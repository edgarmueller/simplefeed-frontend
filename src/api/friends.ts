import axios from "axios";
import { API_URL } from "../lib/auth/api/constants";
import { createHeaders } from "../lib/fetch";

export const removeFriend = async (friendId: string) => {
  await axios.delete(`${API_URL}/friends/${friendId}`, {
    headers: {
      ...createHeaders(),
    },
  });
};