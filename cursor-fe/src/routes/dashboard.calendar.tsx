import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { TransactionCalendar } from '@/components/dashboard/transaction-calendar'
import { RecentTransactions } from '@/components/dashboard/recent-transaction'
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard/calendar')({
  component: CalendarPage,
})

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">Calendar</h1>
            <p className="text-gray-400">View your transactions by date</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
        <TransactionCalendar
          onSelectDate={handleDateSelect}
          selectedDate={selectedDate}
        />
        <RecentTransactions date={selectedDate} />
        <AddTransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </div>
  )
}
