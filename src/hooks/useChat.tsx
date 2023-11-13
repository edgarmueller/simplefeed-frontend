import decodeToken from "jwt-decode";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { JOIN_CONVERSATION, fetchConversations } from "../api/chat";
import { Conversation, Message } from "../domain.interface";
import { getAccessToken } from "../api/auth";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";
import { refreshToken } from "../lib/axios";
import { SOCKET_URL } from "../api/constants";
import { sortBy } from "lodash";

export const groupUnreadMessagesByConversations = (
  userId: string,
  messagesByConversation: { [conversationId: string]: Message[] }
): any => {
  const unreadMessagesCountByConversation = Object.entries(
    messagesByConversation
  ).reduce((acc, [convId, messages]) => {
    acc[convId] =
      messages
        ?.filter((msg) => msg.authorId !== userId)
        .filter((msg) => !msg.isRead).length || 0;
    return acc;
  }, {} as Record<string, number>);

  return {
    ...unreadMessagesCountByConversation,
    total: Object.values(unreadMessagesCountByConversation).reduce(
      (acc: number, count: number) => acc + count,
      0
    ),
  };
};

type ChatContextProps = {
  conversations: Conversation[];
  fetchConversations(): Promise<Conversation[]>;
  hasError: boolean;
  error: string | undefined;
  joinConversation(conversationId: string): void;
  sendMessage(conversationId: string, msg: string): void;
  requestMessages(conversationId: string, page: number): void;
  markAsRead(conversationId: string, msg: Message[]): void;
  messagesByConversation: { [conversationId: string]: Message[] };
  loading: boolean;
};

const ChatContext = createContext<ChatContextProps>({
  conversations: [],
  hasError: false,
  error: undefined,
  fetchConversations: async () => [],
  joinConversation: (id) => {},
  sendMessage: () => {},
  requestMessages: () => {},
  markAsRead: () => {},
  messagesByConversation: {},
  loading: false,
});

export const ChatProvider = ({ children }: any) => {
  const { user } = useUser();
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState();
  const [messagesByConversation, setMessagesByConversation] = useState<{
    [conversationId: string]: Message[];
  }>({});

  const fetchAllConversations = useCallback(
    () =>
      fetchConversations()
        .then((conversations) => {
          console.log("fetchAllConversations");
          setConversations(conversations);
          const messagesByConversationId = Object.keys(conversations).reduce((acc, convId, idx) => {
            const conversation = conversations[idx];
            acc[conversation.id] = conversation.messages;
            return acc;
          }, {} as { [conversationId: string]: Message[] })
          setMessagesByConversation(messagesByConversationId);
          setError(undefined);
          return conversations;
        })
        .catch((error) => {
          setError(error.message);
          return [];
        }),
    []
  );

  const validateToken = useCallback(async () => {
    const existingToken = getAccessToken();
    if (!existingToken) {
      return;
    }
    // Perform your token validation logic here
    // You can use a library like jwt-decode to decode the token and check its expiration
    const decodedToken = decodeToken<{ exp: number }>(existingToken);

    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      // Token has expired
      // You can trigger the token refresh process here
      await refreshToken();
      console.log("token refreshed");
    }
    return getAccessToken();
  }, []);

  const requestMessages = useCallback(
    async (conversationId: string, page: number) => {
      console.log("requestingMessages for page", page)
      socket?.emit("request_messages", {
        conversationId,
        page,
        auth: await validateToken(),
      });
      // setLoading(true);
    },
    [socket, validateToken]
  );

  const markAsRead = useCallback(
    async (conversationId: string, messages: Message[]) => {
      if (messages?.length === 0) return;
      await validateToken();
      messages?.forEach((msg) => {
        if (msg.authorId !== user?.id) {
          msg.isRead = true;
        }
      });
      socket?.emit("mark_as_read", {
        conversationId,
        auth: await validateToken(),
      });
    },
    [socket, validateToken, user?.id]
  );
  const sendMessage = useCallback(
    async (conversationId: string, msg: string) => {
      if (!msg) return;

      const message: Message = {
        authorId: user?.id || "",
        content: msg,
        conversationId,
      };
      socket?.emit("send_message", {
        message,
        auth: await validateToken(),
      });
    },
    [validateToken, socket, user?.id]
  );

  useEffect(() => {
    validateToken().then(() => {
      fetchAllConversations();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const joinConversation = useCallback(
    async (conversationId: string) => {
      socket?.emit(JOIN_CONVERSATION, {
        conversationId,
        auth: await validateToken(),
      });
    },
    [socket, validateToken]
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    const _socket = io(`${SOCKET_URL}/chat`, {
      autoConnect: false,
      query: {
        Authorization: `Bearer ${token}`,
      },
      transports: ["websocket"],
    });

    function onAllMessages(conversation: any) {
      setMessagesByConversation((prev) => ({
        ...prev,
        [conversation.id]: conversation.messages,
      }));
    }

    function onMessageRead(confirmation: any) {
      const conversationId = confirmation.conversationId;
      const userId = confirmation.userId;
      setMessagesByConversation((prev) => {
        return {
          ...prev,
          [conversationId]: prev[conversationId]?.map((msg: Message) => {
            if (msg.authorId !== userId) {
              return {
                ...msg,
                isRead: true,
              };
            }
            return msg;
          }),
        };
      });
    }

    function onNewMessages(conv: Conversation) {
      const conversationId = conv.id;
      // setLoading(false);
      setMessagesByConversation((prev) => {
        return {
          ...prev,
          [conversationId]: sortBy(prev[conversationId].concat(conv.messages), a => a.createdAt).reverse(),
        };
      });
    }

    function onMessage(msg: Message) {
      setMessagesByConversation((prev) => {
        return {
          ...prev,
          [msg.conversationId]: [msg, ...(prev[msg.conversationId] || [])],
        };
      });
    }

    _socket?.connect();
    setSocket(_socket);
    _socket?.on("send_all_messages", onAllMessages);
    _socket?.on("send_messages", onNewMessages);
    _socket?.on("receive_message", onMessage);
    _socket?.on("message_read", onMessageRead);

    return () => {
      _socket?.off("receive_message", onMessage);
      _socket?.off("send_all_messages", onAllMessages);
      _socket?.off("send_messages", onNewMessages);
      _socket.close();
      setSocket(undefined);
    };
  }, [token]);

  // --
  const value = useMemo(
    () => ({
      conversations,
      hasError: error !== undefined,
      error,
      fetchConversations: fetchAllConversations,
      joinConversation,
      requestMessages,
      sendMessage,
      markAsRead,
      messagesByConversation,
      // TODO
      loading,
    }),
    [
      conversations,
      error,
      fetchAllConversations,
      joinConversation,
      requestMessages,
      sendMessage,
      markAsRead,
      messagesByConversation,
      loading,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
