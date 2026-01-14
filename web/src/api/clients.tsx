import ky from 'ky'

const api = ky.create({
    prefixUrl: 'http://localhost:8080/api',
    hooks: {
        beforeRequest: [
            (request) => {
                const token = localStorage.getItem('access_token')
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`)
                }
            },
        ],
    },
})

export default api
