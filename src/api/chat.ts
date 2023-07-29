import { Conversation } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders } from "../lib/fetch";

export const JOIN_CONVERSATION = "join_conversation";

export const fetchConversations = async (): Promise<Conversation[]> => {
  const response = await fetch<Conversation[]>()(`${API_URL}/chat`, {
    headers: {
      ...createHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.body;
};
