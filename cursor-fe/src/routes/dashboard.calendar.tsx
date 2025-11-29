import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { TransactionCalendar } from '@/components/dashboard/transaction-calendar'
import { RecentTransactions } from '@/components/dashboard/recent-transaction'

export const Route = createFileRoute('/dashboard/calendar')({
  component: CalendarPage,
})

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Calendar</h1>
          <p className="text-gray-400">View your transactions by date</p>
        </div>
        <TransactionCalendar onSelectDate={handleDateSelect} />
        <RecentTransactions date={selectedDate} />
      </div>
    </div>
  )
}
