import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { LogOut } from 'lucide-react'
import { DiscoveryFeed } from '@/components/DiscoveryFeed'

export const Route = createFileRoute('/_authenticated/home')({
    component: RouteComponent,
})

function RouteComponent() {
    const authStoreState = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        toast.promise(
            async () => {
                await new Promise((r) => setTimeout(r, 1000))
                authStoreState.logout()
                await router.navigate({ to: '/login' })
            },
            {
                loading: 'Logging out...',
                success: 'Successfully logged out',
                error: 'Failed to logout',
            }
        )
    }

    return (
        <div className="relative min-h-screen overflow-auto">
            {/* Floating Logout Button */}
            <div className="fixed top-4 right-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg border border-border/50 hover:bg-muted transition-all duration-200"
                    aria-label="Logout"
                >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            {/* Discovery Feed */}
            <DiscoveryFeed />

            <Outlet />
        </div>
    )
}
