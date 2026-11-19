import { describe, expect, it } from 'vitest'
import { countActiveFilters, parseSearchState, toQueryString, type SearchState } from '../params'
import { DEFAULT_FILTERS } from '@/features/venues/types'

const DEFAULT_STATE: SearchState = { ...DEFAULT_FILTERS, mode: 'venue', simulateError: false }

describe('parseSearchState', () => {
  it('returns defaults for empty params', () => {
    expect(parseSearchState(new URLSearchParams())).toEqual(DEFAULT_STATE)
  })

  it('round-trips a fully populated state', () => {
    const s: SearchState = {
      city: 'London',
      guests: 10,
      date: '2026-12-01',
      category: 'gallery',
      q: 'loft',
      types: ['Bar', 'Loft'],
      capMin: 50,
      capMax: 500,
      priceMin: 20,
      priceMax: 400,
      occasions: ['Wedding', 'Pop-up'],
      verified: true,
      sort: 'price-asc',
      mode: 'vendor',
      simulateError: true,
    }
    expect(parseSearchState(new URLSearchParams(toQueryString(s)))).toEqual(s)
  })

  it('falls back to defaults for malformed values', () => {
    const s = parseSearchState(
      new URLSearchParams('capMin=abc&guests=-5&types=Nope&types=Bar&sort=bad&city=Paris&mode=x&category=zzz'),
    )
    expect(s.capMin).toBe(10)
    expect(s.guests).toBeUndefined()
    expect(s.types).toEqual(['Bar'])
    expect(s.sort).toBe('recommended')
    expect(s.city).toBeUndefined()
    expect(s.mode).toBe('venue')
    expect(s.category).toBe('all')
  })

  it('resets both capacity bounds when min exceeds max', () => {
    const s = parseSearchState(new URLSearchParams('capMin=900&capMax=100'))
    expect(s.capMin).toBe(10)
    expect(s.capMax).toBe(1500)
  })

  it('reads simulateError=1 as true', () => {
    expect(parseSearchState(new URLSearchParams('simulateError=1')).simulateError).toBe(true)
  })
})

describe('toQueryString', () => {
  it('omits default values', () => {
    expect(toQueryString(DEFAULT_STATE)).toBe('')
  })

  it('writes arrays as repeated keys', () => {
    expect(toQueryString({ ...DEFAULT_STATE, types: ['Bar', 'Loft'] })).toBe('types=Bar&types=Loft')
  })

  it('writes city then guests in a stable order', () => {
    expect(toQueryString({ city: 'London', guests: 10 })).toBe('city=London&guests=10')
  })
})

describe('countActiveFilters', () => {
  it('counts types, verified and a changed price range', () => {
    expect(countActiveFilters({ ...DEFAULT_STATE, types: ['Bar'], verified: true, priceMax: 300 })).toBe(3)
  })

  it('is zero for defaults', () => {
    expect(countActiveFilters(DEFAULT_STATE)).toBe(0)
  })
})
