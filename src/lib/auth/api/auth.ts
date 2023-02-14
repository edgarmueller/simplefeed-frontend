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
  userProfile: { username: string, firstName: string; lastName: string; imageUrl: string }
) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    user: {
      email,
      password,
			username: userProfile.username,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      imageUrl: userProfile.imageUrl,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    // redirect: 'follow'
  };

  const response = await fetch(`${API_URL}/auth/register`, requestOptions);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
}

export async function login(email: string, password: string) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    user: {
      email,
      password,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    // redirect: 'follow'
  };

  const response = await fetch(`${API_URL}/auth/login`, requestOptions);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const { user } = await response.json();
  saveAccessToken(user.token);
  saveRefreshToken(user.refreshToken);
  return user;
}

export function logout() {
  deleteFromStorage("user");
  deleteFromStorage("token");
  deleteFromStorage("refreshToken");
}
