import type { BookingWithVenue } from './types'

export function splitBookings(list: BookingWithVenue[], today: string) {
  const isUpcoming = (b: BookingWithVenue) => b.date >= today && (b.status === 'Pending' || b.status === 'Confirmed')
  const upcoming = list.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date))
  const past = list.filter((b) => !isUpcoming(b)).sort((a, b) => b.date.localeCompare(a.date))
  return { upcoming, past }
}
