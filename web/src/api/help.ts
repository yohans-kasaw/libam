import apiService from './client'
import type { HealthResponse } from '@/types/helpDto'

export async function getDbStat(): Promise<HealthResponse> {
    const res = await apiService.get('api/db-stat', {})
    return res.json<HealthResponse>()
}
