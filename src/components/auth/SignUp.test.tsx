import { fireEvent, render, screen } from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { MemoryRouter } from 'react-router'
import { register } from '../../api/auth'
import { SignUp } from './SignUp'

vi.mock('../../api/auth', () => ({ register: vi.fn() }))

const fill = (id: string, value: string) =>
  fireEvent.change(document.getElementById(id)!, { target: { value } })

function submitForm() {
  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  )
  fill('input-email', 'bart@example.com')
  fill('input-username', 'bart')
  fill('input-password', 'secret')
  fill('input-confirm-password', 'secret')
  fireEvent.click(screen.getByRole('button', { name: 'Sign up' }))
}

describe('SignUp', () => {
  it('confirms a successful sign-up', async () => {
    vi.mocked(register).mockResolvedValue({})

    submitForm()

    expect(await screen.findByText(/sign up successful/i)).toBeInTheDocument()
  })

  it('shows the error instead of a success message when sign-up fails', async () => {
    vi.mocked(register).mockRejectedValue(
      new AxiosError('Request failed', '409', undefined, undefined, {
        data: { message: 'User with email bart@example.com already exists' },
        status: 409,
        statusText: 'Conflict',
        headers: {},
        config: { headers: new AxiosHeaders() },
      })
    )

    submitForm()

    expect(await screen.findByText(/already exists/)).toBeInTheDocument()
    expect(screen.queryByText(/sign up successful/i)).not.toBeInTheDocument()
  })
})
