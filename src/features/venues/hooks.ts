'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { venueQuery, venuesQuery } from './queries'
import { getFeaturedVenues } from './service'
import type { FeaturedTab, VenueFilters } from './types'

export function useVenues(f: VenueFilters, opts: { simulateError?: boolean; enabled?: boolean } = {}) {
  const simulateError = opts.simulateError ?? false
  return useQuery({
    ...venuesQuery(f, simulateError),
    placeholderData: keepPreviousData,
    enabled: opts.enabled ?? true,
    ...(simulateError ? { retry: false } : {}),
  })
}

export function useFeaturedVenues(tab: FeaturedTab) {
  return useQuery({ queryKey: ['featured', tab], queryFn: () => getFeaturedVenues(tab) })
}

export function useVenue(id: string | null) {
  return useQuery({
    ...venueQuery(id ?? ''),
    enabled: Boolean(id),
  })
}
