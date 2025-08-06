"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Flame, Droplets, Thermometer, Eye, MapPin, Clock, TrendingUp } from "lucide-react"

interface FireHotspot {
  id: string
  latitude: number
  longitude: number
  confidence: number
  brightness: number
  location: string
  detectedAt: Date
  severity: "low" | "medium" | "high" | "critical"
}

interface FloodRisk {
  id: string
  region: string
  riskLevel: "low" | "medium" | "high" | "critical"
  precipitation: number
  waterLevel: number
  affectedArea: number
  population: number
  lastUpdate: Date
}

export default function DisasterAlerts() {
  const [fireHotspots, setFireHotspots] = useState<FireHotspot[]>([])
  const [floodRisks, setFloodRisks] = useState<FloodRisk[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock fire hotspot data (would come from NASA FIRMS API)
      const mockFireData: FireHotspot[] = [
        {
          id: "1",
          latitude: -2.5489,
          longitude: 118.0149,
          confidence: 85,
          brightness: 320.5,
          location: "Central Kalimantan",
          detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          severity: "high",
        },
        {
          id: "2",
          latitude: -0.7893,
          longitude: 113.9213,
          confidence: 92,
          brightness: 345.2,
          location: "West Kalimantan",
          detectedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          severity: "critical",
        },
        {
          id: "3",
          latitude: -1.2379,
          longitude: 116.8529,
          confidence: 78,
          brightness: 298.7,
          location: "East Kalimantan",
          detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          severity: "medium",
        },
        {
          id: "4",
          latitude: 0.5384,
          longitude: 101.4492,
          confidence: 88,
          brightness: 312.1,
          location: "Riau Province",
          detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
          severity: "high",
        },
      ]

      // Mock flood risk data (would come from Open-Meteo API)
      const mockFloodData: FloodRisk[] = [
        {
          id: "1",
          region: "Jakarta Metropolitan",
          riskLevel: "high",
          precipitation: 85.5,
          waterLevel: 2.8,
          affectedArea: 1250,
          population: 850000,
          lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: "2",
          region: "Semarang City",
          riskLevel: "medium",
          precipitation: 45.2,
          waterLevel: 1.9,
          affectedArea: 680,
          population: 320000,
          lastUpdate: new Date(Date.now() - 45 * 60 * 1000),
        },
        {
          id: "3",
          region: "Medan Metropolitan",
          riskLevel: "critical",
          precipitation: 120.8,
          waterLevel: 3.5,
          affectedArea: 2100,
          population: 1200000,
          lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
        },
      ]

      setFireHotspots(mockFireData)
      setFloodRisks(mockFloodData)
      setLastUpdate(new Date())
      setIsLoading(false)
    }

    fetchData()

    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "high":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case "medium":
        return <Eye className="w-4 h-4 text-yellow-600" />
      default:
        return <Eye className="w-4 h-4 text-green-600" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600">Loading disaster alerts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold">Disaster Alert System</h1>
            <p className="text-gray-600">Real-time monitoring of fire hotspots and flood risks</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="font-medium">{lastUpdate.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Active Fire Hotspots</p>
                <p className="text-3xl font-bold text-red-700">{fireHotspots.length}</p>
              </div>
              <Flame className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Flood Risk Areas</p>
                <p className="text-3xl font-bold text-blue-700">{floodRisks.length}</p>
              </div>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-orange-700">
                  {
                    [...fireHotspots, ...floodRisks].filter(
                      (item) =>
                        ("severity" in item && item.severity === "critical") ||
                        ("riskLevel" in item && item.riskLevel === "critical"),
                    ).length
                  }
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monitoring Status</p>
                <p className="text-lg font-bold text-green-700">Active</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="fire" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fire" className="flex items-center space-x-2">
            <Flame className="w-4 h-4" />
            <span>Fire Hotspots</span>
          </TabsTrigger>
          <TabsTrigger value="flood" className="flex items-center space-x-2">
            <Droplets className="w-4 h-4" />
            <span>Flood Risks</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fire" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-red-600" />
                <span>Active Fire Hotspots</span>
              </CardTitle>
              <CardDescription>Real-time fire detection using NASA FIRMS satellite data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fireHotspots.map((hotspot) => (
                  <div key={hotspot.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(hotspot.severity)}
                        <div>
                          <h3 className="font-semibold">{hotspot.location}</h3>
                          <p className="text-sm text-gray-600">
                            {hotspot.latitude.toFixed(4)}°, {hotspot.longitude.toFixed(4)}°
                          </p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(hotspot.severity)}>{hotspot.severity.toUpperCase()}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500">Confidence</div>
                          <div className="font-medium">{hotspot.confidence}%</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500">Brightness</div>
                          <div className="font-medium">{hotspot.brightness}K</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500">Detected</div>
                          <div className="font-medium">{formatTimeAgo(hotspot.detectedAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <Button variant="outline" size="sm">
                            View on Map
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fire Intensity</span>
                        <span>{hotspot.confidence}%</span>
                      </div>
                      <Progress value={hotspot.confidence} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flood" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                <span>Flood Risk Assessment</span>
              </CardTitle>
              <CardDescription>Flood risk monitoring using precipitation and water level data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {floodRisks.map((risk) => (
                  <div key={risk.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(risk.riskLevel)}
                        <div>
                          <h3 className="font-semibold">{risk.region}</h3>
                          <p className="text-sm text-gray-600">{risk.population.toLocaleString()} people affected</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(risk.riskLevel)}>{risk.riskLevel.toUpperCase()} RISK</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500">Precipitation</div>
                          <div className="font-medium">{risk.precipitation}mm</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500">Water Level</div>
                          <div className="font-medium">{risk.waterLevel}m</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500">Affected Area</div>
                          <div className="font-medium">{risk.affectedArea} km²</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-gray-500">Last Update</div>
                          <div className="font-medium">{formatTimeAgo(risk.lastUpdate)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Level</span>
                        <span>
                          {risk.riskLevel === "critical"
                            ? "90%"
                            : risk.riskLevel === "high"
                              ? "70%"
                              : risk.riskLevel === "medium"
                                ? "50%"
                                : "30%"}
                        </span>
                      </div>
                      <Progress
                        value={
                          risk.riskLevel === "critical"
                            ? 90
                            : risk.riskLevel === "high"
                              ? 70
                              : risk.riskLevel === "medium"
                                ? 50
                                : 30
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Contacts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span>Emergency Response</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="font-semibold text-red-700">Fire Emergency</div>
              <div className="text-2xl font-bold text-red-600">113</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="font-semibold text-blue-700">Flood Emergency</div>
              <div className="text-2xl font-bold text-blue-600">119</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="font-semibold text-orange-700">General Emergency</div>
              <div className="text-2xl font-bold text-orange-600">112</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
