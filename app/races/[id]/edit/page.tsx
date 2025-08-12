"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { getRace, updateRace, type Race } from "@/lib/races"
import { RaceForm } from "@/components/races/race-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface EditRacePageProps {
  params: {
    id: string
  }
}

export default function EditRacePage({ params }: EditRacePageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [race, setRace] = useState<Race | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    loadRace()
  }, [user, params.id])

  const loadRace = async () => {
    try {
      setLoading(true)
      const raceData = await getRace(params.id)
      if (!raceData) {
        router.push("/races")
        return
      }

      // Check if user owns this race
      if (raceData.userId !== user?.id) {
        router.push("/races")
        return
      }

      setRace(raceData)
    } catch (error) {
      console.error("Error loading race:", error)
      router.push("/races")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (raceData: Omit<Race, "id" | "createdAt" | "updatedAt">) => {
    if (!user || !race) return

    setIsSubmitting(true)
    try {
      await updateRace(race.id, raceData)
      router.push("/races")
    } catch (error) {
      console.error("Error updating race:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement de la course...</p>
        </div>
      </div>
    )
  }

  if (!user || !race) {
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
            <h1 className="text-2xl font-bold text-primary ml-4">Modifier la Course</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RaceForm
          initialData={race}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Mettre à jour la course"
        />
      </main>
    </div>
  )
}
