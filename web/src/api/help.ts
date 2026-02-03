import apiService from './client'
import type { HealthResponse } from '@/types/helpDto'

export async function getHealth(): Promise<HealthResponse> {
    await new Promise(resolve => setTimeout(resolve, 3000))
    const res = await apiService.get('api/health', {})
    return res.json<HealthResponse>()
}
