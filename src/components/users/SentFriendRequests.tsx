import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { cancelFriendRequest as cancelFriendRequestApi } from "../../api/friends";
import { useFriends } from "../../hooks/useFriends";
import { UserDetailSmall } from "./UserDetailSmall";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const SentFriendRequests = () => {
  const { sentFriendRequests, fetchSentFriendRequests } = useFriends();
  const cancelFriendRequest = useMutation({
    mutationFn: (friendRequestId: string) => cancelFriendRequestApi(friendRequestId),
    onSuccess: async () => {
      fetchSentFriendRequests();
    }
  });
  useEffect(() => {
    fetchSentFriendRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
								cancelFriendRequest.mutate(friendRequest.id)
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
