import { useOutlet } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import { UserProvider } from "../hooks/useUser";
import { FriendsProvider } from "../hooks/useFriends";
import { ChatProvider } from "../../../components/chat/useChat";
import { NotificationProvider } from "../../../components/notifications/useNotifications";

export const AuthOutlet = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>
      <UserProvider>
        <FriendsProvider>
          <ChatProvider>
            <NotificationProvider>{outlet}</NotificationProvider>
          </ChatProvider>
        </FriendsProvider>
      </UserProvider>
    </AuthProvider>
  );
};
