'use client'

import Image from 'next/image'
import { useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Tabs } from '@/components/ui/Tabs'
import { VenueCard } from '@/components/venue/VenueCard'
import { VenueCardSkeleton } from '@/components/venue/VenueCardSkeleton'
import { useQuickView } from '@/features/quickview/useQuickView'
import { useFeaturedVenues } from '@/features/venues/hooks'
import { FEATURED_TABS } from '@/features/venues/taxonomy'
import type { FeaturedTab } from '@/features/venues/types'
import { ScrollRow } from './ScrollRow'
import { SectionHeader } from './SectionHeader'

const CARD = 'w-[82vw] max-w-[300px] shrink-0 snap-start md:w-[300px] lg:w-[calc((100%-75px)/4)]'

export function FeaturedVenues() {
  const [tab, setTab] = useState<FeaturedTab>('Gallery')
  const { data, isPending, isError, refetch } = useFeaturedVenues(tab)
  const { open } = useQuickView()

  return (
    <section className="relative isolate overflow-hidden bg-night px-4 py-14 md:px-8 lg:min-h-[800px] lg:px-[82px] lg:pt-[77px] lg:pb-[52px]">
      <Image src="/images/hero/hero-1.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/70" />

      <SectionHeader title="Featured Venues" tone="light" />
      <Tabs
        label="Featured venue types"
        variant="dark"
        tabs={FEATURED_TABS.map((t) => ({ id: t, label: t }))}
        value={tab}
        onChange={(id) => setTab(id as FeaturedTab)}
        className="mx-auto mt-6 max-w-max lg:mt-[25px]"
      />

      <div className="mx-auto mt-8 max-w-[1275px] lg:mt-[46px]">
        {isError ? (
          <div className="rounded-card bg-surface/95 p-8 text-center">
            <p className="text-ink">We couldn&apos;t load featured venues.</p>
            <button type="button" onClick={() => refetch()} className="mt-3 cursor-pointer font-semibold text-brand-500 hover:underline">
              Try again
            </button>
          </div>
        ) : isPending ? (
          <div className="no-scrollbar -mx-4 flex gap-[25px] overflow-hidden px-4 md:mx-0 md:px-0">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={CARD}>
                <VenueCardSkeleton />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-card bg-surface">
            <EmptyState title="No featured venues yet" description="Try another type above or browse all venues." />
          </div>
        ) : (
          <ScrollRow label="featured venues">
            {data.map((v) => (
              <div key={v.id} className={CARD}>
                <VenueCard venue={v} onOpen={open} />
              </div>
            ))}
          </ScrollRow>
        )}
      </div>
    </section>
  )
}
