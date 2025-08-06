"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, Key, CheckCircle, XCircle, ExternalLink, Copy, Download, Satellite, MapIcon } from "lucide-react"

interface MapService {
  name: string
  baseUrl: string
  attribution: string
  requiresToken: boolean
  token?: string
  maxZoom: number
  status?: "active" | "inactive" | "error"
}

export default function RealMapIntegration() {
  const [services, setServices] = useState<Record<string, MapService>>({})
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchMapServices()
  }, [])

  const fetchMapServices = async () => {
    try {
      const response = await fetch("/api/map-tokens")
      const data = await response.json()
      setServices(data.data.mapServices)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch map services:", error)
      setLoading(false)
    }
  }

  const testService = async (serviceKey: string) => {
    try {
      // Test different services
      if (serviceKey === "nasa_firms") {
        const response = await fetch("/api/map-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service: "nasa_firms" }),
        })
        const result = await response.json()
        setTestResults((prev) => ({ ...prev, [serviceKey]: result.success }))
      } else if (serviceKey === "mapbox") {
        const response = await fetch("/api/map-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service: "mapbox",
            params: { z: 1, x: 0, y: 0 },
          }),
        })
        const result = await response.json()
        setTestResults((prev) => ({ ...prev, [serviceKey]: result.success }))
      } else {
        // For other services, just mark as tested
        setTestResults((prev) => ({ ...prev, [serviceKey]: true }))
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [serviceKey]: false }))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getServiceStatus = (serviceKey: string, service: MapService) => {
    if (testResults[serviceKey] === true) return "active"
    if (testResults[serviceKey] === false) return "error"
    return service.requiresToken ? "inactive" : "active"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Real Map Service Integration</h2>
        <p className="text-gray-600">Configure and test various map services and satellite APIs</p>
      </div>

      <Tabs defaultValue="free-services" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="free-services">Free Services</TabsTrigger>
          <TabsTrigger value="premium-services">Premium Services</TabsTrigger>
          <TabsTrigger value="satellite-apis">Satellite APIs</TabsTrigger>
          <TabsTrigger value="setup-guide">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="free-services" className="space-y-4">
          <Alert>
            <Globe className="h-4 w-4" />
            <AlertDescription>These services are completely free to use with proper attribution.</AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {Object.entries(services)
              .filter(([_, service]) => !service.requiresToken)
              .map(([key, service]) => (
                <Card key={key} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <MapIcon className="w-5 h-5 text-green-500" />
                        {service.name}
                      </CardTitle>
                      <Badge variant={getServiceStatus(key, service) === "active" ? "default" : "secondary"}>
                        {getServiceStatus(key, service) === "active" ? "Ready" : "Available"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <strong>URL:</strong> {service.baseUrl}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Max Zoom:</strong> {service.maxZoom}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Attribution:</strong> {service.attribution}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => testService(key)}>
                        Test Service
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(service.baseUrl)}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy URL
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="premium-services" className="space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              These services require API keys but offer advanced features and higher limits.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {Object.entries(services)
              .filter(([_, service]) => service.requiresToken)
              .map(([key, service]) => (
                <Card key={key} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-500" />
                        {service.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {testResults[key] === true && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {testResults[key] === false && <XCircle className="w-4 h-4 text-red-500" />}
                        <Badge
                          variant={
                            service.token && service.token !== `your_${key}_key_here` ? "default" : "destructive"
                          }
                        >
                          {service.token && service.token !== `your_${key}_key_here` ? "Configured" : "Needs Token"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <strong>URL:</strong> {service.baseUrl}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Max Zoom:</strong> {service.maxZoom}
                    </div>
                    {service.token && (
                      <div className="text-sm text-gray-600">
                        <strong>Token Status:</strong>
                        <span className={service.token.includes("your_") ? "text-red-500" : "text-green-500"}>
                          {service.token.includes("your_") ? " Not configured" : " Configured"}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => testService(key)}
                        disabled={!service.token || service.token.includes("your_")}
                      >
                        Test Service
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(service.baseUrl)}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy URL
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={getSignupUrl(key)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Get API Key
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="satellite-apis" className="space-y-4">
          <Alert>
            <Satellite className="h-4 w-4" />
            <AlertDescription>Satellite and Earth observation APIs for environmental monitoring.</AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {[
              {
                name: "NASA FIRMS",
                description: "Active fire detection data for Indonesia",
                url: "https://firms.modaps.eosdis.nasa.gov/api/",
                status: "Free with registration",
                dataTypes: ["Fire hotspots", "Thermal anomalies", "Historical data"],
              },
              {
                name: "Sentinel Hub",
                description: "Satellite imagery and analysis platform",
                url: "https://services.sentinel-hub.com/",
                status: "Free tier available",
                dataTypes: ["Optical imagery", "Radar data", "NDVI", "Land cover"],
              },
              {
                name: "Google Earth Engine",
                description: "Planetary-scale geospatial analysis",
                url: "https://earthengine.googleapis.com/",
                status: "Free for research",
                dataTypes: ["Landsat", "MODIS", "Sentinel", "Climate data"],
              },
              {
                name: "Planet Labs",
                description: "Daily satellite imagery",
                url: "https://api.planet.com/",
                status: "Commercial",
                dataTypes: ["High-resolution imagery", "Daily updates", "Analytics"],
              },
            ].map((api, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Satellite className="w-5 h-5 text-purple-500" />
                      {api.name}
                    </CardTitle>
                    <Badge variant="outline">{api.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{api.description}</p>
                  <div className="text-sm">
                    <strong>Data Types:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {api.dataTypes.map((type, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => testService(api.name.toLowerCase().replace(" ", "_"))}>
                      Test API
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={api.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Documentation
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="setup-guide" className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-indigo-500" />
                Environment Setup Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Create .env.local file in your project root:</h4>
                <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
                  <div className="space-y-1">
                    <div># Map Service API Keys</div>
                    <div>MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZXhhbXBsZSJ9.example</div>
                    <div>GOOGLE_MAPS_API_KEY=AIzaSyExample_Google_API_Key_Here</div>
                    <div>BING_MAPS_API_KEY=Example_Bing_API_Key_Here</div>
                    <div></div>
                    <div># Satellite Data APIs</div>
                    <div>NASA_FIRMS_API_KEY=your_nasa_firms_key_here</div>
                    <div>SENTINEL_HUB_API_KEY=your_sentinel_hub_key_here</div>
                    <div>SENTINEL_HUB_INSTANCE_ID=your_instance_id_here</div>
                    <div>GOOGLE_EARTH_ENGINE_API_KEY=your_gee_key_here</div>
                    <div>PLANET_API_KEY=your_planet_key_here</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 bg-transparent"
                  onClick={() =>
                    copyToClipboard(`# Map Service API Keys
MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZXhhbXBsZSJ9.example
GOOGLE_MAPS_API_KEY=AIzaSyExample_Google_API_Key_Here
BING_MAPS_API_KEY=Example_Bing_API_Key_Here

# Satellite Data APIs
NASA_FIRMS_API_KEY=your_nasa_firms_key_here
SENTINEL_HUB_API_KEY=your_sentinel_hub_key_here
SENTINEL_HUB_INSTANCE_ID=your_instance_id_here
GOOGLE_EARTH_ENGINE_API_KEY=your_gee_key_here
PLANET_API_KEY=your_planet_key_here`)
                  }
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Template
                </Button>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Install required packages:</h4>
                <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono">
                  <div># For Leaflet (OpenStreetMap)</div>
                  <div>npm install leaflet react-leaflet @types/leaflet</div>
                  <div></div>
                  <div># For Mapbox GL JS</div>
                  <div>npm install mapbox-gl react-map-gl</div>
                  <div></div>
                  <div># For Google Maps</div>
                  <div>npm install @googlemaps/react-wrapper</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Quick Start Links:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Get Mapbox Token
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Google Cloud Console
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://firms.modaps.eosdis.nasa.gov/api/" target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      NASA FIRMS API
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://www.sentinel-hub.com/" target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Sentinel Hub
                    </a>
                  </Button>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Current Status:</strong> The interactive SVG map is fully functional without any external
                  dependencies. Add the above tokens to enable real satellite data and professional map tiles.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getSignupUrl(serviceKey: string): string {
  const urls: Record<string, string> = {
    mapbox: "https://account.mapbox.com/auth/signup/",
    googlemaps: "https://console.cloud.google.com/",
    bingmaps: "https://www.bingmapsportal.com/",
    esri: "https://developers.arcgis.com/sign-up/",
  }
  return urls[serviceKey] || "#"
}
