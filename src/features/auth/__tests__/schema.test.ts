import { describe, expect, it } from 'vitest'
import { loginSchema } from '../schema'

const firstError = (input: unknown) => {
  const r = loginSchema.safeParse(input)
  return r.success ? null : r.error.issues.map((i) => i.message)
}

describe('loginSchema', () => {
  it('requires an email', () => {
    expect(firstError({ email: '', password: 'secret1' })).toContain('Email is required')
  })

  it('rejects a malformed email', () => {
    expect(firstError({ email: 'bad', password: 'secret1' })).toContain('Enter a valid email address')
  })

  it('requires a password', () => {
    expect(firstError({ email: 'a@b.com', password: '' })).toContain('Password is required')
  })

  it('requires at least 6 password characters', () => {
    expect(firstError({ email: 'a@b.com', password: '123' })).toContain('Password must be at least 6 characters')
  })

  it('accepts a valid pair', () => {
    expect(loginSchema.parse({ email: 'eve.holt@reqres.in', password: 'cityslicka' })).toEqual({
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    })
  })
})
