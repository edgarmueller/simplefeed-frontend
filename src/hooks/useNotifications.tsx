import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./useAuth";
import { Notification } from "../domain.interface";
import { useChat } from "./useChat";
import { useUser } from "./useUser";
import { useFriends } from "./useFriends";
import { SOCKET_URL } from "../api/constants";
import { validateToken } from "../api/validateToken";
import { NotificationState, useNotificationsStore } from "../stores/useNotificationsStore";

type NotificationContextProps = {
  markAsRead: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextProps>({
  markAsRead: (id: string) => { },
});

export const NotificationProvider = ({ children }: any) => {
  const { token } = useAuth();
  const { refresh } = useUser();
  const { fetchReceivedFriendRequests, fetchSentFriendRequests } = useFriends();
  const { joinConversation, fetchConversations } = useChat()
  const [socket, setSocket] = useState<Socket>();
  const setNotifications = useNotificationsStore((state: NotificationState) => state.setNotifications)
  const markNotificationAsRead = useNotificationsStore((state: NotificationState) => state.markNotificationAsRead)
  const addNotification = useNotificationsStore((state: NotificationState) => state.addNewNotification)
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

    function onAllNotifications(notifications: Notification[]) {
      setNotifications(notifications);
    }

    async function onNotification(msg: Notification) {
      if (msg.type === "friend-request-accepted") {
        refresh()
        await fetchReceivedFriendRequests()
        await fetchSentFriendRequests()
        fetchConversations().then(convos => {
          for (const convo of convos) {
            joinConversation(convo.id)
          }
        });
      }
      addNotification(msg)
    }

    function onNotificationRead(n: Notification) {
      markNotificationAsRead(n)
    }

    if (isConnecting || socket?.connected) {
      return;
    }

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

  const markAsRead = useCallback(async (notificationId: string) => {
    console.log('marking notifcation as read', notificationId)
    const token = await validateToken()
    socket?.emit("mark_notification_as_read", { notificationId, auth: token });
  }, [socket?.id]);

  const value = { markAsRead}

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
