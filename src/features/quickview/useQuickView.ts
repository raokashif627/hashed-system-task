'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

let openedInApp = false

export function useQuickView() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const venueId = sp.get('venue')

  useEffect(() => {
    if (!venueId) openedInApp = false
  }, [venueId])

  const withVenue = useCallback(
    (id: string | null) => {
      const next = new URLSearchParams(sp.toString())
      if (id) next.set('venue', id)
      else next.delete('venue')
      const qs = next.toString()
      return qs ? `${pathname}?${qs}` : pathname
    },
    [pathname, sp],
  )

  const open = useCallback(
    (id: string) => {
      openedInApp = true
      window.history.pushState(null, '', withVenue(id))
    },
    [withVenue],
  )

  const close = useCallback(() => {
    if (openedInApp) {
      openedInApp = false
      router.back()
    } else {
      window.history.replaceState(null, '', withVenue(null))
    }
  }, [router, withVenue])

  return { venueId, open, close }
}
