import { Conversation } from "../domain.interface";
import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

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
