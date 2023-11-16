import { Badge, Box, Card, CardBody, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Conversation } from "../../domain.interface";
import { useUser } from "../../hooks/useUser";
import { groupUnreadMessagesByConversations, useChat } from "../../hooks/useChat";
import { UserDetailSmall } from "../users/UserDetailSmall";
import { sortBy } from "lodash";

interface UnreadMessageCountProps {
  unreadMessages: number;
}

function UnreadMessageCount({ unreadMessages }: UnreadMessageCountProps) {
  if (unreadMessages === 0) {
    return null;
  }
  return (
    <Badge colorScheme="red" variant="outline" mr={2}>
      {unreadMessages} new message(s)
    </Badge>
  )
}

export const Conversations = () => {
  const navigate = useNavigate();
  const { conversations, messagesByConversation } = useChat();
  const { user } = useUser();
  const unreadByConversations = groupUnreadMessagesByConversations(user?.id!, messagesByConversation);
  const lookupUserById = (participantIds: string[]) => {
    return user?.friends.find((friend) => participantIds.includes(friend.id));
  }
  const mostRecentMessage = (conversation: Conversation) =>
    sortBy(conversation.messages, a => a.createdAt)[conversation.messages.length - 1]
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
        {conversations?.map((conversation) => {
          const messageCount = unreadByConversations[conversation.id]
          return (
            <Box
              mt={2}
              key={conversation.id}
              _hover={{ bg: "blackAlpha.100", cursor: "pointer" }}
              onClick={() => {
                const user = lookupUserById(conversation.userIds)
                const url = `/users/${user?.username}/chat`
                navigate(url);
              }}
            >
              <Box dir="row">
                <UserDetailSmall
                  user={lookupUserById(conversation.userIds)}
                  bold
                  asLink={false}
                />
                <UnreadMessageCount unreadMessages={messageCount} />
                <Text as="span">
                  {mostRecentMessageAuthor(conversation)}
                  {mostRecentMessage(conversation)?.content}
                </Text>
              </Box>
            </Box>
          )
        })}
      </CardBody>
    </Card>
  );
};
