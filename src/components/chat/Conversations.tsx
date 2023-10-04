import { Badge, Box, Card, CardBody, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Conversation } from "../../domain.interface";
import { useUser } from "../../lib/auth/hooks/useUser";
import { UserDetailSmall } from "../UserDetailSmall";
import { useChat } from "./useChat";

export const Conversations = () => {
  const navigate = useNavigate();
  const { conversations, unreadByConversations } = useChat();
  const { user } = useUser();
  const lookupUserId = (participantIds: string[]) =>
    user?.friends.find((friend) => participantIds.includes(friend.id));
  const mostRecentMessage = (conversation: Conversation) =>
    conversation.messages[conversation.messages.length - 1];
  const mostRecentMessageAuthor = (conversation: Conversation) => {
    const msg = mostRecentMessage(conversation);
    if (msg) {
      return msg?.authorId === user?.id ? "You: " : "They: ";
    }
    return "";
  };

  return (
    <Card>
      <CardBody>
        {conversations.length === 0 && <Text>No conversations</Text>}
        {conversations?.map((conversation) => (
          <Box 
            mt={2}
            key={conversation.id}
            _hover={{ bg: "blackAlpha.100", cursor: "pointer" }}
            onClick={() => {
              navigate(
                `/users/${
                  lookupUserId(conversation.participantIds)?.username
                }/chat`
              );
            }}
          >
              <UserDetailSmall
                user={lookupUserId(conversation.participantIds)}
                bold
                asLink={false}
              />
              {unreadByConversations[conversation.id] === 0 ? null : (
                <Badge colorScheme="red" variant="solid" ml={2}>
                  {unreadByConversations[conversation.id]}
                </Badge>
              )}
              <Text fontSize={"sm"}>
                {mostRecentMessageAuthor(conversation)}
                {mostRecentMessage(conversation)?.content}
              </Text>
          </Box>
        ))}
      </CardBody>
    </Card>
  );
};
