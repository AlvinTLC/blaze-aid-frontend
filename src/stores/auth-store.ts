import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  expiresAt: string | null
  setSession: (accessToken: string, expiresAt: string) => void
  clear: () => void
  isAuthenticated: () => boolean
}

/**
 * JWT lives in memory (Zustand) and is mirrored to sessionStorage so a
 * page refresh survives. Backend is Bearer-only (no httpOnly cookie);
 * see memory #1240. sessionStorage (not localStorage) keeps the token
 * scoped to the tab and reduces post-expiry staleness.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,
      setSession: (accessToken, expiresAt) =>
        set({ accessToken, expiresAt }),
      clear: () => set({ accessToken: null, expiresAt: null }),
      isAuthenticated: () => {
        const { accessToken, expiresAt } = get()
        if (!accessToken) return false
        if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
          return false
        }
        return true
      },
    }),
    {
      name: 'blazeaid.auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
      }),
    },
  ),
)
