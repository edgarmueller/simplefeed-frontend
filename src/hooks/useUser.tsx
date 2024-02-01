import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { me } from "../api/user";
import { User } from "../domain.interface";
import { useAuth } from "./useAuth";

type UserContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  hasError: boolean;
  error: string | undefined;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: (updatedUser: User) => { },
  hasError: false,
  error: undefined,
  refresh: async () => { },
});

export const UserProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState();
  useEffect(() => {
    if (token) {
      me()
        .then((me) => {
          if (!isEqual(user, me)) {
            setUser(me);
          }
          if (error !== undefined) {
            setError(undefined);
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [token, user, error]);
  const refresh = useCallback(() => me()
    .then((me) => {
      setUser(me);
      setError(undefined);
    })
    .catch((error) => {
      setError(error.message);
    }), []);
  const value = useMemo(
    () => ({
      user,
      setUser,
      refresh,
      hasError: error !== undefined,
      error,
    }),
    [user?.id, error, refresh]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
