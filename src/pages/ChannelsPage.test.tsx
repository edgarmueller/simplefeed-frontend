import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { fetchChannels } from '../api/channels'
import { getSentFriendRequests } from '../api/friends'
import { User } from '../model/domain.interface'
import { useUserStore } from '../stores/useUserStore'
import { renderWithProviders } from '../test/render'
import ChannelsPage from './ChannelsPage'

vi.mock('../api/channels', () => ({ fetchChannels: vi.fn() }))
vi.mock('../api/friends', () => ({ getSentFriendRequests: vi.fn(), makeFriendRequest: vi.fn() }))

const channel = (username: string, firstName: string, lastName: string) =>
  ({ id: `use-${username}`, username, firstName, lastName, isBot: true, bio: `${firstName} ${lastName} news` }) as User

describe('ChannelsPage', () => {
  it('shows each channel with what the user can do with it', async () => {
    vi.mocked(fetchChannels).mockResolvedValue([
      channel('hackernews', 'Hacker', 'News'),
      channel('munich', 'Munich', 'Events'),
      channel('lobsters', 'Lobste', 'rs'),
    ])
    vi.mocked(getSentFriendRequests).mockResolvedValue([
      { id: 'frq-1', from: { id: 'use-bart', username: 'bart', firstName: 'Bart', lastName: 'Simpson' }, to: channel('munich', 'Munich', 'Events') },
    ])
    useUserStore.getState().setFriends([channel('hackernews', 'Hacker', 'News')])

    renderWithProviders(
      <QueryClientProvider client={new QueryClient()}>
        <ChannelsPage />
      </QueryClientProvider>
    )

    expect(await screen.findByText('Hacker News news')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tune in chat' })).toHaveAttribute('href', '/users/hackernews/chat')
    expect(await screen.findByRole('button', { name: 'Subscription requested' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled()
    expect(screen.getAllByText('Channel')).toHaveLength(3)
  })
})
