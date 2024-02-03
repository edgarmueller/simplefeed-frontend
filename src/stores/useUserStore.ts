import { create } from 'zustand';
import { User } from '../domain.interface';

export interface UserState {
  user: User | null
  friends: User[]
  setUser: (user: User) => void
  setFriends(friends: User[]): void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  friends: [],
  setUser: (user: User) => set({ user }),
  setFriends: (friends: User[]) => set({ friends })
}))
