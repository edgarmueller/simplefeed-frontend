import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { cancelFriendRequest } from "../../api/friends";
import { useFriends } from "../../hooks/useFriends";
import { UserDetailSmall } from "./UserDetailSmall";

export const SentFriendRequests = () => {
  const { sentFriendRequests, fetchSentFriendRequests } = useFriends();
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
								await cancelFriendRequest(friendRequest.id)
								await fetchSentFriendRequests();
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
