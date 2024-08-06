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
import { Conversation, Message } from "../model/domain.interface";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";
import { ChatState, useChatStore } from "../stores/useChatStore";

const SEND_MESSAGE = "send_message";
const MARK_AS_READ = "mark_as_read"
const JOIN_CONVERSATION = "join_conversation"



type ChatContextProps = {
  fetchConversations(): Promise<Conversation[]>;
  hasError: boolean;
  error: string | undefined;
  joinConversation(conversationId: string): void;
  sendMessage(conversationId: string, msg: string): void;
  requestMessages(conversationId: string, page: number): void;
  markAsRead(conversationId: string, /*msg: Message[]*/): void;
  loading: boolean;
};

const ChatContext = createContext<ChatContextProps>({
  hasError: false,
  error: undefined,
  fetchConversations: async () => [],
  joinConversation: (id) => { },
  sendMessage: () => { },
  requestMessages: () => { },
  markAsRead: () => { },
  loading: false,
});

export const ChatProvider = ({ children }: any) => {
  const { user } = useUser();
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const markAsReadInStore = useChatStore(s => s.markMessagesAsRead)
  const addMessagesInStore = useChatStore(s => s.addNewMessages)

  const setConversations = useChatStore((state: ChatState) => state.setConversations)
  const fetchAllConversations = useCallback(
    async () => {
      if (!user) return [];
      setLoading(true);
      try {
        const conversations = await fetchConversations()
        setConversations(conversations);
        setError(undefined);
        setLoading(false);
        return conversations;
      } catch (error) {
        console.error(error)
        setLoading(false);
        if (error instanceof Error) {
          setError(error.message);
        }
        return [];
      }
    }, [user, setConversations]);
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
    async (conversationId: string) => {
      markAsReadInStore(conversationId, user?.id)
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
  const joinConversation = useCallback(
    async (conversationId: string) => {
      socket?.emit(JOIN_CONVERSATION, {
        conversationId,
        auth: await validateToken(),
      });
    },
    [socket]
  );

  const clearConversations = useChatStore((state: any) => state.clearConversations)
  useEffect(() => {
    clearConversations();
    setError(undefined);
    setLoading(false);
    validateToken().then((t) => {
      if (t) {
        fetchAllConversations();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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

    function onMessageRead(message: any) {
      // TODO: we can use message
      const conversationId = message.conversationId;
      const userId = message.userId;
      markAsReadInStore(conversationId, userId)
    }

    function onNewMessages(conv: Conversation) {
      setLoading(false);
      const conversationId = conv.id;
      const messages = conv.messages;
      addMessagesInStore(conversationId, messages)
    }

    function onReceiveMessage(msg: Message) {
      addMessagesInStore(msg.conversationId, [msg])
    }

    _socket?.connect();
    setSocket(_socket);
    _socket?.on("send_messages", onNewMessages);
    _socket?.on("receive_message", onReceiveMessage);
    _socket?.on("message_read", onMessageRead);

    return () => {
      _socket?.off("receive_message", onReceiveMessage);
      _socket?.off("send_messages", onNewMessages);
      _socket.close();
      setSocket(undefined);
    };
  }, [token]);

  // --
  const value = useMemo(
    () => {
      return {
        hasError: error !== undefined,
        error,
        fetchConversations: fetchAllConversations,
        joinConversation,
        requestMessages,
        sendMessage,
        markAsRead,
        // TODO
        loading,
      }
    },
    [
      error,
      fetchAllConversations,
      joinConversation,
      requestMessages,
      sendMessage,
      markAsRead,
      loading,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
