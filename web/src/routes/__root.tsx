import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeToggle } from '@/components/ThemeToggle'

function RootComponent() {
    return (
        <>
            <div className='flex justify-end'>
                <ThemeToggle />
            </div>
            <Outlet></Outlet>
            <TanStackRouterDevtools />
        </>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
