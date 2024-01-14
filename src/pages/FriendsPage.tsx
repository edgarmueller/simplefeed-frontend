import {
  Button,
  Card,
  CardBody,
  Heading,
  Stack
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { removeFriend as removeFriendApi } from "../api/friends";
import { useUser } from "../hooks/useUser";
import { Layout } from "../components/common/Layout";
import { FriendList } from "../components/users/FriendList";
import { UserDetailSmall } from "../components/users/UserDetailSmall";
import { ReceivedFriendRequests } from "../components/users/ReceivedFriendRequests";
import { SentFriendRequests } from "../components/users/SentFriendRequests";

export const FriendsPage = () => {
  const { user, refresh: refreshUser } = useUser();
  const removeFriend = useMutation({
    mutationFn: (friendId: string) => removeFriendApi(friendId),
    onSuccess: refreshUser
  }) 
  return (
    <Layout>
      <Card variant="outline">
        <CardBody>
          <Stack spacing="4">
            <ReceivedFriendRequests />
            <SentFriendRequests />
          </Stack>
        </CardBody>
      </Card>
      <Card variant="outline" mt={4}>
        <CardBody>
          <Heading size="sm" textTransform="uppercase">
            Friends
          </Heading>
          <FriendList
            friends={user?.friends || []}
            renderFriend={(friend) => (
              <>
                <UserDetailSmall user={friend} asLink />
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="xs"
                  onClick={() => {
                    removeFriend.mutate(friend.id);
                  }}
                >
                  Remove
                </Button>
              </>
            )}
            ifEmpty={<>No friends</>}
          />
        </CardBody>
      </Card>
    </Layout>
  );
};
