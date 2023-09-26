import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "../../lib/auth/hooks/useAuth";
import { Notification } from "../../domain.interface";
import { useChat } from "../chat/useChat";
import { useUser } from "../../lib/auth/hooks/useUser";
import { SOCKET_URL } from "../../lib/auth/api/constants";

type NotificationContextProps = {
  notifications: any[];
  markAsRead: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  markAsRead: (id: string) => {},
});

export const NotificationProvider = ({ children }: any) => {
  const { token } = useAuth();
  const { refresh } = useUser();
  const { joinConversation, fetchConversations } = useChat()
  const [socket, setSocket] = useState<Socket>();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!token || isConnecting) {
      return;
    }
    setIsConnecting(true)
    const socket = io(`${SOCKET_URL}/notifications`, {
      autoConnect: false,
      query: {
        Authorization: `Bearer ${token}`,
      },
      transports: ["websocket"],

    });
    setSocket(socket);

    function onAllNotifications(notifications: any) {
      setNotifications(notifications);
    }

    function onNotification(msg: Notification) {
      console.log('received notification', msg)
      if (msg.type === "friend-request-accepted") {
        refresh()
        fetchConversations().then(() => {
          joinConversation(msg.resourceId)
        });
      }
      setNotifications((prev) => [...prev, msg]);
    }

    function onNotificationRead(msg: Notification) {
      setNotifications((prev) => prev.filter((n) => n.id !== msg.id));
    }

    if (isConnecting || socket?.connected) {
      console.log('connected socket', socket?.connected)
      return;
    }

    console.log('connecting socket', socket?.connected, isConnecting)

    socket?.on("send_all_notifications", onAllNotifications);
    // TODO: in use?
    socket?.on("receive_notification", onNotification);
    socket?.on("notification_read", onNotificationRead);

    socket?.connect();
    setIsConnecting(false)

    return () => {
      socket?.off("send_all_notifications", onAllNotifications);
      socket?.off("receive_notification", onNotification);
      socket?.off("notification_read", onNotificationRead);
      socket.close()
    };
  }, [token]);

  const markAsRead = (notificationId: string) => {
    console.log('marking notifcation as read', notificationId)
    socket?.emit("mark_notification_as_read", { notificationId });
  };

  const value = useMemo(
    () => ({
      notifications,
      markAsRead
    }),
    [notifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
