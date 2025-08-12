"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

export default function CalendarPage() {
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)

    // Ajuster pour commencer le lundi
    const dayOfWeek = firstDay.getDay()
    startDate.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

    const days = []
    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000))
    }
    return days
  }

  const days = getDaysInMonth()
  const today = new Date()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête simple */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Tableau de bord
              </Link>
              <Link href="/races" className="text-gray-600 hover:text-gray-900">
                Mes courses
              </Link>
              <span className="text-blue-600 font-medium">Calendrier</span>
            </nav>
          </div>
          <Button asChild>
            <Link href="/races/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle course
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Navigation du calendrier */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <Button variant="outline" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendrier simple */}
        <div className="bg-white rounded-lg border shadow-sm">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth()
              const isToday = day.toDateString() === today.toDateString()

              return (
                <div
                  key={index}
                  className={`h-24 p-2 border-r border-b last:border-r-0 ${
                    isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${isToday ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  <div
                    className={`text-sm ${
                      isCurrentMonth ? (isToday ? "text-blue-600 font-semibold" : "text-gray-900") : "text-gray-400"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500">
          <p>Vue calendrier pour vos courses cyclistes</p>
        </div>
      </div>
    </div>
  )
}
