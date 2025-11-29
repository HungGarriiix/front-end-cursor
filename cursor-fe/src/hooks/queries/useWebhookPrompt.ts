/**
 * Webhook Query Hooks
 * Custom React Query hooks for webhook interactions
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitPromptToWebhook } from '@/services/webhook'

/**
 * Hook for submitting a prompt to the webhook
 * Returns mutation functions and state for prompt submission
 */
export function useWebhookPrompt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (prompt: string) => {
      if (!prompt.trim()) {
        throw new Error('Prompt cannot be empty')
      }
      return submitPromptToWebhook(prompt)
    },
    onSuccess: () => {
      // Invalidate any cached webhook data if needed
      queryClient.invalidateQueries({ queryKey: ['webhook'] })
    },
    onError: (error) => {
      console.error('Webhook prompt error:', error)
    },
  })
}
