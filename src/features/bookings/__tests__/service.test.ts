import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cancelBooking, getBookings, requestBooking } from '../service'

async function settle<T>(p: Promise<T>) {
  await vi.advanceTimersByTimeAsync(700)
  return p
}

describe('bookings service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-18T10:00:00'))
  })
  afterEach(() => vi.useRealTimers())

  it('seeds six bookings joined with their venues', async () => {
    const list = await settle(getBookings())
    expect(list).toHaveLength(6)
    expect(list.every((b) => b.venue && b.venue.id === b.venueId)).toBe(true)
  })

  it('persists a cancellation', async () => {
    const [first] = await settle(getBookings())
    await settle(cancelBooking(first.id))
    const list = await settle(getBookings())
    expect(list.find((b) => b.id === first.id)?.status).toBe('Cancelled')
  })

  it('adds a pending request and stores it', async () => {
    const created = await settle(requestBooking({ venueId: 'v2', date: '2026-12-24', guests: 40 }))
    expect(created.status).toBe('Pending')
    const stored = JSON.parse(localStorage.getItem('venuze-bookings') ?? '[]')
    expect(stored.some((b: { id: string }) => b.id === created.id)).toBe(true)
    expect(await settle(getBookings())).toHaveLength(7)
  })
})
