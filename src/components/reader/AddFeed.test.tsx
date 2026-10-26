import { fireEvent, screen, waitFor } from '@testing-library/react'
import { addFeed, fetchSubscriptions, unsubscribe } from '../../api/reader'
import { Channel } from '../../model/domain.interface'
import { subscription } from '../../test/fixtures'
import { renderWithProviders } from '../../test/render'
import { notifySuccess } from '../ui/toaster'
import { AddFeed } from './AddFeed'

vi.mock('../../api/reader', () => ({ addFeed: vi.fn(), fetchSubscriptions: vi.fn(), unsubscribe: vi.fn() }))
vi.mock('../ui/toaster', () => ({ notifySuccess: vi.fn(), notifyError: vi.fn() }))

const feed = (status: Channel['status'], overrides: Partial<Channel> = {}): Channel => ({
  id: 'cha-sz',
  kind: 'feed',
  url: 'https://sz.de/muenchen',
  status,
  ...overrides,
})

const submit = (url: string) => {
  fireEvent.change(screen.getByLabelText('Feed or website address'), { target: { value: url } })
  fireEvent.click(screen.getByRole('button', { name: 'Add' }))
}

describe('AddFeed', () => {
  beforeEach(() => {
    vi.mocked(fetchSubscriptions).mockReset()
    vi.mocked(addFeed).mockReset()
  })

  it('shows a new feed as pending while it is read', async () => {
    vi.mocked(fetchSubscriptions).mockResolvedValueOnce([]).mockResolvedValue([subscription(feed('pending'))])
    vi.mocked(addFeed).mockResolvedValue(subscription(feed('pending')))
    renderWithProviders(<AddFeed />)

    submit('sz.de/muenchen')

    expect(await screen.findByText('Reading https://sz.de/muenchen…')).toBeInTheDocument()
    expect(addFeed).toHaveBeenCalledWith('sz.de/muenchen')
  })

  it('says so when a pending feed became a channel', async () => {
    vi.mocked(fetchSubscriptions)
      .mockResolvedValueOnce([subscription(feed('pending'))])
      .mockResolvedValue([subscription(feed('active', { name: 'SZ München' }))])
    const { queryClient } = renderWithProviders(<AddFeed />)
    await screen.findByText('Reading https://sz.de/muenchen…')

    await queryClient.invalidateQueries({ queryKey: ['subscriptions'] })

    await waitFor(() => expect(notifySuccess).toHaveBeenCalledWith('SZ München is now a channel'))
    expect(screen.queryByText(/Reading/)).not.toBeInTheDocument()
  })

  it('explains why a feed failed and lets the reader dismiss it', async () => {
    vi.mocked(fetchSubscriptions).mockResolvedValue([subscription(feed('failed', { error: 'no feed found at https://sz.de/muenchen' }))])
    vi.mocked(unsubscribe).mockResolvedValue()
    renderWithProviders(<AddFeed />)

    expect(await screen.findByText('no feed found at https://sz.de/muenchen')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))

    await waitFor(() => expect(unsubscribe).toHaveBeenCalledWith('cha-sz'))
  })

  it('says when reading takes unusually long', async () => {
    const createdAt = new Date(Date.now() - 5 * 60_000).toISOString()
    vi.mocked(fetchSubscriptions).mockResolvedValue([subscription(feed('pending'), { createdAt })])
    renderWithProviders(<AddFeed />)

    expect(await screen.findByText('Still reading https://sz.de/muenchen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('says why an address was refused', async () => {
    vi.mocked(fetchSubscriptions).mockResolvedValue([])
    vi.mocked(addFeed).mockRejectedValue(
      Object.assign(new Error('Request failed with status code 400'), {
        isAxiosError: true,
        response: { status: 400, data: { message: '"foo" is not a web address' } },
      })
    )
    renderWithProviders(<AddFeed />)

    submit('foo')

    expect(await screen.findByText('"foo" is not a web address')).toBeInTheDocument()
  })
})
