import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import SocialButtons from '@/components/SocialButtons'
import LoginForm from '@/components/LoginForm'
import { Separator } from '@/components/ui/separator'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { BorderBeam } from '@/components/ui/border-beam'

export const Route = createFileRoute('/_auth/login')({
    beforeLoad() {
        const { isAuthenticated } = useAuthStore.getState()
        if (isAuthenticated) {
            throw redirect({
                to: '/',
                replace: true,
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const authStoreState = useAuthStore()

    const router = useRouter()

    const handleSendOtp = () => {
        toast.promise(
            async () => {
                // Simulate a real API call delay
                await new Promise((r) =>
                    setTimeout(() => {
                        authStoreState.login('placeholder-token')
                        r(true)
                    }, 1500),
                )

                //TODO: what the hell is this
                await router.invalidate()

                await router.navigate({ to: '/home' })
                return 'Login successful'
            },
            {
                loading: 'Sending OTP...',
                success: 'OTP sent! Redirecting...',
                error: 'Failed to send OTP',
            },
        )
    }

    return (
        <div className="flex justify-center">
            <Card className="relative w-full max-w-sm shadow-lg border-muted/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Sign in
                    </CardTitle>
                    <CardDescription>
                        Choose your preferred method to receive a secure login
                        code and access your account.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    <LoginForm onSendOtp={handleSendOtp} />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <SocialButtons />
                </CardContent>
                <BorderBeam
                    duration={50}
                    size={500}
                    className="from-transparent via-foreground/60 to-transparent"
                ></BorderBeam>
            </Card>
        </div>
    )
}
