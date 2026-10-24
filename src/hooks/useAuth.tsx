import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "../lib/axios";
import { getAccessToken, logout as logoutApi } from "../api/auth"
import { useStoredValue } from "../lib/storage";

type AuthContextProps = {
	token: string | null,
	login: () => void,
	logout: () => void
}

const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: any) => {
  const token = useStoredValue("token");
  const navigate = useNavigate();
  const login = useCallback(() => {
    navigate("/feed");
  }, [navigate])

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    logoutApi();
    navigate("/sign-in", { replace: true });
  }, [navigate])

  // refresh the access token shortly before it expires
  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = getAccessToken();
      if (!accessToken) return;
      const { exp } = jwtDecode<{ exp: number }>(accessToken);
      if (exp * 1000 - 60 * 1000 < Date.now()) {
        refreshToken();
      }
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);
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