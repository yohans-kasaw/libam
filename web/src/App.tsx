import { lazy, Suspense, useEffect, useState } from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

// adds type safty for <Links>
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const router = createRouter({
    routeTree,
})

const queryClient = new QueryClient()

const ReactQueryDevtoolsProduction = lazy(() =>
    import('@tanstack/react-query-devtools/production').then(
        (d) => ({ default: d.ReactQueryDevtools }),
    ),
)

export default function App() {
    const [showDevTools, setShowDevTools] = useState(false)

    useEffect(() => {
        // @ts-expect-error - no type for windows 
        window.toggleDevTools = () => setShowDevTools((old) => !old)
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools />
            {showDevTools && (
                <Suspense fallback={null}>
                    <ReactQueryDevtoolsProduction />
                </Suspense>
            )}
        </QueryClientProvider>
    )
}
