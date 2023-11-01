import useLocalStorage from "@rehooks/local-storage";
import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../domain.interface";
import jwtDecode from "jwt-decode";
import { refreshToken } from "../lib/axios";
import { getAccessToken, logout as logoutApi } from "../api/auth"

type AuthContextProps = {
	token: string | null,
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
    logoutApi();
    navigate("/sign-in", { replace: true });
  }, [navigate])

  useEffect(() => { 
    // implement timer
    setInterval(() => {
      const accessToken = getAccessToken();
      if (!accessToken) return;
      const decoded = jwtDecode(accessToken) as any;
      // console.log(decoded.exp * 1000 < Date.now())
      // console.log(decoded.exp, Date.now())
      // console.log(decoded.exp * 1000 - 30 * 1000 , Date.now())
      if (decoded.exp * 1000 - 60 * 1000 < Date.now()) {
        refreshToken();
      }
    }, 1000 * 60);
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