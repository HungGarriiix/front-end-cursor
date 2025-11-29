import { useState, useEffect } from 'react'

export interface Transaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

export function useSpendings(skip = 0, limit = 100) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpendings = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/spendings?skip=${skip}&limit=${limit}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setTransactions(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch spendings'
        setError(errorMessage)
        console.error('Error fetching spendings:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpendings()
  }, [skip, limit])

  return { transactions, isLoading, error }
}

