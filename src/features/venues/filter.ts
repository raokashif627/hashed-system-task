import type { Venue, VenueFilters } from './types'

function matches(v: Venue, f: VenueFilters): boolean {
  if (f.city && v.city !== f.city) return false
  if (f.guests && v.capacity < f.guests) return false
  if (f.category !== 'all' && v.category !== f.category) return false
  if (f.q) {
    const q = f.q.trim().toLowerCase()
    if (q && ![v.title, v.area, v.type].some((s) => s.toLowerCase().includes(q))) return false
  }
  if (f.types.length && !f.types.includes(v.type)) return false
  if (v.capacity < f.capMin || v.capacity > f.capMax) return false
  if (v.pricePerHour < f.priceMin || v.pricePerHour > f.priceMax) return false
  if (f.occasions.length && !f.occasions.some((o) => v.occasions.includes(o))) return false
  if (f.verified && !v.verified) return false
  return true
}

export function filterVenues(venues: Venue[], f: VenueFilters): Venue[] {
  const result = venues.filter((v) => matches(v, f))
  switch (f.sort) {
    case 'price-asc':
      return result.sort((a, b) => a.pricePerHour - b.pricePerHour)
    case 'price-desc':
      return result.sort((a, b) => b.pricePerHour - a.pricePerHour)
    case 'capacity-desc':
      return result.sort((a, b) => b.capacity - a.capacity)
    default:
      return result.sort((a, b) => Number(b.verified) - Number(a.verified))
  }
}
