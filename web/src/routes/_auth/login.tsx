import LoginForm from '@/components/LoginForm'
import SocialButtons from '@/components/SocialButtons'
import { BorderBeam } from '@/components/ui/border-beam'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getIsAuthenticated } from '@/store/authStore'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useLoginMutation } from '../../hooks/api/useAuth'

export const Route = createFileRoute('/_auth/login')({
    beforeLoad() {
        if (getIsAuthenticated()) {
            throw redirect({
                to: '/',
                replace: true,
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { mutate: login } = useLoginMutation()

    const handleLogin = (
        method: 'email' | 'phone' | 'password',
        identifier: string,
        password?: string,
    ) => {
        const isPasswordLogin = method === 'password'
        if (!isPasswordLogin) {
            toast.error("This method has not been implemented")
            return
        }

        login({
            email: identifier,
            password: password ?? "",
        })
    }

    return (
        <div className="flex  justify-center items-center h-full">
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
                    <LoginForm handleLogin={handleLogin} />

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
