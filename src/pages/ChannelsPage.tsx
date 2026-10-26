import { Alert, Button, Card, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router";
import { fetchChannels } from "../api/channels";
import { Layout } from "../components/common/Layout";
import { SubscribeButton } from "../components/users/SubscribeButton";
import { useIsSubscribed } from "../hooks/useIsSubscribed";
import { UserDetailSmall } from "../components/users/UserDetailSmall";
import { User } from "../model/domain.interface";

const ChannelCard = ({ channel }: { channel: User }) => {
  const isSubscribed = useIsSubscribed(channel.id);
  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Stack direction="row" justify="space-between" align="center" gap={4}>
          <Stack gap={1}>
            <UserDetailSmall user={channel} asLink />
            {channel.bio ? <Text color="fg.muted">{channel.bio}</Text> : null}
          </Stack>
          <Stack direction="row" gap={2}>
            {isSubscribed ? (
              <Button asChild size="sm" variant="subtle">
                <RouterLink to={`/users/${channel.username}/chat`}>Tune in chat</RouterLink>
              </Button>
            ) : null}
            <SubscribeButton channel={channel} />
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

const ChannelsPage = () => {
  const channels = useQuery({ queryKey: ["channels"], queryFn: fetchChannels });

  return (
    <Layout>
      <Heading size="3xl" mb={2}>
        Channels
      </Heading>
      <Text color="fg.muted" mb={4}>
        Channels post news to your feed. Like the posts you enjoy and a channel picks more like them, or message it to tune what it posts.
      </Text>
      {channels.isLoading ? <Spinner /> : null}
      {channels.error ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Couldn't load channels: {channels.error.message}</Alert.Title>
        </Alert.Root>
      ) : null}
      {channels.data?.length === 0 ? <Text>No channels yet.</Text> : null}
      <Stack gap={3}>
        {channels.data?.map((channel) => <ChannelCard key={channel.id} channel={channel} />)}
      </Stack>
    </Layout>
  );
};

export default ChannelsPage;
