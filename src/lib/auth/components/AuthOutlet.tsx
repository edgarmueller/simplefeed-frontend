import { useOutlet } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import { UserProvider } from "../hooks/useUser";
import { ChatProvider } from "../../../components/chat/useChat";

export const AuthOutlet = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>
      <UserProvider>
        <ChatProvider>{outlet}</ChatProvider>
      </UserProvider>
    </AuthProvider>
  );
};
