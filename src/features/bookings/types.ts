import type { Venue } from '@/features/venues/types'

export type BookingStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'

export interface Booking {
  id: string
  venueId: string
  date: string
  guests: number
  status: BookingStatus
  createdAt: string
}

export interface BookingWithVenue extends Booking {
  venue: Venue
}

export interface BookingRequest {
  venueId: string
  date: string
  guests: number
}
