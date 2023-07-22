import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getSentFriendRequests,
} from "../api/friend-requests";
import { removeFriend } from "../api/friends";
import { FriendRequest } from "../domain.interface";
import { useUser } from "../lib/auth/hooks/useUser";
import { Layout } from "./Layout";
import { UserDetailSmall } from "./UserDetailSmall";
import { useChat } from "./chat/useChat";

export const Friends = () => {
  const { user, refresh: refreshUser } = useUser();
  const { fetchConversations } = useChat();
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    FriendRequest[]
  >([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>(
    []
  );
  useEffect(() => {
    getFriendRequests().then((friendRequests) => {
      setReceivedFriendRequests(friendRequests);
    });
    getSentFriendRequests().then((friendRequests) => {
      setSentFriendRequests(friendRequests);
    });
  }, []);

  return (
    <Layout>
      <Card variant="outline">
        <CardBody>
          <Stack spacing="4">
            <Heading size="sm" textTransform="uppercase">
              Friend Requests
            </Heading>
            <Box>
              <Heading size="xs">Received</Heading>
              {receivedFriendRequests.length === 0
                ? <Text size="sm">No friend requests</Text>
                : receivedFriendRequests.map((friendRequest) => (
                    <Flex key={friendRequest.id} justify="space-between" align="center">
                      <UserDetailSmall
                        user={friendRequest.from}
                      />
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outline"
                          colorScheme="green"
                          size="xs"
                          onClick={async () => {
                            await acceptFriendRequest(friendRequest.id);
                            setReceivedFriendRequests((requests) =>
                              requests.filter(
                                (request) => request.id !== friendRequest.id
                              )
                            );
                            await refreshUser();
                            await fetchConversations();
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          colorScheme="red"
                          size="xs"
                          onClick={async () => {
                            await declineFriendRequest(friendRequest.id);
                            setReceivedFriendRequests((requests) =>
                              requests.filter(
                                (request) => request.id !== friendRequest.id
                              )
                            );
                          }}
                        >
                          Decline
                        </Button>
                      </Stack>
                    </Flex>
                  ))}
            </Box>
            <Box>
              <Heading size="xs">Sent</Heading>
              {sentFriendRequests.length === 0 ? (
                <Text size="sm">No friend requests</Text>
              ) : (
                sentFriendRequests.map((friendRequest) => (
                  <Flex justify="space-between" align="center">
                    <UserDetailSmall
                      key={friendRequest.id}
                      user={friendRequest.to}
                      small
                      hasFriendRequest
                    />
                    <Button
                      colorScheme="red"
                      size="xs"
                      onClick={() => declineFriendRequest(friendRequest.id)}
                    >
                      Cancel
                    </Button>
                  </Flex>
                ))
              )}
            </Box>
          </Stack>
          <Heading size="sm" textTransform="uppercase" paddingTop={4}>
            Friends
          </Heading>
          {user?.friends.length === 0
            ? "No friends"
            : user?.friends.map((friend) => (
                <Flex key={friend.id} justify={"space-between"} align={"center"}>
                  <UserDetailSmall user={friend} asLink />
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="xs"
                    onClick={async () => {
                      await removeFriend(friend.id)
                      await refreshUser();
                    }}
                  >
                    Remove
                  </Button>
                </Flex>
              ))}
        </CardBody>
      </Card>
    </Layout>
  );
};
