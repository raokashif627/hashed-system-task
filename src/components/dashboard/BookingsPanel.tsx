'use client'

import { CalendarDays, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button, buttonClasses } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useBookings, useCancelBooking } from '@/features/bookings/hooks'
import { splitBookings } from '@/features/bookings/split'
import type { BookingStatus, BookingWithVenue } from '@/features/bookings/types'
import { useQuickView } from '@/features/quickview/useQuickView'
import { cn } from '@/lib/cn'
import { formatBookingDate, todayISO } from '@/lib/format'

const STATUS_STYLES: Record<BookingStatus, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Completed: 'bg-surface-alt text-body',
  Cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
}

function StatusPill({ status }: { status: BookingStatus }) {
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_STYLES[status])}>{status}</span>
}

function BookingRow({ booking, onCancel, onOpen }: { booking: BookingWithVenue; onCancel?: () => void; onOpen: () => void }) {
  return (
    <li className="flex animate-fade-in flex-col gap-4 rounded-card border border-line bg-surface p-4 sm:flex-row sm:items-center">
      <button type="button" onClick={onOpen} className="relative h-36 w-full shrink-0 cursor-pointer overflow-hidden rounded-btn sm:h-20 sm:w-28" aria-label={`Open ${booking.venue.title}`}>
        <Image src={booking.venue.images[0]} alt="" fill sizes="112px" className="object-cover" />
      </button>
      <div className="min-w-0 flex-1">
        <button type="button" onClick={onOpen} className="cursor-pointer text-left font-semibold text-ink hover:text-brand-500">
          {booking.venue.title}
        </button>
        <p className="text-sm text-brand-500">
          {booking.venue.area}, {booking.venue.city}
        </p>
        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-body">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" /> {formatBookingDate(booking.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" /> {booking.guests} guests
          </span>
        </p>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <StatusPill status={booking.status} />
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
            Cancel
          </Button>
        )}
      </div>
    </li>
  )
}

function Section({ title, children }: { title: 'Upcoming' | 'Past'; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h3 className="mb-3 text-lg font-semibold text-ink">{title}</h3>
      {children}
    </section>
  )
}

export function BookingsPanel() {
  const { data, isPending, isError, refetch } = useBookings()
  const cancel = useCancelBooking()
  const { open } = useQuickView()
  const [pending, setPending] = useState<BookingWithVenue | null>(null)

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-card" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div role="alert" className="py-12 text-center">
        <p className="text-ink">We couldn&apos;t load your bookings.</p>
        <Button className="mt-4" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const { upcoming, past } = splitBookings(data, todayISO())

  return (
    <div className="space-y-10">
      <Section title="Upcoming">
        {upcoming.length ? (
          <ul className="space-y-3">
            {upcoming.map((b) => (
              <BookingRow key={b.id} booking={b} onOpen={() => open(b.venueId)} onCancel={() => setPending(b)} />
            ))}
          </ul>
        ) : (
          <EmptyState
            illustration="bookings"
            className="py-8"
            title="No upcoming bookings"
            description="When you request a venue it will show up here."
            action={
              <Link href="/search" className={buttonClasses('outline', 'md')}>
                Find a venue
              </Link>
            }
          />
        )}
      </Section>
      <Section title="Past">
        {past.length ? (
          <ul className="space-y-3">
            {past.map((b) => (
              <BookingRow key={b.id} booking={b} onOpen={() => open(b.venueId)} />
            ))}
          </ul>
        ) : (
          <EmptyState illustration="bookings" className="py-8" title="No past bookings yet" description="Your completed and cancelled bookings will appear here." />
        )}
      </Section>

      <Modal open={Boolean(pending)} onClose={() => setPending(null)} title="Cancel this booking?">
        {pending && (
          <div className="px-6 pb-6">
            <p className="text-sm text-body">
              {pending.venue.title} · {formatBookingDate(pending.date)} · {pending.guests} guests. This can&apos;t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="light" onClick={() => setPending(null)}>
                Keep booking
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  cancel.mutate(pending.id)
                  setPending(null)
                }}
              >
                Cancel booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
