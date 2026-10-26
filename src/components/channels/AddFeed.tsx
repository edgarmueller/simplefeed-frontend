import { Alert, Box, Button, Card, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { addFeed, fetchMyFeeds, withdrawFeed } from "../../api/feeds";
import { useRefreshSubscriptions } from "../../hooks/useRefreshSubscriptions";
import { getErrorMessages } from "../../lib/errors";
import { FeedRequest } from "../../model/domain.interface";
import { notifyError, notifySuccess } from "../ui/toaster";

/** how often to look whether pending feeds became channels */
const PENDING_POLL_MS = 3000;

const PendingFeed = ({ feed }: { feed: FeedRequest }) => {
  const queryClient = useQueryClient();
  const dismiss = useMutation({
    mutationFn: () => withdrawFeed(feed.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-feeds"] }),
    onError: (error: Error) => notifyError("Removing the feed", error),
  });
  return feed.status === "failed" ? (
    <Alert.Root status="warning" size="sm">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Couldn't add {feed.url}</Alert.Title>
        <Alert.Description>{feed.error}</Alert.Description>
      </Alert.Content>
      <Button size="xs" variant="ghost" onClick={() => dismiss.mutate()} loading={dismiss.isPending}>
        Dismiss
      </Button>
    </Alert.Root>
  ) : (
    <Stack direction="row" align="center" gap={2} color="fg.muted" fontSize="sm">
      <Spinner size="xs" />
      <Text>Reading {feed.url}…</Text>
    </Stack>
  );
};

/** Adds any RSS or Atom feed, or a website that has one, as a channel. */
export const AddFeed = () => {
  const [url, setUrl] = useState("");
  const refreshSubscriptions = useRefreshSubscriptions();
  const queryClient = useQueryClient();
  const myFeeds = useQuery({
    queryKey: ["my-feeds"],
    queryFn: fetchMyFeeds,
    refetchInterval: (query) =>
      query.state.data?.some((feed) => feed.status === "pending") ? PENDING_POLL_MS : false,
  });

  // a pending feed disappears from the list once it is a channel the user subscribes to
  const pendingIds = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!myFeeds.data) return;
    const pending = new Set(myFeeds.data.filter((feed) => feed.status === "pending").map((feed) => feed.id));
    const listed = new Set(myFeeds.data.map((feed) => feed.id));
    const activated = [...pendingIds.current].filter((id) => !listed.has(id));
    pendingIds.current = pending;
    if (activated.length > 0) {
      notifySuccess(activated.length === 1 ? "Your feed is now a channel" : "Your feeds are now channels");
      refreshSubscriptions({ subscribed: true });
    }
  }, [myFeeds.data, refreshSubscriptions]);

  const add = useMutation({
    mutationFn: (feedUrl: string) => addFeed(feedUrl),
    onSuccess: async (feed) => {
      setUrl("");
      if (feed.status === "active") {
        notifySuccess(`Subscribed to ${feed.title ?? feed.url}`);
        await refreshSubscriptions({ subscribed: true });
      } else {
        await queryClient.invalidateQueries({ queryKey: ["my-feeds"] });
      }
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
        {myFeeds.data?.map((feed) => <PendingFeed key={feed.id} feed={feed} />)}
      </Card.Body>
    </Card.Root>
  );
};
