'use client'

import { useEffect, useState } from 'react'
import { Chip } from '@/components/ui/Chip'
import { Drawer } from '@/components/ui/Drawer'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { Toggle } from '@/components/ui/Toggle'
import { DEFAULT_SEARCH_STATE, type SearchState } from '@/features/search/params'
import { OCCASIONS, VENUE_TYPES } from '@/features/venues/taxonomy'
import type { Occasion, VenueType } from '@/features/venues/types'

export type FilterDraft = Pick<SearchState, 'types' | 'occasions' | 'verified' | 'capMin' | 'capMax' | 'priceMin' | 'priceMax'>

function draftOf(s: FilterDraft): FilterDraft {
  return {
    types: s.types,
    occasions: s.occasions,
    verified: s.verified,
    capMin: s.capMin,
    capMax: s.capMax,
    priceMin: s.priceMin,
    priceMax: s.priceMax,
  }
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

interface FiltersDrawerProps {
  open: boolean
  onClose: () => void
  value: SearchState
  onApply: (draft: FilterDraft) => void
}

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-6 last:border-b-0">
      <h3 className="mb-4 text-base font-semibold text-ink">{title}</h3>
      {children}
    </section>
  )
}

export function FiltersDrawer({ open, onClose, value, onApply }: FiltersDrawerProps) {
  const [draft, setDraft] = useState<FilterDraft>(() => draftOf(value))

  useEffect(() => {
    if (open) setDraft(draftOf(value))
  }, [open, value])

  const patch = (p: Partial<FilterDraft>) => setDraft((d) => ({ ...d, ...p }))

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <>
          <button
            type="button"
            onClick={() => setDraft(draftOf(DEFAULT_SEARCH_STATE))}
            className="h-11 cursor-pointer rounded-btn bg-[#e4e4e4] px-4 text-sm font-semibold text-ink transition-colors hover:bg-[#d6d6d6] dark:bg-surface-alt"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="h-11 cursor-pointer rounded-btn bg-brand-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Apply Filters
          </button>
        </>
      }
    >
      <Section title="Venue Type">
        <div className="flex flex-wrap gap-2.5">
          {VENUE_TYPES.map((t) => (
            <Chip key={t} selected={draft.types.includes(t)} onClick={() => patch({ types: toggle<VenueType>(draft.types, t) })}>
              {t}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Capacity">
        <p className="mb-4 text-[13px] text-body">
          Showing venues for {draft.capMin} - {draft.capMax} guests
        </p>
        <RangeSlider
          min={DEFAULT_SEARCH_STATE.capMin}
          max={DEFAULT_SEARCH_STATE.capMax}
          step={10}
          value={[draft.capMin, draft.capMax]}
          onChange={([capMin, capMax]) => patch({ capMin, capMax })}
          ariaLabel="Capacity"
        />
      </Section>

      <Section title="Price per hour (USD)">
        <RangeSlider
          min={DEFAULT_SEARCH_STATE.priceMin}
          max={DEFAULT_SEARCH_STATE.priceMax}
          step={10}
          value={[draft.priceMin, draft.priceMax]}
          onChange={([priceMin, priceMax]) => patch({ priceMin, priceMax })}
          ariaLabel="Price per hour"
          formatLabel={money}
        />
      </Section>

      <Section title="Event / Occasion">
        <div className="flex flex-wrap gap-2.5">
          {OCCASIONS.map((o) => (
            <Chip key={o} selected={draft.occasions.includes(o)} onClick={() => patch({ occasions: toggle<Occasion>(draft.occasions, o) })}>
              {o}
            </Chip>
          ))}
        </div>
      </Section>

      <div className="py-6">
        <Toggle
          label="Verified Only"
          description="Show only verified venues"
          checked={draft.verified}
          onChange={(verified) => patch({ verified })}
        />
      </div>
    </Drawer>
  )
}
