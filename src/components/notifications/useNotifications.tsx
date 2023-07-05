import { createContext, useContext, useState } from "react";

type NotificationContextProps = {
  unreadCount: any;
  setUnreadCount(count: number): void;
};

const NotificationContext = createContext<NotificationContextProps>({
  unreadCount: 0,
  setUnreadCount: () => {},
});

export const NotificationProvider = ({ children }: any) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const value = {
    unreadCount,
    setUnreadCount,
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
