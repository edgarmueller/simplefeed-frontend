import { Alert, Box, Button, Flex, Heading, Spinner, Text, useToast } from "@chakra-ui/react";
import { cancelFriendRequest } from "../../api/friends";
import { useFriends } from "../../hooks/useFriends";
import { UserDetailSmall } from "./UserDetailSmall";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const SentFriendRequests = () => {
  const toast = useToast();
  const { sentFriendRequests, fetchSentFriendRequests, isLoadingSentFriendRequests, sentFriendRequestsFetchError } = useFriends();
  const cancelFriendRequestMutation = useMutation({
    mutationFn: (friendRequestId: string) => cancelFriendRequest(friendRequestId),
    onSuccess: async () => {
      // refetch sent friend requests
      await fetchSentFriendRequests();
      toast({
        title: "Friend request cancelled",
        status: "success",
        duration: 5000,
        isClosable: true
      })
    },
    onError: (error: Error) => {
      toast({
        title: `Cancel friend request failed: ${error.message}. Please try again later.`,
        status: "error",
        duration: 5000,
        isClosable: true
      })
    } 
  });
  useEffect(() => {
    fetchSentFriendRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isLoadingSentFriendRequests) {
    return <Spinner />
  }
  if (sentFriendRequestsFetchError) {
    return <Alert variant='solid' colorScheme="red">{sentFriendRequestsFetchError.message}</Alert>
  }
  return (
    <Box>
      <Heading size="xs" mb={2}>Sent</Heading>
      {sentFriendRequests.length === 0 ? (
        <Text size="sm">No friend requests</Text>
      ) : (
        sentFriendRequests.map((friendRequest) => (
          <Flex justify="space-between" align="center" mt={2}>
            <UserDetailSmall
              key={friendRequest.id}
              user={friendRequest.to as any}
            />
            <Button
              colorScheme="red"
              size="xs"
              onClick={async () => {
								cancelFriendRequestMutation.mutate(friendRequest.id)
							}}
            >
              Cancel
            </Button>
          </Flex>
        ))
      )}
    </Box>
  );
};
