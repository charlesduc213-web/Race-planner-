// Service d'intégration avec la FFC (Fédération Française de Cyclisme)

export interface FfcRace {
  id: string
  name: string
  date: string
  location: string
  category: "Route" | "Piste" | "VTT" | "Cyclo-cross" | "BMX"
  level: "Départemental" | "Régional" | "National" | "International"
  registrationUrl?: string
  description?: string
  organizer?: string
}

export async function searchFfcRaces(filters?: {
  region?: string
  category?: string
  dateFrom?: string
  dateTo?: string
}): Promise<FfcRace[]> {
  // En l'absence d'API officielle FFC, on simule des données
  // Dans une vraie implémentation, on pourrait :
  // 1. Scraper le site FFC (avec permission)
  // 2. Utiliser des flux RSS s'ils existent
  // 3. Intégrer avec des partenaires comme SportEasy, etc.

  console.log("Recherche de courses FFC avec filtres:", filters)

  // Simulation de courses FFC
  const mockRaces: FfcRace[] = [
    {
      id: "ffc-2024-001",
      name: "Grand Prix de la Ville de Paris",
      date: "2024-06-15",
      location: "Paris (75)",
      category: "Route",
      level: "National",
      organizer: "VC Paris",
      description: "Course en ligne de 120km dans les rues de Paris",
    },
    {
      id: "ffc-2024-002",
      name: "Championnat Régional Île-de-France",
      date: "2024-07-20",
      location: "Fontainebleau (77)",
      category: "Route",
      level: "Régional",
      organizer: "Comité Régional IDF",
      description: "Championnat régional sur 80km",
    },
    {
      id: "ffc-2024-003",
      name: "Critérium de Vincennes",
      date: "2024-08-10",
      location: "Vincennes (94)",
      category: "Route",
      level: "Départemental",
      organizer: "US Vincennes",
      description: "Critérium urbain de 60 minutes",
    },
  ]

  // Filtrage basique
  let filteredRaces = mockRaces

  if (filters?.region) {
    filteredRaces = filteredRaces.filter((race) => race.location.toLowerCase().includes(filters.region!.toLowerCase()))
  }

  if (filters?.category) {
    filteredRaces = filteredRaces.filter((race) => race.category === filters.category)
  }

  if (filters?.dateFrom) {
    filteredRaces = filteredRaces.filter((race) => race.date >= filters.dateFrom!)
  }

  if (filters?.dateTo) {
    filteredRaces = filteredRaces.filter((race) => race.date <= filters.dateTo!)
  }

  return filteredRaces
}

export function importFfcRaceToPersonal(ffcRace: FfcRace) {
  // Convertit une course FFC en course personnelle
  return {
    id: `imported-${ffcRace.id}`,
    name: ffcRace.name,
    date: ffcRace.date,
    location: ffcRace.location,
    distance: 0, // À remplir par l'utilisateur
    elevation: 0, // À remplir par l'utilisateur
    type: ffcRace.category.toLowerCase(),
    difficulty: "medium",
    priority: "normal",
    isPublic: true,
    notes: `Course importée de la FFC - ${ffcRace.description || ""}`,
    privateNotes: "",
    route: "",
    gpxFile: null,
    weather: null,
    source: "FFC",
    originalId: ffcRace.id,
  }
}
