import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchConversations } from "../../api/chat";
import { Conversation } from "../../domain.interface";
import { useAuth } from "../../lib/auth/hooks/useAuth";

type ChatContextProps = {
  conversations: Conversation[]
  hasError: boolean;
  error: string | undefined;
};

const ChatContext = createContext<ChatContextProps>({
  conversations: [],
  hasError: false,
  error: undefined,
});

export const ChatProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState();
  useEffect(() => {
    if (token) {
      fetchConversations()
        .then((conversations) => {
          setConversations(conversations);
          setError(undefined);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [token]);
  const value = useMemo(
    () => ({
      conversations,
      hasError: error !== undefined,
      error,
    }),
    [conversations, error]
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
