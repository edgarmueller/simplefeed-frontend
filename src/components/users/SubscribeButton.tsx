import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribe, unsubscribe } from "../../api/channels";
import { useChat } from "../../hooks/useChat";
import { useIsSubscribed } from "../../hooks/useIsSubscribed";
import { useUser } from "../../hooks/useUser";
import { User } from "../../model/domain.interface";
import { notifyError, notifySuccess } from "../ui/toaster";

/** Subscribes to or unsubscribes from a channel, effective immediately. */
export const SubscribeButton = ({ channel }: { channel: Pick<User, "id" | "username" | "firstName" | "lastName"> }) => {
  const isSubscribed = useIsSubscribed(channel.id);
  const { refresh } = useUser();
  const { fetchConversations, joinConversation } = useChat();
  const queryClient = useQueryClient();
  const name = `${channel.firstName} ${channel.lastName}`;
  const mutation = useMutation({
    mutationFn: async () => {
      await (isSubscribed ? unsubscribe(channel.username) : subscribe(channel.username));
    },
    onSuccess: async () => {
      notifySuccess(isSubscribed ? `Unsubscribed from ${name}` : `Subscribed to ${name}`);
      await refresh();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["channels"] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
      ]);
      if (!isSubscribed) {
        // subscribing opens a chat with the channel
        const conversations = await fetchConversations();
        conversations.forEach((conversation) => joinConversation(conversation.id));
      }
    },
    onError: (error: Error) => notifyError(isSubscribed ? "Unsubscribing" : "Subscribing", error),
  });

  return (
    <Button
      size="sm"
      variant={isSubscribed ? "outline" : "solid"}
      loading={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
