import { API_URL } from "../lib/auth/api/constants";
import axios, { createHeaders } from "../lib/axios";

export async function fetchUserProfile(username: string): Promise<any> {
  const res = await axios.get(`${API_URL}/users/${username}`, {
    headers: {
      "Content-Type": "application/json",
      ...createHeaders(),
    },
  });
  return res.data;
}

export async function followProfile(username: string) {
  const res = await axios.post(`${API_URL}/profiles/${username}/follow`, {
    headers: createHeaders(),
  });
  return res.data;
}

export async function unfollowProfile(username: string) {
  const res = await axios.delete(`${API_URL}/profiles/${username}/follow`, {
    headers: createHeaders(),
  });
  return res.data;
}
