import axios, { createHeaders } from "../lib/axios";
import { User } from "../model/domain.interface";
import { API_URL } from "./constants";

/** The channels users can subscribe to, with whether the current user does. */
export async function fetchChannels(): Promise<User[]> {
  const res = await axios.get(`${API_URL}/channels`, {
    headers: createHeaders(),
  });
  return res.data;
}

/** Subscribes the current user, effective immediately. */
export async function subscribe(channelUsername: string): Promise<User> {
  const res = await axios.put(`${API_URL}/channels/${channelUsername}/subscription`, {}, {
    headers: createHeaders(),
  });
  return res.data;
}

export async function unsubscribe(channelUsername: string): Promise<void> {
  await axios.delete(`${API_URL}/channels/${channelUsername}/subscription`, {
    headers: createHeaders(),
  });
}
