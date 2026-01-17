import { DEFAULT_THEME_MODE, THEME_STORAGE_KEY } from '@/lib/constants'
import { themeContext, type Theme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'


function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(
        (localStorage.getItem(THEME_STORAGE_KEY) as Theme) ||
        DEFAULT_THEME_MODE,
    )

    const value = {
        theme: theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(THEME_STORAGE_KEY, theme)
            setTheme(theme)
        },
    }

    useEffect(() => {
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
    }, [theme])

    return (
        <themeContext.Provider value={value}>{children}</themeContext.Provider>
    )
}

export default ThemeProvider
