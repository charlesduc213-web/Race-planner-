// Club management utilities and types
export interface Club {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ClubMember {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
  joinedAt: string
}

// Mock data for development
export const mockClubs: Club[] = []

export const mockClubMembers: ClubMember[] = []

// Mock API functions
export async function getClub(clubId: string): Promise<Club | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockClubs.find((club) => club.id === clubId) || null
}

export async function getClubMembers(clubId: string): Promise<ClubMember[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockClubMembers
}

export async function getClubRaces(clubId: string, excludeUserId?: string): Promise<any[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Import races from the races module
  const { mockRaces } = await import("./races")

  // Get all public races from club members, excluding the current user's races
  return mockRaces
    .filter((race) => race.isPublic && (excludeUserId ? race.userId !== excludeUserId : true))
    .map((race) => ({
      ...race,
      // Remove private notes for club view
      privateNotes: undefined,
      // Add mock user info
      user: mockClubMembers.find((member) => member.id === race.userId),
    }))
}

export async function joinClub(userId: string, clubId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Mock implementation - in real app, this would update the database
  return true
}

export async function leaveClub(userId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Mock implementation
  return true
}
