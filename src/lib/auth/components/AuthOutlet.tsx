import { useOutlet } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";

export const AuthOutlet = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>{outlet}</AuthProvider>
  );
};