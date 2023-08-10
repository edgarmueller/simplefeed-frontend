import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { saveAccessToken } from './auth/api/auth';
import { API_URL } from './auth/api/constants';

const REFRESH_URL = `${API_URL}/auth/refresh`;

export const createHeaders = () => {
  const token = localStorage.getItem("token")
  if (!token) {
    return
  }
  return {
    Authorization: `Bearer ${token}`,
  }
};

export async function refreshToken() {
	const refreshToken = localStorage.getItem('refreshToken')
	if (!refreshToken) {
		console.warn("Attempt to refresh without refresh token")
	}
	const resp = await axios.post(REFRESH_URL, { refreshToken })
	console.log('refresh response', resp.data)
	const accessToken = resp.data.accessToken
	saveAccessToken(accessToken)
	return accessToken
}

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest: any) => {
	const accessToken = await refreshToken()
	failedRequest.response.config.headers['Authorization'] = `Bearer ${accessToken}`
}

// Instantiate the interceptor
createAuthRefreshInterceptor(axios, refreshAuthLogic);

export default axios;