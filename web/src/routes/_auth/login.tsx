import { createFileRoute, redirect } from '@tanstack/react-router'
import SocialButtons from '@/components/SocialButtons'
import LoginForm, { type LoginMethod } from '@/components/LoginForm'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_auth/login')({
    beforeLoad() {
        if (authenticated()) {
            throw redirect({
                to: '/',
                replace: true,
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const handleSendOtp = (method: LoginMethod, value: string) => {
        console.log('Using login method:', method)
        console.log('Submitting identity:', value)
        // api.sendOtp({ [method]: value })
    }

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-sm shadow-lg border-muted/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Sign in
                    </CardTitle>
                    <CardDescription>
                        Choose your preferred method to receive a secure login code and access your account.
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
            </Card>
        </div>
    )
}

//TODO: implement
function authenticated() {
    return false
}
