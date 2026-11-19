import type { QueryClient } from '@tanstack/react-query'
import { venueQuery, venuesQuery } from '@/features/venues/queries'
import { parseSearchState, toVenueFilters } from './params'

export async function prefetchSearch(qc: QueryClient, sp: URLSearchParams): Promise<void> {
  const state = parseSearchState(sp)
  if (state.mode === 'vendor' || state.simulateError) return
  const venueId = sp.get('venue')
  await Promise.all([
    qc.prefetchQuery(venuesQuery(toVenueFilters(state))),
    venueId ? qc.prefetchQuery(venueQuery(venueId)) : undefined,
  ])
}
