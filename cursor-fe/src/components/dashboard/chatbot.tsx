import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, X, ImagePlus } from 'lucide-react'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<
    Array<{ type: 'user' | 'bot'; content: string; image?: string }>
  >([])
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setSelectedImage(file)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload image to dedicated webhook
  const handleImageUpload = async (file: File): Promise<string> => {
    const imageWebhookUrl = import.meta.env.VITE_IMAGE_WEBHOOK_URL
    if (!imageWebhookUrl) {
      throw new Error('Image webhook URL is not defined')
    }

    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(imageWebhookUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Image upload failed with status ${response.status}`)
    }

    const data = await response.json()
    // Return image URL or processed result from webhook
    return String(
      data?.imageUrl || data?.output || 'Image uploaded successfully',
    )
  }

  // Submit chat with optional image
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if ((!prompt.trim() && !selectedImage) || isLoading) {
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Message content
      const messageContent = selectedImage
        ? `[Image uploaded] ${prompt || '(no text description)'}`
        : prompt

      setMessages((prev) => [
        ...prev,
        {
          type: 'user',
          content: messageContent,
          image: imagePreview || undefined,
        },
      ])

      const currentPrompt = prompt
      const currentImage = selectedImage

      setPrompt('')
      handleRemoveImage()

      // If there's an image, upload it first to image webhook
      if (currentImage) {
        try {
          const imageResult = await handleImageUpload(currentImage)
          console.log('Image upload result:', imageResult)

          // Add image processing result to messages
          setMessages((prev) => [
            ...prev,
            { type: 'bot', content: imageResult },
          ])
        } catch (imageErr) {
          const errorMessage =
            imageErr instanceof Error ? imageErr.message : 'Image upload failed'
          setError(errorMessage)
          console.error('Image upload error:', imageErr)
          setIsLoading(false)
          return
        }
      }

      // If there's a text prompt, send to chat webhook
      if (currentPrompt.trim()) {
        const webhookUrl = import.meta.env.VITE_WEBHOOK_URL
        if (!webhookUrl) {
          throw new Error('Chat webhook URL is not defined')
        }

        const formData = new FormData()
        formData.append('prompt', currentPrompt.trim())

        const response = await fetch(webhookUrl, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Chat request failed with status ${response.status}`)
        }

        const data = await response.json()
        const resultText = String(data?.output || 'No response from webhook')

        setMessages((prev) => [...prev, { type: 'bot', content: resultText }])
        console.log('Chat webhook result:', data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error:', err)
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
              <p className="text-xs text-muted-foreground">
                AI-powered prompt engineering
              </p>
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
          <div className="border-t border-border p-4 space-y-3">
            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block w-full">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-32 object-cover rounded-md border border-border"
                />
                <button
                  onClick={handleRemoveImage}
                  type="button"
                  className="absolute top-1 right-1 bg-destructive/80 hover:bg-destructive text-white p-1 rounded transition-colors"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder="Enter your prompt... (or just upload an image)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="resize-none"
              />

              {/* Image Upload Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isLoading}
                className="hidden"
                title="Upload image"
                aria-label="Upload image"
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-10 h-10 rounded-full border border-border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
                  title="Upload image"
                  aria-label="Upload image"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>
                <Button
                  type="submit"
                  disabled={isLoading || (!prompt.trim() && !selectedImage)}
                  className="flex-1"
                  size="sm"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
