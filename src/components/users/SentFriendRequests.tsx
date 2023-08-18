import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { cancelFriendRequest, getSentFriendRequests } from "../../api/friend-requests";
import { FriendRequest } from "../../domain.interface";
import { UserDetailSmall } from "../UserDetailSmall";

export const SentFriendRequests = () => {
	const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>([]);
	const fetchSentFriendRequests = async () => {
		const requests = await getSentFriendRequests();
		setSentFriendRequests(requests);
	}
  useEffect(() => {
		fetchSentFriendRequests();
  }, []);
  return (
    <Box>
      <Heading size="xs" mb={2}>Sent</Heading>
      {sentFriendRequests.length === 0 ? (
        <Text size="sm">No friend requests</Text>
      ) : (
        sentFriendRequests.map((friendRequest) => (
          <Flex justify="space-between" align="center">
            <UserDetailSmall
              key={friendRequest.id}
              user={friendRequest.to}
              small
              hasFriendRequest
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
