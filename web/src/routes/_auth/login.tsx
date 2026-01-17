import { createFileRoute, redirect } from '@tanstack/react-router'
import SocialButtons from '@/components/SocialButtons'

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
    return <SocialButtons/>
}

//TODO: implement
function authenticated() {
    return false
}
