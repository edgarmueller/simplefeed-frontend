import { Alert, AlertDescription, AlertIcon, AlertTitle, Badge, Box, Button, Grid, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { BiChat, BiCog } from "react-icons/bi";
import { FiLogOut, FiSearch, FiUsers } from "react-icons/fi";
import { MdOutlineFeed } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { fetchConversations } from "../api/chat";
import { useAuth } from "../lib/auth/hooks/useAuth";
import { useUser } from "../lib/auth/hooks/useUser";
import { Logo } from "./Logo";
import { UserDetail } from "./UserDetail";
import { useChat } from "./chat/useChat";
import { useNotifications } from "./notifications/useNotifications";

export const Layout = ({ children }: any) => {
  const { user, hasError, error } = useUser();
  const { requestAllMessages, messagesByConversation } = useChat()
  const { unreadCount, setUnreadCount } = useNotifications();
  useEffect(() => {
    const unreadMessagesCount = Object.values(messagesByConversation).reduce(
      (acc, messages) => {
        return (
          acc + (messages?.filter((msg) => msg.authorId !== user?.id).filter(msg => !msg.isRead).length || 0)
        )
      }, 0)
    setUnreadCount(unreadMessagesCount);
  }, [messagesByConversation, setUnreadCount, user?.id]);
  useEffect(() => {
    fetchConversations()
      .then((conversations) => {
        for (const conversation of conversations) {
          requestAllMessages(conversation.id);
        }
      })
  }, [requestAllMessages]);
  const { logout } = useAuth();
  return (
    <Grid
      templateColumns="20% 1fr"
      templateRows="auto 1fr auto"
      height="100vh"
      gap={4}
    >
      <Box p={4} gridColumn="1 / -1">
        <Logo />
      </Box>
      <Box p={4}>
        <Stack h="100%" spacing={4} marginLeft={12} align="flex-start">
          <UserDetail small user={user} />
          <RouterLink to="/feed">
            <Button variant="link" leftIcon={<MdOutlineFeed />}>
              Feed
            </Button>
          </RouterLink>
          <RouterLink to="/search">
            <Button variant="link" leftIcon={<FiSearch/> }>
              Search
            </Button>
          </RouterLink>
          <RouterLink to="/chat">
            <Button variant="link" leftIcon={<BiChat />}>
              Chat
              {
                unreadCount === 0 ? null :
                  <Badge colorScheme="red" variant="solid" ml={2}>
                    {unreadCount}
                  </Badge>
              }
            </Button>
          </RouterLink>
          <RouterLink to="/friends">
            <Button variant="link" leftIcon={<FiUsers />}>
              Friends
            </Button>
          </RouterLink>
          <RouterLink to="/settings">
            <Button variant="link" leftIcon={<BiCog />}>
              Settings
            </Button>
          </RouterLink>
          <Button variant="link" leftIcon={<FiLogOut />} onClick={logout}>
            Logout
          </Button>
        </Stack>
      </Box>
      <Box p={4}>
        {/* Main Content */}
        <Box bg="white" maxWidth="65%" h="100%">
          {
            hasError ? 
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>An error occurred</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert> : children
          }
        </Box>
      </Box>
      <Box bg="gray.200" p={4} gridColumn="1 / -1">
        {/* Footer */}
        <Box h="100%" bg="gray.400">
          {/* Replace with your footer content */}
        </Box>
      </Box>
    </Grid>
  );
};
