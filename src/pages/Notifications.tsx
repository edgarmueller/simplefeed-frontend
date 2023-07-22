import { Box, Button, Grid, GridItem, Heading, Link, Text } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { useNotifications } from "../components/notifications/useNotifications";
import { Link as RouterLink } from "react-router-dom";

const Notifications = () => {
  const { notifications, markAsRead } = useNotifications();
  console.log(
    "notifications..",
    notifications.filter((n) => !n.viewed)
  );
  const unreadNotificatons = notifications?.filter((n) => !n.viewed);
  return (
    <Layout>
      <Heading>Notifications</Heading>
      <Grid templateColumns="4fr 1fr" gap={4}>
        <Box p={4}></Box>
        <Box>
          {
            unreadNotificatons.length > 0 ?
              <Button
                colorScheme="green"
                variant="outline"
                size="xs"
                onClick={() => {
                  unreadNotificatons.map((notification) => {
                    markAsRead(notification.id);
                  });
                }}
              >
                Mark all as read
              </Button> : null
          }
        </Box>
      </Grid>
      {unreadNotificatons.length === 0 ? (
        <>No notifications</>
      ) : (
        <Grid templateColumns="4fr 1fr">
          {unreadNotificatons.map((notification) => {
            return (
              <GridItem colSpan={2} key={notification.id} >
                <Link as={RouterLink} to={notification.link} onClick={() => markAsRead(notification.id)}>
								  {notification.message}
                </Link>
                <Button
									m={2}
                  colorScheme="green"
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    markAsRead(notification.id);
                  }}
                >
                  Mark as read
                </Button>
              </GridItem>
            );
          })}
        </Grid>
      )}
    </Layout>
  );
};

export default Notifications;
