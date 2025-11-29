import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TransactionCalendar } from '@/components/dashboard/transaction-calendar'
import { RecentTransactions } from '@/components/dashboard/recent-transaction'

export const Route = createFileRoute('/dashboard/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  useEffect(() => {
    const callWebhook = async () => {
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL
      
      if (!webhookUrl) {
        console.error('Webhook URL is not defined in environment variables')
        return
      }

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: 'Hello from dashboard'
          }),
        })

        const result = await response.json()
        console.log('Webhook result:', result)
      } catch (error) {
        console.error('Webhook error:', error)
      }
    }

    callWebhook()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <TransactionCalendar onSelectDate={handleDateSelect} />
        <RecentTransactions date={selectedDate} />
      </div>
    </div>
  )
}
