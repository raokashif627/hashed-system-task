import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { PrefetchedSearch, type RawSearchParams } from '@/components/search/PrefetchedSearch'
import { SearchSkeleton } from '@/components/search/SearchSkeleton'

export const metadata: Metadata = { title: 'Search venues' }

export default function SearchPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  return (
    <>
      <Suspense fallback={<div className="h-[88px] border-b border-line bg-surface" />}>
        <TopBar variant="solid" showCompactSearch />
      </Suspense>
      <main>
        <h1 className="sr-only">Search venues</h1>
        <Suspense fallback={<SearchSkeleton />}>
          <PrefetchedSearch searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  )
}
