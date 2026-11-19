'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { DEFAULT_SEARCH_STATE, parseSearchState, toQueryString, type SearchState } from './params'

export function useSearchState() {
  const sp = useSearchParams()
  const pathname = usePathname()
  const state = useMemo(() => parseSearchState(new URLSearchParams(sp.toString())), [sp])

  const write = useCallback(
    (next: Partial<SearchState>) => {
      const qs = toQueryString(next)
      const venue = sp.get('venue')
      const extra = venue ? `${qs ? '&' : ''}venue=${encodeURIComponent(venue)}` : ''
      window.history.replaceState(null, '', `${pathname}${qs || extra ? `?${qs}${extra}` : ''}`)
    },
    [pathname, sp],
  )

  const update = useCallback((patch: Partial<SearchState>) => write({ ...state, ...patch }), [state, write])

  const reset = useCallback(
    () =>
      write({
        ...DEFAULT_SEARCH_STATE,
        city: state.city,
        date: state.date,
        guests: state.guests,
        mode: state.mode,
        category: state.category,
      }),
    [state, write],
  )

  return { state, update, reset }
}
