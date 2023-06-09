import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "../../../domain.interface";
import { useAuth } from "./useAuth";
import { me } from "../api/auth"

type UserContextProps = {
	user: User | null,
  incrementPostCount: () => void
  decrementPostCount: () => void
}

const UserContext = createContext<UserContextProps>({
  user: null,
  incrementPostCount: () => {},
  decrementPostCount: () => {}
});

export const UserProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (token) {
      me().then((me) => setUser(me))
    }
  }, [token]);
  const value = useMemo(
    () => ({
      user,
      incrementPostCount: () => {
        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              nrOfPosts: prevUser.nrOfPosts + 1,
            };
          }
          return prevUser;
        });
      },
      decrementPostCount: () => {
        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              nrOfPosts: prevUser.nrOfPosts - 1,
            };
          }
          return prevUser;
        });
      }
    }),
    [user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};