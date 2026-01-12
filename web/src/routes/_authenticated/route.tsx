import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad() {
        if (!authenticated()) {

            throw redirect({
                to: "/login"
            })
        }
    }
})

//TODO: implement
function authenticated() {
    return false
}
