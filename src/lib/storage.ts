import { useSyncExternalStore } from 'react'

// localStorage only notifies other tabs, so writes from this tab are
// broadcast to subscribers here as well
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

export function writeStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  notify()
}

export function deleteFromStorage(key: string) {
  localStorage.removeItem(key)
  notify()
}

/** The current value stored under `key`, re-rendering when it changes. */
export function useStoredValue(key: string): string | null {
  return useSyncExternalStore(subscribe, () => localStorage.getItem(key))
}
