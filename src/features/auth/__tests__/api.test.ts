import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reqres } from '@/lib/axios'
import { DEMO_PASSWORD, login } from '../api'
import { IncorrectPasswordError, loginErrorMessage } from '../errors'

vi.mock('@/lib/axios', () => ({ reqres: { post: vi.fn(), get: vi.fn() } }))

describe('login', () => {
  beforeEach(() => {
    vi.mocked(reqres.post).mockReset()
    vi.mocked(reqres.post).mockResolvedValue({ data: { token: 'QpwL5tke4Pnpja7X4' } })
  })

  it('uses the password from the brief', () => {
    expect(DEMO_PASSWORD).toBe('cityslicka')
  })

  it('returns the token for the demo password', async () => {
    await expect(login({ email: 'eve.holt@reqres.in', password: 'cityslicka' })).resolves.toBe('QpwL5tke4Pnpja7X4')
  })

  it('rejects any other password even though reqres accepts it', async () => {
    const attempt = login({ email: 'eve.holt@reqres.in', password: 'wrongpw' })
    await expect(attempt).rejects.toBeInstanceOf(IncorrectPasswordError)
  })

  it('still lets reqres report an unknown email first', async () => {
    const notFound = new Error('user not found')
    vi.mocked(reqres.post).mockRejectedValue(notFound)
    await expect(login({ email: 'nobody@example.com', password: 'wrongpw' })).rejects.toBe(notFound)
  })
})

describe('loginErrorMessage for a wrong password', () => {
  it('says the password is incorrect', () => {
    expect(loginErrorMessage(new IncorrectPasswordError())).toBe('Incorrect password.')
  })
})
