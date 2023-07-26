import decodeToken from "jwt-decode";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  unreadByConversations: any;
  fetchConversations(): Promise<Conversation[]>;
  hasError: boolean;
  error: string | undefined;
  isConnected: boolean;
  joinConversation(conversationId: string): void;
  sendMessage(conversationId: string, msg: string): void;
  requestAllMessages(conversationId: string): void;
  markAsRead(conversationId: string, msg: Message[]): void;
  messagesByConversation: { [conversationId: string]: Message[] };
};

const ChatContext = createContext<ChatContextProps>({
  conversations: [],
  unreadByConversations: {},
  hasError: false,
  error: undefined,
  isConnected: false,
  fetchConversations: async () => [],
  joinConversation: (id) => {},
  sendMessage: () => {},
  requestAllMessages: () => {},
  markAsRead: () => {},
  messagesByConversation: {},
});

export const ChatProvider = ({ children }: any) => {
  const { user } = useUser();
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  let lastMessage = useRef<string>();
  let lastConversation = useRef<string>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadByConversations, setUnreadByConversations] = useState<any>({
    total: 0,
  });
  const [error, setError] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [messagesByConversation, setMessagesByConversation] = useState<{
    [conversationId: string]: Message[];
  }>({});

  const updateChatAccessToken = (newToken: string | null) => {
    if (socket && newToken) {
      socket.io.opts.extraHeaders = {
        Authorization: `Bearer ${newToken}`,
      };
    }
  };

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
    if (!token) return false;
    // Perform your token validation logic here
    // You can use a library like jwt-decode to decode the token and check its expiration
    const decodedToken = decodeToken<{ exp: number }>(token);

    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      // Token has expired
      // You can trigger the token refresh process here
      await refreshToken();
      await updateChatAccessToken(getAccessToken());
      console.log("token refreshed", getAccessToken());
      return true;
    }
    return false;
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
    (conversationId: string, messages: Message[]) => {
      console.log("marking as read", messages);
      messages?.forEach((msg) => {
        if (msg.authorId !== user?.id) {
          msg.isRead = true;
        }
      });
      socket?.emit("mark_as_read", {
        conversationId,
      });
    },
    [socket]
  );
  const sendMessage = async (conversationId: string, msg: string) => {
    if (!msg) return;

    const message: Message = {
      authorId: user?.id || "",
      content: msg,
      conversationId,
    };
    await validateToken();
    console.log('sending message now..', socket?.connected, socket?.active, socket?.io.opts.extraHeaders);
    socket?.emit("send_message", JSON.stringify({
      message,
      auth: socket?.io.opts.extraHeaders,
    }));
    // setInputValue("");
  };
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

  function joinConversation(conversationId: string) {
    console.log("joining", conversationId);
    socket?.emit("join_conversation", {
      conversationId,
    });
  }

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
    socket?.on("receive_message", onMessage);
    socket?.on("message_read", onMessageRead);

    return () => {
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
      joinConversation,
      requestAllMessages,
      sendMessage,
      markAsRead,
      messagesByConversation,
      unreadByConversations,
      isConnected,
    }),
    [
      unreadByConversations,
      conversations,
      error,
      joinConversation,
      fetchAllConversations,
      requestAllMessages,
      sendMessage,
      markAsRead,
      messagesByConversation,
      isConnected,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
