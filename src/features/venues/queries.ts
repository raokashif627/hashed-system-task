import { queryOptions } from '@tanstack/react-query'
import { getVenueById, getVenues } from './service'
import type { VenueFilters } from './types'

export function venuesQuery(f: VenueFilters, simulateError = false) {
  return queryOptions({
    queryKey: ['venues', f, simulateError],
    queryFn: () => getVenues(f, { simulateError }),
  })
}

export function venueQuery(id: string) {
  return queryOptions({
    queryKey: ['venue', id],
    queryFn: () => getVenueById(id),
  })
}
