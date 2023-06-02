import { Box, Button, Grid, Stack } from "@chakra-ui/react";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { MdOutlineFeed } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../lib/auth/hooks/useAuth";
import { useUser } from "../lib/auth/hooks/useUser";
import { Logo } from "./Logo";
import { UserDetail } from "./UserDetail";

export const Layout = ({ children }: any) => {
  const { user } = useUser();
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
        {/* Navigation */}
        <Stack h="100%" spacing={4} marginLeft={12} align="flex-start">
          <UserDetail small user={user} />
          <RouterLink to="/feed">
            <Button variant="link" leftIcon={<MdOutlineFeed />}>
              Feed
            </Button>
          </RouterLink>
          <RouterLink to="/friends">
            <Button variant="link" leftIcon={<FiUsers />}>
              Friends
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
          {children}
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
