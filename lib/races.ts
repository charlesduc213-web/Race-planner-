// Race management utilities and types
export interface Race {
  id: string
  userId: string
  title: string
  description?: string
  date: string
  location?: string
  distanceKm?: number
  elevationGainM?: number
  raceType: "road" | "mountain" | "gravel" | "track" | "cyclocross"
  difficultyLevel: 1 | 2 | 3 | 4 | 5
  registrationUrl?: string
  privateNotes?: string
  isPublic: boolean
  status: "planned" | "registered" | "completed" | "cancelled"
  priority: "normal" | "important" | "objective"
  objectiveNotes?: string
  resultTime?: string
  resultPosition?: number
  resultNotes?: string
  weatherInfo?: {
    temperature?: number
    conditions?: string
    windSpeed?: number
    humidity?: number
  }
  gpxTrackUrl?: string
  gpxFileName?: string
  createdAt: string
  updatedAt: string
}

// Mock data for development
export const mockRaces: Race[] = []

export const raceTypeLabels = {
  road: "Route",
  mountain: "Montagne",
  gravel: "Gravel",
  track: "Piste",
  cyclocross: "Cyclocross",
}

export const statusLabels = {
  planned: "Planifiée",
  registered: "Inscrite",
  completed: "Terminée",
  cancelled: "Annulée",
}

export const priorityLabels = {
  normal: "Normale",
  important: "Importante",
  objective: "Objectif",
}

export const difficultyLabels = {
  1: "Très facile",
  2: "Facile",
  3: "Modérée",
  4: "Difficile",
  5: "Très difficile",
}

// Mock API functions
export async function getRaces(userId: string): Promise<Race[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockRaces.filter((race) => race.userId === userId)
}

export async function getRace(id: string): Promise<Race | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockRaces.find((race) => race.id === id) || null
}

export async function createRace(raceData: Omit<Race, "id" | "createdAt" | "updatedAt">): Promise<Race> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newRace: Race = {
    ...raceData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockRaces.push(newRace)
  return newRace
}

export async function updateRace(id: string, raceData: Partial<Race>): Promise<Race | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockRaces.findIndex((race) => race.id === id)
  if (index === -1) return null

  mockRaces[index] = {
    ...mockRaces[index],
    ...raceData,
    updatedAt: new Date().toISOString(),
  }
  return mockRaces[index]
}

export async function deleteRace(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockRaces.findIndex((race) => race.id === id)
  if (index === -1) return false

  mockRaces.splice(index, 1)
  return true
}
