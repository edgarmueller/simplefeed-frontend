export interface UserToken {
	username: string;
	userId: string;
}

export interface Profile {
	username: string;
	firstName: string;
	lastName: string;
	bio?: string;
	imageUrl?: string;
	nrOfLikes: number
	nrOfPosts: number
}
export interface User {
	id: string
	username: string
	friends: User[]
}

export interface Post {
	id: string;
	body: string
	createdAt: string;
	postedTo: {
		profile: Pick<Profile, 'firstName' | 'lastName' | 'username'>,
	},
	author: {
		profile: Pick<Profile, 'firstName' | 'lastName' | 'imageUrl' | 'username'>,
	}
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
	to: string;
}