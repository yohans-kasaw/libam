import { useThemeStore } from '@/store/themeStore'
import { Sun, Moon, Monitor } from 'lucide-react'
import { capitalize, cn } from '@/lib/utils'

export function ThemeToggle() {
    const themeStore = useThemeStore()

    const modes = [
        { name: 'light', icon: Sun },
        { name: 'dark', icon: Moon },
        { name: 'system', icon: Monitor },
    ] as const

    const currentMode =
        modes.find((mode) => mode.name === themeStore.theme) || modes[0]
    const Icon = currentMode.icon

    const cycleTheme = () => {
        const currentIndex = modes.findIndex(
            (mode) => mode.name === themeStore.theme,
        )
        const nextIndex = (currentIndex + 1) % modes.length
        themeStore.setTheme(modes[nextIndex].name)
    }

    return (
        <button
            onClick={cycleTheme}
            className={cn('flex h-9 w-9 items-center justify-center rounded-full border bg-background shadow-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-md')}
            title={`Current: ${capitalize(currentMode.name)}. Click to cycle.`}
        >
            <Icon
                size={16}
                key={currentMode.name}
                className="transition-transform duration-300 animate-in zoom-in-50"
            />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
