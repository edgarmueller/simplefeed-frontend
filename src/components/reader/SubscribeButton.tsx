import { Button } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { subscribe, unsubscribe } from "../../api/reader";
import { useRefreshReader } from "../../hooks/useReader";
import { Channel } from "../../model/domain.interface";
import { notifyError, notifySuccess } from "../ui/toaster";

/** Subscribes to or unsubscribes from a channel, effective immediately. */
export const SubscribeButton = ({ channel, subscribed }: { channel: Channel; subscribed: boolean }) => {
  const refresh = useRefreshReader();
  const name = channel.name ?? channel.url ?? "the channel";
  const mutation = useMutation({
    mutationFn: async () => {
      await (subscribed ? unsubscribe(channel.id) : subscribe(channel.id));
    },
    onSuccess: async () => {
      notifySuccess(subscribed ? `Unsubscribed from ${name}` : `Subscribed to ${name}. Its first stories are on their way.`);
      await refresh();
    },
    onError: (error: Error) => notifyError(subscribed ? "Unsubscribing" : "Subscribing", error),
  });
  return (
    <Button size="sm" variant={subscribed ? "outline" : "solid"} loading={mutation.isPending} onClick={() => mutation.mutate()}>
      {subscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
