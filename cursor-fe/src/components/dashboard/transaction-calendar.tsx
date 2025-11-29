'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSpendings } from '@/hooks/queries/useSpendings'

interface TransactionCalendarProps {
  onSelectDate: (date: Date) => void
}

export function TransactionCalendar({
  onSelectDate,
}: TransactionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { data: spendings = [], isLoading } = useSpendings()

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  // Create a map of dates to transaction counts from real data
  const getTransactionCountsByDate = () => {
    const counts: { [key: string]: number } = {}
    spendings.forEach((spending) => {
      // Extract just the date part (YYYY-MM-DD) from the ISO string
      // This avoids timezone conversion issues
      const dateKey = spending.date.split('T')[0]
      counts[dateKey] = (counts[dateKey] || 0) + 1
    })
    return counts
  }

  const transactionCounts = getTransactionCountsByDate()

  const hasTransactions = (day: number) => {
    // Format the date to match the format from API (YYYY-MM-DD)
    const dateStr = formatDate(day)
    return !!transactionCounts[dateStr]
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    )
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    )
    onSelectDate(newDate)
  }

  const today = new Date()
  const isCurrentMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth()
  const currentDay = today.getDate()

  const monthName = currentDate.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction Calendar</CardTitle>
            <CardDescription>
              View payments and purchases marked with red dots
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-32 text-center">
              {monthName}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-muted-foreground h-8"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index}>
                {day === null ? (
                  <div className="h-12 bg-muted/30 rounded" />
                ) : (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-12 rounded font-medium text-sm transition-colors relative flex items-center justify-center border ${
                      isCurrentMonth && day === currentDay
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card hover:bg-secondary border-border'
                    }`}
                  >
                    {day}
                    {hasTransactions(day) && (
                      <div
                        className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                          isCurrentMonth && day === currentDay
                            ? 'bg-primary-foreground'
                            : 'bg-destructive'
                        }`}
                      />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
