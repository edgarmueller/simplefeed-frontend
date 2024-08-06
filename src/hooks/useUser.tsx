import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { me } from "../api/user";
import { User } from "../model/domain.interface";
import { useAuth } from "./useAuth";
import { useUserStore } from "../stores/useUserStore";

type UserContextProps = {
  user: User | null;
  hasError: boolean;
  error: string | undefined;
  refresh: () => Promise<void>;
};

export const UserContext = createContext<UserContextProps>({
  user: null,
  hasError: false,
  error: undefined,
  refresh: async () => { },
});

export const UserProvider = ({ children }: any) => {
  const { token } = useAuth()
  const { user, setUser, setFriends} = useUserStore()
  const [error, setError] = useState()
  useEffect(() => {
    if (token) {
      me()
        .then((me) => {
          if (!isEqual(user, me)) {
            setUser(me);
          }
          setFriends(user?.friends || [])
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
