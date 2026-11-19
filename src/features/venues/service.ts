import data from '@/data/venues.json'
import { sleep } from '@/lib/sleep'
import { filterVenues } from './filter'
import type { FeaturedTab, Venue, VenueFilters } from './types'

const VENUES = data as Venue[]
const LATENCY = 700

export async function getVenues(
  f: VenueFilters,
  opts: { simulateError?: boolean } = {},
): Promise<{ items: Venue[]; total: number }> {
  await sleep(LATENCY)
  if (opts.simulateError) throw new Error('Failed to load venues')
  const items = filterVenues(VENUES, f)
  return { items, total: items.length }
}

export async function getFeaturedVenues(tab: FeaturedTab): Promise<Venue[]> {
  await sleep(LATENCY)
  return VENUES.filter((v) => v.featuredTabs.includes(tab)).slice(0, 8)
}

export async function getVenueById(id: string): Promise<Venue | null> {
  await sleep(LATENCY)
  return VENUES.find((v) => v.id === id) ?? null
}
