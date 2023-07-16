
export interface User {
	id: string
	email: string
	username: string
	firstName: string
	lastName: string
	friends: User[]
	imageUrl: string
	nrOfPosts: number
	nrOfLikes: number
	// TODO: split dtos?
	mutualFriendsCount?: number
	conversations: Conversation[]
}

export interface Conversation {
	id: string
	participantIds: string[]
	messages: Message[]
}

export interface Message {
	conversationId: string
	content: string
	authorId: string
	recipientId?: string
	createdAt?: string
	isRead?: boolean
}

export interface Notification {
	id: string
	viewed: boolean
}
export interface Post {
	id: string;
	body: string
	createdAt: string;
	postedTo: User
	author: User
	likes: any[]
}

export interface Pagination<T> {
	items: T[]
	meta: {
		totalPages: number
		currentPage: number
		itemCount: number
		totalItems: number
	}
}

export interface Comment {
	id: string;
	content: string;	
	createdAt: string;
	author: string;
	path: string;
}

export interface FriendRequest {
	id: string;
	from: string;
	to: {
		id: string
	};
}