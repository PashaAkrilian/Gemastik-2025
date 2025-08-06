"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TreePine,
  Droplets,
  Leaf,
  BarChart3,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Zap,
  Shield,
  Heart,
  Globe,
} from "lucide-react"

interface EcosystemService {
  id: string
  name: string
  value: number
  unit: string
  trend: "up" | "down" | "stable"
  change: number
  description: string
  importance: "low" | "medium" | "high" | "critical"
}

interface CarbonData {
  region: string
  totalStock: number
  annualSequestration: number
  forestCover: number
  trend: "increasing" | "decreasing" | "stable"
}

interface BiodiversityIndex {
  region: string
  speciesCount: number
  endemicSpecies: number
  threatenedSpecies: number
  habitatQuality: number
  conservationStatus: "excellent" | "good" | "fair" | "poor"
}

export default function EcoServices() {
  const [ecosystemServices, setEcosystemServices] = useState<EcosystemService[]>([])
  const [carbonData, setCarbonData] = useState<CarbonData[]>([])
  const [biodiversityData, setBiodiversityData] = useState<BiodiversityIndex[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock ecosystem services data
      const mockServices: EcosystemService[] = [
        {
          id: "carbon",
          name: "Carbon Sequestration",
          value: 2.8,
          unit: "Gt CO₂/year",
          trend: "up",
          change: 5.2,
          description: "Annual carbon dioxide removal from atmosphere",
          importance: "critical",
        },
        {
          id: "water",
          name: "Water Regulation",
          value: 847,
          unit: "billion m³/year",
          trend: "down",
          change: -2.1,
          description: "Freshwater regulation and purification",
          importance: "critical",
        },
        {
          id: "air",
          name: "Air Purification",
          value: 156,
          unit: "million tons/year",
          trend: "up",
          change: 3.8,
          description: "Air pollutant removal capacity",
          importance: "high",
        },
        {
          id: "biodiversity",
          name: "Biodiversity Conservation",
          value: 17500,
          unit: "species protected",
          trend: "stable",
          change: 0.5,
          description: "Species diversity maintenance",
          importance: "critical",
        },
        {
          id: "pollination",
          name: "Pollination Services",
          value: 12.4,
          unit: "billion USD/year",
          trend: "down",
          change: -1.8,
          description: "Economic value of natural pollination",
          importance: "high",
        },
        {
          id: "soil",
          name: "Soil Formation",
          value: 2.1,
          unit: "cm/century",
          trend: "down",
          change: -0.3,
          description: "Natural soil formation rate",
          importance: "medium",
        },
      ]

      // Mock carbon data
      const mockCarbon: CarbonData[] = [
        {
          region: "Sumatra",
          totalStock: 8.2,
          annualSequestration: 0.45,
          forestCover: 58.2,
          trend: "decreasing",
        },
        {
          region: "Kalimantan",
          totalStock: 15.7,
          annualSequestration: 0.82,
          forestCover: 72.1,
          trend: "decreasing",
        },
        {
          region: "Papua",
          totalStock: 22.3,
          annualSequestration: 1.15,
          forestCover: 84.6,
          trend: "stable",
        },
        {
          region: "Java",
          totalStock: 2.1,
          annualSequestration: 0.12,
          forestCover: 23.4,
          trend: "increasing",
        },
        {
          region: "Sulawesi",
          totalStock: 6.8,
          annualSequestration: 0.38,
          forestCover: 49.7,
          trend: "stable",
        },
      ]

      // Mock biodiversity data
      const mockBiodiversity: BiodiversityIndex[] = [
        {
          region: "Papua",
          speciesCount: 15420,
          endemicSpecies: 2840,
          threatenedSpecies: 156,
          habitatQuality: 87,
          conservationStatus: "excellent",
        },
        {
          region: "Kalimantan",
          speciesCount: 12680,
          endemicSpecies: 1950,
          threatenedSpecies: 203,
          habitatQuality: 74,
          conservationStatus: "good",
        },
        {
          region: "Sumatra",
          speciesCount: 9840,
          endemicSpecies: 1420,
          threatenedSpecies: 287,
          habitatQuality: 62,
          conservationStatus: "fair",
        },
        {
          region: "Sulawesi",
          speciesCount: 8760,
          endemicSpecies: 1680,
          threatenedSpecies: 145,
          habitatQuality: 69,
          conservationStatus: "good",
        },
        {
          region: "Java",
          speciesCount: 4520,
          endemicSpecies: 380,
          threatenedSpecies: 198,
          habitatQuality: 45,
          conservationStatus: "poor",
        },
      ]

      setEcosystemServices(mockServices)
      setCarbonData(mockCarbon)
      setBiodiversityData(mockBiodiversity)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />
    }
  }

  const getConservationColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-700 bg-green-100"
      case "good":
        return "text-blue-700 bg-blue-100"
      case "fair":
        return "text-yellow-700 bg-yellow-100"
      case "poor":
        return "text-red-700 bg-red-100"
      default:
        return "text-gray-700 bg-gray-100"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600">Loading ecosystem services data...</p>
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
          <TreePine className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Ecosystem Services Monitoring</h1>
            <p className="text-gray-600">Comprehensive ecosystem health and service valuation</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Carbon Stock</p>
                <p className="text-3xl font-bold text-green-700">55.1 Gt</p>
              </div>
              <TreePine className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Water Regulation</p>
                <p className="text-3xl font-bold text-blue-700">847B m³</p>
              </div>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Species Protected</p>
                <p className="text-3xl font-bold text-purple-700">51,220</p>
              </div>
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Economic Value</p>
                <p className="text-3xl font-bold text-orange-700">$127B</p>
              </div>
              <Globe className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services" className="flex items-center space-x-2">
            <Leaf className="w-4 h-4" />
            <span>Ecosystem Services</span>
          </TabsTrigger>
          <TabsTrigger value="carbon" className="flex items-center space-x-2">
            <TreePine className="w-4 h-4" />
            <span>Carbon Stock</span>
          </TabsTrigger>
          <TabsTrigger value="biodiversity" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Biodiversity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge className={getImportanceColor(service.importance)}>{service.importance}</Badge>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{service.value}</div>
                      <div className="text-sm text-gray-600">{service.unit}</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(service.trend)}
                      <span
                        className={`text-sm font-medium ${
                          service.trend === "up"
                            ? "text-green-600"
                            : service.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {service.change > 0 ? "+" : ""}
                        {service.change}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Service Health</span>
                      <span>
                        {service.importance === "critical"
                          ? "95%"
                          : service.importance === "high"
                            ? "80%"
                            : service.importance === "medium"
                              ? "65%"
                              : "50%"}
                      </span>
                    </div>
                    <Progress
                      value={
                        service.importance === "critical"
                          ? 95
                          : service.importance === "high"
                            ? 80
                            : service.importance === "medium"
                              ? 65
                              : 50
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="carbon" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TreePine className="h-5 w-5 text-green-600" />
                <span>Carbon Stock Analysis by Region</span>
              </CardTitle>
              <CardDescription>
                Forest carbon storage and sequestration capacity across Indonesian regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {carbonData.map((region, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold text-lg">{region.region}</h3>
                          <p className="text-sm text-gray-600">Forest Cover: {region.forestCover}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(region.trend)}
                        <Badge
                          variant="outline"
                          className={
                            region.trend === "increasing"
                              ? "border-green-200 text-green-700"
                              : region.trend === "decreasing"
                                ? "border-red-200 text-red-700"
                                : "border-gray-200 text-gray-700"
                          }
                        >
                          {region.trend}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{region.totalStock}</div>
                        <div className="text-sm text-green-600">Gt Carbon Stock</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{region.annualSequestration}</div>
                        <div className="text-sm text-blue-600">Gt/year Sequestration</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-700">{region.forestCover}%</div>
                        <div className="text-sm text-purple-600">Forest Coverage</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Carbon Storage Capacity</span>
                        <span>{Math.round((region.totalStock / 22.3) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((region.totalStock / 22.3) * 100)} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biodiversity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-purple-600" />
                <span>Biodiversity Conservation Index</span>
              </CardTitle>
              <CardDescription>Species diversity and conservation status across Indonesian ecosystems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {biodiversityData.map((region, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-semibold text-lg">{region.region}</h3>
                          <p className="text-sm text-gray-600">Habitat Quality: {region.habitatQuality}%</p>
                        </div>
                      </div>
                      <Badge className={getConservationColor(region.conservationStatus)}>
                        {region.conservationStatus.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-700">{region.speciesCount.toLocaleString()}</div>
                        <div className="text-xs text-green-600">Total Species</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-700">{region.endemicSpecies.toLocaleString()}</div>
                        <div className="text-xs text-blue-600">Endemic Species</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xl font-bold text-red-700">{region.threatenedSpecies}</div>
                        <div className="text-xs text-red-600">Threatened</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-700">{region.habitatQuality}%</div>
                        <div className="text-xs text-purple-600">Habitat Quality</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Conservation Effectiveness</span>
                        <span>{region.habitatQuality}%</span>
                      </div>
                      <Progress value={region.habitatQuality} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Panel */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <Shield className="h-5 w-5" />
            <span>Conservation Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
              <MapPin className="w-4 h-4 mr-2" />
              View Priority Areas
            </Button>
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
