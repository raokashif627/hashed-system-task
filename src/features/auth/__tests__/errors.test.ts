import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { loginErrorMessage } from '../errors'

const httpError = (status: number, data: unknown) =>
  new AxiosError('fail', 'ERR', undefined, undefined, {
    status,
    statusText: '',
    data,
    headers: {},
    config: { headers: new AxiosHeaders() },
  })

describe('loginErrorMessage', () => {
  it('maps user not found', () => {
    expect(loginErrorMessage(httpError(400, { error: 'user not found' }))).toBe('No account found with this email.')
  })

  it('maps missing password', () => {
    expect(loginErrorMessage(httpError(400, { error: 'Missing password' }))).toBe('Please enter your password.')
  })

  it('maps a 401 to the API key hint', () => {
    expect(loginErrorMessage(httpError(401, { error: 'Missing API key' }))).toBe(
      'Invalid API key — check NEXT_PUBLIC_REQRES_API_KEY.',
    )
  })

  it('maps a request with no response to a network error', () => {
    expect(loginErrorMessage(new AxiosError('Network Error', 'ERR_NETWORK'))).toBe(
      'Network error. Check your connection and try again.',
    )
  })

  it('falls back to a generic message', () => {
    expect(loginErrorMessage(new Error('boom'))).toBe('Something went wrong. Please try again.')
    expect(loginErrorMessage(httpError(500, {}))).toBe('Something went wrong. Please try again.')
  })
})
