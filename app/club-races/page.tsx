"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { getClub, getClubMembers, getClubRaces, type Club, type ClubMember } from "@/lib/clubs"
import { raceTypeLabels, statusLabels } from "@/lib/races"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MapPin, Mountain, Users, Search, Filter, ArrowLeft, UserPlus } from "lucide-react"

export default function ClubRacesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [club, setClub] = useState<Club | null>(null)
  const [members, setMembers] = useState<ClubMember[]>([])
  const [clubRaces, setClubRaces] = useState<any[]>([])
  const [filteredRaces, setFilteredRaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
      return
    }

    if (user && user.clubId) {
      loadClubData()
    } else if (user && !user.clubId) {
      setLoading(false)
    }
  }, [user, isLoading, router])

  useEffect(() => {
    filterRaces()
  }, [clubRaces, searchTerm, statusFilter, typeFilter])

  const loadClubData = async () => {
    if (!user?.clubId) return

    try {
      setLoading(true)
      const [clubData, membersData, racesData] = await Promise.all([
        getClub(user.clubId),
        getClubMembers(user.clubId),
        getClubRaces(user.clubId, user.id),
      ])

      setClub(clubData)
      setMembers(membersData)
      setClubRaces(racesData)
    } catch (error) {
      console.error("Error loading club data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRaces = () => {
    let filtered = clubRaces

    if (searchTerm) {
      filtered = filtered.filter(
        (race) =>
          race.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          race.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          race.user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          race.user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusVariant = (status: string) => {
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement du club...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // User not in a club
  if (!user.clubId || !club) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-2xl font-bold text-primary ml-4">Club</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Vous n'êtes membre d'aucun club</h3>
              <p className="text-muted-foreground mb-4">
                Rejoignez un club pour voir les courses des autres membres et partager vos propres courses.
              </p>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Rejoindre un club
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-2xl font-bold text-primary">{club.name}</h1>
            </div>
            <Badge variant="secondary">
              {members.length} membre{members.length > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="races" className="space-y-6">
          <TabsList>
            <TabsTrigger value="races">Courses du club</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
          </TabsList>

          <TabsContent value="races" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une course ou un membre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
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
                  <SelectValue placeholder="Type" />
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

            {/* Race List */}
            {filteredRaces.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune course trouvée</h3>
                  <p className="text-muted-foreground">
                    {clubRaces.length === 0
                      ? "Aucun membre du club n'a encore partagé de course publique."
                      : "Essayez de modifier vos filtres de recherche."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRaces.map((race) => (
                  <Card key={race.id} className="race-card-hover">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{race.title}</CardTitle>
                          <CardDescription className="mt-1">{race.description}</CardDescription>
                          {race.user && (
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback className="text-xs">
                                  {getInitials(race.user.firstName, race.user.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              {race.user.firstName} {race.user.lastName}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(race.date)}
                        </div>
                        {race.location && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {race.location}
                          </div>
                        )}
                        {(race.distanceKm || race.elevationGainM) && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mountain className="h-4 w-4 mr-2" />
                            {race.distanceKm && `${race.distanceKm} km`}
                            {race.distanceKm && race.elevationGainM && " • "}
                            {race.elevationGainM && `${race.elevationGainM}m D+`}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Badge variant={getStatusVariant(race.status)}>{statusLabels[race.status]}</Badge>
                          <Badge variant="outline">{raceTypeLabels[race.raceType]}</Badge>
                          <Badge variant="outline">Niveau {race.difficultyLevel}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membres du club</CardTitle>
                <CardDescription>
                  {members.length} membre{members.length > 1 ? "s" : ""} dans {club.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.role === "admin" && <Badge variant="secondary">Admin</Badge>}
                        <p className="text-sm text-muted-foreground">Membre depuis {formatDate(member.joinedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
