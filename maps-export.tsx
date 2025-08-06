"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, Map, FileText } from "lucide-react"

export default function MapsExport() {
  const [selectedRegion, setSelectedRegion] = useState("")
  const [exportFormat, setExportFormat] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const landClassifications = [
    { type: "Forest", area: "2,450 km²", percentage: 35, color: "bg-green-500" },
    { type: "Agricultural", area: "1,890 km²", percentage: 27, color: "bg-yellow-500" },
    { type: "Urban", area: "980 km²", percentage: 14, color: "bg-gray-500" },
    { type: "Water Bodies", area: "560 km²", percentage: 8, color: "bg-blue-500" },
    { type: "Grassland", area: "420 km²", percentage: 6, color: "bg-green-300" },
    { type: "Barren Land", area: "700 km²", percentage: 10, color: "bg-orange-500" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Map className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Land Classification Maps & Data Export</h1>
      </div>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="visualization">Map Visualization</TabsTrigger>
          <TabsTrigger value="statistics">Land Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Land Classification Data</span>
              </CardTitle>
              <CardDescription>
                Select region, date range, and format to export land classification data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="region">Select Region</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="java">Java Island</SelectItem>
                        <SelectItem value="sumatra">Sumatra Island</SelectItem>
                        <SelectItem value="kalimantan">Kalimantan Island</SelectItem>
                        <SelectItem value="sulawesi">Sulawesi Island</SelectItem>
                        <SelectItem value="papua">Papua Island</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="geojson">GeoJSON</SelectItem>
                        <SelectItem value="shapefile">Shapefile (.shp)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="kml">KML</SelectItem>
                        <SelectItem value="geotiff">GeoTIFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting data...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleExport}
                disabled={!selectedRegion || !exportFormat || isExporting}
                className="w-full"
              >
                {isExporting ? "Exporting..." : "Export Data"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Land Classification Map</CardTitle>
              <CardDescription>Visualize land use patterns and changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Map className="h-16 w-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500">Interactive map will be displayed here</p>
                  <p className="text-sm text-gray-400">Integration with mapping libraries like Leaflet or Mapbox</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {landClassifications.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landClassifications.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {item.type}
                    <Badge variant="secondary">{item.percentage}%</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Area Coverage</span>
                      <span className="font-medium">{item.area}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Land Use Change Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+2.3%</div>
                    <div className="text-sm text-gray-600">Forest Growth</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">-1.8%</div>
                    <div className="text-sm text-gray-600">Agricultural Loss</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">+0.5%</div>
                    <div className="text-sm text-gray-600">Urban Expansion</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
