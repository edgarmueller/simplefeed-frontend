import { Alert, Heading, Link, Spinner, Stack, Tabs, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import { FeedView, fetchChannels } from "../api/reader";
import { Layout } from "../components/common/Layout";
import { ChannelChat } from "../components/reader/ChannelChat";
import { FeedList } from "../components/reader/FeedList";
import { SubscribeButton } from "../components/reader/SubscribeButton";
import { useSubscriptions } from "../hooks/useReader";
import { MarkAllReadButton } from "./FeedPage";

/** One channel: what it picked for the reader, and the chat to tune it. */
const ChannelPage = () => {
  const { channelId } = useParams();
  const subscriptions = useSubscriptions();
  const catalog = useQuery({ queryKey: ["channels"], queryFn: fetchChannels });
  const [tab, setTab] = useState<"stories" | "tune">("stories");
  const [view, setView] = useState<FeedView>("unread");
  const subscription = subscriptions.data?.find((s) => s.channel.id === channelId);
  const channel = subscription?.channel ?? catalog.data?.find((c) => c.id === channelId);

  if (!channel) {
    return (
      <Layout>
        {subscriptions.isLoading || catalog.isLoading ? <Spinner /> : <Text>This channel doesn't exist (anymore).</Text>}
      </Layout>
    );
  }
  return (
    <Layout>
      <Stack gap={4}>
        <Stack direction="row" justify="space-between" align="flex-start" gap={4}>
          <Stack gap={1}>
            <Heading size="3xl">{channel.name ?? channel.url}</Heading>
            {channel.description ? <Text color="fg.muted">{channel.description}</Text> : null}
            {channel.siteUrl ? (
              <Link href={channel.siteUrl} target="_blank" rel="noopener noreferrer" fontSize="sm" color="fg.muted">
                {channel.siteUrl}
              </Link>
            ) : null}
          </Stack>
          <SubscribeButton channel={channel} subscribed={!!subscription} />
        </Stack>
        {channel.status === "pending" ? (
          <Stack direction="row" align="center" gap={2} color="fg.muted">
            <Spinner size="sm" />
            <Text>Reading the feed…</Text>
          </Stack>
        ) : null}
        {channel.status === "failed" ? (
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Couldn't read this feed</Alert.Title>
              <Alert.Description>{channel.error}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}
        {subscription && channel.status === "active" ? (
          <Tabs.Root value={tab} onValueChange={(event) => setTab(event.value as "stories" | "tune")} variant="enclosed">
            <Tabs.List>
              <Tabs.Trigger value="stories">Stories</Tabs.Trigger>
              <Tabs.Trigger value="tune">Tune</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="stories">
              <Stack gap={3}>
                <Stack direction="row" justify="space-between" align="center">
                  <Tabs.Root value={view} onValueChange={(event) => setView(event.value as FeedView)} variant="line" size="sm">
                    <Tabs.List>
                      <Tabs.Trigger value="unread">Unread</Tabs.Trigger>
                      <Tabs.Trigger value="all">All</Tabs.Trigger>
                    </Tabs.List>
                  </Tabs.Root>
                  {view === "unread" ? <MarkAllReadButton channelId={channel.id} /> : null}
                </Stack>
                <FeedList view={view} channelId={channel.id} />
              </Stack>
            </Tabs.Content>
            <Tabs.Content value="tune">
              <ChannelChat subscription={subscription} />
            </Tabs.Content>
          </Tabs.Root>
        ) : null}
        {!subscription && channel.status === "active" ? (
          <Text color="fg.muted">Subscribe to get its stories in your feed and tune what it picks.</Text>
        ) : null}
      </Stack>
    </Layout>
  );
};

export default ChannelPage;
