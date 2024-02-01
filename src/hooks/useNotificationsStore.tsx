import { create } from 'zustand';
import { Notification } from '../domain.interface';

export interface NotificationState {
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  markNotificationAsRead: (notification: Notification) => void
  addNewNotification: (notification: Notification) => void
}

export const useNotificationsStore = create<NotificationState>((set) => ({
  notifications: [],
  setNotifications: (notifications: Notification[]) => set(s => {
    const newState = {
      ...s,
      notifications,
    }
    return newState
  }),
  markNotificationAsRead: (notification: Notification) => set((state: NotificationState) => {
    const notifications = state.notifications.map(n => {
      if (n.id !== notification.id) {
        return n
      }
      return {
        ...n,
        viewed: true,
      }
    })
    const newState = {
      ...state,
      notifications,
    }
    return newState
  }),
  addNewNotification: (notification: Notification) => set((state: NotificationState) => {
    const notifications = [...state.notifications, notification]
    const newState = {
      ...state,
      notifications,
    }
    return newState
  })
}))