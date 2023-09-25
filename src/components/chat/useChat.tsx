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
import { JOIN_CONVERSATION, fetchConversations } from "../../api/chat";
import { Conversation, Message } from "../../domain.interface";
import { getAccessToken } from "../../lib/auth/api/auth";
import { useAuth } from "../../lib/auth/hooks/useAuth";
import { useUser } from "../../lib/auth/hooks/useUser";
import { refreshToken } from "../../lib/axios";
import { SOCKET_URL } from "../../lib/auth/api/constants";

type ChatContextProps = {
  conversations: Conversation[];
  unreadByConversations: any;
  fetchConversations(): Promise<Conversation[]>;
  hasError: boolean;
  error: string | undefined;
  joinConversation(conversationId: string): void;
  sendMessage(conversationId: string, msg: string): void;
  requestMessages(conversationId: string, page: number): void;
  requestAllMessages(conversationId: string): void;
  markAsRead(conversationId: string, msg: Message[]): void;
  messagesByConversation: { [conversationId: string]: Message[] };
  loading: boolean;
};

const ChatContext = createContext<ChatContextProps>({
  conversations: [],
  unreadByConversations: {},
  hasError: false,
  error: undefined,
  fetchConversations: async () => [],
  joinConversation: (id) => {},
  sendMessage: () => {},
  requestMessages: () => {},
  requestAllMessages: () => {},
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
  const [unreadByConversations, setUnreadByConversations] = useState<any>({
    total: 0,
  });
  const [error, setError] = useState();
  const [messagesByConversation, setMessagesByConversation] = useState<{
    [conversationId: string]: Message[];
  }>({});
  const fetchAllConversations = useCallback(
    () =>
      fetchConversations()
        .then((conversations) => {
          setConversations(conversations);
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
      socket?.emit("request_messages", {
        conversationId,
        page,
        auth: await validateToken(),
      });
      setLoading(true)
    },
    [socket]
  );
  const requestAllMessages = useCallback(
    async (conversationId: string) => {
      socket?.emit("request_all_messages", {
        conversationId,
        auth: await validateToken(),
      });
    },
    [socket]
  );
  const markAsRead = useCallback(
    async (conversationId: string, messages: Message[]) => {
      if (messages.length === 0) return;
      await validateToken();
      console.log("marking as read", messages);
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
      socket?.emit("send_message", {
        message,
        auth: await validateToken(),
      });
    },
    [validateToken, token, socket, user?.id]
  );

  useEffect(() => {
    if (token) {
      fetchAllConversations();
    }
  }, [token, fetchAllConversations]);

  useEffect(() => {
    refreshToken();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    const socket = io(SOCKET_URL, {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [token]);

  useEffect(() => {
    if (!socket?.connected) {
      // TODO
      fetchConversations().then((conversations) => {
        setConversations(conversations);
        for (const conversation of conversations) {
          requestAllMessages(conversation.id);
        }
      });
    }
  }, [socket, requestAllMessages]);

  const joinConversation = useCallback(
    (conversationId: string) => {
      socket?.emit(JOIN_CONVERSATION, {
        conversationId,
        auth: token,
      });
    },
    [socket, token]
  );

  useEffect(() => {
    const unreadMessagesCountByConversation = Object.entries(
      messagesByConversation
    ).reduce((acc, [convId, messages]) => {
      acc[convId] =
        messages
          ?.filter((msg) => msg.authorId !== user?.id)
          .filter((msg) => !msg.isRead).length || 0;
      return acc;
    }, {} as Record<string, number>);
    setUnreadByConversations({
      ...unreadMessagesCountByConversation,
      total: Object.values(unreadMessagesCountByConversation).reduce(
        (acc: number, count: number) => acc + count,
        0
      ),
    });
  }, [messagesByConversation, user?.id]);

  useEffect(() => {
    function onAllMessages(conversation: any) {
      setMessagesByConversation((prev) => ({
        ...prev,
        [conversation.id]: conversation.messages
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
      setLoading(false)
      setMessagesByConversation((prev) => {
        return {
          ...prev,
          [conversationId]: [...prev[conversationId], ...conv.messages]
        };
      });
    }

    function onMessage(msg: Message) {
      setMessagesByConversation((prev) => {
        return {
          ...prev,
          [msg.conversationId]: [...(prev[msg.conversationId] || []), msg],
        };
      });
    }

    if (socket?.active) {
      return;
    }
    socket?.connect();
    socket?.on("send_all_messages", onAllMessages);
    socket?.on("send_messages", onNewMessages);
    socket?.on("receive_message", onMessage);
    socket?.on("message_read", onMessageRead);

    return () => {
      socket?.off("receive_message", onMessage);
      socket?.off("send_all_messages", onAllMessages);
      socket?.off("send_messages", onNewMessages);
    };
  }, [socket]);

  // --
  const value = useMemo(
    () => ({
      conversations,
      hasError: error !== undefined,
      error,
      fetchConversations: fetchAllConversations,
      joinConversation,
      requestMessages,
      requestAllMessages,
      sendMessage,
      markAsRead,
      messagesByConversation,
      unreadByConversations,
      loading
    }),
    [
      unreadByConversations,
      conversations,
      error,
      joinConversation,
      fetchAllConversations,
      requestMessages,
      requestAllMessages,
      sendMessage,
      markAsRead,
      messagesByConversation,
      loading
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
