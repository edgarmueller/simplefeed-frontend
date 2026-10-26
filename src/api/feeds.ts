import axios, { createHeaders } from "../lib/axios";
import { FeedRequest } from "../model/domain.interface";
import { API_URL } from "./constants";

/**
 * Adds a feed by its URL or a website's. A feed that is a channel already
 * comes back "active" and subscribed; a new one is "pending" until it has
 * been read.
 */
export async function addFeed(url: string): Promise<FeedRequest> {
  const res = await axios.post(`${API_URL}/feeds`, { url }, { headers: createHeaders() });
  return res.data;
}

/** The feeds the user added that aren't channels yet. */
export async function fetchMyFeeds(): Promise<FeedRequest[]> {
  const res = await axios.get(`${API_URL}/feeds`, { headers: createHeaders() });
  return res.data;
}

export async function withdrawFeed(feedId: string): Promise<void> {
  await axios.delete(`${API_URL}/feeds/${feedId}`, { headers: createHeaders() });
}
