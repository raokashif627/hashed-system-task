import { describe, expect, it } from 'vitest'
import type { Venue } from '@/features/venues/types'
import { splitBookings } from '../split'
import type { BookingStatus, BookingWithVenue } from '../types'

const b = (id: string, date: string, status: BookingStatus): BookingWithVenue => ({
  id,
  venueId: 'v1',
  date,
  guests: 10,
  status,
  createdAt: '2026-11-01T00:00:00.000Z',
  venue: {} as Venue,
})

describe('splitBookings', () => {
  const today = '2026-11-18'

  it('treats a pending booking today as upcoming', () => {
    expect(splitBookings([b('a', '2026-11-18', 'Pending')], today).upcoming.map((x) => x.id)).toEqual(['a'])
  })

  it('treats a confirmed booking yesterday as past', () => {
    expect(splitBookings([b('a', '2026-11-17', 'Confirmed')], today).past.map((x) => x.id)).toEqual(['a'])
  })

  it('treats a cancelled future booking as past', () => {
    expect(splitBookings([b('a', '2026-12-01', 'Cancelled')], today).past.map((x) => x.id)).toEqual(['a'])
  })

  it('sorts upcoming ascending and past descending', () => {
    const { upcoming, past } = splitBookings(
      [
        b('u2', '2026-12-10', 'Confirmed'),
        b('u1', '2026-11-20', 'Pending'),
        b('p1', '2026-10-01', 'Completed'),
        b('p2', '2026-11-10', 'Completed'),
      ],
      today,
    )
    expect(upcoming.map((x) => x.id)).toEqual(['u1', 'u2'])
    expect(past.map((x) => x.id)).toEqual(['p2', 'p1'])
  })
})
