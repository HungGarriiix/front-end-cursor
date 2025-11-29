import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TransactionCalendar } from '@/components/dashboard/transaction-calendar'
import { RecentTransactions } from '@/components/dashboard/recent-transaction'
import { WebhookPrompt } from '@/components/dashboard/webhook-prompt'

export const Route = createFileRoute('/dashboard/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <WebhookPrompt />
        <TransactionCalendar onSelectDate={handleDateSelect} />
        <RecentTransactions date={selectedDate} />
      </div>
    </div>
  )
}
