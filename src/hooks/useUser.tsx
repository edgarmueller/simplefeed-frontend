import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { me } from "../api/user";
import { User } from "../model/domain.interface";
import { useUserStore } from "../stores/useUserStore";
import { useAuth } from "./useAuth";

type UserContextProps = {
  user: User | null;
  hasError: boolean;
  error: string | undefined;
  refresh: () => Promise<QueryObserverResult<User, Error>>;
};

export const UserContext = createContext<UserContextProps>({
  user: null,
  hasError: false,
  error: undefined,
  refresh: async () => {
    throw new Error("default value");
  },
});

export const UserProvider = ({ children }: any) => {
  const { token } = useAuth();
  const { user, setUser, setFriends } = useUserStore();
  const [error, setError] = useState<string>();
  const { refetch, data, error: err } = useQuery({
    enabled: false,
    queryFn: () => me(),
    queryKey: ["me"],
  });
  useEffect(() => {
    if (data) {
      setUser(data)
      setFriends(data?.friends || []);
    }
    if (err) {
      setError(err.message)
    } else {
      setError(undefined)
    }
  }, [data, error, err, setFriends, setUser])
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [refetch, token]);
  const value = useMemo(
    () => ({
      user,
      refresh: refetch,
      hasError: error !== undefined,
      error,
    }),
    [error, refetch, user]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
