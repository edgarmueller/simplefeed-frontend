import {
  Button,
  Card,
  CardBody,
  Heading,
  Stack,
  useToast
} from "@chakra-ui/react";
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
  const toast = useToast();
  const { refresh: refreshUser } = useUser();
  const { friends } = useUserStore()
  const removeFriendMutation = useMutation({
    mutationFn: (friendId: string) => removeFriend(friendId),
    onSuccess: async () => {
      await refreshUser();
      toast({
        title: "Friend removed",
        status: "success",
        duration: 5000,
        isClosable: true
      })
    },
    onError: (error: Error) => {
      toast({
        title: `Remove friend request failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    }
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
            friends={friends || []}
            renderFriend={(friend) => (
              <>
                <UserDetailSmall user={friend} asLink />
                <Button
                  variant="outline"
                  colorScheme="red"
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
        </CardBody>
      </Card>
    </Layout>
  );
};
