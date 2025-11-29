import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function WebhookPrompt() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim() || isLoading) {
      return
    }

    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL

    if (!webhookUrl) {
      setError('Webhook URL is not defined in environment variables')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
      console.log('Webhook result:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Webhook error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Prompt</CardTitle>
        <CardDescription>
          Enter your prompt and send it to the webhook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Prompt'}
          </Button>
        </form>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive font-medium">Error</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <Label>Result</Label>
            <div className="rounded-md bg-muted border p-4">
              <pre className="text-sm overflow-auto whitespace-pre-wrap break-words">
                {result}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

