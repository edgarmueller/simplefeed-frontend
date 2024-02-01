import { Alert, AlertDescription, AlertIcon, Badge, Box, Card, CardBody, Text } from "@chakra-ui/react";
import { head } from "lodash";
import { useNavigate } from "react-router-dom";
import { Conversation, Message, User } from "../../domain.interface";
import { useChat } from "../../hooks/useChat";
import { useUser } from "../../hooks/useUser";
import { getUnreadMessagesByConversation, useChatStore } from "../../stores/useChatStore";
import { UserDetailSmall } from "../users/UserDetailSmall";

interface UnreadMessageCountProps {
  unreadMessages: number;
}

function UnreadMessageCount({ unreadMessages }: UnreadMessageCountProps) {
  if (!unreadMessages) {
    return null;
  }
  return (
    <Badge colorScheme="red" variant="outline" mr={2}>
      {unreadMessages} new message(s)
    </Badge>
  )
}
const findFriend = (user: User | undefined, conversation: Conversation) => {
  return user?.friends.find((friend) => conversation.userIds.includes(friend.id));
}

type ConversationItemProps = {
  user?: User
  conversation: Conversation
  unreadCount: number
  mostRecentMessage?: Message
}

const ConversationItem = ({ user, conversation, unreadCount, mostRecentMessage }: ConversationItemProps) => {
  const navigate = useNavigate();
  const friend = findFriend(user, conversation)
  const url = `/users/${friend?.username}/chat`
  return (
    <Box
      mt={2}
      key={conversation.id}
      _hover={{ bg: "blackAlpha.100", cursor: "pointer" }}
      onClick={() => {
        if (!friend) {
          return;
        }
        navigate(url);
      }}
    >
      <Box dir="row">
        <UserDetailSmall
          user={findFriend(user, conversation)}
          bold
          asLink={false}
        />
        <UnreadMessageCount unreadMessages={unreadCount} />
        <Text as="span">
          {user && mostRecentMessage ? mostRecentMessage?.authorId === user.id ? "You: " : "They: " : null}
          {mostRecentMessage?.content}
        </Text>
      </Box>
    </Box>
  )
}

export const Conversations = () => {
  const { user } = useUser();
  const { error } = useChat();
  const conversations = useChatStore((state) => state.conversations);
  const messagesByConversation = useChatStore((state) => state.messagesByConversation);
  const getUnreadByConversation = useChatStore(getUnreadMessagesByConversation)
  const unreadByConversation = getUnreadByConversation(user?.id)
  const getMostRecentMessage = (conversation: Conversation) => head(messagesByConversation[conversation.id])

  return (
    <Card>
      <CardBody>
        {error ? <Alert status="error">
                <AlertIcon />
          <AlertDescription>Couldn't fetch conversations: {error}</AlertDescription>
          </Alert> : null}
        {conversations.length === 0 && <Text>No conversations</Text>}
        {conversations?.map((conversation) => {
          const messageCount = unreadByConversation![conversation.id]
          const mostRecentMessage = getMostRecentMessage(conversation);
          return <ConversationItem
            user={user || undefined}
            conversation={conversation}
            unreadCount={messageCount}
            mostRecentMessage={mostRecentMessage}
          />
        })}
      </CardBody>
    </Card>
  );
};
