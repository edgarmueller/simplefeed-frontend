import { API_URL } from "../lib/auth/api/constants";
import { createHeaders } from "../lib/fetch";

export const fetchConversations = async () => {
		const response = await fetch(`${API_URL}/chat`, {
				headers: {
						...createHeaders(),
						'Content-Type': 'application/json'
				},
		});

		const conv = await response.json();
		console.log(conv)
		return conv;
}

