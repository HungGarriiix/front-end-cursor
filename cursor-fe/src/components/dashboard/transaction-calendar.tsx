"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TransactionCalendarProps {
  onSelectDate: (date: Date) => void
}

// Mock transaction data
const mockTransactions: { [key: string]: number } = {
  "2025-01-05": 3,
  "2025-01-08": 1,
  "2025-01-12": 2,
  "2025-01-15": 4,
  "2025-01-18": 1,
  "2025-01-22": 2,
  "2025-01-25": 3,
}

export function TransactionCalendar({ onSelectDate }: TransactionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const hasTransactions = (day: number) => {
    return !!mockTransactions[formatDate(day)]
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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    onSelectDate(newDate)
  }

  const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction Calendar</CardTitle>
            <CardDescription>View payments and purchases marked with red dots</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-32 text-center">{monthName}</span>
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
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground h-8">
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
                    className="w-full h-12 rounded bg-card hover:bg-secondary border border-border relative flex items-center justify-center font-medium text-sm transition-colors"
                  >
                    {day}
                    {hasTransactions(day) && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
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
