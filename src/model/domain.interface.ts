/** The reader's account. */
export interface User {
	id: string
	email: string
	username: string
	firstName: string
	lastName: string
	imageUrl?: string
}

export type ChannelKind = 'hackernews' | 'feed'
/** a feed is pending until it has been read, and failed if it couldn't be */
export type ChannelStatus = 'pending' | 'active' | 'failed'

/** A source of stories: Hacker News, or a feed someone added. */
export interface Channel {
	id: string
	kind: ChannelKind
	/** unknown until a feed has been read */
	name?: string
	description?: string
	/** for feeds: the address as added */
	url?: string
	feedUrl?: string
	siteUrl?: string
	status: ChannelStatus
	/** why a feed couldn't be read */
	error?: string
	subscribed?: boolean
}

/** What a reader wants from one channel, tuned in its chat. */
export interface Preferences {
	interests: string[]
	muted: string[]
	minScore: number
	maxPostsPerDay: number
	notes: string
}

export interface Subscription {
	id: string
	channel: Channel
	preferences: Preferences
	unread: number
	/** when the channel last picked something for the reader */
	lastPickedAt?: string
	createdAt: string
}

/** A story from a channel. */
export interface Item {
	id: string
	title: string
	url: string
	domain: string
	excerpt?: string
	score?: number
	comments?: number
	discussionUrl?: string
	/** the publication, e.g. "SZ München" */
	sourceName?: string
	publishedAt: string
}

/** An item a channel picked for the reader, and what they did with it. */
export interface Entry {
	id: string
	item: Item
	channel: Pick<Channel, 'id' | 'kind' | 'name'>
	/** the curator's one-sentence summary, if it wrote one */
	summary?: string
	pickedAt: string
	readAt?: string
	likedAt?: string
	savedAt?: string
}

/** A message in the reader's chat with a channel. */
export interface Message {
	id: string
	author: 'reader' | 'channel'
	content: string
	createdAt: string
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
