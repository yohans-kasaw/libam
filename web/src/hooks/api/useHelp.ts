import { useQuery } from '@tanstack/react-query'
import { getDbStat } from '../../api/help'
import type { HealthResponse } from '@/types/helpDto'

export function useHealthQuery() {
    return useQuery<HealthResponse, Error>({
        queryKey: ['api/db-stat'],
        queryFn: getDbStat,
    })
}
