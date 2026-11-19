'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown'
import { GUEST_OPTIONS, dateLabel } from '@/features/search/options'
import { toQueryString, type SearchMode } from '@/features/search/params'
import { CITIES } from '@/features/venues/taxonomy'
import type { City } from '@/features/venues/types'
import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/cn'
import { todayISO } from '@/lib/format'

function Field({ label, labelId, htmlFor, children, className }: { label: string; labelId: string; htmlFor: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative flex flex-col gap-[5px] px-[5px]', className)}>
      <label id={labelId} htmlFor={htmlFor} className="text-sm text-[#808080]">
        {label}
      </label>
      {children}
    </div>
  )
}

const CITY_OPTIONS: DropdownOption<string>[] = [{ value: '', label: 'Anywhere' }, ...CITIES.map((c) => ({ value: c.id, label: c.label }))]
const GUEST_DROPDOWN: DropdownOption<string>[] = [{ value: '', label: 'Any' }, ...GUEST_OPTIONS.map((g) => ({ value: String(g.min), label: g.label }))]

export function HeroSearch() {
  const router = useRouter()
  const [mode, setMode] = useState<SearchMode>('venue')
  const [city, setCity] = useState<City | ''>('Dubai')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState<number | ''>(10)
  const dateRef = useRef<HTMLInputElement>(null)
  const hydrated = useHydrated()

  function submit(e: FormEvent) {
    e.preventDefault()
    const qs = toQueryString({ city: city || undefined, date: date || undefined, guests: guests || undefined, mode })
    router.push(`/search${qs ? `?${qs}` : ''}`)
  }

  return (
    <form onSubmit={submit} className="relative mx-auto w-full max-w-[311px] md:max-w-[678px] lg:max-w-[1054px]">
      <fieldset className="relative z-10 mx-auto flex h-[55px] w-[264px] items-center justify-between rounded-btn bg-white px-2.5 shadow-float max-md:w-full max-md:rounded-b-none max-md:shadow-none md:-mb-[17px]">
        <legend className="sr-only">Search for</legend>
        {(
          [
            { id: 'venue', label: 'Venue', icon: '/images/icons/venue-white.svg' },
            { id: 'vendor', label: 'Vendors', icon: '/images/icons/vendors.svg' },
          ] as const
        ).map((opt) => {
          const active = mode === opt.id
          return (
            <label
              key={opt.id}
              className={cn(
                'flex h-10 flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-btn text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500',
                active ? 'bg-brand-500 text-white' : 'text-black hover:bg-surface-alt',
              )}
            >
              <input type="radio" name="mode" value={opt.id} checked={active} onChange={() => setMode(opt.id)} className="sr-only" />
              <img src={opt.icon} alt="" width={20} height={20} className={cn(!active && opt.id === 'venue' && 'invert', active && opt.id === 'vendor' && 'invert')} />
              {opt.label}
            </label>
          )
        })}
      </fieldset>

      <div className="flex flex-col gap-4 rounded-btn bg-white px-[18px] pt-4 pb-5 max-md:rounded-t-none md:h-[85px] md:flex-row md:items-center md:gap-4 md:px-[15px] md:pt-0 md:pb-0 lg:h-[100px] lg:gap-8">
        <Field label="Where" labelId="hero-where-label" htmlFor="hero-where" className="md:min-w-0 md:flex-1">
          <Dropdown id="hero-where" labelId="hero-where-label" value={city} options={CITY_OPTIONS} onChange={(v) => setCity(v as City | '')} />
        </Field>
        <span className="h-px bg-[#e4e4e4] md:h-10 md:w-px md:shrink-0 lg:hidden" />
        <Field label="When" labelId="hero-when-label" htmlFor="hero-when" className="md:min-w-0 md:flex-1">
          <div className="relative flex h-6 items-center justify-between gap-2">
            <span className="truncate text-base font-medium text-black">{dateLabel(date || undefined)}</span>
            <img src="/images/icons/arrow-down.svg" alt="" width={24} height={24} className="pointer-events-none shrink-0" />
            <input
              ref={dateRef}
              id="hero-when"
              type="date"
              min={hydrated ? todayISO() : undefined}
              value={date}
              onChange={(e) => setDate(e.target.value && e.target.value < todayISO() ? '' : e.target.value)}
              onClick={() => dateRef.current?.showPicker?.()}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        </Field>
        <span className="h-px bg-[#e4e4e4] md:h-10 md:w-px md:shrink-0 lg:hidden" />
        <Field label="Guests" labelId="hero-guests-label" htmlFor="hero-guests" className="md:min-w-0 md:flex-1">
          <Dropdown
            id="hero-guests"
            labelId="hero-guests-label"
            value={guests === '' ? '' : String(guests)}
            options={GUEST_DROPDOWN}
            onChange={(v) => setGuests(v ? Number(v) : '')}
          />
        </Field>
        <button
          type="submit"
          className="mt-1 flex h-[50px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-btn bg-brand-500 text-xl font-semibold tracking-[-0.48px] text-white transition-colors hover:bg-brand-600 md:mt-0 md:h-[61px] md:w-[147px] md:shrink-0 lg:text-2xl"
        >
          <Search className="size-6" strokeWidth={2.2} />
          Search
        </button>
      </div>
    </form>
  )
}
