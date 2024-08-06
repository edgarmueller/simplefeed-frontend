import { create } from 'zustand';
import { Conversation, Message } from '../model/domain.interface';
import { sortBy, uniqBy } from 'lodash';

export interface ChatState {
  conversations: Conversation[]
  messagesByConversation: { [conversationId: string]: Message[] }
  clearConversations: () => void
  setConversations: (conversations: Conversation[]) => void
  markMessagesAsRead: (conversationId: string, userId: string | undefined) => void
  addNewMessages: (conversationId: string, messages: Message[]) => void
}

export type GroupedMessages = { [conversationId: string]: Message[] }

// TODO: replace uniqBy and sortBy 
const mergeAndSortMessages = (messages: Message[], moreMessages: Message[]) =>
  uniqBy(sortBy([...messages, ...moreMessages], 'createdAt').reverse(), 'id')

const groupMessagesByConversation = (conversations: Conversation[], groupedMessages: GroupedMessages = {}): { [conversationId: string]: Message[] } => {
  const messagesByConversation = conversations.reduce((acc, conv) => {
    acc[conv.id] = mergeAndSortMessages(groupedMessages[conv.id] || [], conv.messages)
    return acc;
  }, {} as Record<string, Message[]>);
  return messagesByConversation
};

const countUnreadMessagesByConversation = (
  userId: string,
  messagesByConversation: { [conversationId: string]: Message[] }
): Record<string, number> => {
  const unreadMessagesCountByConversation = Object.entries(
    messagesByConversation
  ).reduce((acc, [convId, messages]) => {
    acc[convId] =
      messages
        ?.filter((msg) => msg.authorId !== userId)
        .filter((msg) => !msg.isRead).length || 0;
    return acc;
  }, {} as Record<string, number>);

  return unreadMessagesCountByConversation
};

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  messagesByConversation: {},
  clearConversations: () => set({ conversations: [] }),
  setConversations: (conversations: Conversation[]) => set(chatState => {
    const newState = {
      ...chatState,
      conversations,
      messagesByConversation: groupMessagesByConversation(conversations, chatState.messagesByConversation),
    }
    return newState
  }),
  addNewMessages: (conversationId: string, newMessages: Message[]) => set(chatState => {
    const messagesByConversation = { ...chatState.messagesByConversation };
    const messages = messagesByConversation[conversationId];
    if (!messages) return chatState;
    return {
      ...chatState,
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: mergeAndSortMessages(messages, newMessages)
      },
    };
  }),
  markMessagesAsRead: (conversationId: string, readerUserId: string | undefined) => set(chatState => {
    const messagesByConversation = { ...chatState.messagesByConversation };
    const messages = messagesByConversation[conversationId];
    if (!messages || !readerUserId) return chatState;
    return {
      ...chatState,
      messagesByConversation: {
        ...messagesByConversation,
        [conversationId]: messages.map((msg: Message) => {
          if (msg.authorId === readerUserId) return msg;
          msg.isRead = true;
          return msg;
        })
      },
    };
  })
}))


export const getUnreadMessagesByConversation = (s: ChatState) => (userId: string | undefined) => {
  if (!userId) {
    return {}
  }
  const count = countUnreadMessagesByConversation(userId, s.messagesByConversation)
  return count
}

export const getUnreadCount = (s: ChatState) => (userId: string | undefined) => {
  const unreadMessagesByConversation = getUnreadMessagesByConversation(s)(userId)
  return Object.values(unreadMessagesByConversation).reduce((acc, cnt) => acc + cnt, 0)
}