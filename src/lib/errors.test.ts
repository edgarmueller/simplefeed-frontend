import { AxiosError, AxiosHeaders } from 'axios'
import { getErrorMessages } from './errors'

const axiosError = (data: unknown) =>
  new AxiosError('Request failed with status code 400', '400', undefined, undefined, {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() },
  })

describe('getErrorMessages', () => {
  it('uses the validation messages returned by the API', () => {
    expect(getErrorMessages(axiosError({ message: ['email must be an email'] }))).toEqual([
      'email must be an email',
    ])
  })

  it('accepts a single message', () => {
    expect(getErrorMessages(axiosError({ message: 'User already exists' }))).toEqual([
      'User already exists',
    ])
  })

  it('falls back to the error message', () => {
    expect(getErrorMessages(new Error('Network Error'))).toEqual(['Network Error'])
  })
})
