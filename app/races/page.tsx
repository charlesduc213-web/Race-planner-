"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { getRaces, deleteRace, type Race, raceTypeLabels, statusLabels, difficultyLabels } from "@/lib/races"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Calendar, MapPin, Mountain, Edit, Trash2, Plus, Search, Filter, ArrowLeft } from "lucide-react"

export default function RacesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [races, setRaces] = useState<Race[]>([])
  const [filteredRaces, setFilteredRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
      return
    }

    if (user) {
      loadRaces()
    }
  }, [user, isLoading, router])

  useEffect(() => {
    filterRaces()
  }, [races, searchTerm, statusFilter, typeFilter])

  const loadRaces = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userRaces = await getRaces(user.id)
      setRaces(userRaces)
    } catch (error) {
      console.error("Error loading races:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRaces = () => {
    let filtered = races

    if (searchTerm) {
      filtered = filtered.filter(
        (race) =>
          race.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          race.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((race) => race.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((race) => race.raceType === typeFilter)
    }

    setFilteredRaces(filtered)
  }

  const handleDeleteRace = async (raceId: string) => {
    try {
      await deleteRace(raceId)
      await loadRaces()
    } catch (error) {
      console.error("Error deleting race:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusVariant = (status: Race["status"]) => {
    switch (status) {
      case "completed":
        return "default"
      case "registered":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-lg font-medium">Chargement de vos courses...</p>
          <p className="text-sm text-muted-foreground">Veuillez patienter</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Mes Courses</h1>
                <p className="text-sm text-muted-foreground">
                  {races.length} course{races.length > 1 ? "s" : ""} au total
                </p>
              </div>
            </div>
            <Button onClick={() => router.push("/races/new")} className="shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle course
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une course par nom ou lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="planned">Planifiées</SelectItem>
                  <SelectItem value="registered">Inscrites</SelectItem>
                  <SelectItem value="completed">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="road">Route</SelectItem>
                  <SelectItem value="mountain">Montagne</SelectItem>
                  <SelectItem value="gravel">Gravel</SelectItem>
                  <SelectItem value="track">Piste</SelectItem>
                  <SelectItem value="cyclocross">Cyclocross</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Race List */}
        {filteredRaces.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={races.length === 0 ? "Aucune course enregistrée" : "Aucune course trouvée"}
            description={
              races.length === 0
                ? "Commencez par ajouter votre première course pour suivre vos objectifs cyclistes !"
                : "Aucune course ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
            }
            action={
              races.length === 0
                ? {
                    label: "Ajouter ma première course",
                    onClick: () => router.push("/races/new"),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRaces.map((race) => (
              <Card key={race.id} className="race-card-hover shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-primary">{race.title}</CardTitle>
                      {race.description && (
                        <CardDescription className="mt-1 line-clamp-2">{race.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/races/${race.id}/edit`)}
                        className="hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="hover:bg-destructive/10 bg-transparent">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer la course "{race.title}" ? Cette action est définitive
                              et ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRace(race.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Supprimer définitivement
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{formatDate(race.date)}</span>
                    </div>
                    {race.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{race.location}</span>
                      </div>
                    )}
                    {(race.distanceKm || race.elevationGainM) && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mountain className="h-4 w-4 mr-2 text-primary" />
                        <span>
                          {race.distanceKm && `${race.distanceKm} km`}
                          {race.distanceKm && race.elevationGainM && " • "}
                          {race.elevationGainM && `${race.elevationGainM}m D+`}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant={getStatusVariant(race.status)} className="font-medium">
                        {statusLabels[race.status]}
                      </Badge>
                      <Badge variant="outline" className="font-medium">
                        {raceTypeLabels[race.raceType]}
                      </Badge>
                      <Badge variant="outline" className="font-medium">
                        Niveau {race.difficultyLevel} - {difficultyLabels[race.difficultyLevel]}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
