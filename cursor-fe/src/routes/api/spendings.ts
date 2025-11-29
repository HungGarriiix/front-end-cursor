import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/spendings')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const searchParams = url.searchParams
        const skip = searchParams.get('skip') || '0'
        const limit = searchParams.get('limit') || '100'

        try {
          const response = await fetch(
            `http://100.65.74.85:8000/spendings?skip=${skip}&limit=${limit}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          })
        } catch (error) {
          console.error('Error proxying spendings request:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch spendings' }),
            {
              status: 500,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          )
        }
      },
    },
  },
})

