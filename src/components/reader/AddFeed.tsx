import { Alert, Box, Button, Card, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { addFeed, unsubscribe } from "../../api/reader";
import { useRefreshReader, useSubscriptions } from "../../hooks/useReader";
import { getErrorMessages } from "../../lib/errors";
import { Subscription } from "../../model/domain.interface";
import { notifyError, notifySuccess } from "../ui/toaster";

/** reading a feed takes seconds; after this long, something is off */
const SLOW_AFTER_MS = 60_000;

/** Whether the feed has been pending for longer than reading usually takes. */
function useIsSlow({ channel, createdAt }: Subscription) {
  const slowAt = new Date(createdAt).getTime() + SLOW_AFTER_MS;
  const [isSlow, setSlow] = useState(() => Date.now() > slowAt);
  useEffect(() => {
    if (isSlow || channel.status !== "pending") return;
    const timeout = setTimeout(() => setSlow(true), slowAt - Date.now());
    return () => clearTimeout(timeout);
  }, [isSlow, channel.status, slowAt]);
  return isSlow && channel.status === "pending";
}

const PendingFeed = ({ subscription }: { subscription: Subscription }) => {
  const refresh = useRefreshReader();
  const remove = useMutation({
    mutationFn: () => unsubscribe(subscription.channel.id),
    onSuccess: refresh,
    onError: (error: Error) => notifyError("Removing the feed", error),
  });
  const isSlow = useIsSlow(subscription);
  const { channel } = subscription;
  const removeButton = (label: string) => (
    <Button size="xs" variant="ghost" onClick={() => remove.mutate()} loading={remove.isPending}>
      {label}
    </Button>
  );
  if (channel.status === "failed") {
    return (
      <Alert.Root status="warning" size="sm">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Couldn't add {channel.url}</Alert.Title>
          <Alert.Description>{channel.error}</Alert.Description>
        </Alert.Content>
        {removeButton("Dismiss")}
      </Alert.Root>
    );
  }
  if (isSlow) {
    return (
      <Alert.Root status="info" size="sm">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Still reading {channel.url}</Alert.Title>
          <Alert.Description>
            This usually takes a few seconds. If it stays like this, the channels worker may not be running.
          </Alert.Description>
        </Alert.Content>
        {removeButton("Cancel")}
      </Alert.Root>
    );
  }
  return (
    <Stack direction="row" align="center" gap={2} color="fg.muted" fontSize="sm">
      <Spinner size="xs" />
      <Text>Reading {channel.url}…</Text>
    </Stack>
  );
};

/** Adds any RSS or Atom feed, or a website that has one, as a channel. */
export const AddFeed = () => {
  const [url, setUrl] = useState("");
  const refresh = useRefreshReader();
  const subscriptions = useSubscriptions();
  const notYetChannels = subscriptions.data?.filter((subscription) => subscription.channel.status !== "active") ?? [];

  // a pending feed that became active is a channel now
  const pending = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!subscriptions.data) return;
    const activated = subscriptions.data.filter(
      (subscription) => pending.current.has(subscription.id) && subscription.channel.status === "active"
    );
    pending.current = new Set(
      subscriptions.data.filter((subscription) => subscription.channel.status === "pending").map((subscription) => subscription.id)
    );
    if (activated.length > 0) {
      // toasts render synchronously, which React doesn't allow from inside an effect
      queueMicrotask(() =>
        notifySuccess(activated.length === 1 ? `${activated[0].channel.name} is now a channel` : "Your feeds are now channels")
      );
      refresh();
    }
  }, [subscriptions.data, refresh]);

  const add = useMutation({
    mutationFn: (feedUrl: string) => addFeed(feedUrl),
    onSuccess: async (subscription) => {
      setUrl("");
      if (subscription.channel.status === "active") {
        notifySuccess(`Subscribed to ${subscription.channel.name ?? subscription.channel.url}`);
      }
      await refresh();
    },
  });

  return (
    <Card.Root variant="subtle">
      <Card.Body gap={3}>
        <Box
          as="form"
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            if (url.trim()) add.mutate(url.trim());
          }}
        >
          <Stack direction="row" gap={2}>
            <Input
              aria-label="Feed or website address"
              placeholder="Add a feed: a feed or website address, e.g. sueddeutsche.de/muenchen"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              bg="bg"
            />
            <Button type="submit" loading={add.isPending} disabled={!url.trim()}>
              Add
            </Button>
          </Stack>
          {add.error ? (
            <Text color="fg.error" fontSize="sm" mt={2}>
              {getErrorMessages(add.error).join(" ")}
            </Text>
          ) : null}
        </Box>
        {notYetChannels.map((subscription) => (
          <PendingFeed key={subscription.id} subscription={subscription} />
        ))}
      </Card.Body>
    </Card.Root>
  );
};
