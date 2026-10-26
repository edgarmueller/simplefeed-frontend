import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { addFeed, fetchMyFeeds, withdrawFeed } from '../../api/feeds'
import { UserContext } from '../../hooks/useUser'
import { FeedRequest } from '../../model/domain.interface'
import { renderWithProviders } from '../../test/render'
import { AddFeed } from './AddFeed'

vi.mock('../../api/feeds', () => ({ addFeed: vi.fn(), fetchMyFeeds: vi.fn(), withdrawFeed: vi.fn() }))

const pending: FeedRequest = { id: 'fee-1', url: 'https://sz.de/muenchen', status: 'pending', createdAt: new Date().toISOString() }

function renderForm(refresh = vi.fn()) {
  renderWithProviders(
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={{ user: null, hasError: false, error: undefined, refresh }}>
        <AddFeed />
      </UserContext.Provider>
    </QueryClientProvider>
  )
  return refresh
}

const submit = (url: string) => {
  fireEvent.change(screen.getByLabelText('Feed or website address'), { target: { value: url } })
  fireEvent.click(screen.getByRole('button', { name: 'Add' }))
}

describe('AddFeed', () => {
  beforeEach(() => {
    vi.mocked(fetchMyFeeds).mockReset()
    vi.mocked(addFeed).mockReset()
  })

  it('shows a new feed as pending while it is read', async () => {
    vi.mocked(fetchMyFeeds).mockResolvedValueOnce([]).mockResolvedValue([pending])
    vi.mocked(addFeed).mockResolvedValue(pending)
    renderForm()

    submit('sz.de/muenchen')

    expect(await screen.findByText('Reading https://sz.de/muenchen…')).toBeInTheDocument()
    expect(addFeed).toHaveBeenCalledWith('sz.de/muenchen')
  })

  it('subscribes right away to a feed that is a channel already', async () => {
    vi.mocked(fetchMyFeeds).mockResolvedValue([])
    vi.mocked(addFeed).mockResolvedValue({ ...pending, status: 'active', title: 'SZ München' })
    const refresh = renderForm()

    submit('sz.de/muenchen')

    await waitFor(() => expect(refresh).toHaveBeenCalled())
  })

  it('reloads the subscriptions once a pending feed became a channel', async () => {
    vi.mocked(fetchMyFeeds).mockResolvedValueOnce([pending]).mockResolvedValue([])
    const client = new QueryClient()
    const refresh = vi.fn()
    renderWithProviders(
      <QueryClientProvider client={client}>
        <UserContext.Provider value={{ user: null, hasError: false, error: undefined, refresh }}>
          <AddFeed />
        </UserContext.Provider>
      </QueryClientProvider>
    )
    await screen.findByText('Reading https://sz.de/muenchen…')

    await client.invalidateQueries({ queryKey: ['my-feeds'] })

    await waitFor(() => expect(refresh).toHaveBeenCalled())
    expect(screen.queryByText(/Reading/)).not.toBeInTheDocument()
  })

  it('explains why a feed failed and lets the user dismiss it', async () => {
    vi.mocked(fetchMyFeeds).mockResolvedValue([
      { id: 'fee-2', url: 'https://example.com/', status: 'failed', error: 'no feed found at https://example.com/', createdAt: new Date().toISOString() },
    ])
    vi.mocked(withdrawFeed).mockResolvedValue()
    renderForm()

    expect(await screen.findByText('no feed found at https://example.com/')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))

    await waitFor(() => expect(withdrawFeed).toHaveBeenCalledWith('fee-2'))
  })

  it('says why an address was refused', async () => {
    vi.mocked(fetchMyFeeds).mockResolvedValue([])
    vi.mocked(addFeed).mockRejectedValue(
      Object.assign(new Error('Request failed with status code 400'), {
        isAxiosError: true,
        response: { status: 400, data: { message: '"foo" is not a web address' } },
      })
    )
    renderForm()

    submit('foo')

    expect(await screen.findByText('"foo" is not a web address')).toBeInTheDocument()
  })

  it('says so when reading a feed takes unusually long, and lets the user cancel', async () => {
    vi.mocked(fetchMyFeeds).mockResolvedValue([{ ...pending, createdAt: new Date(Date.now() - 5 * 60_000).toISOString() }])
    vi.mocked(withdrawFeed).mockResolvedValue()
    renderForm()

    expect(await screen.findByText('Still reading https://sz.de/muenchen')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => expect(withdrawFeed).toHaveBeenCalledWith('fee-1'))
  })
})
