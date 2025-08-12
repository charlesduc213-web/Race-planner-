"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import type { Race } from "@/lib/races"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getWeatherForRace, getWeatherIcon } from "@/lib/weather"
import type { WeatherData } from "@/lib/weather"

interface RaceFormProps {
  initialData?: Partial<Race>
  onSubmit: (data: Omit<Race, "id" | "createdAt" | "updatedAt">) => Promise<void>
  isSubmitting: boolean
  submitLabel: string
}

export function RaceForm({ initialData, onSubmit, isSubmitting, submitLabel }: RaceFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: initialData?.date || "",
    location: initialData?.location || "",
    distanceKm: initialData?.distanceKm?.toString() || "",
    elevationGainM: initialData?.elevationGainM?.toString() || "",
    raceType: initialData?.raceType || ("road" as Race["raceType"]),
    difficultyLevel: initialData?.difficultyLevel || (1 as Race["difficultyLevel"]),
    registrationUrl: initialData?.registrationUrl || "",
    privateNotes: initialData?.privateNotes || "",
    isPublic: initialData?.isPublic ?? true,
    status: initialData?.status || ("planned" as Race["status"]),
    priority: initialData?.priority || ("normal" as Race["priority"]),
    objectiveNotes: initialData?.objectiveNotes || "",
    resultTime: initialData?.resultTime || "",
    resultPosition: initialData?.resultPosition?.toString() || "",
    resultNotes: initialData?.resultNotes || "",
    weatherTemperature: initialData?.weatherInfo?.temperature?.toString() || "",
    weatherConditions: initialData?.weatherInfo?.conditions || "",
    weatherWindSpeed: initialData?.weatherInfo?.windSpeed?.toString() || "",
    weatherHumidity: initialData?.weatherInfo?.humidity?.toString() || "",
    gpxFileName: initialData?.gpxFileName || "",
  })

  const [gpxFile, setGpxFile] = useState<File | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    let gpxTrackUrl = initialData?.gpxTrackUrl
    let gpxFileName = formData.gpxFileName

    if (gpxFile) {
      // In a real app, this would upload to a file storage service
      gpxTrackUrl = URL.createObjectURL(gpxFile)
      gpxFileName = gpxFile.name
    }

    const raceData: Omit<Race, "id" | "createdAt" | "updatedAt"> = {
      userId: user.id,
      title: formData.title,
      description: formData.description || undefined,
      date: formData.date,
      location: formData.location || undefined,
      distanceKm: formData.distanceKm ? Number.parseFloat(formData.distanceKm) : undefined,
      elevationGainM: formData.elevationGainM ? Number.parseInt(formData.elevationGainM) : undefined,
      raceType: formData.raceType,
      difficultyLevel: formData.difficultyLevel,
      registrationUrl: formData.registrationUrl || undefined,
      privateNotes: formData.privateNotes || undefined,
      isPublic: formData.isPublic,
      status: formData.status,
      priority: formData.priority,
      objectiveNotes: formData.objectiveNotes || undefined,
      resultTime: formData.resultTime || undefined,
      resultPosition: formData.resultPosition ? Number.parseInt(formData.resultPosition) : undefined,
      resultNotes: formData.resultNotes || undefined,
      weatherInfo:
        formData.weatherTemperature ||
        formData.weatherConditions ||
        formData.weatherWindSpeed ||
        formData.weatherHumidity
          ? {
              temperature: formData.weatherTemperature ? Number.parseFloat(formData.weatherTemperature) : undefined,
              conditions: formData.weatherConditions || undefined,
              windSpeed: formData.weatherWindSpeed ? Number.parseFloat(formData.weatherWindSpeed) : undefined,
              humidity: formData.weatherHumidity ? Number.parseFloat(formData.weatherHumidity) : undefined,
            }
          : undefined,
      gpxTrackUrl,
      gpxFileName,
    }

    await onSubmit(raceData)
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGpxFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.toLowerCase().endsWith(".gpx")) {
      setGpxFile(file)
      updateField("gpxFileName", file.name)
    }
  }

  const fetchWeatherData = async () => {
    if (formData.location && formData.date) {
      setIsLoadingWeather(true)
      try {
        const weather = await getWeatherForRace(formData.location, formData.date)
        if (weather) {
          setWeatherData(weather)
          // Auto-fill weather fields
          updateField("weatherTemperature", weather.temperature.toString())
          updateField("weatherConditions", weather.conditions)
          updateField("weatherWindSpeed", weather.windSpeed.toString())
          updateField("weatherHumidity", weather.humidity.toString())
        }
      } catch (error) {
        console.error("Erreur lors de la récupération météo:", error)
      } finally {
        setIsLoadingWeather(false)
      }
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWeatherData()
    }, 1000) // Debounce de 1 seconde

    return () => clearTimeout(timeoutId)
  }, [formData.location, formData.date])

  const getPriorityBadge = (priority: Race["priority"]) => {
    switch (priority) {
      case "objective":
        return (
          <Badge variant="destructive" className="ml-2">
            🎯 Objectif
          </Badge>
        )
      case "important":
        return (
          <Badge variant="secondary" className="ml-2">
            ⭐ Importante
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="ml-2">
            📅 Normale
          </Badge>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Informations générales
            {getPriorityBadge(formData.priority)}
          </CardTitle>
          <CardDescription>Les détails de base de votre course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nom de la course *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Grand Prix de la Ville"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Description de la course..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Centre-ville, Paris"
            />
          </div>
        </CardContent>
      </Card>

      {/* Priority and Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>Priorité et objectifs</CardTitle>
          <CardDescription>Définissez l'importance de cette course dans votre planning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Niveau de priorité</Label>
            <Select value={formData.priority} onValueChange={(value) => updateField("priority", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">📅 Normale - Course d'entraînement ou plaisir</SelectItem>
                <SelectItem value="important">⭐ Importante - Course significative dans votre saison</SelectItem>
                <SelectItem value="objective">🎯 Objectif - Course principale de votre saison</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.priority === "objective" && (
            <div className="space-y-2">
              <Label htmlFor="objectiveNotes">Objectifs spécifiques</Label>
              <Textarea
                id="objectiveNotes"
                value={formData.objectiveNotes}
                onChange={(e) => updateField("objectiveNotes", e.target.value)}
                placeholder="Ex: Finir dans les 10 premiers, battre mon record personnel, terminer sans abandon..."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Race Details */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de la course</CardTitle>
          <CardDescription>Caractéristiques techniques et niveau de difficulté</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distanceKm">Distance (km)</Label>
              <Input
                id="distanceKm"
                type="number"
                step="0.1"
                value={formData.distanceKm}
                onChange={(e) => updateField("distanceKm", e.target.value)}
                placeholder="85.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="elevationGainM">Dénivelé (m)</Label>
              <Input
                id="elevationGainM"
                type="number"
                value={formData.elevationGainM}
                onChange={(e) => updateField("elevationGainM", e.target.value)}
                placeholder="1200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">Niveau de difficulté</Label>
              <Select
                value={formData.difficultyLevel.toString()}
                onValueChange={(value) => updateField("difficultyLevel", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Très facile</SelectItem>
                  <SelectItem value="2">2 - Facile</SelectItem>
                  <SelectItem value="3">3 - Modéré</SelectItem>
                  <SelectItem value="4">4 - Difficile</SelectItem>
                  <SelectItem value="5">5 - Très difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="raceType">Type de course</Label>
              <Select value={formData.raceType} onValueChange={(value) => updateField("raceType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="road">Route</SelectItem>
                  <SelectItem value="mountain">Montagne</SelectItem>
                  <SelectItem value="gravel">Gravel</SelectItem>
                  <SelectItem value="track">Piste</SelectItem>
                  <SelectItem value="cyclocross">Cyclocross</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifiée</SelectItem>
                  <SelectItem value="registered">Inscrite</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Informations météo
            {weatherData && <span className="text-2xl">{getWeatherIcon(weatherData.conditions)}</span>}
          </CardTitle>
          <CardDescription>
            {isLoadingWeather
              ? "Récupération des données météo..."
              : weatherData
                ? `Météo automatique pour ${formData.location} le ${new Date(formData.date).toLocaleDateString("fr-FR")}`
                : "Renseignez le lieu et la date pour obtenir la météo automatiquement"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weatherData && weatherData.recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📋 Recommandations pour cette course
              </h4>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                {weatherData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weatherTemperature">Température (°C)</Label>
              <Input
                id="weatherTemperature"
                type="number"
                value={formData.weatherTemperature}
                onChange={(e) => updateField("weatherTemperature", e.target.value)}
                placeholder="22"
                disabled={isLoadingWeather}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weatherConditions">Conditions</Label>
              <Select
                value={formData.weatherConditions}
                onValueChange={(value) => updateField("weatherConditions", value)}
                disabled={isLoadingWeather}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">☀️ Ensoleillé</SelectItem>
                  <SelectItem value="cloudy">☁️ Nuageux</SelectItem>
                  <SelectItem value="rainy">🌧️ Pluvieux</SelectItem>
                  <SelectItem value="stormy">⛈️ Orageux</SelectItem>
                  <SelectItem value="foggy">🌫️ Brouillard</SelectItem>
                  <SelectItem value="windy">💨 Venteux</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weatherWindSpeed">Vitesse du vent (km/h)</Label>
              <Input
                id="weatherWindSpeed"
                type="number"
                value={formData.weatherWindSpeed}
                onChange={(e) => updateField("weatherWindSpeed", e.target.value)}
                placeholder="15"
                disabled={isLoadingWeather}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weatherHumidity">Humidité (%)</Label>
              <Input
                id="weatherHumidity"
                type="number"
                value={formData.weatherHumidity}
                onChange={(e) => updateField("weatherHumidity", e.target.value)}
                placeholder="65"
                disabled={isLoadingWeather}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchWeatherData}
              disabled={!formData.location || !formData.date || isLoadingWeather}
            >
              {isLoadingWeather ? "Chargement..." : "🔄 Actualiser la météo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GPX File */}
      <Card>
        <CardHeader>
          <CardTitle>Trace GPX du parcours</CardTitle>
          <CardDescription>Téléchargez le fichier GPX de votre parcours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gpxFile">Fichier GPX</Label>
            <Input
              id="gpxFile"
              type="file"
              accept=".gpx"
              onChange={handleGpxFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            {formData.gpxFileName && (
              <p className="text-sm text-muted-foreground">Fichier sélectionné : {formData.gpxFileName}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations complémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registrationUrl">URL d'inscription</Label>
            <Input
              id="registrationUrl"
              type="url"
              value={formData.registrationUrl}
              onChange={(e) => updateField("registrationUrl", e.target.value)}
              placeholder="https://example.com/register"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="privateNotes">Notes privées</Label>
            <Textarea
              id="privateNotes"
              value={formData.privateNotes}
              onChange={(e) => updateField("privateNotes", e.target.value)}
              placeholder="Vos notes personnelles sur cette course..."
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => updateField("isPublic", checked)}
            />
            <Label htmlFor="isPublic">Visible par les membres du club</Label>
          </div>
        </CardContent>
      </Card>

      {/* Results (if completed) */}
      {formData.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats</CardTitle>
            <CardDescription>Vos résultats pour cette course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resultTime">Temps (HH:MM:SS)</Label>
                <Input
                  id="resultTime"
                  value={formData.resultTime}
                  onChange={(e) => updateField("resultTime", e.target.value)}
                  placeholder="02:45:30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resultPosition">Classement</Label>
                <Input
                  id="resultPosition"
                  type="number"
                  value={formData.resultPosition}
                  onChange={(e) => updateField("resultPosition", e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resultNotes">Notes sur la performance</Label>
              <Textarea
                id="resultNotes"
                value={formData.resultNotes}
                onChange={(e) => updateField("resultNotes", e.target.value)}
                placeholder="Comment s'est déroulée la course..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
