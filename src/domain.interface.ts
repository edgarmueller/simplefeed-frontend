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
}
export interface User {
	profile: Profile
}