'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import venues from '@/data/venues.json'
import type { Venue } from '@/features/venues/types'
import { cancelBooking, getBookings, requestBooking } from './service'
import type { BookingRequest, BookingWithVenue } from './types'

const KEY = ['bookings'] as const

export function useBookings() {
  return useQuery({ queryKey: KEY, queryFn: getBookings })
}

export function useCancelBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cancelBooking,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: KEY })
      const previous = qc.getQueryData<BookingWithVenue[]>(KEY)
      qc.setQueryData<BookingWithVenue[]>(KEY, (list) => list?.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b)))
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      qc.setQueryData(KEY, ctx?.previous)
      toast.error('Could not cancel the booking. Please try again.')
    },
    onSuccess: () => toast.success('Booking cancelled'),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useRequestBooking() {
  const qc = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: requestBooking,
    onMutate: async (input: BookingRequest) => {
      await qc.cancelQueries({ queryKey: KEY })
      const previous = qc.getQueryData<BookingWithVenue[]>(KEY)
      const venue = (venues as Venue[]).find((v) => v.id === input.venueId)
      if (previous && venue) {
        qc.setQueryData<BookingWithVenue[]>(KEY, [
          ...previous,
          { ...input, id: `optimistic-${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString(), venue },
        ])
      }
      return { previous }
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) qc.setQueryData(KEY, ctx.previous)
      toast.error('Could not send your request. Please try again.')
    },
    onSuccess: () =>
      toast.success('Request sent — see My bookings', {
        action: { label: 'View', onClick: () => router.push('/dashboard?tab=bookings') },
      }),
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
