import { Conversation, User } from "../domain.interface";
import { API_URL } from "../lib/auth/api/constants";
import fetch, { createHeaders } from "../lib/fetch";

export interface UserSearchResult {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	imageUrl: string;
}

export const searchUsers = async (term: string): Promise<UserSearchResult[]> => {
		const response = await fetch<User[]>()(`${API_URL}/search?users=${term}`, {
				headers: {
						...createHeaders(),
						'Content-Type': 'application/json'
				},
		});

		return response.body;
}

