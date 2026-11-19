import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from '../store'

describe('useUiStore', () => {
  beforeEach(() => useUiStore.getState().reset())

  it('starts with everything closed', () => {
    const { filtersOpen, mapOpen } = useUiStore.getState()
    expect(filtersOpen).toBe(false)
    expect(mapOpen).toBe(false)
  })

  it('opens and closes the filters drawer', () => {
    useUiStore.getState().setFiltersOpen(true)
    expect(useUiStore.getState().filtersOpen).toBe(true)
    useUiStore.getState().setFiltersOpen(false)
    expect(useUiStore.getState().filtersOpen).toBe(false)
  })

  it('closes the mobile map when the filters drawer opens', () => {
    useUiStore.getState().setMapOpen(true)
    useUiStore.getState().setFiltersOpen(true)
    expect(useUiStore.getState().mapOpen).toBe(false)
    expect(useUiStore.getState().filtersOpen).toBe(true)
  })

  it('reset closes every panel', () => {
    useUiStore.getState().setFiltersOpen(true)
    useUiStore.getState().reset()
    expect(useUiStore.getState().filtersOpen).toBe(false)
  })
})
