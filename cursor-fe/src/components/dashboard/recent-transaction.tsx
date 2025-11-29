"use client"

import { useMemo } from "react"
import { Coffee, ShoppingCart, Wallet, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

interface RecentTransactionsProps {
  date: Date
}

// Mock transaction data - matching backend response structure
const allTransactions: Array<Transaction> = [
  { id: "428121f7-371e-4d8f-af4f-7e14f445e19b", amount: 200, category: "food", description: "eat pizza with team", date: "2025-01-05T09:14:52.840000", created_at: "2025-01-05T16:15:13.681712" },
  { id: "6281ab98-f168-4fe1-9880-2cad6b1f7476", amount: 12.5, category: "Food", description: "Lunch at cafe", date: "2025-01-15T12:30:00", created_at: "2025-01-15T12:35:00" },
  { id: "25632021-cab5-4dd4-96f9-68749fcf8ef2", amount: 2.5, category: "Transport", description: "Bus ticket", date: "2025-01-15T08:30:00", created_at: "2025-01-15T08:35:00" },
  { id: "74485cbf-253f-4c91-903e-b74d3e9d1bf1", amount: 15, category: "Transport", description: "Uber ride", date: "2025-01-14T22:00:00", created_at: "2025-01-14T22:05:00" },
  { id: "3a1f2e3a-8ae2-49e4-b5e2-181da17dfa7c", amount: 45.8, category: "Food", description: "Grocery shopping", date: "2025-01-14T18:00:00", created_at: "2025-01-14T18:05:00" },
  { id: "1a766f58-5b96-462d-9684-24a0f6a4ac00", amount: 35, category: "Healthcare", description: "Pharmacy", date: "2025-01-14T10:00:00", created_at: "2025-01-14T10:05:00" },
  { id: "edf8d917-8321-4c29-9eb2-1ed5613cee31", amount: 45, category: "Entertainment", description: "Movie tickets", date: "2025-01-13T19:00:00", created_at: "2025-01-13T19:05:00" },
  { id: "4a8a6352-52d1-4604-a3a8-3b6682802df2", amount: 45, category: "Transport", description: "Gas refill", date: "2025-01-13T14:00:00", created_at: "2025-01-13T14:05:00" },
  { id: "78efbc56-9d83-49a2-9c49-82995e25d298", amount: 5.5, category: "Miscellaneous", description: "ATM fee", date: "2025-01-13T10:00:00", created_at: "2025-01-13T10:05:00" },
  { id: "e3ddf502-b977-4e9f-97ce-f4bd6035a7ac", amount: 8.99, category: "Food", description: "Coffee and pastry", date: "2025-01-13T09:15:00", created_at: "2025-01-13T09:20:00" },
  { id: "a85a9cda-ce30-44d6-8063-4921e1605be2", amount: 67.25, category: "Food", description: "Restaurant dinner", date: "2025-01-12T19:45:00", created_at: "2025-01-12T19:50:00" },
  { id: "96b2ab1c-cfd9-4bad-96cd-31a8388fd881", amount: 28.99, category: "Personal Care", description: "Haircut", date: "2025-01-12T15:00:00", created_at: "2025-01-12T15:05:00" },
  { id: "100839c1-96c7-46b7-a1f5-cd1670f8d02e", amount: 34.99, category: "Shopping", description: "Books", date: "2025-01-12T11:00:00", created_at: "2025-01-12T11:05:00" },
  { id: "0dfd5175-9305-48de-b072-7e5d4baaebf8", amount: 8.5, category: "Transport", description: "Train ticket", date: "2025-01-12T07:15:00", created_at: "2025-01-12T07:20:00" },
  { id: "dda75b4e-7f85-47e1-ac0f-2be397556c3a", amount: 12, category: "Transport", description: "Taxi", date: "2025-01-11T20:30:00", created_at: "2025-01-11T20:35:00" },
  { id: "fbb7c552-ac92-4418-aeaf-2cff7e051921", amount: 25, category: "Entertainment", description: "Bowling", date: "2025-01-11T18:00:00", created_at: "2025-01-11T18:05:00" },
  { id: "1684eb0b-99e5-4d1e-93c0-e9618400be78", amount: 23.4, category: "Food", description: "Fast food", date: "2025-01-11T13:20:00", created_at: "2025-01-11T13:25:00" },
  { id: "8ecdf79b-4110-4303-b6de-4620864eba0f", amount: 45, category: "Education", description: "Books", date: "2025-01-11T12:00:00", created_at: "2025-01-11T12:05:00" },
  { id: "703a1047-ac20-486a-8e78-d802008c4293", amount: 89.5, category: "Food", description: "Weekly groceries", date: "2025-01-10T16:30:00", created_at: "2025-01-10T16:35:00" },
  { id: "75d7005a-bafc-4e72-93cc-8e541edc6834", amount: 89.99, category: "Shopping", description: "New shoes", date: "2025-01-10T15:00:00", created_at: "2025-01-10T15:05:00" },
  { id: "7922c05a-8c6c-4968-afd2-4e1db3ae6f34", amount: 150, category: "Healthcare", description: "Doctor visit", date: "2025-01-10T14:00:00", created_at: "2025-01-10T14:05:00" },
  { id: "75dfe35e-3bcd-4ae9-8c2d-5fda150a1fe1", amount: 3, category: "Transport", description: "Subway pass", date: "2025-01-10T09:00:00", created_at: "2025-01-10T09:05:00" },
]

const categoryIcons: { [key: string]: any } = {
  shopping: ShoppingCart,
  food: Coffee,
  transport: Zap,
  entertainment: Wallet,
  healthcare: Wallet,
  education: Wallet,
  "personal care": Wallet,
  miscellaneous: Wallet,
  bills: Wallet,
  travel: Wallet,
}

export function RecentTransactions({ date }: RecentTransactionsProps) {
  const dateStr = date.toISOString().split("T")[0]

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const transactionDate = t.date.split("T")[0]
      return transactionDate === dateStr
    })
  }, [dateStr])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No transactions on this date</p>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const categoryLower = transaction.category.toLowerCase()
              const IconComponent = categoryIcons[categoryLower] || Wallet

              return (
                <div key={transaction.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-card-foreground truncate">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.category}</p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap text-foreground">
                    -${transaction.amount.toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
