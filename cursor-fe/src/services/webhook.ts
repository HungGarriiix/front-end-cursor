/**
 * Webhook Service
 * Handles all webhook-related API calls for the chatbot
 */

export interface WebhookRequest {
  prompt: string
}

export interface WebhookResponse {
  output: string
  [key: string]: unknown
}

/**
 * Get the webhook URL from environment variables
 * @throws Error if VITE_WEBHOOK_URL is not defined
 */
export function getWebhookUrl(): string {
  const url = import.meta.env.VITE_WEBHOOK_URL
  if (!url) {
    throw new Error(
      'Webhook URL is not defined in environment variables (VITE_WEBHOOK_URL)',
    )
  }
  return url
}

/**
 * Process escape sequences in webhook response
 * Handles: \n, \t, \r, \', \", \\
 */
export function processEscapeSequences(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}

/**
 * Send a prompt to the webhook and get AI-generated response
 * @param prompt - The user's prompt to send to the webhook
 * @returns The processed webhook response
 * @throws Error if the webhook request fails or response is invalid
 */
export async function submitPromptToWebhook(prompt: string): Promise<string> {
  const webhookUrl = getWebhookUrl()

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt.trim(),
    } as WebhookRequest),
  })

  if (!response.ok) {
    throw new Error(`Webhook request failed with status ${response.status}`)
  }

  const data: WebhookResponse = await response.json()

  if (!data?.output) {
    throw new Error('Webhook response does not contain an "output" field')
  }

  const resultText = String(data.output)
  return processEscapeSequences(resultText)
}
