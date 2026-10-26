import { Button } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { subscribe, unsubscribe } from "../../api/channels";
import { useIsSubscribed } from "../../hooks/useIsSubscribed";
import { useRefreshSubscriptions } from "../../hooks/useRefreshSubscriptions";
import { User } from "../../model/domain.interface";
import { notifyError, notifySuccess } from "../ui/toaster";

/** Subscribes to or unsubscribes from a channel, effective immediately. */
export const SubscribeButton = ({ channel }: { channel: Pick<User, "id" | "username" | "firstName" | "lastName"> }) => {
  const isSubscribed = useIsSubscribed(channel.id);
  const refreshSubscriptions = useRefreshSubscriptions();
  const name = `${channel.firstName} ${channel.lastName}`.trim();
  const mutation = useMutation({
    mutationFn: async () => {
      await (isSubscribed ? unsubscribe(channel.username) : subscribe(channel.username));
    },
    onSuccess: async () => {
      notifySuccess(isSubscribed ? `Unsubscribed from ${name}` : `Subscribed to ${name}`);
      await refreshSubscriptions({ subscribed: !isSubscribed });
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
