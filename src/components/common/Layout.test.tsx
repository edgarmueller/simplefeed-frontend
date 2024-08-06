// components/counter/counter.test.tsx
import { render, screen } from '@testing-library/react'

import { Layout } from './Layout'
import { BrowserRouter } from 'react-router-dom'
import { useChatStore } from '../../stores/useChatStore'
import { Conversation, Message, User } from '../../model/domain.interface'
import { useUserStore } from '../../stores/useUserStore'

describe('Layout', () => {
  test('should render with initial state of 1', async () => {
    useUserStore.getState().setUser({ id: 'user_123' } as User)
    useChatStore.getState().setConversations([{ id: 'conv_123', messages: [], userIds: ['user_123', 'user_234'] } as Conversation])
    useChatStore.getState().addNewMessages('conv_123', [{ content: 'hello' } as Message])
    renderLayout()

    expect(
      await screen.findByRole('button', { name: /chat 1/i }),
    ).toBeInTheDocument()
  })
})

const renderLayout = () => {
  return render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}