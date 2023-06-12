import { User } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders, rawRefreshAwareFetch } from "../lib/fetch";

export const updateUserInfo = async (
  id: string,
  userInfo: Pick<User, "email" | "firstName" | "lastName"> & {
    password?: string;
    image?: any;
  }
): Promise<User> => {
  const data = new FormData();
  if (userInfo.email) {
    data.append("email", userInfo.email);
  }
  if (userInfo.firstName) {
    data.append("firstName", userInfo.firstName);
  }
  if (userInfo.lastName) {
    data.append("lastName", userInfo.lastName);
  }
  if (userInfo.password) {
    data.append("password", userInfo.password);
  }
  if (userInfo.image) {
    data.append("image", userInfo.image);
  }
  const text = await rawRefreshAwareFetch()(`${API_URL}/users/${id}`, {
    method: "PATCH",
    body: data,
    headers: createHeaders(),
  });
  return JSON.parse(text);
};

export async function me(): Promise<User> {
  const res = await fetch<User>()(`${API_URL}/users/me`, {
    headers: createHeaders(),
  });
  return res.body;
}
