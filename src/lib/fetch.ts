import { configureRefreshFetch, fetchJSON as fetchJson } from 'refresh-fetch'
import { logout, saveAccessToken } from './auth/api/auth'
import { API_URL } from './auth/api/constants';


const REFRESH_URL = `${API_URL}/auth/refresh`;
  
const shouldRefreshToken = (response: any) => {
  if (!response.ok) {
    return response.status === 401 && response.body.message === 'Token expired'
  }
  return false
}

export const rawRefreshAwareFetch = <T>() => configureRefreshFetch({
  // Pass fetch function you want to wrap, it should already be adding
  // token to the request
  fetch: wrappedRawFetch<T>(),
  // shouldRefreshToken is called when API fetch fails and it should decide
  // whether the response error means we need to refresh token
  shouldRefreshToken,
  // refreshToken should call the refresh token API, save the refreshed
  // token and return promise -- resolving it when everything goes fine,
  // rejecting it when refreshing fails for some reason
  refreshToken,
})

const refreshAwareFetch = <T>() => configureRefreshFetch({
  // Pass fetch function you want to wrap, it should already be adding
  // token to the request
  fetch: wrappedFetch<T>(),
  // shouldRefreshToken is called when API fetch fails and it should decide
  // whether the response error means we need to refresh token
  shouldRefreshToken,
  // refreshToken should call the refresh token API, save the refreshed
  // token and return promise -- resolving it when everything goes fine,
  // rejecting it when refreshing fails for some reason
  refreshToken,
})

export async function refreshToken() {
  console.log('refreshing token...')
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    console.warn("Attempt to refresh without refresh token")
    return
  }
  try {
    const resp = await fetchJson<{ accessToken: string }>(REFRESH_URL, {
      method: "POST",
      body: JSON.stringify({
        refreshToken,
      }),
    });
    saveAccessToken(resp.body.accessToken);
  } catch (error) {
    console.warn("error during refresh", error);
    logout();
  }
}

const wrappedFetch = <T>() => async (url: string, options: RequestInit) => {
  const headers = createHeaders();
  const opts = {
    ...options,
    headers: {
      ...options?.headers,
      ...headers,
    },
  };
  return fetchJson<T>(url, opts);
}

const wrappedRawFetch = <T>() => async (url: string, options: RequestInit) => {
  const headers = createHeaders();
  const opts = {
    ...options,
    headers: {
      ...options?.headers,
      ...headers,
    },
  };
  const res = await fetch(url, opts);
  return res.clone().text();
}

export const createHeaders = () => {
  const token = localStorage.getItem("token")
  if (!token) {
    return
  }
  return {
    Authorization: `Bearer ${token}`,
  }
};

export default refreshAwareFetch
