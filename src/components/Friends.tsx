import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriends,
  getFriendRequests,
  getSentFriendRequests,
} from "../api/friend-requests";
import { removeFriend } from "../api/friends";
import { FriendRequest, User } from "../domain.interface";
import { useUser } from "../lib/auth/hooks/useUser";
import { Layout } from "./Layout";
import { UserDetail } from "./UserDetail";

export const Friends = () => {
  const { user } = useUser();
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    FriendRequest[]
  >([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>(
    []
  );
  const [friends, setFriends] = useState<User[]>([]);
  const fetchFriendsOfUser = useCallback(async () => {
    if (user?.username) {
      const friends = await fetchFriends(user?.username);
      setFriends(friends);
    }
  }, [user]);
  useEffect(() => {
    getFriendRequests().then((friendRequests) => {
      setReceivedFriendRequests(friendRequests);
    });
    getSentFriendRequests().then((friendRequests) => {
      setSentFriendRequests(friendRequests);
    });
    fetchFriendsOfUser();
  }, [fetchFriendsOfUser]);

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
                    <Flex justify="space-between" align="center">
                      <UserDetail
                        key={friendRequest.id}
                        user={friendRequest.from}
                        small
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
                            await fetchFriendsOfUser();
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
                    <UserDetail
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
          {friends.length === 0
            ? "No friends"
            : friends.map((friend) => (
                <Flex justify={"space-between"} align={"center"}>
                  <UserDetail key={friend.id} user={friend} small />
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="xs"
                    onClick={() => removeFriend(friend.id)}
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
