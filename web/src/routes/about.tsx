import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import apiService from '../api/clients'

interface Health {
    idle: number
    status: string
}

export const Route = createFileRoute('/about')({
    component: About,
})

function About() {
    const { data, isLoading } = useQuery({
        queryKey: ['health'],
        queryFn: (): Promise<Health> => {
            return apiService.get('health', {}).json()
        },
    })
    return (
        <div>
            Hello from "About"
            <br />
            {isLoading && 'loadig ..'}
            {data?.status}
            <br />
            {data?.idle}
        </div>
    )
}
