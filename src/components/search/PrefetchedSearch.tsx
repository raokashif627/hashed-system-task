import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { prefetchSearch } from '@/features/search/prefetch'
import { makeQueryClient } from '@/lib/query-client'
import { SearchView } from './SearchView'

export type RawSearchParams = Record<string, string | string[] | undefined>

function toURLSearchParams(raw: RawSearchParams): URLSearchParams {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) {
    for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value]) sp.append(key, v)
  }
  return sp
}

export async function PrefetchedSearch({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const queryClient = makeQueryClient()
  await prefetchSearch(queryClient, toURLSearchParams(await searchParams))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchView />
    </HydrationBoundary>
  )
}
