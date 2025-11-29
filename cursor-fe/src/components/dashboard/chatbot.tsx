import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, X } from 'lucide-react'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<
    Array<{ type: 'user' | 'bot'; content: string }>
  >([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim() || isLoading) {
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const currentPrompt = prompt

      // Display user message
      setMessages((prev) => [
        ...prev,
        {
          type: 'user',
          content: currentPrompt,
        },
      ])

      setPrompt('')

      // Send text prompt to chat webhook
      const chatWebhookUrl = import.meta.env.VITE_WEBHOOK_URL
      if (!chatWebhookUrl) {
        throw new Error('Chat Webhook URL is not defined')
      }

      const chatFormData = new FormData()
      chatFormData.append('prompt', currentPrompt.trim())

      const chatResponse = await fetch(chatWebhookUrl, {
        method: 'POST',
        body: chatFormData,
      })

      if (!chatResponse.ok) {
        throw new Error(
          `Chat webhook request failed with status ${chatResponse.status}`,
        )
      }

      const data = await chatResponse.json()
      const resultText = String(data?.output || 'No response from webhook')

      setMessages((prev) => [...prev, { type: 'bot', content: resultText }])
      console.log('Chat webhook result:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Webhook error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open chat assistant"
          aria-label="Open chat assistant"
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border border-border rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-card-foreground">
                Chat Assistant
              </h3>
              <p className="text-xs text-muted-foreground">AI-powered chat</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                setPrompt('')
                setError(null)
                setMessages([])
              }}
              title="Close chat"
              aria-label="Close chat"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center">
                <div className="text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start a conversation</p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-muted-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-xs text-destructive font-medium">Error</p>
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder="Enter your message..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="resize-none"
              />

              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full"
                size="sm"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
