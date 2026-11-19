import { describe, expect, it } from 'vitest'
import { filterVenues } from '../filter'
import { DEFAULT_FILTERS, type Venue, type VenueFilters } from '../types'

const base: Omit<Venue, 'id' | 'title' | 'city' | 'area' | 'capacity' | 'pricePerHour' | 'type' | 'category' | 'verified' | 'occasions'> = {
  lat: 0,
  lng: 0,
  images: [],
  sizeSqft: 1000,
  amenities: [],
  featuredTabs: [],
  description: '',
}

const fixture: Venue[] = [
  { ...base, id: 'a', title: 'Sunny Loft', city: 'London', area: 'Soho', capacity: 100, pricePerHour: 50, type: 'Loft', category: 'warehouse', verified: false, occasions: ['Birthday'] },
  { ...base, id: 'b', title: 'Art Space', city: 'London', area: 'Camden', capacity: 300, pricePerHour: 200, type: 'Gallery', category: 'gallery', verified: true, occasions: ['Wedding', 'Reception'] },
  { ...base, id: 'c', title: 'Neon Lounge', city: 'Dubai', area: 'Marina', capacity: 500, pricePerHour: 120, type: 'Bar', category: 'private-party', verified: true, occasions: ['Birthday', 'Pop-up'] },
  { ...base, id: 'd', title: 'Board Room', city: 'New York', area: 'Midtown', capacity: 20, pricePerHour: 80, type: 'Office Space', category: 'office-space', verified: false, occasions: ['Conference'] },
  { ...base, id: 'e', title: 'Grand Hall', city: 'Dubai', area: 'Loftside', capacity: 1500, pricePerHour: 400, type: 'Ballroom', category: 'venue', verified: true, occasions: ['Wedding'] },
]

const run = (patch: Partial<VenueFilters>) => filterVenues(fixture, { ...DEFAULT_FILTERS, ...patch }).map((v) => v.id)

describe('filterVenues', () => {
  it('keeps everything with default filters in recommended order', () => {
    expect(run({})).toEqual(['b', 'c', 'e', 'a', 'd'])
  })

  it('filters by city', () => {
    expect(run({ city: 'Dubai' }).sort()).toEqual(['c', 'e'])
  })

  it('keeps venues that fit the guest count', () => {
    expect(run({ guests: 300 }).sort()).toEqual(['b', 'c', 'e'])
  })

  it('filters by category and treats all as no filter', () => {
    expect(run({ category: 'gallery' })).toEqual(['b'])
    expect(run({ category: 'all' })).toHaveLength(5)
  })

  it('matches keyword against title, area and type case-insensitively', () => {
    expect(run({ q: 'LOFT' }).sort()).toEqual(['a', 'e'])
  })

  it('ORs within types and ANDs with other filters', () => {
    expect(run({ types: ['Bar', 'Loft'] }).sort()).toEqual(['a', 'c'])
    expect(run({ types: ['Bar', 'Loft'], city: 'London' })).toEqual(['a'])
  })

  it('applies inclusive capacity and price ranges', () => {
    expect(run({ capMin: 100, capMax: 500 }).sort()).toEqual(['a', 'b', 'c'])
    expect(run({ priceMin: 80, priceMax: 200 }).sort()).toEqual(['b', 'c', 'd'])
  })

  it('ORs occasions', () => {
    expect(run({ occasions: ['Pop-up', 'Conference'] }).sort()).toEqual(['c', 'd'])
  })

  it('drops unverified venues when verified is on', () => {
    expect(run({ verified: true }).sort()).toEqual(['b', 'c', 'e'])
  })

  it('sorts by price and capacity', () => {
    expect(run({ sort: 'price-asc' })).toEqual(['a', 'd', 'c', 'b', 'e'])
    expect(run({ sort: 'price-desc' })).toEqual(['e', 'b', 'c', 'd', 'a'])
    expect(run({ sort: 'capacity-desc' })).toEqual(['e', 'c', 'b', 'a', 'd'])
  })
})
