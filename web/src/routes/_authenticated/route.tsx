import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSideBar'
import {} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad() {
        const { isAuthenticated } = useAuthStore.getState()
        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="pl-8 w-full">
                <div>
                    <SidebarTrigger />
                </div>
                <div>
                    <Outlet></Outlet>
                </div>
            </div>
        </SidebarProvider>
    )
}
