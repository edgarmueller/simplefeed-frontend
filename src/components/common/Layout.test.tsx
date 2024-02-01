// components/counter/counter.test.tsx
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Layout } from './Layout'
import { BrowserRouter } from 'react-router-dom'
import { useChatStore } from '../../stores/useChatStore'
import { Conversation, Message } from '../../domain.interface'
import { UserContext, UserProvider } from '../../hooks/useUser'

describe('Layout', () => {
  test('should render with initial state of 1', async () => {
    useChatStore.getState().setConversations([{ id: 'conv_123', messages: [] } as Conversation])
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
      <UserContext.Provider value={{ user: { id: 'user_123' } }}>
        <Layout />
      </UserContext.Provider>
    </BrowserRouter>
  )
}