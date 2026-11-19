'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/features/auth/store'
import type { Venue } from '@/features/venues/types'
import { useSavedStore } from './store'

export function useCurrentUrl(): string {
  const pathname = usePathname()
  const sp = useSearchParams()
  const qs = sp.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

export function useToggleSaved(): (venue: Venue) => void {
  const router = useRouter()
  const current = useCurrentUrl()
  const token = useAuthStore((s) => s.token)

  return useCallback(
    (venue: Venue) => {
      if (!token) {
        toast('Log in to save venues', {
          action: { label: 'Log in', onClick: () => router.push(`/login?from=${encodeURIComponent(current)}`) },
        })
        return
      }
      const { ids, add, remove } = useSavedStore.getState()
      if (ids.includes(venue.id)) {
        remove(venue.id)
        toast('Removed from saved', { action: { label: 'Undo', onClick: () => add(venue.id) } })
      } else {
        add(venue.id)
        toast.success('Saved to your venues')
      }
    },
    [current, router, token],
  )
}
