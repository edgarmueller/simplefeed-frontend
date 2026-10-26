import { fireEvent, screen, waitFor } from '@testing-library/react'
import { fetchFeed, fetchSubscriptions } from '../../api/reader'
import { Entry, Pagination } from '../../model/domain.interface'
import { entry, subscription } from '../../test/fixtures'
import { renderWithProviders } from '../../test/render'
import { FeedList } from './FeedList'

vi.mock('../../api/reader', () => ({ fetchFeed: vi.fn(), fetchSubscriptions: vi.fn(), markEntry: vi.fn() }))

const page = (items: Entry[]): Pagination<Entry> => ({
  items,
  meta: { totalPages: 1, currentPage: 1, itemCount: items.length, totalItems: items.length },
})
const NOW = Date.parse('2026-10-26T12:00:00Z')
const at = (minutesAgo: number) => new Date(NOW - minutesAgo * 60_000).toISOString()

describe('FeedList', () => {
  beforeEach(() => {
    vi.mocked(fetchFeed).mockReset()
    vi.mocked(fetchSubscriptions).mockReset()
  })

  it('offers stories that arrived after the list loaded', async () => {
    vi.mocked(fetchSubscriptions).mockResolvedValue([subscription(undefined, { lastPickedAt: at(10) })])
    vi.mocked(fetchFeed)
      .mockResolvedValueOnce(page([entry('Older story', { pickedAt: at(10) })]))
      .mockResolvedValue(page([entry('Brand new story', { pickedAt: at(0) }), entry('Older story', { pickedAt: at(10) })]))
    const { queryClient } = renderWithProviders(<FeedList view="unread" />)
    await screen.findByText('Older story')

    vi.mocked(fetchSubscriptions).mockResolvedValue([subscription(undefined, { lastPickedAt: at(0) })])
    await queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    fireEvent.click(await screen.findByRole('button', { name: 'Show new stories' }))

    expect(await screen.findByText('Brand new story')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Show new stories' })).not.toBeInTheDocument())
  })

  it('just loads them into an empty list', async () => {
    vi.mocked(fetchSubscriptions).mockResolvedValue([subscription()])
    vi.mocked(fetchFeed).mockResolvedValueOnce(page([])).mockResolvedValue(page([entry('First story', { pickedAt: at(0) })]))
    const { queryClient } = renderWithProviders(<FeedList view="unread" />)
    await screen.findByText(/all caught up/)

    vi.mocked(fetchSubscriptions).mockResolvedValue([subscription(undefined, { lastPickedAt: at(0) })])
    await queryClient.invalidateQueries({ queryKey: ['subscriptions'] })

    expect(await screen.findByText('First story')).toBeInTheDocument()
  })
})
