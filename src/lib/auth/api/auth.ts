import axios from "axios";
import { API_URL } from "./constants";
import { writeStorage, deleteFromStorage } from "@rehooks/local-storage";

export function getAccessToken() {
  return localStorage.getItem("token");
}

export function saveAccessToken(token: string) {
  writeStorage("token", token);
}

export function saveRefreshToken(refreshToken: string) {
  writeStorage("refreshToken", refreshToken);
}

export function clearRefreshToken() {
  deleteFromStorage("refreshToken");
}

export function clearAccessToken() {
  deleteFromStorage("token");
}

export async function register(
  email: string,
  password: string,
  userProfile: {
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  }
) {
  const headers = { "Content-Type": "application/json" };

  const raw = {
    user: {
      email,
      password,
      username: userProfile.username,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      imageUrl: userProfile.imageUrl,
    },
  };

  try {
    const response = await axios.post(`${API_URL}/auth/register`, raw, { headers });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function login(email: string, password: string): Promise<any> {
  const headers = { "Content-Type": "application/json" }

  const raw = {
    user: {
      email,
      password,
    },
  };

  const response = await axios.post(`${API_URL}/auth/login`, raw, { headers });
  const { accessToken, refreshToken } = await response.data
  saveAccessToken(accessToken);
  saveRefreshToken(refreshToken);
  return {
    accessToken,
    refreshToken,
  };
}

export function logout() {
  deleteFromStorage("user");
  deleteFromStorage("token");
  deleteFromStorage("refreshToken");
}

//export const updatePassword = async (userId: string, password: string) => {
//  const res = await fetch(
//    `${API_URL}/auth/update-password`,
//    {
//      body: JSON.stringify({ password }),
//      method: "PATCH",
//      headers: createHeaders(),
//    }
//  );
//  return res.body;
//};
//