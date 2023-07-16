import { Box, Button, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { useNotifications } from "../components/notifications/useNotifications";

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
          </Button>
        </Box>
      </Grid>
      {unreadNotificatons.length === 0 ? (
        <>No notifications</>
      ) : (
        <Grid templateColumns="4fr 1fr">
          {unreadNotificatons.map((notification) => {
            return (
              <GridItem colSpan={2} key={notification.id} >
								{notification.message} from {notification.recipientId}
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
