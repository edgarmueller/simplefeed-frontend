import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { FriendRequest } from "../../domain.interface";
import { useEffect, useState } from "react";
import { acceptFriendRequest, declineFriendRequest, getFriendRequests } from "../../api/friend-requests";
import { useChat } from "../chat/useChat";
import { UserDetailSmall } from "../UserDetailSmall";
import { useUser } from "../../lib/auth/hooks/useUser";

export const ReceivedFriendRequests = () => {
  const { user, refresh: refreshUser } = useUser();
  const { fetchConversations, joinConversation } = useChat();
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<
    FriendRequest[]
  >([]);
  useEffect(() => {
    getFriendRequests().then((friendRequests) => {
      setReceivedFriendRequests(friendRequests);
    });
  }, []);
  return (
    <Box>
      <Heading size="sm" textTransform="uppercase">
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
            <Flex key={friendRequest.id} justify="space-between" align="center">
              <UserDetailSmall user={friendRequest.from} />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outline"
                  colorScheme="green"
                  size="xs"
                  onClick={async () => {
                    await acceptFriendRequest(friendRequest.id);
                    setReceivedFriendRequests((requests) =>
                      requests.filter(
                        (request) => request.id !== friendRequest.id
                      )
                    );
                    await refreshUser();
                    const conversations = await fetchConversations();
                    const conversationId = conversations.find(
                      (conversation) =>
                        conversation.participantIds.includes(user?.id || "") &&
                        conversation.participantIds.includes(
                          friendRequest.from.id
                        )
                    );
                    if (!conversationId) {
                      return;
                    }
                    await joinConversation(conversationId.id);
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
                    setReceivedFriendRequests((requests) =>
                      requests.filter(
                        (request) => request.id !== friendRequest.id
                      )
                    );
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
