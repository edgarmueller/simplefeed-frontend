import { Alert, Badge, Box, Grid, Link, Spinner, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BiBookmark, BiCog, BiErrorCircle } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineFeed, MdRssFeed } from "react-icons/md";
import { Link as RouterLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useSubscriptions } from "../../hooks/useReader";
import { useUser } from "../../hooks/useUser";
import { Subscription } from "../../model/domain.interface";
import { useUserStore } from "../../stores/useUserStore";
import { UserAvatar } from "../ui/user-avatar";
import { Logo } from "./Logo";

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
    <Badge colorPalette="blue" variant="subtle" size="sm">
      {count}
    </Badge>
  );

const ChannelLink = ({ subscription }: { subscription: Subscription }) => {
  const { channel } = subscription;
  return (
    <Link asChild fontSize="sm" color="fg.muted" _hover={{ color: "fg", textDecoration: "none" }} width="100%">
      <RouterLink to={`/channels/${channel.id}`}>
        <Stack direction="row" justify="space-between" align="center" width="100%" gap={2}>
          <Text truncate>{channel.name ?? channel.url}</Text>
          {channel.status === "pending" ? <Spinner size="xs" /> : null}
          {channel.status === "failed" ? <BiErrorCircle title={channel.error} /> : null}
          {channel.status === "active" ? <CountBadge count={subscription.unread} /> : null}
        </Stack>
      </RouterLink>
    </Link>
  );
};

export const Layout = ({ children }: { children?: ReactNode }) => {
  const { hasError, error } = useUser();
  const { user } = useUserStore();
  const { logout } = useAuth();
  const subscriptions = useSubscriptions();
  const unread = subscriptions.data?.reduce((total, subscription) => total + subscription.unread, 0) ?? 0;
  return (
    <Grid templateColumns="20% 1fr" templateRows="auto 1fr auto" minHeight="100vh" gap={4}>
      <Box p={4} gridColumn="1 / -1">
        <Logo />
      </Box>
      <Box p={4}>
        <Stack as="nav" gap={4} marginLeft={12} align="flex-start">
          <Stack direction="row" align="center" gap={2}>
            <UserAvatar size="sm" name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} src={user?.imageUrl} />
            <Text>{user?.firstName} {user?.lastName}</Text>
          </Stack>
          <NavLink to="/feed" icon={<MdOutlineFeed />}>
            Feed <CountBadge count={unread} />
          </NavLink>
          <NavLink to="/saved" icon={<BiBookmark />}>Saved</NavLink>
          <NavLink to="/channels" icon={<MdRssFeed />}>Channels</NavLink>
          {subscriptions.data?.length ? (
            <Stack gap={1} width="100%" paddingStart={6} aria-label="Your channels">
              {subscriptions.data.map((subscription) => (
                <ChannelLink key={subscription.id} subscription={subscription} />
              ))}
            </Stack>
          ) : null}
          <NavLink to="/settings" icon={<BiCog />}>Settings</NavLink>
          <Link as="button" {...navLinkStyle} onClick={logout}>
            <FiLogOut />
            Logout
          </Link>
        </Stack>
      </Box>
      <Box p={4}>
        <Box bg="bg" maxWidth="2xl" h="100%">
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
