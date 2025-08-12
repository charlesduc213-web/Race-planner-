// Service météo automatique avec rappels intelligents
export interface WeatherData {
  temperature: number
  conditions: string
  windSpeed: number
  humidity: number
  recommendations: string[]
}

export async function getWeatherForRace(location: string, date: string): Promise<WeatherData | null> {
  // Simulation d'un appel API météo (OpenWeatherMap, etc.)
  // En production, utiliser une vraie API météo

  const raceDate = new Date(date)
  const today = new Date()

  // Si la course est dans le futur, simuler des prévisions
  if (raceDate > today) {
    return generateWeatherForecast(location, raceDate)
  }

  // Si la course est passée, simuler des données historiques
  return generateHistoricalWeather(location, raceDate)
}

function generateWeatherForecast(location: string, date: Date): WeatherData {
  // Simulation basée sur la saison et la localisation
  const month = date.getMonth()
  const isWinter = month >= 11 || month <= 2
  const isSummer = month >= 5 && month <= 8

  let temperature: number
  let conditions: string
  let windSpeed: number
  let humidity: number

  if (isWinter) {
    temperature = Math.random() * 15 + 2 // 2-17°C
    conditions = Math.random() > 0.6 ? "rainy" : Math.random() > 0.3 ? "cloudy" : "sunny"
    windSpeed = Math.random() * 25 + 10 // 10-35 km/h
    humidity = Math.random() * 30 + 60 // 60-90%
  } else if (isSummer) {
    temperature = Math.random() * 20 + 18 // 18-38°C
    conditions = Math.random() > 0.7 ? "sunny" : Math.random() > 0.4 ? "cloudy" : "rainy"
    windSpeed = Math.random() * 15 + 5 // 5-20 km/h
    humidity = Math.random() * 40 + 40 // 40-80%
  } else {
    temperature = Math.random() * 18 + 8 // 8-26°C
    conditions = Math.random() > 0.5 ? "cloudy" : Math.random() > 0.3 ? "sunny" : "rainy"
    windSpeed = Math.random() * 20 + 8 // 8-28 km/h
    humidity = Math.random() * 35 + 50 // 50-85%
  }

  const recommendations = generateRecommendations(temperature, conditions, windSpeed, humidity)

  return {
    temperature: Math.round(temperature),
    conditions,
    windSpeed: Math.round(windSpeed),
    humidity: Math.round(humidity),
    recommendations,
  }
}

function generateHistoricalWeather(location: string, date: Date): WeatherData {
  // Simulation de données historiques
  return generateWeatherForecast(location, date)
}

