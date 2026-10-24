import { Button, Card, Heading, Stack } from "@chakra-ui/react";
import { notifyError, notifySuccess } from "../components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { removeFriend } from "../api/friends";
import { useUser } from "../hooks/useUser";
import { Layout } from "../components/common/Layout";
import { FriendList } from "../components/users/FriendList";
import { UserDetailSmall } from "../components/users/UserDetailSmall";
import { ReceivedFriendRequests } from "../components/users/ReceivedFriendRequests";
import { SentFriendRequests } from "../components/users/SentFriendRequests";
import { useUserStore } from "../stores/useUserStore";

export const FriendsPage = () => {
  const { refresh: refreshUser } = useUser();
  const { friends } = useUserStore()
  const removeFriendMutation = useMutation({
    mutationFn: (friendId: string) => removeFriend(friendId),
    onSuccess: async () => {
      await refreshUser();
      notifySuccess("Friend removed");
    },
    onError: (error: Error) => notifyError("Removing the friend", error),
  })
  return (
    <Layout>
      <Card.Root variant="outline">
        <Card.Body>
          <Stack gap="4">
            <ReceivedFriendRequests />
            <SentFriendRequests />
          </Stack>
        </Card.Body>
      </Card.Root>
      <Card.Root variant="outline" mt={4}>
        <Card.Body>
          <Heading size="sm" textTransform="uppercase">
            Friends
          </Heading>
          <FriendList
            friends={friends || []}
            renderFriend={(friend) => (
              <>
                <UserDetailSmall user={friend} asLink />
                <Button
                  variant="outline"
                  colorPalette="red"
                  size="xs"
                  onClick={() => {
                    removeFriendMutation.mutate(friend.id);
                  }}
                >
                  Remove
                </Button>
              </>
            )}
            ifEmpty={<>No friends</>}
          />
        </Card.Body>
      </Card.Root>
    </Layout>
  );
};
