import axios, { createHeaders } from "../lib/axios";
import { User } from "../model/domain.interface";
import { API_URL } from "./constants";

/** The automated accounts users can subscribe to. */
export async function fetchChannels(): Promise<User[]> {
  const res = await axios.get(`${API_URL}/channels`, {
    headers: createHeaders(),
  });
  return res.data;
}
