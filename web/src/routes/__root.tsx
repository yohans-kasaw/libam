import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

function RootComponent() {
    return (
        <>
            <div>Hello "__root"!</div>
            <div>
                <Link to="/">
                    home
                </Link>
            </div>
            <div>
                <Link to="/about">
                    about
                </Link>
            </div>
            <Outlet></Outlet>
        </>
    )
}

export const Route = createRootRoute({
    component: RootComponent,
})
