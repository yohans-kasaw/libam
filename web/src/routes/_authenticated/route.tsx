import { getIsAuthenticated } from '@/store/authStore'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AppSidebar } from '@/components/AppSideBar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad() {
        if (!getIsAuthenticated()) {
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
