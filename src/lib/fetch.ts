import { configureRefreshFetch, fetchJSON as fetchJson } from 'refresh-fetch';
import { logout, saveAccessToken } from './auth/api/auth';
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
  const res = await fetchRawJSON(url, opts);
  return res.body as any;
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

// copy of refresh-fetch with slight modification --

// the lib hard-codes the content-type header to application/json
// if options contains a body, hence not allowing us to send form data
type ResponseBody = Object | null | string

const fetchRawJSON = (url: string | Request | URL, options: Object = {}) => {
  // The Content-Type header describes the type of the body so should be
  // omitted when there isn't one.
  return fetch(url, options)
    .then((response: Response) => {
      return getResponseBody(response).then(body => ({
        response,
        body
      }))
    })
    .then(checkStatus)
}

const getResponseBody = (response: Response): Promise<ResponseBody> => {
  const contentType = response.headers.get('content-type')
  return contentType && contentType.indexOf('json') >= 0
    ? response.clone().text().then(tryParseJSON)
    : response.clone().text()
}

const tryParseJSON = (json: string): Object | null => {
  if (!json) {
    return null
  }

  try {
    return JSON.parse(json)
  } catch (e) {
    throw new Error(`Failed to parse unexpected JSON response: ${json}`)
  }
}

class ResponseError {
name: string;
  constructor(status: number, response: Response, body: ResponseBody) {
    this.name = 'ResponseError'
  }
}

const checkStatus = ({ response, body }: any) => {
  if (response.ok) {
    return { response, body }
  } else {
    throw new ResponseError(response.status, response, body)
  }
}

// copy end -- 