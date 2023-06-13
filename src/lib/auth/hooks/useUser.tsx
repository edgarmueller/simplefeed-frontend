import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { me } from "../../../api/user";
import { User } from "../../../domain.interface";
import { useAuth } from "./useAuth";

type UserContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  hasError: boolean;
  error: string | undefined;
  incrementPostCount: () => void;
  decrementPostCount: () => void;
};

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  hasError: false,
  error: undefined,
  incrementPostCount: () => {},
  decrementPostCount: () => {},
});

export const UserProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState();
  useEffect(() => {
    if (token) {
      me()
        .then((me) => {
          setUser(me);
          setError(undefined);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [token]);
  const value = useMemo(
    () => ({
      user,
      setUser,
      hasError: error !== undefined,
      error,
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
      },
    }),
    [user, error]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
