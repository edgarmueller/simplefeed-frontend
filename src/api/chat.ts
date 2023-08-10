import { Conversation } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import axios, { createHeaders } from "../lib/axios";

export const JOIN_CONVERSATION = "join_conversation";

export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await axios.get(`${API_URL}/chat`, {
    headers: {
      ...createHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
