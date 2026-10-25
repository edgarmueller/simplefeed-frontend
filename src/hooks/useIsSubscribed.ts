import { useUserStore } from "../stores/useUserStore";

/** Whether the current user subscribes to the channel. */
export const useIsSubscribed = (channelId?: string) =>
  useUserStore((state) => state.subscriptions.some((channel) => channel.id === channelId));
