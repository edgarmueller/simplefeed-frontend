import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { fetchChannels, subscribe } from '../api/channels'
import { UserContext } from '../hooks/useUser'
import { User } from '../model/domain.interface'
import { useUserStore } from '../stores/useUserStore'
import { renderWithProviders } from '../test/render'
import ChannelsPage from './ChannelsPage'

vi.mock('../api/channels', () => ({ fetchChannels: vi.fn(), subscribe: vi.fn(), unsubscribe: vi.fn() }))

const channel = (username: string, firstName: string, lastName: string) =>
  ({ id: `use-${username}`, username, firstName, lastName, isBot: true, bio: `${firstName} ${lastName} news` }) as User

const hackerNews = channel('hackernews', 'Hacker', 'News')
const munich = channel('munich', 'Munich', 'Events')

function renderPage(refresh = vi.fn()) {
  renderWithProviders(
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={{ user: null, hasError: false, error: undefined, refresh }}>
        <ChannelsPage />
      </UserContext.Provider>
    </QueryClientProvider>
  )
}

describe('ChannelsPage', () => {
  beforeEach(() => {
    vi.mocked(fetchChannels).mockResolvedValue([hackerNews, munich])
    useUserStore.getState().setSubscriptions([hackerNews])
  })

  it('shows each channel with what the user can do with it', async () => {
    renderPage()

    expect(await screen.findByText('Hacker News news')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tune in chat' })).toHaveAttribute('href', '/users/hackernews/chat')
    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled()
    expect(screen.getAllByText('Channel')).toHaveLength(2)
  })

  it('subscribes right away', async () => {
    vi.mocked(subscribe).mockResolvedValue({ ...munich, subscribed: true })
    // the refreshed profile lists the new subscription
    const refresh = vi.fn(async () => useUserStore.getState().setSubscriptions([hackerNews, munich]))
    renderPage(refresh as never)

    fireEvent.click(await screen.findByRole('button', { name: 'Subscribe' }))

    await waitFor(() => expect(subscribe).toHaveBeenCalledWith('munich'))
    await waitFor(() => expect(refresh).toHaveBeenCalled())
    expect(await screen.findAllByRole('link', { name: 'Tune in chat' })).toHaveLength(2)
    expect(screen.queryByRole('button', { name: 'Subscribe' })).not.toBeInTheDocument()
  })
})
