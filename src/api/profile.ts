import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

export async function fetchUserProfile(username: string): Promise<any> {
  const res = await axios.get(`${API_URL}/users/${username}`, {
    headers: {
      "Content-Type": "application/json",
      ...createHeaders(),
    },
  });
  return res.data;
}
