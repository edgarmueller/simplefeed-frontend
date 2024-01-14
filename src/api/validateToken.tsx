import decodeToken from "jwt-decode";
import { getAccessToken } from "./auth";
import { refreshToken } from "../lib/axios";

export const validateToken = async () => {
	const existingToken = getAccessToken();
	if (!existingToken) {
		return;
	}
	const decodedToken = decodeToken<{ exp: number }>(existingToken);

	if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
		// Token has expired
		// You can trigger the token refresh process here
		await refreshToken();
		console.log("token refreshed");
	}
	return getAccessToken();
}