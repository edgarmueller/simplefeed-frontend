import { createContext, useContext, useEffect, useState } from "react";
import { getFriendRequests, getSentFriendRequests } from "../../../api/friend-requests";
import { FriendRequest, User } from "../../../domain.interface";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";

type FriendsContextProps = {
  friends: any[];
  receivedFriendRequests: FriendRequest[]
  sentFriendRequests: FriendRequest[]
  fetchReceivedFriendRequests(): Promise<void>
  fetchSentFriendRequests(): Promise<void>
};

const FriendsContext = createContext<FriendsContextProps>({
  friends: [],
  receivedFriendRequests: [],
  sentFriendRequests: [],
  fetchReceivedFriendRequests: async () => {},
  fetchSentFriendRequests: async () => {}
});

export const FriendsProvider = ({ children }: any) => {
  const { token } = useAuth();
  const { user } = useUser();
  // const { refresh } = useUser();
  const [friends, setFriends] = useState<User[]>(user?.friends || []);
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
    friends,
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
