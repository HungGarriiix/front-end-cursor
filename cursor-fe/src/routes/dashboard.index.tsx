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

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndex,
})

function DashboardIndex() {
  const { user } = useAuth()
  const today = new Date()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Welcome back, {user?.name || 'User'}!
            </CardTitle>
            <CardDescription>Here's your financial overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-white mt-2">$12,450.00</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  +$2,340.50
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Last Transaction</p>
                <p className="text-2xl font-bold text-white mt-2">Just now</p>
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
