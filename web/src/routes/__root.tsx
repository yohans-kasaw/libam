import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Toaster } from '@/components/ui/sonner'


function RootComponent() {
    return (
        <>
            <div className='flex justify-end'>
                <ThemeToggle />
            </div>
            <Outlet></Outlet>
            <Toaster position='top-center'/>
            <TanStackRouterDevtools />
        </>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
