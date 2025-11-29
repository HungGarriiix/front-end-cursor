import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/services/api'

export interface Spending {
  id: string
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

export function useSpendings() {
  return useQuery({
    queryKey: ['spendings'],
    queryFn: async () => {
      const data = await apiRequest<Spending[]>('/spendings?skip=0&limit=100', {
        method: 'GET',
      })
      return data
    },
  })
}
