"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import {
  getAdminStats,
  getAllUsers,
  getAllClubs,
  getAllRaces,
  updateUserRole,
  toggleUserStatus,
  deleteClub,
  type AdminStats,
  type AdminUser,
  type AdminClub,
  type AdminRace,
} from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, Building, Calendar, BarChart3, Shield, UserCheck, UserX, Trash2, Edit } from "lucide-react"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [clubs, setClubs] = useState<AdminClub[]>([])
  const [races, setRaces] = useState<AdminRace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/dashboard")
      return
    }

    if (user && user.role === "admin") {
      loadAdminData()
    }
  }, [user, isLoading, router])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const [statsData, usersData, clubsData, racesData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getAllClubs(),
        getAllRaces(),
      ])

      setStats(statsData)
      setUsers(usersData)
      setClubs(clubsData)
      setRaces(racesData)
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, role: "user" | "admin") => {
    try {
      await updateUserRole(userId, role)
      await loadAdminData()
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId)
      await loadAdminData()
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  const handleDeleteClub = async (clubId: string) => {
    try {
      await deleteClub(clubId)
      await loadAdminData()
    } catch (error) {
      console.error("Error deleting club:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement du tableau de bord admin...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
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
              <h1 className="text-2xl font-bold text-primary">Administration</h1>
            </div>
            <Badge variant="default">
              <Shield className="h-3 w-3 mr-1" />
              Administrateur
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">{stats.activeUsers} actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clubs</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClubs}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRaces}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.racesThisMonth}</div>
                <p className="text-xs text-muted-foreground">Courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
                <p className="text-xs text-muted-foreground">Utilisateurs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="races">Courses</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>Gérez les comptes utilisateurs et leurs permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((adminUser) => (
                    <div key={adminUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(adminUser.firstName, adminUser.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {adminUser.firstName} {adminUser.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{adminUser.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {adminUser.clubName && `Club: ${adminUser.clubName} • `}
                            Créé le {formatDate(adminUser.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={adminUser.role === "admin" ? "default" : "secondary"}>
                          {adminUser.role === "admin" ? "Admin" : "Utilisateur"}
                        </Badge>
                        <Badge variant={adminUser.isActive ? "default" : "destructive"}>
                          {adminUser.isActive ? "Actif" : "Inactif"}
                        </Badge>
                        <Select
                          value={adminUser.role}
                          onValueChange={(value) => handleUpdateUserRole(adminUser.id, value as "user" | "admin")}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Utilisateur</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(adminUser.id)}>
                          {adminUser.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clubs Management */}
          <TabsContent value="clubs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des clubs</CardTitle>
                <CardDescription>Gérez les clubs et leurs membres</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clubs.map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{club.name}</h4>
                        <p className="text-sm text-muted-foreground">{club.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {club.memberCount} membre{club.memberCount > 1 ? "s" : ""} • {club.raceCount} course
                          {club.raceCount > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Créé par {club.createdByName} le {formatDate(club.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer le club</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer "{club.name}" ? Cette action est irréversible et
                                affectera tous les membres du club.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteClub(club.id)}>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Races Management */}
          <TabsContent value="races" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des courses</CardTitle>
                <CardDescription>Vue d'ensemble de toutes les courses du système</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {races.map((race) => (
                    <div key={race.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{race.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(race.date)} • {race.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Par {race.userName} • {race.clubName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {race.distanceKm && `${race.distanceKm} km • `}
                          Créée le {formatDate(race.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={race.status === "completed" ? "default" : "outline"}>{race.status}</Badge>
                        <Badge variant={race.isPublic ? "secondary" : "outline"}>
                          {race.isPublic ? "Publique" : "Privée"}
                        </Badge>
                        <Badge variant="outline">{race.raceType}</Badge>
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
