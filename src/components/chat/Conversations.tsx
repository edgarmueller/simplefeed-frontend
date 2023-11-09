import { Badge, Box, Card, CardBody, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Conversation } from "../../domain.interface";
import { useUser } from "../../hooks/useUser";
import { groupUnreadMessagesByConversations, useChat } from "../../hooks/useChat";
import { UserDetailSmall } from "../users/UserDetailSmall";

export const Conversations = () => {
  const navigate = useNavigate();
  const { conversations, messagesByConversation } = useChat();
  const { user } = useUser();
  const unreadByConversations = groupUnreadMessagesByConversations(user?.id!, messagesByConversation);
  const lookupUserById = (participantIds: string[]) => {
    return user?.friends.find((friend) => participantIds.includes(friend.id));
  }
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
                  lookupUserById(conversation.userIds)?.username
                }/chat`
              );
            }}
          >
              <UserDetailSmall
                user={lookupUserById(conversation.userIds)}
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
