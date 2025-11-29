# Environment Setup Guide

This document explains how to set up environment variables for the Cursor Hackathon frontend application, specifically for webhook and API integrations.

## Environment Files

- `.env.local` - Local environment variables (not committed to git)
- `.env.example` - Template showing required variables (committed to git)

## Required Variables

### Webhook Configuration

```env
# Webhook URL for AI chatbot
# The webhook should accept POST requests with a JSON body: { "prompt": string }
# Expected response: { "output": string }
VITE_WEBHOOK_URL=https://your-webhook-domain.com/api/webhook
```

**Example Webhook Implementation:**

- Should accept POST requests
- Request body: `{ "prompt": "user input" }`
- Response body: `{ "output": "AI response" }`
- The response supports escape sequences: `\n`, `\t`, `\r`, `\'`, `\"`, `\\` (these are automatically processed)

### API Configuration (Optional)

```env
# Base URL for general API requests
# If not provided, defaults to the current domain (window.location.origin)
VITE_API_BASE_URL=https://your-api-domain.com
```

## Setup Instructions

### 1. Create `.env.local` file

Copy the `.env.example` file to `.env.local` in the `cursor-fe` directory:

```bash
cp .env.example .env.local
```

### 2. Configure Variables

Edit `.env.local` and replace the placeholder values with your actual endpoints:

```env
VITE_WEBHOOK_URL=https://your-webhook-url.com/webhook
VITE_API_BASE_URL=https://your-api-url.com
```

### 3. Access in Code

All Vite environment variables are accessed via `import.meta.env`:

```typescript
// In any TypeScript/JavaScript file
const webhookUrl = import.meta.env.VITE_WEBHOOK_URL
const apiBase = import.meta.env.VITE_API_BASE_URL

// Or use the helper functions
import { getWebhookUrl, getApiBaseUrl } from '@/services'

const url = getWebhookUrl() // Throws error if not defined
const baseUrl = getApiBaseUrl() // Returns URL or falls back to origin
```

## Using TanStack Query with Webhooks

### Webhook Hook Example

```typescript
import { useWebhookPrompt } from '@/hooks/queries'

function MyComponent() {
  const { mutate, isLoading, error, data } = useWebhookPrompt()

  const handleSubmit = async (prompt: string) => {
    mutate(prompt, {
      onSuccess: (response) => {
        console.log('Response:', response)
      },
      onError: (error) => {
        console.error('Error:', error)
      },
    })
  }

  return (
    <div>
      <button onClick={() => handleSubmit('Hello')}>
        {isLoading ? 'Loading...' : 'Send'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Response: {data}</p>}
    </div>
  )
}
```

### Generic API Hook Example

```typescript
import { useApiQuery, useApiMutation } from '@/hooks/queries'

// Fetching data
function GetData() {
  const { data, isLoading, error } = useApiQuery('users', '/api/users')
  return <div>{isLoading ? 'Loading...' : JSON.stringify(data)}</div>
}

// Mutating data
function CreateUser() {
  const mutation = useApiMutation('users', '/api/users', 'POST')

  return (
    <button
      onClick={() =>
        mutation.mutate({ name: 'John Doe' }, {
          onSuccess: () => alert('User created!'),
        })
      }
    >
      {mutation.isPending ? 'Creating...' : 'Create User'}
    </button>
  )
}
```

## File Structure

```
src/
├── services/              # API and webhook service implementations
│   ├── api.ts            # Generic API client
│   ├── webhook.ts        # Webhook-specific service
│   └── index.ts          # Service exports
├── hooks/
│   └── queries/          # TanStack Query custom hooks
│       ├── useWebhookPrompt.ts   # Webhook mutation hook
│       ├── useApi.ts             # Generic API hooks
│       └── index.ts              # Hook exports
└── components/
    └── dashboard/
        └── chatbot.tsx   # Chatbot component using hooks
```

## Services Overview

### `api.ts` - Generic API Client

Provides:

- `getApiBaseUrl()` - Get base URL from env or use origin
- `apiRequest<T>()` - Generic fetch wrapper with error handling
- `createApiError()` - Create typed API errors

### `webhook.ts` - Webhook Service

Provides:

- `getWebhookUrl()` - Get webhook URL from env
- `submitPromptToWebhook()` - Send prompt to webhook
- `processEscapeSequences()` - Parse escape sequences in responses

## Query Hooks Overview

### `useWebhookPrompt()` - Webhook Mutation

```typescript
const {
  mutate, // Function to trigger mutation
  isPending, // boolean - loading state
  error, // Error or null
  data, // Response string or undefined
} = useWebhookPrompt()
```

### `useApiQuery<T>()` - Data Fetching

```typescript
const {
  data, // Fetched data of type T
  isLoading, // boolean - loading state
  error, // Error or null
  refetch, // Function to manually refetch
} = useApiQuery('key', '/api/endpoint')
```

### `useApiMutation<TData, TError>()` - Data Mutation

```typescript
const {
  mutate, // Function to trigger mutation
  mutateAsync, // Async version of mutate
  isPending, // boolean - loading state
  error, // Error or null
  data, // Response data of type TData
} = useApiMutation('key', '/api/endpoint', 'POST')
```

## Error Handling

All services throw errors with detailed messages:

```typescript
import { ApiError, submitPromptToWebhook } from '@/services'

try {
  const response = await submitPromptToWebhook('prompt')
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
    // "Webhook URL is not defined in environment variables"
    // "Webhook request failed with status 500"
    // "Webhook response does not contain an \"output\" field"
  }
}
```

## Common Issues

### "VITE_WEBHOOK_URL is not defined"

**Solution:** Add `VITE_WEBHOOK_URL` to `.env.local`

### Webhook returns undefined/empty response

**Ensure your webhook returns proper JSON:**

```json
{
  "output": "Your response text"
}
```

### TypeScript errors with import.meta.env

**Add this to `vite-env.d.ts`:**

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_WEBHOOK_URL: string
  VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## Development vs Production

In development, use:

```env
# .env.local (development)
VITE_WEBHOOK_URL=http://localhost:8000/webhook
VITE_API_BASE_URL=http://localhost:3001/api
```

In production, use the actual deployed URLs:

```env
# Set via CI/CD environment variables
VITE_WEBHOOK_URL=https://api.production.com/webhook
VITE_API_BASE_URL=https://api.production.com
```
