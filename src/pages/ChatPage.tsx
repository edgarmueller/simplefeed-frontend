import { Layout } from "../components/common/Layout";
import { Conversations } from "../components/chat/Conversations";
import { useEffect } from "react";
import { useChat } from "../hooks/useChat";

function ChatPage() {
  const { fetchConversations } = useChat();
  useEffect(() => {
    fetchConversations();
  }, []);
  return (
    <Layout>
      <Conversations />
    </Layout>
  );
}

export default ChatPage