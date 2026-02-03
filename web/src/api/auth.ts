import apiService from './client'
import type { LoginResponse, LoginDto } from '@/types/authDto'

export async function loginWithPassword(body: LoginDto): Promise<LoginResponse> {
    const res = await apiService.post("auth/login", {
        json: body
    })
    return res.json<LoginResponse>()
}
