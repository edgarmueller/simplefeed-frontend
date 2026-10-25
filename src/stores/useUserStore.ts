import { create } from 'zustand';
import { User } from '../model/domain.interface';

export interface UserState {
  user: User | null
  /** the channels the user subscribes to */
  subscriptions: User[]
  setUser: (user: User) => void
  setSubscriptions(subscriptions: User[]): void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  subscriptions: [],
  setUser: (user: User) => set({ user }),
  setSubscriptions: (subscriptions: User[]) => set({ subscriptions })
}))
