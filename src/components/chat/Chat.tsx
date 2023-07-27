import { Box, Button, Highlight, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
}

const Chat = ({ friend, conversationId }: ChatProps) => {
  const { markAsRead, sendMessage, requestAllMessages, messagesByConversation } = useChat();
  const [inputValue, setInputValue] = useState("");
  useEffect(() => { 
    if (conversationId) {
      requestAllMessages(conversationId)
    }
  }, [conversationId, requestAllMessages]);

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
            markAsRead(conversationId, messagesByConversation[conversationId]?.filter(({ isRead }) => !isRead))
          }}
        >
          {messagesByConversation[conversationId]?.map((message, index) => (
            <Box
              key={index}
              p={2}
              textAlign={message.authorId === friend.id ? "left" : "right"}
            >
              <Text>
                <Highlight
                  query={message.content}
                  styles={{ px: '2', py: '1', rounded: 'full', bg: message.authorId === friend?.id ? 'teal.100' : 'blue.300' }}
                >
                  {message.content}
                </Highlight>
              </Text>
              <Text fontSize="xs" color="gray.500">
                {formatDate(message.createdAt)}
              </Text>
            </Box>
          ))}
        </ScrollableBox>
        <Input
          placeholder="Type a message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button colorScheme="blackAlpha" onClick={() => {
          sendMessage(conversationId, inputValue)
          setInputValue('')
        }}>
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default Chat;
