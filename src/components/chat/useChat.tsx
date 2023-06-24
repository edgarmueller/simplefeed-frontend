import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchConversations } from "../../api/chat";
import { Conversation } from "../../domain.interface";
import { useAuth } from "../../lib/auth/hooks/useAuth";

type ChatContextProps = {
  conversations: Conversation[];
  fetchConversations(): void;
  hasError: boolean;
  error: string | undefined;
};

const ChatContext = createContext<ChatContextProps>({
  conversations: [],
  hasError: false,
  error: undefined,
  fetchConversations: () => {},
});

export const ChatProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState();
  const fetchAllConversations = useCallback(() =>
    fetchConversations()
      .then((conversations) => {
        setConversations(conversations);
        setError(undefined);
      })
      .catch((error) => {
        setError(error.message);
      }), []
  );
  useEffect(() => {
    if (token) {
      fetchAllConversations();
    }
  }, [token, fetchAllConversations]);
  const value = useMemo(
    () => ({
      conversations,
      hasError: error !== undefined,
      error,
      fetchConversations: fetchAllConversations,
    }),
    [conversations, error, fetchAllConversations]
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
