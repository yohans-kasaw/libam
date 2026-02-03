export interface HealthResponse {
    idle: number
    in_use: number
    max_idle_closed: number
    max_lifetime_closed: number
    open_connections: number
    status: string
    user_id: string
    wait_count: number
    wait_duration: string
}
