import { Button, Heading, Stack, Tabs } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { FeedView, markAllRead } from "../api/reader";
import { Layout } from "../components/common/Layout";
import { FeedList } from "../components/reader/FeedList";
import { notifyError } from "../components/ui/toaster";
import { useRefreshReader } from "../hooks/useReader";

/** "Mark all as read", for the whole feed or one channel. */
export const MarkAllReadButton = ({ channelId }: { channelId?: string }) => {
  const refresh = useRefreshReader();
  const mutation = useMutation({
    mutationFn: () => markAllRead(channelId),
    onSuccess: refresh,
    onError: (error: Error) => notifyError("Marking all as read", error),
  });
  return (
    <Button size="sm" variant="ghost" loading={mutation.isPending} onClick={() => mutation.mutate()}>
      <BiCheckDouble />
      Mark all as read
    </Button>
  );
};

/** The reader's feed: unread stories by default, or everything, or what they saved. */
function FeedPage({ saved = false }: { saved?: boolean }) {
  const [view, setView] = useState<FeedView>("unread");
  if (saved) {
    return (
      <Layout>
        <Stack gap={4}>
          <Heading size="2xl">Saved</Heading>
          <FeedList view="saved" />
        </Stack>
      </Layout>
    );
  }
  return (
    <Layout>
      <Stack gap={4}>
        <Stack direction="row" justify="space-between" align="center">
          <Heading size="2xl">Your feed</Heading>
          {view === "unread" ? <MarkAllReadButton /> : null}
        </Stack>
        <Tabs.Root value={view} onValueChange={(event) => setView(event.value as FeedView)} variant="line" size="sm">
          <Tabs.List>
            <Tabs.Trigger value="unread">Unread</Tabs.Trigger>
            <Tabs.Trigger value="all">All</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <FeedList view={view} />
      </Stack>
    </Layout>
  );
}

export default FeedPage;
