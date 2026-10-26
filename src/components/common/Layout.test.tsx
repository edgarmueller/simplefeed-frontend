import { screen } from '@testing-library/react'
import { fetchSubscriptions } from '../../api/reader'
import { hackerNews, subscription } from '../../test/fixtures'
import { renderWithProviders } from '../../test/render'
import { Layout } from './Layout'

vi.mock('../../api/reader', () => ({ fetchSubscriptions: vi.fn() }))

describe('Layout', () => {
  it("lists the reader's channels with their unread counts", async () => {
    vi.mocked(fetchSubscriptions).mockResolvedValue([
      subscription(hackerNews, { unread: 3 }),
      subscription({ id: 'cha-sz', kind: 'feed', name: 'SZ München', status: 'active' }, { unread: 2 }),
      subscription({ id: 'cha-new', kind: 'feed', url: 'https://new.example.com/', status: 'pending' }),
    ])

    renderWithProviders(<Layout />)

    expect(await screen.findByRole('link', { name: 'Hacker News 3' })).toHaveAttribute('href', '/channels/cha-hackernews')
    expect(screen.getByRole('link', { name: 'SZ München 2' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /https:\/\/new.example.com/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Feed 5' })).toHaveAttribute('href', '/feed')
  })
})
