import { CATEGORY_IDS, CITIES, OCCASIONS, SORT_OPTIONS, VENUE_TYPES } from '@/features/venues/taxonomy'
import {
  DEFAULT_FILTERS,
  type CategoryId,
  type City,
  type Occasion,
  type SortKey,
  type VenueFilters,
  type VenueType,
} from '@/features/venues/types'

export type SearchMode = 'venue' | 'vendor'

export interface SearchState extends VenueFilters {
  mode: SearchMode
  date?: string
  simulateError: boolean
}

export const DEFAULT_SEARCH_STATE: SearchState = { ...DEFAULT_FILTERS, mode: 'venue', simulateError: false }

const CITY_IDS = CITIES.map((c) => c.id) as readonly string[]
const SORT_IDS = SORT_OPTIONS.map((s) => s.id) as readonly string[]
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function oneOf<T extends string>(value: string | null, allowed: readonly string[]): T | undefined {
  return value !== null && allowed.includes(value) ? (value as T) : undefined
}

function manyOf<T extends string>(values: string[], allowed: readonly string[]): T[] {
  return [...new Set(values.filter((v) => allowed.includes(v)))] as T[]
}

function positiveInt(value: string | null): number | undefined {
  if (value === null || !/^\d+$/.test(value)) return undefined
  const n = Number(value)
  return n > 0 ? n : undefined
}

function range(minRaw: string | null, maxRaw: string | null, min: number, max: number): [number, number] {
  const lo = positiveInt(minRaw) ?? min
  const hi = positiveInt(maxRaw) ?? max
  if (lo < min || hi > max || lo > hi) return [min, max]
  return [lo, hi]
}

export function parseSearchState(sp: URLSearchParams): SearchState {
  const d = DEFAULT_SEARCH_STATE
  const [capMin, capMax] = range(sp.get('capMin'), sp.get('capMax'), d.capMin, d.capMax)
  const [priceMin, priceMax] = range(sp.get('priceMin'), sp.get('priceMax'), d.priceMin, d.priceMax)
  const date = sp.get('date')
  const q = sp.get('q')?.trim()

  const state: SearchState = {
    category: oneOf<CategoryId>(sp.get('category'), CATEGORY_IDS) ?? d.category,
    types: manyOf<VenueType>(sp.getAll('types'), VENUE_TYPES),
    capMin,
    capMax,
    priceMin,
    priceMax,
    occasions: manyOf<Occasion>(sp.getAll('occasions'), OCCASIONS),
    verified: sp.get('verified') === '1',
    sort: oneOf<SortKey>(sp.get('sort'), SORT_IDS) ?? d.sort,
    mode: sp.get('mode') === 'vendor' ? 'vendor' : 'venue',
    simulateError: sp.get('simulateError') === '1',
  }
  const city = oneOf<City>(sp.get('city'), CITY_IDS)
  const guests = positiveInt(sp.get('guests'))
  if (city) state.city = city
  if (guests) state.guests = guests
  if (date && DATE_RE.test(date)) state.date = date
  if (q) state.q = q
  return state
}

export function toQueryString(s: Partial<SearchState>): string {
  const d = DEFAULT_SEARCH_STATE
  const sp = new URLSearchParams()
  if (s.city) sp.set('city', s.city)
  if (s.date) sp.set('date', s.date)
  if (s.guests) sp.set('guests', String(s.guests))
  if (s.mode && s.mode !== d.mode) sp.set('mode', s.mode)
  if (s.category && s.category !== d.category) sp.set('category', s.category)
  if (s.q) sp.set('q', s.q)
  s.types?.forEach((t) => sp.append('types', t))
  if (s.capMin !== undefined && s.capMin !== d.capMin) sp.set('capMin', String(s.capMin))
  if (s.capMax !== undefined && s.capMax !== d.capMax) sp.set('capMax', String(s.capMax))
  if (s.priceMin !== undefined && s.priceMin !== d.priceMin) sp.set('priceMin', String(s.priceMin))
  if (s.priceMax !== undefined && s.priceMax !== d.priceMax) sp.set('priceMax', String(s.priceMax))
  s.occasions?.forEach((o) => sp.append('occasions', o))
  if (s.verified) sp.set('verified', '1')
  if (s.sort && s.sort !== d.sort) sp.set('sort', s.sort)
  if (s.simulateError) sp.set('simulateError', '1')
  return sp.toString()
}

export function toVenueFilters(s: SearchState): VenueFilters {
  return {
    city: s.city,
    guests: s.guests,
    category: s.category,
    q: s.q,
    types: s.types,
    capMin: s.capMin,
    capMax: s.capMax,
    priceMin: s.priceMin,
    priceMax: s.priceMax,
    occasions: s.occasions,
    verified: s.verified,
    sort: s.sort,
  }
}

export function countActiveFilters(s: SearchState): number {
  const d = DEFAULT_SEARCH_STATE
  let n = 0
  if (s.types.length) n++
  if (s.occasions.length) n++
  if (s.verified) n++
  if (s.capMin !== d.capMin || s.capMax !== d.capMax) n++
  if (s.priceMin !== d.priceMin || s.priceMax !== d.priceMax) n++
  return n
}
