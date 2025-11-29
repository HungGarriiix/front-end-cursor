import { createFileRoute } from '@tanstack/react-router'
import { TransactionCalendar } from '@/components/dashboard/transaction-calendar'

export const Route = createFileRoute('/dashboard/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <TransactionCalendar onSelectDate={handleDateSelect} />
      </div>
    </div>
  )
}
