'use client'

import { ArrowUpDown, Map as MapIcon, Search, SlidersHorizontal, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { VenueCard } from '@/components/venue/VenueCard'
import { VenueCardSkeleton } from '@/components/venue/VenueCardSkeleton'
import { useQuickView } from '@/features/quickview/useQuickView'
import { countActiveFilters, DEFAULT_SEARCH_STATE, toVenueFilters } from '@/features/search/params'
import { useSearchState } from '@/features/search/useSearchState'
import { useUiStore } from '@/features/ui/store'
import { useVenues } from '@/features/venues/hooks'
import { CATEGORIES, SORT_OPTIONS } from '@/features/venues/taxonomy'
import type { SortKey } from '@/features/venues/types'
import { cn } from '@/lib/cn'
import { CategoryStrip } from './CategoryStrip'
import { FilterChips } from './FilterChips'
import { FiltersDrawer } from './FiltersDrawer'

const VenueMap = dynamic(() => import('./VenueMap').then((m) => m.VenueMap), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-surface-alt" />,
})

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return v
}

export function SearchView() {
  const { state, update } = useSearchState()
  const { open } = useQuickView()
  const filtersOpen = useUiStore((s) => s.filtersOpen)
  const mapOpen = useUiStore((s) => s.mapOpen)
  const setFiltersOpen = useUiStore((s) => s.setFiltersOpen)
  const setMapOpen = useUiStore((s) => s.setMapOpen)

  useEffect(() => () => useUiStore.getState().reset(), [])
  const [keyword, setKeyword] = useState(state.q ?? '')
  const debounced = useDebounced(keyword, 400)
  const isVendor = state.mode === 'vendor'

  useEffect(() => {
    if ((debounced.trim() || undefined) !== state.q) update({ q: debounced.trim() || undefined })
  }, [debounced]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if ((debounced.trim() || undefined) !== state.q) setKeyword(state.q ?? '')
  }, [state.q]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data, isPending, isError, isFetching, refetch } = useVenues(toVenueFilters(state), {
    simulateError: state.simulateError,
    enabled: !isVendor,
  })
  const items = data?.items ?? []
  const activeCount = countActiveFilters(state)
  const category = CATEGORIES.find((c) => c.id === state.category) ?? CATEGORIES[0]
  const total = data?.total ?? 0

  function clearFilters() {
    setKeyword('')
    update({ ...DEFAULT_SEARCH_STATE, city: state.city, category: state.category, mode: state.mode })
  }

  return (
    <div className="flex min-h-[calc(100dvh-88px)] flex-col">
      <div className="flex h-[50px] items-stretch border-b border-[#d0d0d0] bg-surface dark:border-line">
        <label className="flex flex-1 items-center gap-2.5 px-4 md:px-[25px]">
          <Search className="size-6 shrink-0 text-ink" strokeWidth={1.6} />
          <span className="sr-only">Search by keyword</span>
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Add keywords..."
            className="h-full min-w-0 flex-1 bg-transparent text-base tracking-[-0.48px] text-ink outline-none placeholder:text-[#a39e9e]"
          />
        </label>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          disabled={isVendor}
          className="relative flex cursor-pointer items-center gap-[5px] border-l border-[#d0d0d0] px-5 text-base text-ink transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50 dark:border-line"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-brand-500 text-[11px] font-semibold text-white">{activeCount}</span>
          )}
        </button>
      </div>

      <CategoryStrip value={state.category} onChange={(category) => update({ category })} />

      {isVendor ? (
        <EmptyState
          className="flex-1 justify-center py-24"
          title="Vendors are coming soon"
          description="We are onboarding caterers, decorators, photographers and entertainers. Meanwhile, explore our venues."
          action={<Button onClick={() => update({ mode: 'venue' })}>Search venues instead</Button>}
        />
      ) : (
        <div className="relative flex flex-1">
          <div className="min-w-0 flex-1 px-4 pt-5 pb-24 md:px-[30px] lg:pb-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <p data-testid="results-header" className="text-sm text-ink" aria-live="polite">
                {isPending ? (
                  'Searching…'
                ) : (
                  <>
                    {total.toLocaleString('en-US')} <strong className="font-semibold">{total === 1 ? category.one : category.many}</strong>{' '}
                    near {state.city ? state.city : 'you'}
                  </>
                )}
              </p>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <FilterChips state={state} onChange={update} />
                <label className="relative ml-auto flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] text-ink">
                  <ArrowUpDown className="size-3" />
                  Sort by: {SORT_OPTIONS.find((o) => o.id === state.sort)?.label}
                  <select
                    aria-label="Sort by"
                    value={state.sort}
                    onChange={(e) => update({ sort: e.target.value as SortKey })}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6">
              {isError ? (
                <div role="alert" className="flex flex-col items-center py-20 text-center">
                  <p className="text-base font-medium text-ink">We couldn&apos;t load venues right now.</p>
                  <p className="mt-1 text-sm text-muted">Check your connection and try again.</p>
                  <Button className="mt-5" onClick={() => refetch()} loading={isFetching}>
                    Try again
                  </Button>
                </div>
              ) : isPending ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <VenueCardSkeleton key={i} />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  className="py-20"
                  title="No data found for your search."
                  description="Explore other options or clear filters to see more results."
                  action={
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <ul className={cn('grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-3', isFetching && 'opacity-60')}>
                  {items.map((v) => (
                    <li key={v.id}>
                      <VenueCard venue={v} onOpen={open} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside
            aria-label="Map of results"
            className={cn(
              'isolate lg:sticky lg:top-[88px] lg:block lg:h-[calc(100dvh-88px)] lg:w-[29.3%] lg:shrink-0',
              mapOpen ? 'fixed inset-0 z-[60] block' : 'hidden',
            )}
          >
            <ErrorBoundary
              fallback={<div className="flex size-full items-center justify-center bg-surface-alt p-6 text-center text-sm text-muted">The map couldn&apos;t load. Results are still listed.</div>}
            >
              <VenueMap venues={items} onOpen={open} city={state.city} />
            </ErrorBoundary>
            {mapOpen && (
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                aria-label="Close map"
                className="absolute top-4 right-4 z-[1000] flex size-11 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg lg:hidden"
              >
                <X className="size-5 text-black" />
              </button>
            )}
          </aside>

          {!mapOpen && (
            <button
              type="button"
              onClick={() => setMapOpen(true)}
              className="fixed bottom-6 left-1/2 z-40 flex h-11 -translate-x-1/2 cursor-pointer items-center gap-2 rounded-full bg-night px-5 text-sm font-semibold text-white shadow-xl lg:hidden"
            >
              <MapIcon className="size-4" /> Map
            </button>
          )}
        </div>
      )}

      <FiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} value={state} onApply={update} />
    </div>
  )
}
