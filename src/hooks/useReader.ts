import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { fetchSubscriptions } from "../api/reader";
import { Subscription } from "../model/domain.interface";

/** how often unread counts refresh, and more often while waiting for something */
const SUBSCRIPTIONS_POLL_MS = 15_000;
const WAITING_POLL_MS = 3_000;
/** a new subscription gets its first stories within seconds */
const NEW_SUBSCRIPTION_MS = 2 * 60_000;

const isWaiting = (subscription: Subscription) =>
  subscription.channel.status === "pending" ||
  (subscription.unread === 0 && Date.now() - new Date(subscription.createdAt).getTime() < NEW_SUBSCRIPTION_MS);

/** The reader's subscriptions with unread counts, refreshed often while a feed is read or a new one fills. */
export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    refetchInterval: (query) => (query.state.data?.some(isWaiting) ? WAITING_POLL_MS : SUBSCRIPTIONS_POLL_MS),
  });
}

/** When a channel last picked something for the reader, in all channels or one. */
export function useLastPickedAt(channelId?: string): string | undefined {
  const { data } = useSubscriptions();
  return data
    ?.filter((subscription) => !channelId || subscription.channel.id === channelId)
    .map((subscription) => subscription.lastPickedAt)
    .filter((pickedAt): pickedAt is string => !!pickedAt)
    .sort()
    .at(-1);
}

/** Reloads what depends on the reader's subscriptions and read state. */
export function useRefreshReader() {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] }),
        queryClient.invalidateQueries({ queryKey: ["channels"] }),
        queryClient.invalidateQueries({ queryKey: ["feed"] }),
      ]),
    [queryClient]
  );
}
