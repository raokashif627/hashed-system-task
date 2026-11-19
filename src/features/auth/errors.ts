import { isAxiosError } from 'axios'

export class IncorrectPasswordError extends Error {
  constructor() {
    super('Incorrect password')
    this.name = 'IncorrectPasswordError'
  }
}

export function isServiceFailure(err: unknown): boolean {
  return isAxiosError(err) && (!err.response || err.response.status >= 500)
}

export function loginErrorMessage(err: unknown): string {
  if (err instanceof IncorrectPasswordError) return 'Incorrect password.'
  if (isAxiosError(err)) {
    if (!err.response) return 'Network error. Check your connection and try again.'
    const { status, data } = err.response
    const message = typeof data?.error === 'string' ? data.error.toLowerCase() : ''
    if (status === 400 && message.includes('user not found')) return 'No account found with this email.'
    if (status === 400 && message.includes('password')) return 'Please enter your password.'
    if (status === 401) return 'Invalid API key — check NEXT_PUBLIC_REQRES_API_KEY.'
  }
  return 'Something went wrong. Please try again.'
}
