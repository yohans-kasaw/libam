import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

function RootComponent() {
    return (
        <>
            <Outlet></Outlet>
            <Toaster position="top-center" />
        </>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
