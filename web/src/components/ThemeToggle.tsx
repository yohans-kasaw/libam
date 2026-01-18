import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon, Monitor } from 'lucide-react'
import { capitalize, cn } from '@/lib/utils'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const modes = [
        { name: 'light', icon: Sun },
        { name: 'dark', icon: Moon },
        { name: 'system', icon: Monitor },
    ] as const

    return (
        <div className="w-fit px-2 p-1 flex gap-2 rounded-full bg-background/60 shadow-lg transition-all duration-300 hover:shadow-primary/5">
            {modes.map((mode) => {
                const Icon = mode.icon
                const isActive = theme === mode.name

                return (
                    <button
                        key={mode.name}
                        onClick={() => setTheme(mode.name)}
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                            isActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                        title={capitalize(mode.name)}
                    >
                        <Icon
                            size={16}
                            className="transition-transform duration-300 hover:scale-110"
                        />
                        {isActive && (
                            <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20 pointer-events-none" />
                        )}
                    </button>
                )
            })}
        </div>
    )
}
