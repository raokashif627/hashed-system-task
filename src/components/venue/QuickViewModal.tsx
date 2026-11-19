'use client'

import { BadgeCheck, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/features/auth/store'
import { useRequestBooking } from '@/features/bookings/hooks'
import { useQuickView } from '@/features/quickview/useQuickView'
import { useCurrentUrl } from '@/features/saved/useToggleSaved'
import { useVenue } from '@/features/venues/hooks'
import { useHydrated } from '@/hooks/useHydrated'
import { formatCapacity, formatPrice, formatSqft, todayISO } from '@/lib/format'
import { ImageCarousel } from './ImageCarousel'
import { RequestBookingForm } from './RequestBookingForm'

export function QuickViewModal() {
  const { venueId, close } = useQuickView()
  const { data: venue, isPending } = useVenue(venueId)
  const token = useAuthStore((s) => s.token)
  const hydrated = useHydrated()
  const current = useCurrentUrl()
  const request = useRequestBooking()

  return (
    <Modal open={Boolean(venueId)} onClose={close} title={venue?.title ?? 'Venue details'} size="xl" hideTitle>
      {isPending ? (
        <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-72 rounded-card md:h-[420px]" />
          <div className="space-y-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24" />
            <Skeleton className="h-12" />
          </div>
        </div>
      ) : !venue ? (
        <div className="p-10 text-center">
          <p className="text-lg font-semibold text-ink">Venue not found</p>
          <p className="mt-1 text-sm text-muted">It may have been removed or the link is incorrect.</p>
          <Button className="mt-6" onClick={close}>
            Back to browsing
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1.4fr_1fr]">
          <ImageCarousel images={venue.images} alt={venue.title} sizes="(min-width: 768px) 60vw, 100vw" priority className="h-72 md:h-full md:min-h-[520px]" />
          <div className="flex flex-col p-6 md:p-8">
            <div className="flex items-start gap-2 pr-8">
              <h2 className="text-2xl leading-8 font-semibold text-ink">{venue.title}</h2>
              {venue.verified && <BadgeCheck aria-label="Verified" className="mt-1 size-6 shrink-0 text-brand-500" />}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand-500">
              <MapPin className="size-4" /> {venue.area}, {venue.city}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-chip-text">
              {[formatCapacity(venue.capacity) + ' guests', formatSqft(venue.sizeSqft), venue.type, ...venue.amenities].map((a) => (
                <li key={a} className="rounded-full bg-chip px-3 py-1.5 font-medium">
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-body">{venue.description}</p>
            <p className="mt-4 text-sm text-ink">
              From <span className="text-lg font-semibold">{formatPrice(venue.pricePerHour)}</span>/hour
            </p>

            <div className="mt-6 border-t border-line pt-6">
              {!hydrated ? (
                <Skeleton className="h-40" />
              ) : token ? (
                <RequestBookingForm
                  venueId={venue.id}
                  capacity={venue.capacity}
                  today={todayISO()}
                  loading={request.isPending}
                  onSubmit={(input) => request.mutate(input, { onSuccess: close })}
                />
              ) : (
                <div className="rounded-card bg-surface-alt p-5 text-center">
                  <p className="text-sm text-body">Log in to request a booking for this venue.</p>
                  <Link href={`/login?from=${encodeURIComponent(current)}`} className={buttonClasses('primary', 'lg', 'mt-4 w-full')}>
                    Log in to request a booking
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
