import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { logout, saveAccessToken } from '../api/auth';
import { API_URL } from '../api/constants';

const REFRESH_URL = `${API_URL}/auth/refresh`;

export const createHeaders = (token = localStorage.getItem('token')) => {
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
	try {
		console.log("refreshing token")
		const resp = await axios.post(REFRESH_URL, { refreshToken }, { skipAuthRefresh: true } as any)
		const accessToken = resp.data.accessToken
		saveAccessToken(accessToken)
		return accessToken
	} catch (err) {
		console.log('refresh error', err)
		logout();
	}
}

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest: any) => {
	try {
		const accessToken = await refreshToken()
		failedRequest.response.config.headers['Authorization'] = `Bearer ${accessToken}`
	} catch (error) {
		console.log('refreshAuthLogic error', error)
	}
}

// Instantiate the interceptor
createAuthRefreshInterceptor(axios, refreshAuthLogic);

export default axios;