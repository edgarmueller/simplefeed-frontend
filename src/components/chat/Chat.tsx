import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import decodeToken from "jwt-decode";
import { useAuth } from "../../lib/auth/hooks/useAuth";
import { refreshToken } from "../../lib/fetch";
import { getAccessToken } from "../../lib/auth/api/auth";
import { useUser } from "../../lib/auth/hooks/useUser";
import { ScrollableBox } from "./ScrollableBox";

interface Message {
  createdAt: string;
  authorId: string;
  content: string;
  conversationId: string;
}

export interface ChatProps {
  conversationId: string;
  friend: {
    id: string;
    username: string;
  }
}

const Chat = ({ friend, conversationId }: ChatProps) => {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { token } = useAuth();
  const updateChatAccessToken = (newToken: string | null) => {
    if (socket && newToken) {
      console.log('updating token')
      socket.io.opts.extraHeaders = {
        Authorization: `Bearer ${newToken}`,
      };
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    const socket = io('http://localhost:5001', {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, [token]);

  const validateToken = async () => {
    if (!token) return false;
    // Perform your token validation logic here
    // You can use a library like jwt-decode to decode the token and check its expiration
    const decodedToken = decodeToken<{ exp: number }>(token);

    if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
      // Token has expired
      // You can trigger the token refresh process here
      await refreshToken();
      const accessToken = getAccessToken();
      updateChatAccessToken(accessToken);
    }
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onAllMessages(conversation: any) {
      console.log({ conversation })
      setMessages(conversation.messages);
    }

    function onMessage(msg: Message) {
      setMessages(msgs => ([...msgs, msg]));
    }

    if (socket?.active) {
      return;
    }
    socket?.connect();

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("send_all_messages", onAllMessages);
    socket?.on("receive_message", onMessage);

    socket?.emit("request_all_messages", {
      conversationId,
    });

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("receive_message", onMessage);
      socket?.off("send_all_messages", onAllMessages);
    };
  }, [socket, conversationId]);

  const sendMessage = async () => {
    if (!inputValue) return;

    const message: Message = {
      authorId: user?.id || "",
      content: inputValue,
      createdAt: new Date().toISOString(),
      conversationId,
    };

    await validateToken();
    socket?.emit('send_message', JSON.stringify(message));
    setInputValue("");
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Box>{isConnected}</Box>
        <ScrollableBox
          bg="gray.200"
          borderRadius="md"
          p={4}
          height="20em"
          overflowY="auto"
        >
          {messages.map((message, index) => (
            <Box key={index} p={2} textAlign={message.authorId === friend.id ? "left" : "right"}>
              <Text>{message.authorId === friend?.id ? friend.username : user?.username}: {message.content}</Text>
              <Text fontSize="xs" color="gray.500">{formatDate(message.createdAt)}</Text>
            </Box>
          ))}
        </ScrollableBox>
        <Input
          placeholder="Type a message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button colorScheme="blackAlpha" onClick={sendMessage}>
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default Chat;
