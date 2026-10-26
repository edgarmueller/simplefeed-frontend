import { useOutlet } from "react-router";
import { AuthProvider } from "../../hooks/useAuth";
import { UserProvider } from "../../hooks/useUser";

export const AuthOutlet = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>
      <UserProvider>{outlet}</UserProvider>
    </AuthProvider>
  );
};
