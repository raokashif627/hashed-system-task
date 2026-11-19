'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown'
import { GUEST_OPTIONS, cityLabel, dateLabel, guestsLabel } from '@/features/search/options'
import { parseSearchState, toQueryString } from '@/features/search/params'
import { CITIES } from '@/features/venues/taxonomy'
import type { City } from '@/features/venues/types'
import { todayISO } from '@/lib/format'

const SELECT = 'mt-1 h-11 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-brand-500'
const CITY_OPTIONS: DropdownOption<string>[] = [{ value: '', label: 'Anywhere' }, ...CITIES.map((c) => ({ value: c.id, label: c.label }))]
const GUEST_DROPDOWN: DropdownOption<string>[] = [{ value: '', label: 'Any' }, ...GUEST_OPTIONS.map((g) => ({ value: String(g.min), label: g.label }))]

export function CompactSearch() {
  const router = useRouter()
  const sp = useSearchParams()
  const state = parseSearchState(new URLSearchParams(sp.toString()))
  const [open, setOpen] = useState(false)
  const [city, setCity] = useState<City | ''>(state.city ?? '')
  const [date, setDate] = useState(state.date ?? '')
  const [guests, setGuests] = useState<number | ''>(state.guests ?? '')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function submit(e: FormEvent) {
    e.preventDefault()
    setOpen(false)
    const qs = toQueryString({
      ...state,
      city: city || undefined,
      date: date || undefined,
      guests: guests || undefined,
    })
    router.push(`/search${qs ? `?${qs}` : ''}`)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Edit search"
        className="flex h-11 w-[44px] cursor-pointer items-center rounded-btn bg-white pr-[5px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)] sm:w-[430px] sm:pl-6"
      >
        <span className="hidden flex-1 items-center gap-[30px] text-sm font-medium whitespace-nowrap text-black sm:flex">
          <span className="truncate">{cityLabel(state.city)}</span>
          <span className="h-[17px] w-px bg-[#d0d0d0]" />
          <span>{dateLabel(state.date)}</span>
          <span className="h-[17px] w-px bg-[#d0d0d0]" />
          <span>{state.guests ? `${guestsLabel(state.guests)} Guests` : 'Any guests'}</span>
        </span>
        <span className="ml-auto flex size-[34px] items-center justify-center rounded-btn bg-brand-500 max-sm:mx-auto">
          <Search className="size-[18px] text-white" strokeWidth={2.4} />
        </span>
      </button>
      {open && (
        <form
          onSubmit={submit}
          className="absolute top-full left-1/2 z-50 mt-3 w-[min(92vw,430px)] -translate-x-1/2 animate-pop-in space-y-3 rounded-card border border-line bg-surface p-4 shadow-2xl max-sm:fixed max-sm:top-20"
        >
          <div>
            <label id="compact-where-label" htmlFor="compact-where" className="block text-xs text-muted">
              Where
            </label>
            <Dropdown
              id="compact-where"
              labelId="compact-where-label"
              variant="boxed"
              value={city}
              options={CITY_OPTIONS}
              onChange={(v) => setCity(v as City | '')}
            />
          </div>
          <label className="block text-xs text-muted">
            When
            <input type="date" min={todayISO()} className={SELECT} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <div>
            <label id="compact-guests-label" htmlFor="compact-guests" className="block text-xs text-muted">
              Guests
            </label>
            <Dropdown
              id="compact-guests"
              labelId="compact-guests-label"
              variant="boxed"
              value={guests === '' ? '' : String(guests)}
              options={GUEST_DROPDOWN}
              onChange={(v) => setGuests(v ? Number(v) : '')}
            />
          </div>
          <Button type="submit" className="w-full">
            <Search className="size-4" /> Search
          </Button>
        </form>
      )}
    </div>
  )
}
