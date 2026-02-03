import { useAuthStore } from '@/store/authStore';
import ky from 'ky'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) {
    throw new Error("Missing VITE_API_BASE_URL environment variable!");
}

const api = ky.create({
    prefixUrl: API_BASE_URL,
    timeout: 10000,
    hooks: {
        beforeRequest: [
            (request) => {
                const token = useAuthStore.getState().access_token
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`)
                }
            },
        ],
    },
})

export default api
