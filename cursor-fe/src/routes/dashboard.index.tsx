import { createFileRoute } from '@tanstack/react-router'
import { RecentTransactions } from '@/components/dashboard/recent-transaction'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { useSpendings } from '@/hooks/queries/useSpendings'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndex,
})

function DashboardIndex() {
  const { user } = useAuth()
  const { data: spendings = [] } = useSpendings()
  const today = new Date()

  // Calculate total balance (sum of all spendings)
  const totalSpent = spendings.reduce(
    (sum, spending) => sum + spending.amount,
    0,
  )

  // Calculate this month's spending
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const thisMonthSpending = spendings
    .filter((spending) => {
      // Parse the spending date string to get year and month
      const [year, month] = spending.date.split('-')
      return (
        parseInt(month) === currentMonth + 1 && parseInt(year) === currentYear
      )
    })
    .reduce((sum, spending) => sum + spending.amount, 0)

  // Get last transaction
  const lastTransaction = spendings.length > 0 ? spendings[0] : null
  const lastTransactionTime = lastTransaction
    ? new Date(lastTransaction.date).toLocaleString()
    : 'No transactions'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Welcome back, {user?.name || 'User'}!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Here's your financial overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-white mt-2">
                  ${totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  ${thisMonthSpending.toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Last Transaction</p>
                <p className="text-2xl font-bold text-white mt-2 text-sm truncate">
                  {lastTransactionTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <RecentTransactions date={today} />
      </div>
    </div>
  )
}
