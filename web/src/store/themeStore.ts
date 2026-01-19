import { DEFAULT_THEME_MODE, THEME_STORAGE_KEY } from '@/lib/constants'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
export type Theme = 'light' | 'dark' | 'system'
type themeState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const useThemeStore = create<themeState>()(
    persist(
        (set) => ({
            theme: DEFAULT_THEME_MODE,
            setTheme: (theme) => {
                const root = window.document.documentElement
                root.classList.remove('light', 'dark')

                if (theme == 'system') {
                    const systemTheme = window.matchMedia(
                        '(prefers-color-scheme: dark)',
                    ).matches
                        ? 'dark'
                        : 'light'
                    root.classList.add(systemTheme)
                } else {
                    root.classList.add(theme)
                }

                set({ theme: theme })
            },
        }),
        {
            name: THEME_STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
