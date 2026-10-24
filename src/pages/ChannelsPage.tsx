import { Alert, Button, Card, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router";
import { fetchChannels } from "../api/channels";
import { getSentFriendRequests } from "../api/friends";
import { Layout } from "../components/common/Layout";
import { BefriendButton } from "../components/users/BefriendButton";
import { UserDetailSmall } from "../components/users/UserDetailSmall";
import { useUserStore } from "../stores/useUserStore";

const ChannelsPage = () => {
  const { friends } = useUserStore();
  const channels = useQuery({ queryKey: ["channels"], queryFn: fetchChannels });
  const sentRequests = useQuery({ queryKey: ["sent-friend-requests"], queryFn: getSentFriendRequests });
  const isSubscribed = (channelId: string) => friends.some((friend) => friend.id === channelId);
  const isRequested = (channelId: string) =>
    sentRequests.data?.some((request) => request.to.id === channelId) ?? false;

  return (
    <Layout>
      <Heading size="3xl" mb={2}>
        Channels
      </Heading>
      <Text color="fg.muted" mb={4}>
        Channels post news to your feed. Once subscribed, message a channel to tune what it posts.
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
        {channels.data?.map((channel) => (
          <Card.Root key={channel.id} variant="outline">
            <Card.Body>
              <Stack direction="row" justify="space-between" align="center" gap={4}>
                <Stack gap={1}>
                  <UserDetailSmall user={channel} asLink />
                  {channel.bio ? <Text color="fg.muted">{channel.bio}</Text> : null}
                </Stack>
                {isSubscribed(channel.id) ? (
                  <Button asChild size="sm" variant="subtle">
                    <RouterLink to={`/users/${channel.username}/chat`}>Tune in chat</RouterLink>
                  </Button>
                ) : (
                  <BefriendButton
                    // remount once sent requests have loaded, since the button keeps its own state
                    key={String(sentRequests.isSuccess)}
                    username={channel.username}
                    hasFriendRequest={isRequested(channel.id)}
                    isChannel
                  />
                )}
              </Stack>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>
    </Layout>
  );
};

export default ChannelsPage;
