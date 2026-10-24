
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
}

export interface Conversation {
	id: string
	userIds: string[]
	// TODO: can we hide this? or rename to mostRecentMessages?
	messages: Message[]
}

export interface Message {
	id?: string
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
	type: string
	resourceId: string
	link: string
	message: string
}
export interface Post {
	id: string;
	body: string
	createdAt: string;
	postedTo: User
	author: User
	/** only the current user's like, if any */
	likes: Like[]
	attachments?: Attachment[]
}

export interface Like {
	id: string
	userId: string
	unliked?: boolean
}

export type Attachment = { type: 'video' | 'image', url: string }

/** A user as embedded in other resources */
export interface UserSummary {
	id: string
	username: string
	firstName: string
	lastName: string
	imageUrl?: string
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
	from: UserSummary;
	to: UserSummary;
}