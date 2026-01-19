import { TOKEN_KEY } from '@/lib/constants'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type authStoreState = {
    token: string | null
    login: (token: string) => void
    logout: () => void
    isAuthenticated: boolean
}

export const useAuthStore = create<authStoreState>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            login: (token) => {
                set({ token, isAuthenticated: true})
            },
            logout: () => {
                set({ token: null, isAuthenticated: false })
            },
        }),
        {
            name: TOKEN_KEY,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
