import axios, { createHeaders } from "../lib/axios";
import { Channel, Entry, Message, Pagination, Subscription } from "../model/domain.interface";
import { API_URL } from "./constants";

const config = () => ({ headers: createHeaders() });

/** The channels anyone can subscribe to, with whether the reader does. */
export async function fetchChannels(): Promise<Channel[]> {
  return (await axios.get(`${API_URL}/channels`, config())).data;
}

/**
 * Adds a feed by its URL or a website's and subscribes to it. A known feed
 * comes back active; a new one is pending until it has been read.
 */
export async function addFeed(url: string): Promise<Subscription> {
  return (await axios.post(`${API_URL}/channels`, { url }, config())).data;
}

export async function subscribe(channelId: string): Promise<Subscription> {
  return (await axios.put(`${API_URL}/channels/${channelId}/subscription`, {}, config())).data;
}

export async function unsubscribe(channelId: string): Promise<void> {
  await axios.delete(`${API_URL}/channels/${channelId}/subscription`, config());
}

/** The reader's subscriptions with unread counts, including feeds being read or that failed. */
export async function fetchSubscriptions(): Promise<Subscription[]> {
  return (await axios.get(`${API_URL}/subscriptions`, config())).data;
}

export type FeedView = "unread" | "all" | "saved";

export async function fetchFeed(view: FeedView, channelId?: string, page = 1, limit = 20): Promise<Pagination<Entry>> {
  const params = { show: view, page, limit, ...(channelId ? { channel: channelId } : {}) };
  return (await axios.get(`${API_URL}/feed`, { ...config(), params })).data;
}

export async function markEntry(entryId: string, state: { read?: boolean; liked?: boolean; saved?: boolean }): Promise<Entry> {
  return (await axios.patch(`${API_URL}/feed/${entryId}`, state, config())).data;
}

/** Marks the whole feed read, or one channel's part of it. */
export async function markAllRead(channelId?: string): Promise<number> {
  return (await axios.post(`${API_URL}/feed/read`, channelId ? { channelId } : {}, config())).data.marked;
}

export async function fetchMessages(subscriptionId: string): Promise<Message[]> {
  return (await axios.get(`${API_URL}/subscriptions/${subscriptionId}/messages`, config())).data;
}

export async function sendMessage(subscriptionId: string, content: string): Promise<Message> {
  return (await axios.post(`${API_URL}/subscriptions/${subscriptionId}/messages`, { content }, config())).data;
}
