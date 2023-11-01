import { FriendRequest } from "../domain.interface";
import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

export const makeFriendRequest = async (username: string) => {
  await axios.post(`${API_URL}/friend-requests/${username}`, {}, {
    headers: createHeaders()
  });
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await axios.get(`${API_URL}/friend-requests/pending`, {
    headers: createHeaders(), 
  });
  return res.data;
};

export const getSentFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await axios.get(`${API_URL}/friend-requests/sent`, {
    headers: createHeaders(),
  });
  return res.data;
};

export const acceptFriendRequest = async (friendRequestId: string): Promise<FriendRequest> => {
  const res = await axios.patch(`${API_URL}/friend-requests/${friendRequestId}`, {}, {
    headers: createHeaders(),
  });
  return res.data;
};

export const declineFriendRequest = async (friendRequestId: string): Promise<FriendRequest> => {
  const res = await axios.delete(`${API_URL}/friend-requests/${friendRequestId}`, {
    headers: createHeaders(),
  });
  return res.data;
};

// synonym
export const cancelFriendRequest = declineFriendRequest;
