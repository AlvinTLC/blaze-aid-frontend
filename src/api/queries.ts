import { queryOptions, keepPreviousData } from '@tanstack/react-query'
import { apiClient } from './client'
import type { operations } from './schema'

/* ------------------------------------------------------------------ */
/* Dashboard stats                                                     */
/* ------------------------------------------------------------------ */

export const statsQuery = queryOptions({
  queryKey: ['stats'] as const,
  queryFn: async () => {
    const { data, error } = await apiClient.GET('/api/v1/stats', {})
    if (error) throw error
    return data.data
  },
})

/* ------------------------------------------------------------------ */
/* List query factories (type-safe from the OpenAPI schema)           */
/* ------------------------------------------------------------------ */

type QueryOf<Op extends keyof operations> = NonNullable<
  operations[Op]['parameters']['query']
>

export function projectsQuery(query: QueryOf<'list-projects'>) {
  return queryOptions({
    queryKey: ['projects', query] as const,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/v1/projects', {
        params: { query },
      })
      if (error) throw error
      return data
    },
    placeholderData: keepPreviousData,
  })
}

export function resourcesQuery(query: QueryOf<'list-resources'>) {
  return queryOptions({
    queryKey: ['resources', query] as const,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/v1/resources', {
        params: { query },
      })
      if (error) throw error
      return data
    },
    placeholderData: keepPreviousData,
  })
}

export function volunteersQuery(query: QueryOf<'list-volunteers'>) {
  return queryOptions({
    queryKey: ['volunteers', query] as const,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/v1/volunteers', {
        params: { query },
      })
      if (error) throw error
      return data
    },
    placeholderData: keepPreviousData,
  })
}

export function missingQuery(query: QueryOf<'list-missing'>) {
  return queryOptions({
    queryKey: ['missing', query] as const,
    queryFn: async () => {
      const { data, error } = await apiClient.GET('/api/v1/missing', {
        params: { query },
      })
      if (error) throw error
      return data
    },
    placeholderData: keepPreviousData,
  })
}
