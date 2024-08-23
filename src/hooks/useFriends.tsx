import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { getFriendRequests, getSentFriendRequests } from "../api/friends";
import { FriendRequest } from "../model/domain.interface";
import { useAuth } from "./useAuth";

type FriendsContextProps = {
  receivedFriendRequests: FriendRequest[]
  sentFriendRequests: FriendRequest[]
  isLoadingReceivedFriendRequests: boolean
  isLoadingSentFriendRequests: boolean
  receivedFriendRequestsFetchError: Error  | null
  sentFriendRequestsFetchError: Error | null
  fetchReceivedFriendRequests(): Promise<
    QueryObserverResult<FriendRequest[], Error>
  >;
  fetchSentFriendRequests(): Promise<
    QueryObserverResult<FriendRequest[], Error>
  >;
};

const FriendsContext = createContext<FriendsContextProps>({
  receivedFriendRequests: [],
  sentFriendRequests: [],
  isLoadingReceivedFriendRequests: false,
  isLoadingSentFriendRequests: false,
  receivedFriendRequestsFetchError: null,
  sentFriendRequestsFetchError: null,
  fetchReceivedFriendRequests: async () => {
    throw new Error("default value");
  },
  fetchSentFriendRequests: async () => {
    throw new Error("default value");
  },
});

function useFriendRequests() {
  return useQuery({
    queryKey: ["friend-requests"],
    queryFn: () => {
      return getFriendRequests();
    },
  });
}

function useSentFriendRequests() {
  return useQuery({
    queryKey: ["sent-friend-requests"],
    queryFn: () => {
      return getSentFriendRequests();
    },
  });
}

export const FriendsProvider = ({ children }: any) => {
  const { token } = useAuth();
  const {
    data: receivedFriendRequests,
    refetch: fetchReceivedFriendRequests,
    isLoading: isLoadingReceivedFriendRequests,
    error: receivedFriendRequestsFetchError
  } = useFriendRequests();
  const {
    data: sentFriendRequests,
    refetch: fetchSentFriendRequests,
    isLoading: isLoadingSentFriendRequests,
    error: sentFriendRequestsFetchError
  } = useSentFriendRequests();

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchReceivedFriendRequests();
    fetchSentFriendRequests();
  }, [token]);

  const value = {
    receivedFriendRequests: receivedFriendRequests || [],
    sentFriendRequests: sentFriendRequests || [],
    receivedFriendRequestsFetchError,
    sentFriendRequestsFetchError,
    isLoadingReceivedFriendRequests,
    isLoadingSentFriendRequests,
    fetchReceivedFriendRequests,
    fetchSentFriendRequests,
  };

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
};

export const useFriends = () => {
  return useContext(FriendsContext);
};
