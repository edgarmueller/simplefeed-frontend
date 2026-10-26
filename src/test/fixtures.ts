import { Channel, Entry, Preferences, Subscription } from '../model/domain.interface'

export const preferences: Preferences = { interests: [], muted: [], minScore: 100, maxPostsPerDay: 10, notes: '' }

export const hackerNews: Channel = { id: 'cha-hackernews', kind: 'hackernews', name: 'Hacker News', status: 'active' }

export const subscription = (channel: Channel = hackerNews, overrides: Partial<Subscription> = {}): Subscription => ({
  id: `sub-${channel.id}`,
  channel,
  preferences,
  unread: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const entry = (title: string, overrides: Partial<Entry> = {}): Entry => ({
  id: `ent-${title}`,
  item: {
    id: `itm-${title}`,
    title,
    url: `https://example.com/${encodeURIComponent(title)}`,
    domain: 'example.com',
    publishedAt: new Date().toISOString(),
  },
  channel: { id: hackerNews.id, kind: 'hackernews', name: 'Hacker News' },
  pickedAt: new Date().toISOString(),
  ...overrides,
})
