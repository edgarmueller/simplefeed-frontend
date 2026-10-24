import { isAxiosError } from 'axios'

/**
 * A human-readable message for a failed request. The API answers validation
 * errors with `{ message: string | string[] }`.
 */
export function getErrorMessages(error: unknown): string[] {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) {
      return message.map(String)
    }
    if (typeof message === 'string') {
      return [message]
    }
  }
  if (error instanceof Error) {
    return [error.message]
  }
  return ['Something went wrong']
}
