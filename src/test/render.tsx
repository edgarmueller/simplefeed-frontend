import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

/** Renders the element inside the providers every component expects. */
export function renderWithProviders(element: ReactElement) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter>{element}</MemoryRouter>
    </ChakraProvider>
  )
}
