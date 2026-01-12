import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
    beforeLoad() {
        if (authenticated()) {
            throw redirect({
                to: "/",
                replace: true,
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/auth/login"!</div>
}

//TODO: implement
function authenticated() {
    return false
}
