import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad() {
        const { isAuthenticated } = useAuthStore.getState()
        if (!isAuthenticated) {
            throw redirect({
                to: '/login',
            })
        }
    },
})
