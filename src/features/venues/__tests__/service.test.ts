import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getFeaturedVenues, getVenueById, getVenues } from '../service'
import { DEFAULT_FILTERS } from '../types'

async function settle<T>(p: Promise<T>) {
  await vi.advanceTimersByTimeAsync(700)
  return p
}

describe('venues service', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('returns all 30 venues with default filters', async () => {
    const res = await settle(getVenues(DEFAULT_FILTERS))
    expect(res.total).toBe(30)
    expect(res.items).toHaveLength(30)
  })

  it('rejects when simulateError is set', async () => {
    const p = getVenues(DEFAULT_FILTERS, { simulateError: true })
    const assertion = expect(p).rejects.toThrow('Failed to load venues')
    await vi.advanceTimersByTimeAsync(700)
    await assertion
  })

  it('returns null for an unknown id', async () => {
    expect(await settle(getVenueById('nope'))).toBeNull()
  })

  it('returns at most 8 featured venues for a tab', async () => {
    const res = await settle(getFeaturedVenues('Gallery'))
    expect(res.length).toBeGreaterThan(0)
    expect(res.length).toBeLessThanOrEqual(8)
    expect(res.every((v) => v.featuredTabs.includes('Gallery'))).toBe(true)
  })
})
