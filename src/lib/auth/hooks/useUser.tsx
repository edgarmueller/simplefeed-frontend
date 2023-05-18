import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "../../../domain.interface";
import { useAuth } from "./useAuth";
import { me } from "../api/auth"

type UserContextProps = {
	user: User | null,
}

const UserContext = createContext<UserContextProps>({
  user: null,
});

export const UserProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (token) {
      me().then((me) => setUser(me))
    }
  }, [token]);
  const value = useMemo(
    () => ({
      user,
    }),
    [user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};