import { createContext, useContext, useEffect, useState } from "react";
import { getFriendRequests, getSentFriendRequests } from "../api/friends";
import { FriendRequest } from "../model/domain.interface";
import { useAuth } from "./useAuth";

type FriendsContextProps = {
  receivedFriendRequests: FriendRequest[]
  sentFriendRequests: FriendRequest[]
  fetchReceivedFriendRequests(): Promise<void>
  fetchSentFriendRequests(): Promise<void>
};

const FriendsContext = createContext<FriendsContextProps>({
  receivedFriendRequests: [],
  sentFriendRequests: [],
  fetchReceivedFriendRequests: async () => {},
  fetchSentFriendRequests: async () => {}
});

export const FriendsProvider = ({ children }: any) => {
  const { token } = useAuth();
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<FriendRequest[]>([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>([]);
  const fetchReceivedFriendRequests = async () => {
    getFriendRequests().then((friendRequests) => {
      setReceivedFriendRequests(friendRequests);
    });
  }
  const fetchSentFriendRequests = async () => {
    getSentFriendRequests().then((friendRequests) => {
      setSentFriendRequests(friendRequests);
    });
  }

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchReceivedFriendRequests();
    fetchSentFriendRequests();
  }, [token]);

  const value = {
    receivedFriendRequests,
    sentFriendRequests,
    fetchReceivedFriendRequests,
    fetchSentFriendRequests
  };

  return (
    <FriendsContext.Provider value={value}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  return useContext(FriendsContext);
};
