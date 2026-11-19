import { dehydrate, hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useVenue, useVenues } from '@/features/venues/hooks'
import { makeQueryClient } from '@/lib/query-client'
import { parseSearchState, toVenueFilters } from '../params'
import { prefetchSearch } from '../prefetch'

async function serverPrefetch(query: string) {
  const server = makeQueryClient()
  const done = prefetchSearch(server, new URLSearchParams(query))
  await vi.advanceTimersByTimeAsync(700)
  await done
  const browser = makeQueryClient()
  hydrate(browser, dehydrate(server))
  return { server, browser }
}

function wrapperFor(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('prefetchSearch', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('gives the search hook its results on the first render', async () => {
    const { browser } = await serverPrefetch('city=London&sort=price-asc')
    const filters = toVenueFilters(parseSearchState(new URLSearchParams('city=London&sort=price-asc')))
    const { result } = renderHook(() => useVenues(filters), { wrapper: wrapperFor(browser) })
    expect(result.current.isPending).toBe(false)
    expect(result.current.data?.items.length).toBeGreaterThan(0)
    expect(result.current.data?.items.every((v) => v.city === 'London')).toBe(true)
  })

  it('prefetches the venue open in the quick view', async () => {
    const { browser } = await serverPrefetch('city=London&venue=v1')
    const { result } = renderHook(() => useVenue('v1'), { wrapper: wrapperFor(browser) })
    expect(result.current.data?.id).toBe('v1')
  })

  it('fetches nothing for vendor mode or a simulated error', async () => {
    const vendor = await serverPrefetch('mode=vendor')
    const failing = await serverPrefetch('simulateError=1')
    expect(vendor.server.getQueryCache().getAll()).toHaveLength(0)
    expect(failing.server.getQueryCache().getAll()).toHaveLength(0)
  })
})
