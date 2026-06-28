import { apiClient } from './client'
import { useAuthStore } from '@/stores/auth-store'

export async function requestMagicLink(email: string) {
  const { data, error } = await apiClient.POST('/api/v1/magic-login', {
    body: { email },
  })
  if (error) throw error
  return data
}

export async function verifyMagicToken(token: string) {
  const { data, error } = await apiClient.POST('/api/v1/auth/verify', {
    body: { token },
  })
  if (error) throw error
  useAuthStore.getState().setSession(data.access_token, data.expires_at)
  return data
}

export function logout() {
  useAuthStore.getState().clear()
}
