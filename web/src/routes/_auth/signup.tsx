import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup')({
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
    return <div>Hello "/_auth/signup"!</div>
}

//TODO: implement
function authenticated() {
    return false
}
