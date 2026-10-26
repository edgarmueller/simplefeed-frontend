import { fireEvent, screen, waitFor } from '@testing-library/react'
import { markEntry } from '../../api/reader'
import { entry } from '../../test/fixtures'
import { renderWithProviders } from '../../test/render'
import { EntryCard } from './EntryCard'

vi.mock('../../api/reader', () => ({ markEntry: vi.fn() }))

describe('EntryCard', () => {
  beforeEach(() => vi.mocked(markEntry).mockReset().mockResolvedValue({} as never))

  it('links the story and its discussion, with the summary', () => {
    const story = entry('Rust 2.0 is out', { summary: 'The next edition is here.' })
    story.item = { ...story.item, score: 812, comments: 431, discussionUrl: 'https://news.ycombinator.com/item?id=1', domain: 'blog.rust-lang.org' }

    renderWithProviders(<EntryCard entry={story} />)

    expect(screen.getByRole('link', { name: 'Rust 2.0 is out' })).toHaveAttribute('target', '_blank')
    expect(screen.getByText('The next edition is here.')).toBeInTheDocument()
    expect(screen.getByText(/▲ 812 points · blog.rust-lang.org/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '431 comments' })).toHaveAttribute('href', 'https://news.ycombinator.com/item?id=1')
    expect(screen.getByRole('link', { name: 'Hacker News' })).toHaveAttribute('href', '/channels/cha-hackernews')
  })

  it("shows the feed's own excerpt, shortened, when there is no summary", () => {
    const story = entry('Neue U-Bahn-Linie')
    story.item = { ...story.item, excerpt: `Die Stadt hat den Bau beschlossen. ${'Mehr dazu. '.repeat(40)}` }

    renderWithProviders(<EntryCard entry={story} />)

    const text = screen.getByText(/^Die Stadt hat den Bau beschlossen/)
    expect(text.textContent!.length).toBeLessThanOrEqual(240)
    expect(text.textContent!.endsWith('…')).toBe(true)
  })

  it('marks the story read when opened, and likes and saves it', async () => {
    renderWithProviders(<EntryCard entry={entry('Rust 2.0 is out')} />)

    fireEvent.click(screen.getByRole('link', { name: 'Rust 2.0 is out' }))
    fireEvent.click(screen.getByRole('button', { name: 'Like' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(markEntry).toHaveBeenCalledTimes(3))
    expect(markEntry).toHaveBeenCalledWith('ent-Rust 2.0 is out', { read: true })
    expect(markEntry).toHaveBeenCalledWith('ent-Rust 2.0 is out', { liked: true })
    expect(markEntry).toHaveBeenCalledWith('ent-Rust 2.0 is out', { saved: true })
    expect(screen.getByRole('button', { name: 'Unlike' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mark unread' })).toBeInTheDocument()
  })
})
