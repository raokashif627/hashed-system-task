import { create } from 'zustand'

interface UiState {
  filtersOpen: boolean
  mapOpen: boolean
  setFiltersOpen(open: boolean): void
  setMapOpen(open: boolean): void
  reset(): void
}

const CLOSED = { filtersOpen: false, mapOpen: false }

export const useUiStore = create<UiState>()((set) => ({
  ...CLOSED,
  setFiltersOpen: (filtersOpen) => set(filtersOpen ? { filtersOpen, mapOpen: false } : { filtersOpen }),
  setMapOpen: (mapOpen) => set(mapOpen ? { mapOpen, filtersOpen: false } : { mapOpen }),
  reset: () => set(CLOSED),
}))
