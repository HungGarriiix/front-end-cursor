import { useState, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/imagescan')({
  component: ImageScanPage,
})

function ImageScanPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
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
      setScanResult(null)
      setSuccessMessage(null)

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
    setError(null)
    setScanResult(null)
    setSuccessMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setError(null)
    setIsLoading(true)
    setScanResult(null)

    try {
      const imageFormData = new FormData()
      imageFormData.append('image', selectedImage)

      const imageWebhookUrl = import.meta.env.VITE_IMAGE_WEBHOOK_URL
      if (!imageWebhookUrl) {
        throw new Error('Image Webhook URL is not defined')
      }

      const imageResponse = await fetch(imageWebhookUrl, {
        method: 'POST',
        body: imageFormData,
      })

      if (!imageResponse.ok) {
        throw new Error(
          `Image upload failed with status ${imageResponse.status}`,
        )
      }

      const data = await imageResponse.json()

      // Extract analyzed data from webhook response
      // Try multiple possible response fields: output, result, analysis, data, message
      let resultText =
        data?.output ||
        data?.result ||
        data?.analysis ||
        data?.data ||
        data?.message ||
        JSON.stringify(data, null, 2)

      // If result is an object, convert to formatted JSON
      if (typeof resultText === 'object') {
        resultText = JSON.stringify(resultText, null, 2)
      }

      setScanResult(String(resultText))
      setSuccessMessage('Image scanned and processed successfully!')
      console.log('Image scan result:', data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Image scan error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Image Scan</h1>
        <p className="text-muted-foreground">
          Upload an image to scan and process it with AI
        </p>
      </div>

      {/* Main Card */}
      <Card className="p-8">
        <div className="space-y-6">
          {/* Upload Area */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Select Image
            </h2>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground mb-1">
                  Click to upload or drag and drop
                </h3>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative inline-block w-full">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full max-h-96 object-contain rounded-lg border border-border"
                />
                <button
                  onClick={handleRemoveImage}
                  type="button"
                  className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive text-white p-2 rounded-full transition-colors"
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              title="Upload image"
              aria-label="Upload image"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-md bg-green-500/10 border border-green-500/20 p-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">
                    Success
                  </p>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scan Result */}
          {scanResult && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Scan Result</h3>
              <div className="bg-muted p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                  {scanResult}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {imagePreview && (
              <>
                <Button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="flex-1"
                  size="lg"
                >
                  {isLoading ? 'Scanning...' : 'Scan Image'}
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                >
                  Choose Another
                </Button>
              </>
            )}

            {!imagePreview && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Select Image
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Info Section */}
      <Card className="mt-8 p-6 bg-muted/50">
        <h3 className="font-semibold text-foreground mb-3">How it works</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-semibold">1.</span>
            <span>Upload an image from your device</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-semibold">2.</span>
            <span>Click "Scan Image" to process the image</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-semibold">3.</span>
            <span>View the scan results below</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
