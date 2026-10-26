import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useChat } from "./useChat";
import { useUser } from "./useUser";

/** Reloads what depends on the user's subscriptions after they changed. */
export function useRefreshSubscriptions() {
  const { refresh } = useUser();
  const { fetchConversations, joinConversation } = useChat();
  const queryClient = useQueryClient();
  return useCallback(
    async ({ subscribed }: { subscribed: boolean }) => {
      await refresh();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["channels"] }),
        queryClient.invalidateQueries({ queryKey: ["feed"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
      ]);
      if (subscribed) {
        // subscribing opens a chat with the channel
        const conversations = await fetchConversations();
        conversations.forEach((conversation) => joinConversation(conversation.id));
      }
    },
    [refresh, queryClient, fetchConversations, joinConversation]
  );
}
