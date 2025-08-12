// Admin utilities and types
export interface AdminStats {
  totalUsers: number
  totalClubs: number
  totalRaces: number
  activeUsers: number
  racesThisMonth: number
  newUsersThisMonth: number
}

export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  clubId?: string
  clubName?: string
  stravaConnected: boolean
  createdAt: string
  lastLoginAt?: string
  isActive: boolean
}

export interface AdminClub {
  id: string
  name: string
  description?: string
  memberCount: number
  raceCount: number
  createdBy: string
  createdByName: string
  createdAt: string
}

export interface AdminRace {
  id: string
  title: string
  date: string
  location?: string
  distanceKm?: number
  raceType: string
  status: string
  isPublic: boolean
  userId: string
  userName: string
  clubName?: string
  createdAt: string
}

// Mock data for development
export const mockAdminStats: AdminStats = {
  totalUsers: 0,
  totalClubs: 0,
  totalRaces: 0,
  activeUsers: 0,
  racesThisMonth: 0,
  newUsersThisMonth: 0,
}

export const mockAdminUsers: AdminUser[] = []

export const mockAdminClubs: AdminClub[] = []

export const mockAdminRaces: AdminRace[] = []

// Mock API functions
export async function getAdminStats(): Promise<AdminStats> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAdminStats
}

export async function getAllUsers(): Promise<AdminUser[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAdminUsers
}

export async function getAllClubs(): Promise<AdminClub[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAdminClubs
}

export async function getAllRaces(): Promise<AdminRace[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockAdminRaces
}

export async function updateUserRole(userId: string, role: "user" | "admin"): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const user = mockAdminUsers.find((u) => u.id === userId)
  if (user) {
    user.role = role
    return true
  }
  return false
}

export async function toggleUserStatus(userId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const user = mockAdminUsers.find((u) => u.id === userId)
  if (user) {
    user.isActive = !user.isActive
    return true
  }
  return false
}

export async function deleteClub(clubId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockAdminClubs.findIndex((c) => c.id === clubId)
  if (index !== -1) {
    mockAdminClubs.splice(index, 1)
    return true
  }
  return false
}
