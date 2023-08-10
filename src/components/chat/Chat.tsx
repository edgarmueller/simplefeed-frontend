import { Box, Button, Highlight, Input, Text, VStack } from "@chakra-ui/react";
import { last } from "lodash";
import { useEffect, useState } from "react";
import { useUser } from "../../lib/auth/hooks/useUser";
import { ScrollableBox } from "./ScrollableBox";
import { useChat } from "./useChat";

export interface ChatProps {
  conversationId: string;
  friend: {
    id: string;
    username: string;
  };
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Chat = ({ friend, conversationId }: ChatProps) => {
  const {
    markAsRead,
    sendMessage,
    requestAllMessages,
    messagesByConversation,
  } = useChat();
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (conversationId) {
      requestAllMessages(conversationId);
    }
  }, [conversationId, requestAllMessages]);

  let ref: any = undefined;
 
  useEffect(() => {
    const lastElement = ref?.current?.lastElementChild;
    // only scroll to bottom on our own messages
    if (lastElement && last(messagesByConversation[conversationId])?.authorId === user?.id ) {
      lastElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messagesByConversation[conversationId]?.length, conversationId, user?.id])
  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <ScrollableBox
          bg="gray.200"
          borderRadius="md"
          p={4}
          height="20em"
          overflowY="auto"
          onScrollToBottom={() => {
            markAsRead(
              conversationId,
              messagesByConversation[conversationId]?.filter(
                ({ isRead }) => !isRead
              )
            );
          }}
        >
          {(scrollRef: any) => {
            ref= scrollRef;
            return messagesByConversation[conversationId]?.map((message, index) => (
              <Box
                key={index}
                p={2}
                textAlign={message.authorId === friend.id ? "left" : "right"}
              >
                <Text>
                  <Highlight
                    query={message.content}
                    styles={{
                      px: "2",
                      py: "1",
                      rounded: "full",
                      bg:
                        message.authorId === friend?.id
                          ? "teal.100"
                          : "blue.300",
                    }}
                  >
                    {message.content}
                  </Highlight>
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {formatDate(message.createdAt)}
                </Text>
              </Box>
            ));
          }}
        </ScrollableBox>
        <Input
          placeholder="Type a message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          colorScheme="blackAlpha"
          onClick={() => {
            sendMessage(conversationId, inputValue);
            setInputValue("");
          }}
        >
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default Chat;