function generateRecommendations(temp: number, conditions: string, wind: number, humidity: number): string[] {
  const recommendations: string[] = []

  if (temp < 0) {
    recommendations.push("🥶 Température négative : équipement grand froid obligatoire")
    recommendations.push("🧤 Gants chauffants ou sous-gants recommandés")
    recommendations.push("👟 Couvre-chaussures étanches et isolants")
    recommendations.push("🫁 Échauffement prolongé en intérieur")
    recommendations.push("💧 Bidon isotherme pour éviter le gel")
  } else if (temp < 5) {
    recommendations.push("🧥 Prévoir des vêtements chauds et coupe-vent")
    recommendations.push("🧤 Gants et bonnet recommandés")
    recommendations.push("☕ Boisson chaude avant le départ")
    recommendations.push("🦵 Collant long obligatoire")
    recommendations.push("🔥 Échauffement en salle recommandé")
  } else if (temp < 10) {
    recommendations.push("🧥 Veste thermique ou multicouches")
    recommendations.push("🦵 Collant ou jambières selon la durée")
    recommendations.push("🧤 Gants fins recommandés")
    recommendations.push("☕ Boisson tiède dans le bidon")
  } else if (temp < 15) {
    recommendations.push("🧥 Veste légère ou gilet coupe-vent")
    recommendations.push("🦵 Cuissard long ou jambières amovibles")
    recommendations.push("👕 Maillot manches longues ou bras amovibles")
  } else if (temp < 20) {
    recommendations.push("👕 Conditions idéales : maillot manches courtes")
    recommendations.push("🦵 Cuissard court suffisant")
    recommendations.push("🧥 Gilet léger en cas de vent")
  } else if (temp < 25) {
    recommendations.push("👕 Maillot technique respirant")
    recommendations.push("💧 Hydratation normale (500ml/h)")
    recommendations.push("🧴 Crème solaire conseillée")
  } else if (temp < 30) {
    recommendations.push("💧 Augmenter l'hydratation (750ml/h)")
    recommendations.push("🧴 Crème solaire indispensable")
    recommendations.push("👕 Vêtements clairs et ultra-respirants")
    recommendations.push("🧢 Casquette ou bandana sous le casque")
    recommendations.push("🧊 Glaçons dans le bidon si possible")
  } else {
    recommendations.push("🔥 Chaleur extrême : course déconseillée aux heures chaudes")
    recommendations.push("💧 Hydratation maximale (1L/h minimum)")
    recommendations.push("🧴 Renouveler la crème solaire toutes les 2h")
    recommendations.push("👕 Vêtements blancs ou très clairs obligatoires")
    recommendations.push("🧢 Protection tête renforcée")
    recommendations.push("❄️ Serviette humide sur la nuque aux arrêts")
    recommendations.push("⏰ Départ très matinal recommandé")
  }

  switch (conditions) {
    case "rainy":
      recommendations.push("🌧️ K-way ou veste imperméable obligatoire")
      recommendations.push("👓 Lunettes avec traitement anti-buée")
      recommendations.push("🚴 Pneus avec bonne adhérence sur mouillé")
      recommendations.push("🔦 Éclairage renforcé pour la visibilité")
      recommendations.push("🧤 Gants étanches recommandés")
      recommendations.push("👟 Couvre-chaussures imperméables")
      recommendations.push("📱 Protection étanche pour électronique")
      recommendations.push("🛣️ Réduire la vitesse en virage et descente")
      break
    case "stormy":
      recommendations.push("⛈️ DANGER : vérifier si la course est maintenue")
      recommendations.push("🌧️ Équipement pluie complet obligatoire")
      recommendations.push("📱 Téléphone étanche ou protection renforcée")
      recommendations.push("🚫 Éviter les zones exposées et les arbres")
      recommendations.push("🏠 Abri d'urgence identifié sur le parcours")
      break
    case "foggy":
      recommendations.push("🌫️ Éclairage avant/arrière obligatoire")
      recommendations.push("👕 Vêtements haute visibilité")
      recommendations.push("🚴 Réduire la vitesse en descente")
      recommendations.push("📢 Signaler sa présence vocalement")
      recommendations.push("👥 Rester groupé si possible")
      break
    case "windy":
      recommendations.push("💨 Position plus aérodynamique")
      recommendations.push("🚴 Roues pleines déconseillées")
      recommendations.push("👥 Privilégier le peloton pour s'abriter")
      recommendations.push("⚖️ Adapter le braquet aux conditions")
      break
    case "sunny":
      recommendations.push("😎 Lunettes de soleil obligatoires")
      recommendations.push("🧴 Crème solaire toutes les zones exposées")
      recommendations.push("💧 Hydratation préventive avant le départ")
      break
  }

  if (wind > 40) {
    recommendations.push("🌪️ Vent très fort : course potentiellement dangereuse")
    recommendations.push("🚴 Éviter les roues hautes et disques")
    recommendations.push("👥 Rouler impérativement en groupe")
    recommendations.push("🛣️ Attention aux rafales latérales")
  } else if (wind > 30) {
    recommendations.push("💨 Vent fort : adapter la stratégie de course")
    recommendations.push("🚴 Privilégier le peloton pour s'abriter")
    recommendations.push("⚖️ Braquet plus souple face au vent")
  } else if (wind > 20) {
    recommendations.push("💨 Vent modéré : position aérodynamique")
    recommendations.push("🚴 Roues moyennes recommandées")
  }

  if (humidity > 90) {
    recommendations.push("💦 Humidité extrême : risque de surchauffe")
    recommendations.push("👕 Vêtements ultra-respirants obligatoires")
    recommendations.push("💧 Hydratation renforcée même par temps frais")
    recommendations.push("🧊 Refroidissement corporel aux ravitaillements")
  } else if (humidity > 80) {
    recommendations.push("💦 Humidité élevée : hydratation régulière")
    recommendations.push("👕 Vêtements techniques anti-transpiration")
    recommendations.push("🧴 Éviter les crèmes trop grasses")
  }

  const currentMonth = new Date().getMonth()
  if (currentMonth >= 11 || currentMonth <= 2) {
    // Hiver
    recommendations.push("❄️ Saison hivernale : échauffement prolongé")
    recommendations.push("🔋 Vérifier l'autonomie des éclairages")
  } else if (currentMonth >= 5 && currentMonth <= 8) {
    // Été
    recommendations.push("☀️ Saison estivale : départ matinal conseillé")
    recommendations.push("🧴 Renouveler la protection solaire")
  }

  return recommendations
}

export async function getFfcRaces(region?: string): Promise<any[]> {
  // Placeholder pour l'intégration FFC
  // En attendant une API officielle, on peut scraper ou utiliser des données publiques
  console.log("Recherche de courses FFC pour la région:", region)

  // Simulation de courses FFC
  return [
    {
      id: "ffc-001",
      name: "Championnat Régional Route",
      date: "2024-06-15",
      location: "Lyon",
      category: "Route",
      level: "Régional",
      source: "FFC",
    },
    {
      id: "ffc-002",
      name: "Critérium de la Ville",
      date: "2024-07-20",
      location: "Paris",
      category: "Critérium",
      level: "National",
      source: "FFC",
    },
  ]
}

export function getWeatherIcon(conditions: string): string {
  switch (conditions) {
    case "sunny":
      return "☀️"
    case "cloudy":
      return "☁️"
    case "rainy":
      return "🌧️"
    case "stormy":
      return "⛈️"
    case "foggy":
      return "🌫️"
    case "windy":
      return "💨"
    default:
      return "🌤️"
  }
}

export function getConditionLabel(conditions: string): string {
  switch (conditions) {
    case "sunny":
      return "Ensoleillé"
    case "cloudy":
      return "Nuageux"
    case "rainy":
      return "Pluvieux"
    case "stormy":
      return "Orageux"
    case "foggy":
      return "Brouillard"
    case "windy":
      return "Venteux"
    default:
      return "Variable"
  }
}
