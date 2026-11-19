'use client'

import Link from 'next/link'
import { buttonClasses } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { VenueCard } from '@/components/venue/VenueCard'
import { VenueCardSkeleton } from '@/components/venue/VenueCardSkeleton'
import { useQuickView } from '@/features/quickview/useQuickView'
import { useSavedStore } from '@/features/saved/store'
import { useVenues } from '@/features/venues/hooks'
import { DEFAULT_FILTERS } from '@/features/venues/types'

export function SavedVenues() {
  const ids = useSavedStore((s) => s.ids)
  const { data, isPending } = useVenues(DEFAULT_FILTERS)
  const { open } = useQuickView()
  const saved = (data?.items ?? []).filter((v) => ids.includes(v.id))

  if (isPending && ids.length) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {ids.slice(0, 3).map((id) => (
          <VenueCardSkeleton key={id} />
        ))}
      </div>
    )
  }

  if (!saved.length) {
    return (
      <EmptyState
        illustration="saved"
        title="No saved venues yet"
        description="Tap the heart on any venue to keep it here."
        action={
          <Link href="/search" className={buttonClasses('primary', 'md')}>
            Explore venues
          </Link>
        }
      />
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {saved.map((v) => (
        <li key={v.id} className="animate-fade-in">
          <VenueCard venue={v} onOpen={open} />
        </li>
      ))}
    </ul>
  )
}
