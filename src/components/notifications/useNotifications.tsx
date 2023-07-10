import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "../../lib/auth/hooks/useAuth";

type NotificationContextProps = {
  notifications: any[];
};

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
});

export const NotificationProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!token) {
      return;
    }
    // TODO
    const socket = io("http://localhost:5001", {
      autoConnect: false,
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSocket(socket);
    return () => {
      socket.close();
    };
  }, [token]);

  useEffect(() => {
    if (socket?.connected) {
      console.log('requesting_all_notifications')
      console.log('notification socket init')
    }
  }, [socket?.connected, token]);

  useEffect(() => {
    function onConnect() {
      socket?.emit("request_all_notifications");
    }

    function onAllNotifications(notifications: any) {
      console.log('notifications received', notifications)
      setNotifications(notifications);
    }

    function onNotification(msg: Notification) {
    }

    if (socket?.active) {
      return;
    }
    socket?.connect();

    socket?.on("connect", onConnect);
    socket?.on("send_all_notifications", onAllNotifications);
    socket?.on("receive_notification", onNotification);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("send_all_notifications", onAllNotifications);
      socket?.off("receive_notification", onNotification);
    };
  }, [socket]);

  const value = useMemo(
    () => ({
      notifications,
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
