import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth/hooks/useAuth";

export const ProtectedRoute = ({ children }: any) => {
  const { token } = useAuth();
  if (!token) {
    // user is not authenticated
    return <Navigate to="/sign-in" />;
  }
  return children;
};