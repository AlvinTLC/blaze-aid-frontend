import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './schema'
import { useAuthStore } from '@/stores/auth-store'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://blaze-aid-backend.fly.dev'

export const apiClient = createClient<paths>({ baseUrl: API_BASE_URL })

/** Injects `Authorization: Bearer <jwt>` when a session is present. */
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = useAuthStore.getState().accessToken
    if (token) request.headers.set('Authorization', `Bearer ${token}`)
    return request
  },
}

apiClient.use(authMiddleware)

export default apiClient
