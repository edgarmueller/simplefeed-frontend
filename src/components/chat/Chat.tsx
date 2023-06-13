import React, { useEffect, useState } from 'react';
import { Box, Input, Button, VStack } from '@chakra-ui/react';

interface Message {
  text: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const newSocket = new WebSocket('ws://your-websocket-server-url');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!inputValue) return;

    const message: Message = {
      text: inputValue,
      timestamp: Date.now(),
    };

    socket?.send(JSON.stringify(message));
    setInputValue('');
  };

  return (
    <Box width="400px" p={4}>
      <VStack spacing={4} align="stretch">
        <Box
          bg="gray.200"
          borderRadius="md"
          p={4}
          height="300px"
          overflowY="scroll"
        >
          {messages.map((message, index) => (
            <Box key={index} p={2}>
              {message.text}
            </Box>
          ))}
        </Box>
        <Input
          placeholder="Type a message"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button colorScheme="blue" onClick={sendMessage}>
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default Chat;
