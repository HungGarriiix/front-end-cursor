"use client"

import { useMemo } from "react"
import { Coffee, ShoppingCart, Wallet, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSpendings } from "@/hooks/use-spendings"

interface RecentTransactionsProps {
  date: Date
}

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
  const { transactions, isLoading, error } = useSpendings()
  const dateStr = date.toISOString().split("T")[0]

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const transactionDate = t.date.split("T")[0]
      return transactionDate === dateStr
    })
  }, [transactions, dateStr])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-6">Loading transactions...</p>
        ) : error ? (
          <p className="text-sm text-destructive text-center py-6">Error: {error}</p>
        ) : filteredTransactions.length === 0 ? (
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
