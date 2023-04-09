export interface UserToken {
	username: string;
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
	profile: Profile
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