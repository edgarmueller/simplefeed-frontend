import { Button } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { useNotifications } from "../components/notifications/useNotifications";

const Notifications = () => {
	const { notifications, markAsRead } = useNotifications();
	console.log('notifications..', notifications.filter(n => !n.viewed))
	return (
		<Layout>
			<h1>Notifications</h1>
			{
				notifications?.filter(n => !n.viewed).map((notification) => {
					return (<>
						<div key={notification.id}>{notification.message} from {notification.recipientId}</div>
						<Button onClick={() => {
							markAsRead(notification.id)
						}}
						>mark as read</Button>
					</>)
				})
			}
		</Layout>
	);
}

export default Notifications;