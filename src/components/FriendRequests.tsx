import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriendsOfUser,
  getFriendRequests,
  getSentFriendRequests,
} from "../api/friend-requests";
import { FriendRequest, User } from "../domain.interface";
import { useUser } from "../lib/auth/hooks/useUser";
import { Layout } from "./Layout";
import { UserDetail } from "./UserDetail";

export const FriendRequests = () => {
  const { user } = useUser();
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    FriendRequest[]
  >([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>(
    []
  );
  const [friends, setFriends] = useState<User[]>([]);
  useEffect(() => {
    getFriendRequests().then((friendRequests) => {
      setReceivedFriendRequests(friendRequests);
    });
    getSentFriendRequests().then((friendRequests) => {
      setSentFriendRequests(friendRequests);
    });
    if (user?.username) {
      fetchFriendsOfUser(user?.username).then((friendsOfUser) => {
        setFriends(friendsOfUser);
      });
    }
  }, [user]);

  return (
    <Layout>
      <Tabs variant="soft-rounded" colorScheme="blackAlpha">
        <TabList>
          <Tab>Friends</Tab>
          <Tab>Friend Requests</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card variant="outline">
              <CardHeader>
                <Text as="b">Friends</Text>
              </CardHeader>
              <CardBody>
                {friends.length === 0
                  ? "No friends"
                  : friends.map((friend) => (
                      <UserDetail key={friend.id} user={friend} small />
                    ))}
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card variant="outline">
              <CardHeader>
                <Text as="b">Friend Requests</Text>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Received
                    </Heading>
                    {receivedFriendRequests.length === 0
                      ? "No friend requests"
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
                                onClick={() =>
                                  acceptFriendRequest(friendRequest.id)
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outline"
                                colorScheme="red"
                                size="xs"
                                onClick={() =>
                                  declineFriendRequest(friendRequest.id)
                                }
                              >
                                Decline
                              </Button>
                            </Stack>
                          </Flex>
                        ))}
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Sent
                    </Heading>
                    {sentFriendRequests.length === 0
                      ? "No friend requests"
                      : sentFriendRequests.map((friendRequest) => (
                          <Flex justify="space-between" align="center">
                            <UserDetail
                              key={friendRequest.id}
                              user={friendRequest.to}
                              small
                            />
                            <Button
                              colorScheme="red"
                              size="xs"
                              onClick={() =>
                                declineFriendRequest(friendRequest.id)
                              }
                            >
                              Cancel
                            </Button>
                          </Flex>
                        ))}
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};
