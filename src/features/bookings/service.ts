import venues from '@/data/venues.json'
import { sleep } from '@/lib/sleep'
import type { Venue } from '@/features/venues/types'
import { seedBookings } from './seed'
import type { Booking, BookingRequest, BookingWithVenue } from './types'

const KEY = 'venuze-bookings'
const LATENCY = 700
const VENUES = venues as Venue[]

function read(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Booking[]
  } catch {
    localStorage.removeItem(KEY)
  }
  const seeded = seedBookings(new Date())
  write(seeded)
  return seeded
}

function write(list: Booking[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

function withVenue(b: Booking): BookingWithVenue | null {
  const venue = VENUES.find((v) => v.id === b.venueId)
  return venue ? { ...b, venue } : null
}

export async function getBookings(): Promise<BookingWithVenue[]> {
  await sleep(LATENCY)
  return read()
    .map(withVenue)
    .filter((b): b is BookingWithVenue => b !== null)
}

export async function cancelBooking(id: string): Promise<Booking> {
  await sleep(LATENCY)
  const list = read()
  const target = list.find((b) => b.id === id)
  if (!target) throw new Error('Booking not found')
  target.status = 'Cancelled'
  write(list)
  return target
}

export async function requestBooking(input: BookingRequest): Promise<Booking> {
  await sleep(LATENCY)
  const booking: Booking = {
    id: `b_${Date.now()}`,
    ...input,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  }
  write([...read(), booking])
  return booking
}
