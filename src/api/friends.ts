import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

export const removeFriend = async (friendId: string) => {
  await axios.delete(`${API_URL}/friends/${friendId}`, {
    headers: {
      ...createHeaders(),
    },
  });
};