import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

function RootComponent() {
    return (
        <div className='h-screen'>
            <Outlet></Outlet>
            <Toaster position="top-center" />
        </div>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
