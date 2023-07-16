import axios from "axios";
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

export const getSentFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await fetchManyFriendRequest(`${API_URL}/friend-requests/sent`, {
    headers: {
      ...createHeaders(),
    },
  });
  console.log('sent friend requests' ,res.body);
  return res.body;
};

export const cancelFriendRequest = async (friendRequestId: string): Promise<void> => {
  const res = await axios.delete(`${API_URL}/friend-requests/${friendRequestId}`, {
    headers: {
      ...createHeaders(),
    },
  });
  return res.data;
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

export const declineFriendRequest = async (friendRequestId: string): Promise<FriendRequest> => {
  const res = await axios.delete(`${API_URL}/friend-requests/${friendRequestId}`, {
    headers: {
      ...createHeaders(),
    },
  });
  return res.data;
};
