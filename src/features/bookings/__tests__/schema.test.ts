import { describe, expect, it } from 'vitest'
import { bookingRequestSchema } from '../schema'

const messages = (input: unknown) => {
  const r = bookingRequestSchema(50, '2026-11-18').safeParse(input)
  return r.success ? [] : r.error.issues.map((i) => i.message)
}

describe('bookingRequestSchema', () => {
  it('accepts today', () => {
    expect(messages({ date: '2026-11-18', guests: 10 })).toEqual([])
  })

  it('rejects a past date', () => {
    expect(messages({ date: '2026-11-17', guests: 10 })).toContain("Date can't be in the past")
  })

  it('requires a date', () => {
    expect(messages({ date: '', guests: 10 })).toContain('Choose a date')
  })

  it('caps guests at capacity', () => {
    expect(messages({ date: '2026-11-18', guests: 51 })).toContain('This venue fits up to 50 guests')
  })

  it('requires at least one guest', () => {
    expect(messages({ date: '2026-11-18', guests: 0 })).toContain('At least 1 guest')
  })
})
