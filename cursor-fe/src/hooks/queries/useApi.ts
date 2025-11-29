/**
 * API Query Hooks
 * Custom React Query hooks for generic API interactions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiRequest, ApiError } from '@/services/api'

/**
 * Generic hook for fetching data with React Query
 * Handles loading, error, and success states automatically
 *
 * @example
 * const { data, isLoading, error } = useApiQuery('users', '/api/users')
 */
export function useApiQuery<T>(
  queryKey: string | string[],
  endpoint: string,
  options?: {
    enabled?: boolean
    staleTime?: number
    gcTime?: number
  },
) {
  return useQuery<T, ApiError>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => apiRequest<T>(endpoint),
    enabled: options?.enabled !== false,
    staleTime: options?.staleTime || 1000 * 60 * 5, // 5 minutes default
    gcTime: options?.gcTime || 1000 * 60 * 10, // 10 minutes default
  })
}

/**
 * Generic hook for mutations (POST, PUT, DELETE, PATCH)
 * Handles loading, error, and success states automatically
 *
 * @example
 * const mutation = useApiMutation('users', '/api/users', 'POST')
 * mutation.mutate({ name: 'John' })
 */
export function useApiMutation<TData, TError = ApiError>(
  queryKey: string | string[],
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: TError) => void
  },
) {
  const queryClient = useQueryClient()

  return useMutation<TData, TError, unknown>({
    mutationFn: (body) =>
      apiRequest<TData>(endpoint, {
        method,
        body,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
      })
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      console.error(`API ${method} error:`, error)
      options?.onError?.(error)
    },
  })
}
