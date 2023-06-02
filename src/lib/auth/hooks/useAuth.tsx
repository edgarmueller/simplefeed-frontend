import useLocalStorage from "@rehooks/local-storage";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserToken } from "../../../domain.interface";
import { logout as apiLogout } from "../api/auth";

type AuthContextProps = {
	token: UserToken | null,
	login: (user: User) => void,
	logout: () => void
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: any) => {
  const [token] = useLocalStorage("token", null);
  const navigate = useNavigate();
  // TODO types
  const login = useCallback(async (token: any) => {
    navigate("/feed");
  }, [navigate])

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    apiLogout();
    navigate("/sign-in", { replace: true });
  }, [navigate])

  const value = useMemo(
    () => ({
      token,
      login,
      logout
    }),
    [token, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};