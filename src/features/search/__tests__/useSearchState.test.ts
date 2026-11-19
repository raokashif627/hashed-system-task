import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchState } from '../useSearchState'

const replace = vi.fn()
let params = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => '/search',
  useSearchParams: () => params,
}))

describe('useSearchState', () => {
  beforeEach(() => {
    replace.mockReset()
    vi.spyOn(window.history, 'replaceState')
    params = new URLSearchParams('city=London&venue=v2')
  })
  afterEach(() => vi.restoreAllMocks())

  it('writes filter changes to the URL without a server round trip, keeping the open venue', () => {
    const { result } = renderHook(() => useSearchState())
    act(() => result.current.update({ verified: true }))
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/search?city=London&verified=1&venue=v2')
    expect(replace).not.toHaveBeenCalled()
  })
})
