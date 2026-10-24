import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { head } from "lodash";
import { useEffect, useState } from "react";
import { ScrollableBox } from "./ScrollableBox";
import { useChat } from "../../hooks/useChat";
import { useChatStore } from "../../stores/useChatStore";
import { useUserStore } from "../../stores/useUserStore";

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
    sendMessage,
    requestMessages,
    markAsRead,
    loading
  } = useChat();
  const messagesByConversation = useChatStore(s => s.messagesByConversation)
  const [page, setPage] = useState(1);
  const { user } = useUserStore();
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    requestMessages(conversationId, page);
  }, [page, requestMessages, conversationId])

  // TODO: sorted in reverse order, provide convenience?
  const lastMessage = head(messagesByConversation[conversationId]) 
  const lastMessageFromOtherUser = lastMessage?.authorId !== user?.id;
  const nbOfMessages = messagesByConversation[conversationId]?.length
  // TODO: fix this
  let ref: any = undefined;
  useEffect(() => {
    if (lastMessage?.isRead) return;
    // the list may still be empty while messages load
    const lastElement = ref?.current?.lastElementChild?.lastElementChild?.firstElementChild
    lastElement?.scrollIntoView({ behavior: "smooth", block: "end" })
    if (lastMessageFromOtherUser) {
      markAsRead(conversationId)
    }
  }, [
    nbOfMessages,
    lastMessageFromOtherUser,
    conversationId,
    user?.id,
  ]);

  return (
    <Box>
      <VStack gap={4} align="stretch">
        <ScrollableBox
          loading={loading}
          bg="gray.200"
          borderRadius="md"
          p={4}
          height="20em"
          overflowY="auto"
          data={messagesByConversation[conversationId]}
          onScrollToTop={() => {
            setPage(page + 1);
          }}
          onScrollToBottom={() => {
            markAsRead(conversationId);
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
                  <Text
                    display="inline-block"
                    px={3}
                    py={1}
                    rounded="full"
                    bg={message.authorId === friend.id ? "teal.100" : "blue.300"}
                  >
                    {message.content}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {formatDate(message.createdAt)}
                  </Text>
                </Box>
              )
            );
          }}
        </ScrollableBox>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(conversationId, inputValue);
            setInputValue("");
          }}
        >
          <VStack gap={2} align="stretch">
            <Input
              placeholder="Type a message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="submit" colorPalette="gray">
              Send
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Chat;
