import seed from '@/data/bookings.json'
import { todayISO } from '@/lib/format'
import type { Booking, BookingStatus } from './types'

export function addDays(today: Date, days: number): string {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days)
  return todayISO(d)
}

export function seedBookings(today: Date): Booking[] {
  return seed.map((s, i) => ({
    id: `b${i + 1}`,
    venueId: s.venueId,
    date: addDays(today, s.dayOffset),
    guests: s.guests,
    status: s.status as BookingStatus,
    createdAt: today.toISOString(),
  }))
}
