import { sortBy, uniqBy } from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { fetchConversations } from "../api/chat";
import { SOCKET_URL } from "../api/constants";
import { validateToken } from "../api/validateToken";
import { Conversation, Message } from "../domain.interface";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";

const SEND_MESSAGE = "send_message";
const MARK_AS_READ = "mark_as_read"
const JOIN_CONVERSATION = "join_conversation"

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
  joinConversation: (id) => { },
  sendMessage: () => { },
  requestMessages: () => { },
  markAsRead: () => { },
  messagesByConversation: {},
  loading: false,
});

export const ChatProvider = ({ children }: any) => {
  const { user } = useUser();
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string>();
  const [messagesByConversation, setMessagesByConversation] = useState<{
    [conversationId: string]: Message[];
  }>({});

  const fetchAllConversations = useCallback(
    async () => {
      setLoading(true);
      try {
        const conversations = await fetchConversations()
        setConversations(conversations);
        const messagesByConversationId = conversations.reduce((acc, conversation) => {
          acc[conversation.id] = conversation.messages;
          return acc;
        }, {} as { [conversationId: string]: Message[] })
        setMessagesByConversation(messagesByConversationId);
        setError(undefined);
        setLoading(false);
        return conversations;
      } catch (error) {
        setLoading(false);
        if (error instanceof Error) {
          setError(error.message);
        }
        return [];
      }
    }, []);

  const requestMessages = useCallback(
    async (conversationId: string, page: number) => {
      socket?.emit("request_messages", {
        conversationId,
        page,
        auth: await validateToken(),
      });
      setLoading(true);
    },
    [socket]
  );

  const markAsRead = useCallback(
    async (conversationId: string, messages: Message[]) => {
      if (messages?.length === 0) return;
      messages?.forEach((msg) => {
        if (msg.authorId !== user?.id) {
          msg.isRead = true;
        }
      });
      socket?.emit(MARK_AS_READ, {
        conversationId,
        auth: await validateToken(),
      });
    },
    [socket, user?.id]
  );
  const sendMessage = useCallback(
    async (conversationId: string, msg: string) => {
      if (!msg) return;

      const message: Message = {
        authorId: user?.id || "",
        content: msg,
        conversationId,
      };
      socket?.emit(SEND_MESSAGE, {
        message,
        auth: await validateToken(),
      });
    },
    [socket, user?.id]
  );

  useEffect(() => {
    validateToken().then((t) => {
      if (t) {
        fetchAllConversations();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinConversation = useCallback(
    async (conversationId: string) => {
      socket?.emit(JOIN_CONVERSATION, {
        conversationId,
        auth: await validateToken(),
      });
    },
    [socket]
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
      setLoading(false);
      const conversationId = conv.id;
      setMessagesByConversation(s => {
        const messages = uniqBy((s[conversationId] || []).concat(conv.messages), 'id');
        return {
          ...s,
          [conversationId]: sortBy(messages, a => a.createdAt).reverse(),
        };
      });
    }

    function onReceiveMessage(msg: Message) {
      setMessagesByConversation((prev) => {
        return {
          ...prev,
          [msg.conversationId]: [msg, ...(prev[msg.conversationId] || [])],
        };
      });
    }

    _socket?.connect();
    setSocket(_socket);
    _socket?.on("send_messages", onNewMessages);
    _socket?.on("receive_message", onReceiveMessage);
    _socket?.on("message_read", onMessageRead);

    return () => {
      _socket?.off("receive_message", onReceiveMessage);
      // _socket?.off("send_all_messages", onAllMessages);
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
