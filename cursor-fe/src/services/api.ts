/**
 * API Client Configuration
 * Base configuration and utilities for all API calls
 */

export interface ApiConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
}

export interface ApiError extends Error {
  status?: number
  data?: unknown
}

/**
 * Get the base API URL from environment variables
 * Falls back to window.location.origin if not defined
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || window.location.origin
}

/**
 * Create an error with additional context
 */
export function createApiError(
  message: string,
  status?: number,
  data?: unknown,
): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  error.data = data
  return error
}

/**
 * Make a generic API request with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: unknown
    headers?: Record<string, string>
  },
): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`

  const fetchOptions: RequestInit = {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }

  if (options?.body) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = null
    }
    throw createApiError(
      `API request failed: ${response.statusText}`,
      response.status,
      errorData,
    )
  }

  return response.json() as Promise<T>
}
