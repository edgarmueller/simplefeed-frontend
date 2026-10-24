import { Alert, Badge, Box, Grid, Link, Stack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BiBell, BiChat, BiCog } from "react-icons/bi";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { MdOutlineFeed, MdRssFeed } from "react-icons/md";
import { Link as RouterLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";
import { Logo } from "./Logo";
import { UserDetail } from "../users/UserDetail";
import { getUnreadCount, useChatStore } from "../../stores/useChatStore";
import { getUnreadNotifications, useNotificationsStore } from "../../stores/useNotificationsStore";
import { useUserStore } from "../../stores/useUserStore";

const navLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  fontWeight: "semibold",
  color: "fg.muted",
  _hover: { color: "fg", textDecoration: "none" },
} as const;

const NavLink = ({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) => (
  <Link asChild {...navLinkStyle}>
    <RouterLink to={to}>
      {icon}
      {children}
    </RouterLink>
  </Link>
);

const CountBadge = ({ count }: { count: number }) =>
  count === 0 ? null : (
    <Badge colorPalette="red" variant="solid" size="sm">
      {count}
    </Badge>
  );

export const Layout = ({ children }: { children?: ReactNode }) => {
  const { hasError, error } = useUser();
  const { user } = useUserStore();
  const unreadChatMessages = useChatStore((s) => getUnreadCount(s)(user?.id))
  const unreadNotifications = useNotificationsStore((s) => getUnreadNotifications(s).length)
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
        <Stack as="nav" h="100%" gap={4} marginLeft={12} align="flex-start">
          <RouterLink to={`/users/${user?.username}`}>
            <UserDetail small user={user} />
          </RouterLink>
          <NavLink to="/feed" icon={<MdOutlineFeed />}>Feed</NavLink>
          <NavLink to="/channels" icon={<MdRssFeed />}>Channels</NavLink>
          <NavLink to="/search" icon={<FiSearch />}>Search</NavLink>
          <NavLink to="/chat" icon={<BiChat />}>
            Chat <CountBadge count={unreadChatMessages} />
          </NavLink>
          <NavLink to="/notifications" icon={<BiBell />}>
            Notifications <CountBadge count={unreadNotifications} />
          </NavLink>
          <NavLink to="/settings" icon={<BiCog />}>Settings</NavLink>
          <Link as="button" {...navLinkStyle} onClick={logout}>
            <FiLogOut />
            Logout
          </Link>
        </Stack>
      </Box>
      <Box p={4}>
        <Box bg="bg" maxWidth="65%" h="100%">
          {hasError ? (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>An error occurred</Alert.Title>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          ) : (
            children
          )}
        </Box>
      </Box>
      <Box bg="gray.200" p={4} gridColumn="1 / -1" />
    </Grid>
  );
};
