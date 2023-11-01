import { useOutlet } from "react-router-dom";
import { AuthProvider } from "../../hooks/useAuth";
import { UserProvider } from "../../hooks/useUser";
import { FriendsProvider } from "../../hooks/useFriends";
import { ChatProvider } from "../../hooks/useChat";
import { NotificationProvider } from "../../hooks/useNotifications";

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
