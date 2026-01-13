import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

function RootComponent() {
    return (
        <>
            <div>Hello "__root"!</div>
            <div>
                <Link to="/">home</Link>
            </div>
            <div>
                <Link to="/about">about</Link>
            </div>
            <Outlet></Outlet>
            <TanStackRouterDevtools />
        </>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
