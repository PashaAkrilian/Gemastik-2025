"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Layers, MapPin } from "lucide-react"

interface FireData {
  latitude: number
  longitude: number
  brightness: number
  confidence: number
  acq_date: string
}

interface LeafletMapProps {
  selectedLayer: string
  fireData: FireData[]
  onMapClick: (lat: number, lng: number) => void
}

// Declare Leaflet types
declare global {
  interface Window {
    L: any
  }
}

export default function LeafletMap({ selectedLayer, fireData, onMapClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(5)
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const layerGroupsRef = useRef<{ [key: string]: any }>({})

  // Indonesia specific bounds - more precise
  const indonesiaBounds = [
    [-11.5, 94.5], // Southwest (includes southern Java and western Sumatra)
    [6.5, 141.5], // Northeast (includes northern Sumatra and eastern Papua)
  ]

  // Indonesia center - more central to archipelago
  const indonesiaCenter = [-2.0, 118.0] // Centered between major islands

  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      // Load Leaflet CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = () => {
        setIsLoaded(true)
      }
      document.head.appendChild(script)
    } else if (window.L) {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current) {
      initializeMap()
    }
  }, [isLoaded])

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMapLayer()
    }
  }, [selectedLayer])

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateFireData()
    }
  }, [fireData])

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return

    // Initialize map with Indonesia focus
    const map = window.L.map(mapRef.current, {
      center: indonesiaCenter,
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      maxBounds: indonesiaBounds,
      maxBoundsViscosity: 1.0,
      zoomControl: false, // We'll add custom controls
    })

    mapInstanceRef.current = map

    // Add default OpenStreetMap layer
    const osmLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    })
    osmLayer.addTo(map)
    layerGroupsRef.current.osm = osmLayer

    // Add click handler
    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      setClickedCoords({ lat, lng })
      onMapClick(lat, lng)

      // Add marker for clicked location
      if (layerGroupsRef.current.clickMarker) {
        map.removeLayer(layerGroupsRef.current.clickMarker)
      }

      const marker = window.L.marker([lat, lng], {
        icon: window.L.divIcon({
          className: "click-marker",
          html: '<div style="background: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      }).addTo(map)

      layerGroupsRef.current.clickMarker = marker
    })

    // Add zoom handler
    map.on("zoomend", () => {
      setCurrentZoom(map.getZoom())
    })

    // Add Indonesian cities with accurate coordinates
    addIndonesianCities(map)

    // Add Indonesian provinces outline (simplified)
    addProvinceOutlines(map)

    // Initial layer setup
    updateMapLayer()
    updateFireData()

    // Fit to Indonesia bounds initially
    map.fitBounds(indonesiaBounds, { padding: [20, 20] })
  }

  const addIndonesianCities = (map: any) => {
    const indonesianCities = [
      // Java
      { name: "Jakarta", lat: -6.2088, lng: 106.8456, population: "10.6M", province: "DKI Jakarta" },
      { name: "Surabaya", lat: -7.2575, lng: 112.7521, population: "2.9M", province: "Jawa Timur" },
      { name: "Bandung", lat: -6.9175, lng: 107.6191, population: "2.5M", province: "Jawa Barat" },
      { name: "Semarang", lat: -6.9667, lng: 110.4167, population: "1.6M", province: "Jawa Tengah" },
      { name: "Yogyakarta", lat: -7.7956, lng: 110.3695, population: "0.4M", province: "DI Yogyakarta" },

      // Sumatra
      { name: "Medan", lat: 3.5952, lng: 98.6722, population: "2.4M", province: "Sumatera Utara" },
      { name: "Palembang", lat: -2.9761, lng: 104.7754, population: "1.7M", province: "Sumatera Selatan" },
      { name: "Pekanbaru", lat: 0.5071, lng: 101.4478, population: "1.0M", province: "Riau" },
      { name: "Padang", lat: -0.9471, lng: 100.4172, population: "0.9M", province: "Sumatera Barat" },
      { name: "Bandar Lampung", lat: -5.3971, lng: 105.2668, population: "1.2M", province: "Lampung" },

      // Kalimantan
      { name: "Balikpapan", lat: -1.2379, lng: 116.8529, population: "0.7M", province: "Kalimantan Timur" },
      { name: "Pontianak", lat: -0.0263, lng: 109.3425, population: "0.6M", province: "Kalimantan Barat" },
      { name: "Banjarmasin", lat: -3.3194, lng: 114.5906, population: "0.7M", province: "Kalimantan Selatan" },
      { name: "Samarinda", lat: -0.5017, lng: 117.1536, population: "0.8M", province: "Kalimantan Timur" },

      // Sulawesi
      { name: "Makassar", lat: -5.1477, lng: 119.4327, population: "1.4M", province: "Sulawesi Selatan" },
      { name: "Manado", lat: 1.4748, lng: 124.8421, population: "0.4M", province: "Sulawesi Utara" },
      { name: "Palu", lat: -0.8917, lng: 119.8707, population: "0.4M", province: "Sulawesi Tengah" },

      // Bali & Nusa Tenggara
      { name: "Denpasar", lat: -8.65, lng: 115.2167, population: "0.9M", province: "Bali" },
      { name: "Mataram", lat: -8.5833, lng: 116.1167, population: "0.4M", province: "Nusa Tenggara Barat" },

      // Papua
      { name: "Jayapura", lat: -2.5333, lng: 140.7167, population: "0.3M", province: "Papua" },

      // Maluku
      { name: "Ambon", lat: -3.6954, lng: 128.1814, population: "0.4M", province: "Maluku" },
    ]

    const cityGroup = window.L.layerGroup()

    indonesianCities.forEach((city) => {
      const marker = window.L.marker([city.lat, city.lng], {
        icon: window.L.divIcon({
          className: "city-marker",
          html: `
            <div style="
              background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
              color: white; 
              padding: 4px 8px; 
              border-radius: 12px; 
              font-size: 11px; 
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              white-space: nowrap;
              position: relative;
            ">
              ${city.name}
              <div style="
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 4px solid #1f2937;
              "></div>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        }),
      })

      marker.bindPopup(`
        <div style="text-align: center; padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${city.name}</h3>
          <div style="background: #f3f4f6; padding: 8px; border-radius: 8px; margin-bottom: 8px;">
            <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">
              📍 ${city.province}
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280; font-size: 12px;">Population:</span>
            <span style="color: #1f2937; font-weight: bold; font-size: 12px;">${city.population}</span>
          </div>
          <div style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">
            <p style="margin: 0; color: #6b7280; font-size: 11px;">
              ${city.lat.toFixed(4)}°S, ${city.lng.toFixed(4)}°E
            </p>
          </div>
        </div>
      `)

      cityGroup.addLayer(marker)
    })

    cityGroup.addTo(map)
    layerGroupsRef.current.cities = cityGroup
  }

  const addProvinceOutlines = (map: any) => {
    // Add simplified province boundaries for major islands
    const majorIslands = [
      {
        name: "Sumatra",
        bounds: [
          [5.5, 95.0],
          [-6.0, 106.0],
        ],
        color: "#10b981",
      },
      {
        name: "Java",
        bounds: [
          [-5.5, 105.0],
          [-8.8, 115.0],
        ],
        color: "#3b82f6",
      },
      {
        name: "Kalimantan",
        bounds: [
          [4.5, 108.0],
          [-4.5, 119.0],
        ],
        color: "#f59e0b",
      },
      {
        name: "Sulawesi",
        bounds: [
          [2.0, 118.0],
          [-6.0, 125.0],
        ],
        color: "#ef4444",
      },
      {
        name: "Papua",
        bounds: [
          [-1.0, 130.0],
          [-9.0, 141.0],
        ],
        color: "#8b5cf6",
      },
    ]

    const islandGroup = window.L.layerGroup()

    majorIslands.forEach((island) => {
      const rectangle = window.L.rectangle(island.bounds, {
        color: island.color,
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.1,
        dashArray: "5, 5",
      })

      rectangle.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <h4 style="margin: 0; color: ${island.color};">${island.name}</h4>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">
            Major Indonesian Island
          </p>
        </div>
      `)

      islandGroup.addLayer(rectangle)
    })

    islandGroup.addTo(map)
    layerGroupsRef.current.islands = islandGroup
  }

  const updateMapLayer = () => {
    if (!mapInstanceRef.current || !window.L) return

    const map = mapInstanceRef.current

    // Remove existing tile layers except cities, islands and markers
    Object.keys(layerGroupsRef.current).forEach((key) => {
      if (key !== "cities" && key !== "fires" && key !== "clickMarker" && key !== "islands") {
        map.removeLayer(layerGroupsRef.current[key])
      }
    })

    let tileLayer

    switch (selectedLayer) {
      case "satellite":
        // Esri World Imagery (Satellite) - Best for Indonesia
        tileLayer = window.L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "Tiles © Esri — Source: Esri, Maxar, GeoEye, Earthstar Geographics",
            maxZoom: 18,
          },
        )
        break

      case "terrain":
        // OpenTopoMap (Terrain) - Shows Indonesia's topography well
        tileLayer = window.L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)",
          maxZoom: 17,
        })
        break

      case "landcover":
        // CartoDB Positron (Clean style for land cover analysis)
        tileLayer = window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: "© OpenStreetMap contributors © CARTO",
          maxZoom: 19,
        })
        break

      case "ndvi":
        // Stamen Terrain (Good for vegetation analysis)
        tileLayer = window.L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png", {
          attribution: "Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap contributors",
          maxZoom: 18,
        })
        break

      case "temperature":
        // CartoDB Dark (Good contrast for temperature data)
        tileLayer = window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: "© OpenStreetMap contributors © CARTO",
          maxZoom: 19,
        })
        break

      case "fires":
        // Standard OSM for fire overlay
        tileLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        })
        break

      default:
        // Default OpenStreetMap
        tileLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        })
    }

    tileLayer.addTo(map)
    layerGroupsRef.current[selectedLayer] = tileLayer
  }

  const updateFireData = () => {
    if (!mapInstanceRef.current || !window.L) return

    const map = mapInstanceRef.current

    // Remove existing fire markers
    if (layerGroupsRef.current.fires) {
      map.removeLayer(layerGroupsRef.current.fires)
    }

    if (selectedLayer === "fires" && fireData.length > 0) {
      const fireGroup = window.L.layerGroup()

      fireData.forEach((fire, index) => {
        const size = Math.max(6, Math.min(16, (fire.brightness - 280) / 8))
        const opacity = Math.max(0.7, fire.confidence / 100)

        // Color based on confidence level
        let fireColor = "#ff4444"
        if (fire.confidence >= 90) fireColor = "#dc2626"
        else if (fire.confidence >= 80) fireColor = "#ef4444"
        else if (fire.confidence >= 70) fireColor = "#f87171"
        else fireColor = "#fca5a5"

        const fireMarker = window.L.circleMarker([fire.latitude, fire.longitude], {
          radius: size,
          fillColor: fireColor,
          color: "#991b1b",
          weight: 2,
          opacity: opacity,
          fillOpacity: opacity * 0.8,
        })

        // Add pulsing animation for high confidence fires
        if (fire.confidence >= 85) {
          const pulseMarker = window.L.circleMarker([fire.latitude, fire.longitude], {
            radius: size + 4,
            fillColor: fireColor,
            color: fireColor,
            weight: 1,
            opacity: 0.4,
            fillOpacity: 0.2,
          })
          fireGroup.addLayer(pulseMarker)
        }

        fireMarker.bindPopup(`
          <div style="padding: 12px; min-width: 220px; font-family: system-ui;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 20px; margin-right: 8px;">🔥</span>
              <h4 style="margin: 0; color: #dc2626; font-size: 16px;">Fire Hotspot</h4>
            </div>
            
            <div style="background: #fef2f2; padding: 8px; border-radius: 6px; margin-bottom: 10px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                <div>
                  <span style="color: #6b7280;">Latitude:</span><br>
                  <strong style="color: #1f2937;">${fire.latitude.toFixed(4)}°</strong>
                </div>
                <div>
                  <span style="color: #6b7280;">Longitude:</span><br>
                  <strong style="color: #1f2937;">${fire.longitude.toFixed(4)}°</strong>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
              <div style="text-align: center; background: #fff7ed; padding: 6px; border-radius: 4px;">
                <div style="font-size: 11px; color: #9a3412; font-weight: 600;">BRIGHTNESS</div>
                <div style="font-size: 14px; font-weight: bold; color: #ea580c;">${fire.brightness.toFixed(1)}°K</div>
              </div>
              <div style="text-align: center; background: #f0fdf4; padding: 6px; border-radius: 4px;">
                <div style="font-size: 11px; color: #166534; font-weight: 600;">CONFIDENCE</div>
                <div style="font-size: 14px; font-weight: bold; color: ${fire.confidence >= 80 ? "#16a34a" : fire.confidence >= 70 ? "#ca8a04" : "#dc2626"};">${fire.confidence}%</div>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 6px; border-radius: 4px; text-align: center;">
              <div style="font-size: 11px; color: #6b7280;">Detection Date</div>
              <div style="font-size: 12px; font-weight: 600; color: #374151;">${fire.acq_date}</div>
            </div>

            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <div style="font-size: 10px; color: #9ca3af; text-align: center;">
                📡 Data Source: NASA FIRMS VIIRS
              </div>
            </div>
          </div>
        `)

        fireGroup.addLayer(fireMarker)
      })

      fireGroup.addTo(map)
      layerGroupsRef.current.fires = fireGroup
    }
  }

  const zoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }

  const zoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(indonesiaCenter, 5)
    }
  }

  const fitIndonesia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(indonesiaBounds, { padding: [30, 30] })
    }
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🇮🇩</span>
            </div>
          </div>
          <p className="text-gray-700 font-medium">Loading Indonesia Map...</p>
          <p className="text-sm text-gray-500 mt-2">Powered by OpenStreetMap</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>🗺️ Real Geography</span>
            <span>•</span>
            <span>🏙️ 21 Cities</span>
            <span>•</span>
            <span>🔥 Fire Data</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Enhanced Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200"
          onClick={zoomIn}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200"
          onClick={zoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200"
          onClick={resetView}
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-emerald-500 text-white backdrop-blur-sm shadow-lg hover:bg-emerald-600 border-emerald-400"
          onClick={fitIndonesia}
          title="Fit Indonesia"
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>

      {/* Enhanced Layer Info */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="text-gray-700">
            {selectedLayer === "landcover" && "🌿 Land Cover Analysis"}
            {selectedLayer === "satellite" && "🛰️ Satellite Imagery"}
            {selectedLayer === "terrain" && "🏔️ Terrain & Topography"}
            {selectedLayer === "ndvi" && "🌱 Vegetation Index"}
            {selectedLayer === "temperature" && "🌡️ Temperature Data"}
            {selectedLayer === "fires" && "🔥 Fire Hotspots"}
          </span>
        </div>
      </div>

      {/* Enhanced Coordinates Display */}
      {clickedCoords && (
        <div className="absolute top-20 right-4 z-[1000] bg-emerald-500 text-white rounded-lg px-4 py-3 text-sm shadow-lg border border-emerald-400">
          <div className="font-medium flex items-center gap-2">
            <span>📍</span>
            <span>Clicked Location</span>
          </div>
          <div className="text-xs opacity-90 mt-1 font-mono">
            {clickedCoords.lat.toFixed(6)}°S, {clickedCoords.lng.toFixed(6)}°E
          </div>
        </div>
      )}

      {/* Enhanced Zoom Level */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Zoom:</span>
          <span className="font-bold text-gray-700">{currentZoom}</span>
        </div>
      </div>

      {/* Enhanced Fire Count */}
      {selectedLayer === "fires" && fireData.length > 0 && (
        <div className="absolute bottom-4 right-4 z-[1000] bg-red-500 text-white rounded-lg px-4 py-3 text-sm shadow-lg border border-red-400">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-lg">🔥</span>
            <div>
              <div className="font-bold">{fireData.length} Active Fires</div>
              <div className="text-xs opacity-90">Click markers for details</div>
            </div>
          </div>
        </div>
      )}

      {/* Indonesia Flag & Info */}
      <div className="absolute bottom-16 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇮🇩</span>
          <div>
            <div className="font-medium text-gray-700">Republic of Indonesia</div>
            <div className="text-gray-500">17,508 Islands • 1.9M km²</div>
          </div>
        </div>
      </div>

      {/* Enhanced Instructions */}
      <div className="absolute bottom-32 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow-lg max-w-xs border border-gray-200">
        <div className="font-medium mb-1 text-gray-700">Map Controls:</div>
        <div className="space-y-1">
          <div>🖱️ Click anywhere for coordinates</div>
          <div>🔍 Scroll wheel to zoom in/out</div>
          <div>📍 Click city/fire markers for info</div>
          <div>🗺️ Drag to pan around Indonesia</div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-1 right-1 z-[1000] bg-white/80 px-2 py-1 text-xs text-gray-600 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  )
}
