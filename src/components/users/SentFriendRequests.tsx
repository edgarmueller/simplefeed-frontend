import { Alert, Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { notifyError, notifySuccess } from "../ui/toaster";
import { cancelFriendRequest } from "../../api/friends";
import { useFriends } from "../../hooks/useFriends";
import { UserDetailSmall } from "./UserDetailSmall";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const SentFriendRequests = () => {
  const { sentFriendRequests, fetchSentFriendRequests, isLoadingSentFriendRequests, sentFriendRequestsFetchError } = useFriends();
  const cancelFriendRequestMutation = useMutation({
    mutationFn: (friendRequestId: string) => cancelFriendRequest(friendRequestId),
    onSuccess: async () => {
      // refetch sent friend requests
      await fetchSentFriendRequests();
      notifySuccess("Friend request cancelled");
    },
    onError: (error: Error) => notifyError("Cancelling the friend request", error),
  });
  useEffect(() => {
    fetchSentFriendRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isLoadingSentFriendRequests) {
    return <Spinner />
  }
  if (sentFriendRequestsFetchError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{sentFriendRequestsFetchError.message}</Alert.Title>
      </Alert.Root>
    )
  }
  return (
    <Box>
      <Heading size="xs" mb={2}>Sent</Heading>
      {sentFriendRequests.length === 0 ? (
        <Text fontSize="sm">No friend requests</Text>
      ) : (
        sentFriendRequests.map((friendRequest) => (
          <Flex key={friendRequest.id} justify="space-between" align="center" mt={2}>
            <UserDetailSmall user={friendRequest.to} />
            <Button
              variant="outline"
              colorPalette="red"
              size="xs"
              onClick={() => cancelFriendRequestMutation.mutate(friendRequest.id)}
            >
              Cancel
            </Button>
          </Flex>
        ))
      )}
    </Box>
  );
};
