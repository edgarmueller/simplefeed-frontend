import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import { Post as PostEntity } from '../../model/domain.interface'
import { renderWithProviders } from '../../test/render'
import { Post } from './Post'

const channelPost: PostEntity = {
  id: 'pos-1',
  body: [
    '**[Rust 2.0 is out](https://blog.rust-lang.org/2)**',
    '',
    'The next edition is here.',
    '',
    '▲ 812 points · [431 comments](https://news.ycombinator.com/item?id=1) · blog.rust-lang.org',
  ].join('\n'),
  createdAt: new Date().toISOString(),
  author: { id: 'use-hn', username: 'hackernews', firstName: 'Hacker', lastName: 'News', isBot: true } as PostEntity['author'],
  postedTo: { id: 'use-hn', username: 'hackernews', firstName: 'Hacker', lastName: 'News' } as PostEntity['postedTo'],
  likes: [],
}

describe('Post', () => {
  it('shows a channel post with links to the story and its discussion', () => {
    renderWithProviders(
      <QueryClientProvider client={new QueryClient()}>
        <Post post={channelPost} />
      </QueryClientProvider>
    )

    expect(screen.getByRole('link', { name: 'Rust 2.0 is out' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: '431 comments' })).toHaveAttribute('href', 'https://news.ycombinator.com/item?id=1')
    expect(screen.getByText('The next edition is here.')).toBeInTheDocument()
    expect(screen.getByText('Channel')).toBeInTheDocument()
    expect(screen.queryByText(/^Comments/)).not.toBeInTheDocument()
  })
})
