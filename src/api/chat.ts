import { Conversation } from "../model/domain.interface";
import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await axios.get(`${API_URL}/chat`, {
    headers: {
      ...createHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
