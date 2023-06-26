import {
  Box,
  Card,
  CardBody,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchConversations } from "../../api/chat";
import { Conversation } from "../../domain.interface";
import { useUser } from "../../lib/auth/hooks/useUser";
import { UserDetailSmall } from "../UserDetailSmall";

export const Conversations = () => {
	const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
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
  useEffect(() => {
    fetchConversations().then((data) => setConversations(data));
  }, []);
  console.log({ conversations });

  return (
    <Card>
      <CardBody>
        {conversations?.map((conversation) => (
          <Box key={conversation.id} _hover={{ bg: "blackAlpha.100", cursor: "pointer" }} onClick={() => {
						navigate(`/users/${lookupUserId(conversation.participantIds)?.username}/chat`)
					}}>
            <UserDetailSmall
              user={lookupUserId(conversation.participantIds)}
              bold
							asLink={false}
            />
            <Text>
              {mostRecentMessageAuthor(conversation)}
              {mostRecentMessage(conversation)?.content}
            </Text>
          </Box>
        ))}
      </CardBody>
    </Card>
  );
};
