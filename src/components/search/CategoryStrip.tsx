'use client'

import {
  Briefcase,
  Building2,
  Camera,
  Clapperboard,
  Image as ImageIcon,
  LayoutGrid,
  Landmark,
  PartyPopper,
  Users,
  UtensilsCrossed,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'
import { useRef } from 'react'
import { CATEGORIES } from '@/features/venues/taxonomy'
import type { CategoryId } from '@/features/venues/types'
import { cn } from '@/lib/cn'

const ICONS: Record<CategoryId, LucideIcon> = {
  all: LayoutGrid,
  'photo-studio': Camera,
  'film-studio': Clapperboard,
  warehouse: Warehouse,
  gallery: ImageIcon,
  restaurant: UtensilsCrossed,
  apartment: Building2,
  'office-space': Briefcase,
  venue: Landmark,
  'private-party': PartyPopper,
  meeting: Users,
}

export function CategoryStrip({ value, onChange }: { value: CategoryId; onChange: (id: CategoryId) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })

  return (
    <div className="flex h-20 items-stretch border-b border-line bg-surface">
      <button type="button" aria-label="Scroll categories left" onClick={() => scroll(-1)} className="hidden w-[66px] shrink-0 cursor-pointer items-center justify-center text-ink/70 hover:text-ink md:flex">
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none" aria-hidden>
          <path d="M18 6H1m0 0 5-5M1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div ref={ref} role="tablist" aria-label="Space categories" className="no-scrollbar flex flex-1 items-stretch gap-1 overflow-x-auto px-2 md:justify-between md:px-0">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.id]
          const active = c.id === value
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(c.id)}
              className={cn(
                'flex min-w-[88px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 px-3 text-xs capitalize transition-colors',
                active ? 'bg-surface-alt font-medium text-brand-500' : 'text-[#616161] hover:text-ink dark:text-muted',
              )}
            >
              <Icon className="size-[26px]" strokeWidth={1.5} />
              {c.label}
            </button>
          )
        })}
      </div>
      <button type="button" aria-label="Scroll categories right" onClick={() => scroll(1)} className="hidden w-[66px] shrink-0 cursor-pointer items-center justify-center text-ink/70 hover:text-ink md:flex">
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none" aria-hidden>
          <path d="M1 6h17m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
