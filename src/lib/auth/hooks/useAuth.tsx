import useLocalStorage, { writeStorage } from "@rehooks/local-storage";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, UserToken } from "../../../domain.interface";

type AuthContextProps = {
	user: UserToken | null,
	login: (user: User) => void,
	logout: () => void
}

export const useLocalStorage2 = (keyName: string, defaultValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue: any) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: any) => {
  const [user] = useLocalStorage("user", null);
  const navigate = useNavigate();
  // TODO types
  const login = useCallback(async (user: any) => {
    writeStorage("user", user);
    navigate("/home");
  }, [navigate])

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    writeStorage("user", null);
    navigate("/sign-in", { replace: true });
  }, [navigate])

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};