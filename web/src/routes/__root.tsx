import { createRootRoute } from '@tanstack/react-router'

function RootComponent() {
    return (
        <>
            <div>Hello "__root"!</div>
        </>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
