import axios, { createHeaders } from "../lib/axios";
import { API_URL } from "./constants";

export interface UserSearchResult {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	imageUrl: string;
	isBot?: boolean;
}

export const searchUsers = async (term: string): Promise<UserSearchResult[]> => {
		const response = await axios.get(`${API_URL}/search?users=${encodeURIComponent(term)}`, {
				headers: {
						...createHeaders(),
						'Content-Type': 'application/json'
				},
		});

		return response.data;
}

