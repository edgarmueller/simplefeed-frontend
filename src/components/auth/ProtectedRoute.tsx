import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export const ProtectedRoute = ({ children }: any) => {
  const { token } = useAuth();
  if (!token) {
    // user is not authenticated
    return <Navigate to="/sign-in" />;
  }
  return children;
};