import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import apiService from '@/api/client'
import { Button } from '@/components/ui/button'

interface Health {
    idle: number
    status: string
}

export const Route = createFileRoute('/_authenticated/help')({
    component: Help,
})

function Help() {
    const { data, isLoading } = useQuery({
        queryKey: ['health'],
        queryFn: (): Promise<Health> => {
            return apiService.get('health', {}).json()
        },
    })

    return (
        <div>
            <br/>
            Hello from "About"
            <br />
            {isLoading && 'loadig ..'}
            {data?.status}
            <br />
            {data?.idle}
            <br />
            <Button> from shadcn </Button>
        </div>
    )
}
