import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface SavedState {
  ids: string[]
  toggle(id: string): void
  add(id: string): void
  remove(id: string): void
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    {
      name: 'venuze-saved',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ ids }) => ({ ids }),
    },
  ),
)

export function useIsSaved(id: string): boolean {
  return useSavedStore((s) => s.ids.includes(id))
}
