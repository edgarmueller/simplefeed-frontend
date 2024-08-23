import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  acceptFriendRequest as acceptFriendRequestApi,
  declineFriendRequest as declineFriendRequestApi,
} from "../../api/friends";
import { useUser } from "../../hooks/useUser";
import { useChat } from "../../hooks/useChat";
import { useFriends } from "../../hooks/useFriends";
import { UserDetailSmall } from "./UserDetailSmall";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";

export const ReceivedFriendRequests = () => {
  const { refresh: refreshUserProfile } = useUser();
  const toast = useToast();
  const { user } = useUserStore();
  const { fetchConversations, joinConversation } = useChat();
  const {
    receivedFriendRequests,
    fetchReceivedFriendRequests,
    isLoadingReceivedFriendRequests,
    receivedFriendRequestsFetchError,
  } = useFriends();

  useEffect(() => {
    fetchReceivedFriendRequests();
  }, []);

  const acceptFriendRequestMutation = useMutation({
    mutationFn: (friendRequestId: string) =>
      acceptFriendRequestApi(friendRequestId),
    onSuccess: async (data) => {
      await Promise.all([
        // refresh user to fetch friends
        fetchReceivedFriendRequests(),
        // refresh user profile
        refreshUserProfile(),
      ]);
      const conversations = await fetchConversations();
      const conversation = conversations.find(
        (conversation) =>
          conversation.userIds.includes(user?.id || "") &&
          conversation.userIds.includes(data.from.id)
      );
      if (!conversation) {
        return;
      }
      await joinConversation(conversation.id);
      toast({
        title: "Friend request accepted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: `Accept friend request failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
  const declineFriendRequest = useMutation({
    mutationFn: (friendRequestId: string) =>
      declineFriendRequestApi(friendRequestId),
    onSuccess: async () => {
      await fetchReceivedFriendRequests();
    },
    onError: (error: Error) => {
      toast({
        title: `Decline friend request failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  if (isLoadingReceivedFriendRequests) {
    return <Spinner />;
  }

  if (receivedFriendRequestsFetchError) {
    return (
      <Alert variant="solid" colorScheme="red">
        {receivedFriendRequestsFetchError.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Heading size="sm" textTransform="uppercase" mb={2}>
        Friend Requests
      </Heading>
      <Box>
        <Heading size="xs" mb={2}>
          Received
        </Heading>
        {receivedFriendRequests.length === 0 ? (
          <Text size="sm">No friend requests</Text>
        ) : (
          receivedFriendRequests.map((friendRequest) => (
            <Flex
              key={friendRequest.id}
              justify="space-between"
              align="center"
              mt={2}
            >
              <UserDetailSmall user={friendRequest.from} />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outline"
                  colorScheme="green"
                  size="xs"
                  onClick={async () => {
                    await acceptFriendRequestMutation.mutate(friendRequest.id);
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="xs"
                  onClick={async () => {
                    await declineFriendRequest.mutate(friendRequest.id);
                  }}
                >
                  Decline
                </Button>
              </Stack>
            </Flex>
          ))
        )}
      </Box>
    </Box>
  );
};
