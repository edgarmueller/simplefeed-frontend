import { API_URL } from "../lib/auth/api/constants";
import axios, { createHeaders } from "../lib/axios";

export const removeFriend = async (friendId: string) => {
  await axios.delete(`${API_URL}/friends/${friendId}`, {
    headers: {
      ...createHeaders(),
    },
  });
};