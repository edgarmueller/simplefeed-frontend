import { User } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders } from "../lib/fetch";

const fetchUser = fetch<User>();

export async function fetchUserProfile(username: string): Promise<any> {
  const res = await fetchUser(`${API_URL}/users/${username}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.body;
}

export async function followProfile(username: string) {
  const res = await fetchUser(`${API_URL}/profiles/${username}/follow`, {
    headers: {
      ...createHeaders(),
    },
    method: "POST",
  });
  return res.body;
}

export async function unfollowProfile(username: string) {
  const res = await fetchUser(`${API_URL}/profiles/${username}/follow`, {
    headers: {
      ...createHeaders(),
    },
    method: "DELETE",
  });
  return res.body;
}
