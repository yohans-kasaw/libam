import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/home')({
    component: RouteComponent,
})

function RouteComponent() {

    const authStoreState = useAuthStore()
    const router = useRouter()

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome Home</h1>
            <p className="mb-8">Hello "/_authenticated/home"!</p>
            <Button variant="outline" onClick={() => {
                toast.promise(
                    async () => {
                        // Simulate a small delay for better UX consistent with login flow
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
            }}>
                Logout
            </Button>
        </div>
    )
}
