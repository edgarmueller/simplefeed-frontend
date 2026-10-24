import { Alert, Badge, Box, Card, Text } from "@chakra-ui/react";
import { head } from "lodash";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { Conversation, Message, User } from "../../model/domain.interface";
import { useChat } from "../../hooks/useChat";
import { getUnreadMessagesByConversation, useChatStore } from "../../stores/useChatStore";
import { UserDetailSmall } from "../users/UserDetailSmall";
import { useUserStore } from "../../stores/useUserStore";

interface UnreadMessageCountProps {
  unreadMessages: number;
}

function UnreadMessageCount({ unreadMessages }: UnreadMessageCountProps) {
  if (!unreadMessages) {
    return null;
  }
  return (
    <Badge colorPalette="red" variant="outline" mr={2}>
      {unreadMessages} new message(s)
    </Badge>
  )
}
/** Conversations are between a user and a channel they subscribe to. */
const findChannel = (subscriptions: User[], conversation: Conversation) => {
  return subscriptions.find((channel) => conversation.userIds.includes(channel.id));
}

type ConversationItemProps = {
  user?: User
  conversation: Conversation
  unreadCount: number
  mostRecentMessage?: Message
}

const ConversationItem = ({ user, conversation, unreadCount, mostRecentMessage }: ConversationItemProps) => {
  const navigate = useNavigate();
  const subscriptions = useUserStore((state) => state.subscriptions);
  const channel = findChannel(subscriptions, conversation)
  return (
    <Box
      mt={2}
      key={conversation.id}
      _hover={{ bg: "blackAlpha.100", cursor: "pointer" }}
      onClick={() => {
        if (!channel) {
          return;
        }
        navigate(`/users/${channel.username}/chat`);
      }}
    >
      <Box>
        <UserDetailSmall
          user={channel}
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
  const { user } = useUserStore();
  const { error } = useChat();
  const conversations = useChatStore((state) => state.conversations);
  const messagesByConversation = useChatStore((state) => state.messagesByConversation);
  const unreadByConversation = useChatStore(
    useShallow((s) => getUnreadMessagesByConversation(s)(user?.id))
  )
  const getMostRecentMessage = (conversation: Conversation) => head(messagesByConversation[conversation.id])

  return (
    <Card.Root>
      <Card.Body>
        {error ? (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Description>Couldn't fetch conversations: {error}</Alert.Description>
          </Alert.Root>
        ) : null}
        {conversations.length === 0 && <Text>No conversations</Text>}
        {conversations?.map((conversation) => {
          const messageCount = unreadByConversation![conversation.id]
          const mostRecentMessage = getMostRecentMessage(conversation);
          return <ConversationItem
            key={conversation.id}
            user={user || undefined}
            conversation={conversation}
            unreadCount={messageCount}
            mostRecentMessage={mostRecentMessage}
          />
        })}
      </Card.Body>
    </Card.Root>
  );
};
