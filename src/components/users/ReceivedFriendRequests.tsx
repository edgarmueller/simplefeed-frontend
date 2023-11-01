import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { acceptFriendRequest, declineFriendRequest } from "../../api/friend-requests";
import { useUser } from "../../hooks/useUser";
import { useChat } from "../../hooks/useChat";
import { useFriends } from "../../hooks/useFriends";
import { UserDetailSmall } from "./UserDetailSmall";

export const ReceivedFriendRequests = () => {
  const { user, refresh: refreshUser } = useUser();
  const { fetchConversations, joinConversation } = useChat();
  const { receivedFriendRequests, fetchReceivedFriendRequests } = useFriends();
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
            <Flex key={friendRequest.id} justify="space-between" align="center" mt={2}>
              <UserDetailSmall user={friendRequest.from} />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outline"
                  colorScheme="green"
                  size="xs"
                  onClick={async () => {
                    await acceptFriendRequest(friendRequest.id);
                    fetchReceivedFriendRequests();
                    await refreshUser();
                    const conversations = await fetchConversations();
                    const conversation = conversations.find(
                      (conversation) =>
                        conversation.participantIds.includes(user?.id || "") &&
                        conversation.participantIds.includes(
                          friendRequest.from.id
                        )
                    );
                    console.log('joining convo', conversation)
                    if (!conversation) {
                      return;
                    }
                    await joinConversation(conversation.id);
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="xs"
                  onClick={async () => {
                    await declineFriendRequest(friendRequest.id);
                    fetchReceivedFriendRequests();
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
