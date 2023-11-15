import { Box, Button, Grid, GridItem, Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Layout } from "../components/common/Layout";
import { useNotifications } from "../hooks/useNotifications";

const NotificationsPage = () => {
  const { notifications, markAsRead } = useNotifications();
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

export default NotificationsPage;
