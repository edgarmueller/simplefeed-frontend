import { screen } from '@testing-library/react'
import { Conversation, Message, User } from '../../model/domain.interface'
import { useChatStore } from '../../stores/useChatStore'
import { useUserStore } from '../../stores/useUserStore'
import { renderWithProviders } from '../../test/render'
import { Layout } from './Layout'

describe('Layout', () => {
  it('shows the number of unread chat messages', async () => {
    useUserStore.getState().setUser({ id: 'user_123' } as User)
    useChatStore.getState().setConversations([{ id: 'conv_123', messages: [], userIds: ['user_123', 'user_234'] } as Conversation])
    useChatStore.getState().addNewMessages('conv_123', [{ content: 'hello' } as Message])

    renderWithProviders(<Layout />)

    expect(await screen.findByRole('link', { name: /chat 1/i })).toBeInTheDocument()
  })
})
