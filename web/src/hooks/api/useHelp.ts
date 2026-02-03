import { useQuery } from '@tanstack/react-query'
import { getHealth } from '@/api/help'
import type { HealthResponse } from '@/types/helpDto'

export function useHealthQuery() {
    return useQuery<HealthResponse, Error>({
        queryKey: ['api/health'],
        queryFn: getHealth,
    })
}
