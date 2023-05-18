import { FriendRequest, User } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders } from "../lib/fetch";

const fetchOneFriendRequest = fetch<FriendRequest>();
const fetchManyFriendRequest = fetch<FriendRequest[]>();
const fetchManyUsers = fetch<User[]>();

export const makeFriendRequest = async (username: string) => {
  await fetchOneFriendRequest(`${API_URL}/friend-requests/${username}`, {
    headers: {
      ...createHeaders(),
    },
    method: "POST",
  });
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await fetchManyFriendRequest(`${API_URL}/friend-requests/pending`, {
    headers: {
      ...createHeaders(),
    },
  });
  return res.body;
};

export const acceptFriendRequest = async (friendRequestId: string): Promise<FriendRequest> => {
  const res = await fetchOneFriendRequest(`${API_URL}/friend-requests/${friendRequestId}`, {
    headers: {
      ...createHeaders(),
    },
    method: "PATCH",
  });
  return res.body;
};

export const fetchFriendsOfUser = async (username: string): Promise<User[]> => {
  const res = await fetchManyUsers(`${API_URL}/users/${username}/friends`, {
    headers: {
      ...createHeaders(),
    },
  });
  return res.body;
};