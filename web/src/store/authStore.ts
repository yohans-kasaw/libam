import { TOKEN_KEY } from '@/lib/constants'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthStore {
    access_token: string | null
    setCredentials: (token: string) => void
    clearCredentials: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            access_token: null,
            setCredentials: (token) => {
                set({ access_token: token })
            },
            clearCredentials: () => {
                set({ access_token: null })
            },
        }),
        {
            name: TOKEN_KEY,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                access_token: state.access_token
            })
        },
    ),
)

export const getIsAuthenticated = () => !!useAuthStore.getState().access_token;
