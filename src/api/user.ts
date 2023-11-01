import { User } from "../domain.interface";
import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

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
  const resp = await axios.patch(`${API_URL}/users/${id}`, data, {
    headers: {
      ...createHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return resp.data;
};

export async function me(): Promise<User> {
  const res = await axios.get(`${API_URL}/users/me`, {
    headers: createHeaders(),
  });
  return res.data;
}

export async function closeAccount(): Promise<void> {
  await axios.delete(`${API_URL}/users/me`, {
    headers: createHeaders(),
  });
}