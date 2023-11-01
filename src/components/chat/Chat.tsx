import { Box, Button, Highlight, Input, Text, VStack } from "@chakra-ui/react";
import { last } from "lodash";
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { ScrollableBox } from "./ScrollableBox";
import { useChat } from "../../hooks/useChat";

export interface ChatProps {
  conversationId: string;
  friend: {
    id: string;
    username: string;
  };
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Chat = ({ friend, conversationId }: ChatProps) => {
  const {
    markAsRead,
    sendMessage,
    requestAllMessages,
    requestMessages,
    messagesByConversation,
    loading
  } = useChat();
  const [page, setPage] = useState(0);
  const { user } = useUser();
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (conversationId) {
      requestAllMessages(conversationId);
    }
  }, [conversationId, requestAllMessages]);

  let ref: any = undefined;

  useEffect(() => {
    const lastElement = ref?.current?.lastElementChild.lastElementChild.firstElementChild
    // only scroll to bottom on our own messages
    if (
      lastElement &&
      last(messagesByConversation[conversationId])?.authorId === user?.id
    ) {
      lastElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [
    messagesByConversation[conversationId]?.length,
    conversationId,
    user?.id,
  ]);

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <ScrollableBox
          loading={loading}
          bg="gray.200"
          borderRadius="md"
          p={4}
          height="20em"
          overflowY="auto"
          data={messagesByConversation[conversationId]}
          onScrollToTop={() => {
            requestMessages(conversationId, page + 1);
            setPage(page + 1);
          }}
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
            ref = scrollRef;
            return messagesByConversation[conversationId]?.map(
              (message, index) => (
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
              )
            );
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
