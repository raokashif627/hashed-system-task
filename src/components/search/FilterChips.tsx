'use client'

import { Chip } from '@/components/ui/Chip'
import { DEFAULT_SEARCH_STATE, type SearchState } from '@/features/search/params'

interface ChipItem {
  key: string
  label: string
  patch: Partial<SearchState>
}

export function activeChips(s: SearchState): ChipItem[] {
  const d = DEFAULT_SEARCH_STATE
  const chips: ChipItem[] = []
  if (s.verified) chips.push({ key: 'verified', label: 'Verified', patch: { verified: false } })
  if (s.q) chips.push({ key: 'q', label: `“${s.q}”`, patch: { q: undefined } })
  if (s.guests) chips.push({ key: 'guests', label: `${s.guests}+ guests`, patch: { guests: undefined } })
  if (s.capMin !== d.capMin || s.capMax !== d.capMax)
    chips.push({ key: 'cap', label: `${s.capMin}-${s.capMax} guests`, patch: { capMin: d.capMin, capMax: d.capMax } })
  if (s.priceMin !== d.priceMin || s.priceMax !== d.priceMax)
    chips.push({ key: 'price', label: `$${s.priceMin}-$${s.priceMax}/hr`, patch: { priceMin: d.priceMin, priceMax: d.priceMax } })
  s.types.forEach((t) => chips.push({ key: `t-${t}`, label: t, patch: { types: s.types.filter((x) => x !== t) } }))
  s.occasions.forEach((o) => chips.push({ key: `o-${o}`, label: o, patch: { occasions: s.occasions.filter((x) => x !== o) } }))
  return chips
}

export function FilterChips({ state, onChange }: { state: SearchState; onChange: (patch: Partial<SearchState>) => void }) {
  const chips = activeChips(state)
  if (!chips.length) return null
  return (
    <ul aria-label="Active filters" className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto">
      {chips.map((c) => (
        <li key={c.key} className="shrink-0">
          <Chip onRemove={() => onChange(c.patch)}>{c.label}</Chip>
        </li>
      ))}
    </ul>
  )
}
