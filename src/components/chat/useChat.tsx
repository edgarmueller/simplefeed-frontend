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
import { fetchConversations } from "../../api/chat";
import { Conversation, Message } from "../../domain.interface";
import { getAccessToken } from "../../lib/auth/api/auth";
import { useAuth } from "../../lib/auth/hooks/useAuth";
import { useUser } from "../../lib/auth/hooks/useUser";
import { refreshToken } from "../../lib/fetch";

type ChatContextProps = {
  conversations: Conversation[];
  fetchConversations(): void;
  hasError: boolean;
  error: string | undefined;
  isConnected: boolean;
  sendMessage(conversationId: string, msg: string): void;
  requestAllMessages(conversationId: string): void;
  markAsRead(conversationId: string): void;
  messagesByConversation: { [conversationId: string]: Message[] };
};

const ChatContext = createContext<ChatContextProps>({
  conversations: [],
  hasError: false,
  error: undefined,
  fetchConversations: () => {},
  sendMessage: () => {},
  isConnected: false,
  requestAllMessages: () => {},
  markAsRead: () => {},
  messagesByConversation: {},
});

export const ChatProvider = ({ children }: any) => {
  const { user } = useUser();
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [messagesByConversation, setMessagesByConversation] = useState<{
    [conversationId: string]: Message[];
  }>({});

  const updateChatAccessToken = useCallback(
    (newToken: string | null) => {
      if (socket && newToken) {
        socket.io.opts.extraHeaders = {
          Authorization: `Bearer ${newToken}`,
        };
      }
    },
    [socket]
  );

  const fetchAllConversations = useCallback(
    () =>
      fetchConversations()
        .then((conversations) => {
          setConversations(conversations);
          setError(undefined);
        })
        .catch((error) => {
          setError(error.message);
        }),
    []
  );

  const validateToken = useCallback(async () => {
    if (!token) return false;
    // Perform your token validation logic here
    // You can use a library like jwt-decode to decode the token and check its expiration
    const decodedToken = decodeToken<{ exp: number }>(token);

    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      // Token has expired
      // You can trigger the token refresh process here
      await refreshToken();
      const accessToken = getAccessToken();
      updateChatAccessToken(accessToken);
    }
  }, [token, updateChatAccessToken]);

  const requestAllMessages = useCallback(
    (conversationId: string) => {
      socket?.emit("request_all_messages", {
        conversationId,
      });
    },
    [socket]
  );
  const markAsRead = useCallback(
    (conversationId: string) => {
      socket?.emit("mark_as_read", {
        conversationId,
      });
    },
    [socket]
  );
  const sendMessage = useCallback(
    async (conversationId: string, msg: string) => {
      if (!msg) return;

      const message: Message = {
        authorId: user?.id || "",
        content: msg,
        conversationId,
      };

      await validateToken();
      socket?.emit("send_message", JSON.stringify(message));
      // setInputValue("");
    },
    [socket, validateToken]
  );
  // --
  useEffect(() => {
    if (token) {
      fetchAllConversations();
    }
  }, [token, fetchAllConversations]);
  useEffect(() => {
    if (!token) {
      return;
    }
    // TODO
    const socket = io("http://localhost:5001", {
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
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

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
      })
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

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("send_all_messages", onAllMessages);
    socket?.on("receive_message", onMessage);
    socket?.on("mark_as_read", onMessageRead);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("receive_message", onMessage);
      socket?.off("send_all_messages", onAllMessages);
    };
  }, [socket]);

  // --
  const value = useMemo(
    () => ({
      conversations,
      hasError: error !== undefined,
      error,
      fetchConversations: fetchAllConversations,
      requestAllMessages,
      isConnected,
      sendMessage,
      markAsRead,
      messagesByConversation,
    }),
    [
      conversations,
      error,
      fetchAllConversations,
      requestAllMessages,
      isConnected,
      sendMessage,
      markAsRead,
      messagesByConversation,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
