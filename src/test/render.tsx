import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

/** Renders the element inside the providers every component expects. */
export function renderWithProviders(element: ReactElement, { route = '/' } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <MemoryRouter initialEntries={[route]}>{element}</MemoryRouter>
        </ChakraProvider>
      </QueryClientProvider>
    ),
  }
}
