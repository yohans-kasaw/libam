import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

function RootComponent() {
    const theme = useTheme()
    return (
        <>
            <div className="underline">Hello "__root"!</div>
            <div>
                <div className="bg-red-900 dark:bg-blue-900">
                    tailwind theme

                    red - normal
                    <br />
                    blue - dark
                </div>
            </div>
            <div className="">
                <div className="bg-primary">
                    shadcn theme

                    red - normal
                    <br />
                    blue - dark
                </div>
            </div>
            <div>
                {theme.theme}
                <Button onClick={() => {
                    theme.setTheme(theme.theme !== "dark" ? "dark" : "light")
                }}>
                    toggle theme
                </Button>
            </div>
            <div>
                <Link to="/">home</Link>
            </div>
            <div>
                <Link to="/about">about</Link>
            </div>
            <Outlet></Outlet>
            <TanStackRouterDevtools />
        </>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
