import { DEFAULT_THEME_MODE } from '@/lib/constants'
import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'

type themeContextState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialValue = {
    theme: DEFAULT_THEME_MODE as Theme,
    setTheme: () => { },
}

export const themeContext = createContext<themeContextState>(initialValue)

export function useTheme() {
    const context = useContext(themeContext)

    if (context === undefined) {
        throw Error('useTheme should be used with ThemeProvider')
    }

    return context
}
