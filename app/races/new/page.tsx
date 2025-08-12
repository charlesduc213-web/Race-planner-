"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { createRace, type Race } from "@/lib/races"
import { RaceForm } from "@/components/races/race-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewRacePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (raceData: Omit<Race, "id" | "createdAt" | "updatedAt">) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      await createRace(raceData)
      router.push("/races")
    } catch (error) {
      console.error("Error creating race:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" onClick={() => router.push("/races")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux courses
            </Button>
            <h1 className="text-2xl font-bold text-primary ml-4">Nouvelle Course</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RaceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Créer la course" />
      </main>
    </div>
  )
}
