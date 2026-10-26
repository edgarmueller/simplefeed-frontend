import { fireEvent, screen, waitFor } from '@testing-library/react'
import { fetchMessages, sendMessage } from '../../api/reader'
import { Message } from '../../model/domain.interface'
import { preferences, subscription } from '../../test/fixtures'
import { renderWithProviders } from '../../test/render'
import { ChannelChat } from './ChannelChat'

vi.mock('../../api/reader', () => ({ fetchMessages: vi.fn(), sendMessage: vi.fn() }))

const message = (author: Message['author'], content: string): Message => ({
  id: `tun-${content}`,
  author,
  content,
  createdAt: new Date().toISOString(),
})

describe('ChannelChat', () => {
  it("shows the channel's settings and the conversation", async () => {
    vi.mocked(fetchMessages).mockResolvedValue([message('reader', 'mute crypto'), message('channel', 'Leaving out crypto from now on.')])

    renderWithProviders(<ChannelChat subscription={subscription(undefined, { preferences: { ...preferences, muted: ['crypto'] } })} />)

    expect(await screen.findByText('Leaving out crypto from now on.')).toBeInTheDocument()
    expect(screen.getByText('mute crypto')).toBeInTheDocument()
    // the settings next to the chat
    expect(screen.getByText((_, element) => element?.tagName === 'P' && element.textContent === 'Leaving out: crypto')).toBeInTheDocument()
  })

  it('sends a message and waits for the answer', async () => {
    vi.mocked(fetchMessages).mockResolvedValueOnce([]).mockResolvedValue([message('reader', 'more rust')])
    vi.mocked(sendMessage).mockResolvedValue(message('reader', 'more rust'))
    renderWithProviders(<ChannelChat subscription={subscription()} />)
    await screen.findByText(/Tell Hacker News what you want/)

    fireEvent.change(screen.getByPlaceholderText('Type a message'), { target: { value: 'more rust' } })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => expect(sendMessage).toHaveBeenCalledWith('sub-cha-hackernews', 'more rust'))
    expect(await screen.findByText('Hacker News is typing…')).toBeInTheDocument()
  })
})
