'use client'

import { useMemo } from 'react'
import { Coffee, ShoppingCart, Wallet, Zap } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSpendings } from '@/hooks/queries/useSpendings'

const categoryIcons: { [key: string]: any } = {
  shopping: ShoppingCart,
  food: Coffee,
  transport: Zap,
  entertainment: Wallet,
  healthcare: Wallet,
  education: Wallet,
  'personal care': Wallet,
  miscellaneous: Wallet,
  bills: Wallet,
  travel: Wallet,
}

export function AllTransactions() {
  const { data: spendings = [], isLoading } = useSpendings()

  // Sort transactions by date (newest first)
  const sortedTransactions = useMemo(() => {
    return [...spendings].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  }, [spendings])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof spendings } = {}
    sortedTransactions.forEach((transaction) => {
      const dateKey = transaction.date.split('T')[0]
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(transaction)
    })
    return groups
  }, [sortedTransactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>
          Complete history of all your transactions ({spendings.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Loading transactions...
          </p>
        ) : sortedTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No transactions found
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(
              ([dateKey, transactions]) => (
                <div key={dateKey} className="space-y-3">
                  {/* Date Header */}
                  <div className="sticky top-0 bg-card/50 backdrop-blur-sm py-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      {new Date(dateKey + 'T00:00:00').toLocaleDateString(
                        'en-US',
                        { month: 'long', day: 'numeric', year: 'numeric' },
                      )}
                    </h3>
                  </div>

                  {/* Transactions for this date */}
                  {transactions.map((transaction) => {
                    const categoryLower = transaction.category.toLowerCase()
                    const IconComponent = categoryIcons[categoryLower] || Wallet

                    return (
                      <div
                        key={transaction.id}
                        className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive flex-shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-card-foreground truncate">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.category}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleTimeString(
                              'en-US',
                              { hour: '2-digit', minute: '2-digit' },
                            )}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-foreground">
                            -${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
