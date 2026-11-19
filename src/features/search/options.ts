import { CITIES } from '@/features/venues/taxonomy'
import type { City } from '@/features/venues/types'

export const GUEST_OPTIONS = [
  { min: 1, label: '1-10' },
  { min: 10, label: '10-20' },
  { min: 20, label: '20-50' },
  { min: 50, label: '50-100' },
  { min: 100, label: '100+' },
] as const

export function guestsLabel(min?: number): string {
  return GUEST_OPTIONS.find((g) => g.min === min)?.label ?? 'Any'
}

export function cityLabel(city?: City): string {
  return CITIES.find((c) => c.id === city)?.label ?? 'Anywhere'
}

export function dateLabel(date?: string): string {
  if (!date) return 'Anytime'
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
