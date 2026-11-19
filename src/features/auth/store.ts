import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { clearAuthCookie, setAuthCookie } from '@/lib/cookies'

interface AuthState {
  token: string | null
  email: string | null
  setSession(token: string, email: string): void
  logout(): void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      setSession: (token, email) => {
        setAuthCookie(token)
        set({ token, email })
      },
      logout: () => {
        clearAuthCookie()
        set({ token: null, email: null })
      },
    }),
    {
      name: 'venuze-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ token, email }) => ({ token, email }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthCookie(state.token)
        else clearAuthCookie()
      },
    },
  ),
)
