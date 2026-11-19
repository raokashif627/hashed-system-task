import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuickView } from '../useQuickView'

const push = vi.fn()
const replace = vi.fn()
const back = vi.fn()
let params = new URLSearchParams()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace, back }),
  usePathname: () => '/search',
  useSearchParams: () => params,
}))

describe('useQuickView', () => {
  beforeEach(() => {
    push.mockReset()
    replace.mockReset()
    back.mockReset()
    vi.spyOn(window.history, 'pushState')
    vi.spyOn(window.history, 'replaceState')
    params = new URLSearchParams('city=London')
  })
  afterEach(() => vi.restoreAllMocks())

  it('opens with a shallow history entry and goes back on close', () => {
    const { result } = renderHook(() => useQuickView())
    act(() => result.current.open('v1'))
    expect(window.history.pushState).toHaveBeenCalledWith(null, '', '/search?city=London&venue=v1')
    expect(push).not.toHaveBeenCalled()
    act(() => result.current.close())
    expect(back).toHaveBeenCalledTimes(1)
    expect(window.history.replaceState).not.toHaveBeenCalled()
  })

  it('replaces the URL shallowly when the modal came from a shared link', () => {
    params = new URLSearchParams('city=London&venue=v1')
    const { result } = renderHook(() => useQuickView())
    act(() => result.current.close())
    expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/search?city=London')
    expect(replace).not.toHaveBeenCalled()
    expect(back).not.toHaveBeenCalled()
  })
})
