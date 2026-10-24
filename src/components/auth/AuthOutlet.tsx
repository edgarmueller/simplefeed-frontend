import { useOutlet } from "react-router";
import { AuthProvider } from "../../hooks/useAuth";
import { UserProvider } from "../../hooks/useUser";
import { ChatProvider } from "../../hooks/useChat";
import { NotificationProvider } from "../../hooks/useNotifications";

export const AuthOutlet = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>
      <UserProvider>
        <ChatProvider>
          <NotificationProvider>{outlet}</NotificationProvider>
        </ChatProvider>
      </UserProvider>
    </AuthProvider>
  );
};
