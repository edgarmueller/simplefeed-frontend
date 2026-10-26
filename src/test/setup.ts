import '@testing-library/jest-dom/vitest'

// resets all zustand stores between tests, see __mocks__/zustand.ts
vi.mock('zustand')

// jsdom has no IntersectionObserver, which infinite scrolling uses
class NoIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver ??= NoIntersectionObserver as unknown as typeof IntersectionObserver
