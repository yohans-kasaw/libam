import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useHealthQuery } from '@/hooks/api/useHelp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_authenticated/help')({
    component: Help,
})

function Help() {
    const { data, isLoading, isError, error, refetch, isFetching } = useHealthQuery()

    return (
        <div className="max-w-xl mx-auto p-6">
            {isLoading && <Skeleton className="h-40 w-full" />}
            {isError && <div className="p-4 text-red-600">Error: {error.message}</div>}
            {
                (!isError && !isLoading) &&
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">🧪 Testing Page</Badge>
                            <CardTitle>API Health</CardTitle>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                            <span>Status:</span>
                            <Badge>{data!.status}</Badge>
                        </div>
                        <div className="grid gap-2">
                            {Object.entries(data!).map(([key, value]) => (
                                <div key={key} className="flex justify-between p-2 border rounded">
                                    <code>{key}</code>
                                    <span>{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>}
        </div>
    )
}
