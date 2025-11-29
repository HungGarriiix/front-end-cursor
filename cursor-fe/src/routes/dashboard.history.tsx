import { createFileRoute } from '@tanstack/react-router'
import { AllTransactions } from '@/components/dashboard/all-transactions'

export const Route = createFileRoute('/dashboard/history')({
  component: HistoryPage,
})

function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Transaction History</h1>
          <p className="text-gray-400">View all your past transactions</p>
        </div>
        <AllTransactions />
      </div>
    </div>
  )
}
