import { Alert, Box, Card, Heading, Link, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router";
import { fetchChannels } from "../api/reader";
import { Layout } from "../components/common/Layout";
import { AddFeed } from "../components/reader/AddFeed";
import { SubscribeButton } from "../components/reader/SubscribeButton";
import { Channel } from "../model/domain.interface";

const ChannelCard = ({ channel }: { channel: Channel }) => (
  <Card.Root variant="outline">
    <Card.Body>
      <Stack direction="row" justify="space-between" align="center" gap={4}>
        <Stack gap={1}>
          <Link asChild fontWeight="semibold">
            <RouterLink to={`/channels/${channel.id}`}>{channel.name}</RouterLink>
          </Link>
          {channel.description ? <Text color="fg.muted">{channel.description}</Text> : null}
        </Stack>
        <SubscribeButton channel={channel} subscribed={!!channel.subscribed} />
      </Stack>
    </Card.Body>
  </Card.Root>
);

const ChannelsPage = () => {
  const channels = useQuery({ queryKey: ["channels"], queryFn: fetchChannels });

  return (
    <Layout>
      <Heading size="3xl" mb={2}>
        Channels
      </Heading>
      <Text color="fg.muted" mb={4}>
        Each channel picks stories for you. Like the ones you enjoy and it picks more like them, or tell it what you want in
        its chat.
      </Text>
      <Box mb={4}>
        <AddFeed />
      </Box>
      {channels.isLoading ? <Spinner /> : null}
      {channels.error ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Couldn't load channels: {channels.error.message}</Alert.Title>
        </Alert.Root>
      ) : null}
      <Stack gap={3}>
        {channels.data?.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </Stack>
    </Layout>
  );
};

export default ChannelsPage;
