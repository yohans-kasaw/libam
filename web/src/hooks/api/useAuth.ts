import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { loginWithPassword } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import type { LoginDto, LoginResponse } from '@/types/authDto'

export function useLoginMutation() {
    const { setCredentials } = useAuthStore()
    const router = useRouter()

    return useMutation<LoginResponse, Error, LoginDto>({
        mutationFn: loginWithPassword,
        onSuccess: async (data) => {
            setCredentials(data.access_token)
            await router.invalidate()
            toast.success('Successfully logged in!')
        },
        onError: (error) => {
            console.error('Login error:', error)
            toast.error('Login failed. Please check your credentials.')
        },
    })
}

export function useLogout() {
    const { clearCredentials } = useAuthStore()
    const router = useRouter()

    const handleLogout = () => {
        toast.promise(
            async () => {
                clearCredentials()
                await router.invalidate()
                await router.navigate({ to: '/login' })
            },
            {
                loading: 'Logging out...',
                success: 'Successfully logged out',
                error: 'Failed to logout',
            }
        )
    }

    return { handleLogout }
}
