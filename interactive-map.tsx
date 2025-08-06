"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface FireData {
  latitude: number
  longitude: number
  brightness: number
  confidence: number
  acq_date: string
}

interface InteractiveMapProps {
  selectedLayer: string
  fireData: FireData[]
  onMapClick: (lat: number, lng: number) => void
}

export default function InteractiveMap({ selectedLayer, fireData, onMapClick }: InteractiveMapProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSVGClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom

    // Convert SVG coordinates to approximate lat/lng
    const lat = -((y - 300) / 300) * 15 + 2
    const lng = ((x - 400) / 400) * 30 + 95

    onMapClick(lat, lng)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getLayerColor = () => {
    switch (selectedLayer) {
      case "landcover":
        return "#22c55e"
      case "satellite":
        return "#3b82f6"
      case "terrain":
        return "#f97316"
      case "ndvi":
        return "#10b981"
      case "temperature":
        return "#ef4444"
      case "fires":
        return "#dc2626"
      default:
        return "#22c55e"
    }
  }

  const getLayerOpacity = () => {
    switch (selectedLayer) {
      case "satellite":
        return 0.8
      case "temperature":
        return 0.7
      case "fires":
        return 0.9
      default:
        return 0.6
    }
  }

  // Indonesia major cities
  const cities = [
    { name: "Jakarta", x: 420, y: 380, lat: -6.2088, lng: 106.8456 },
    { name: "Surabaya", x: 480, y: 390, lat: -7.2575, lng: 112.7521 },
    { name: "Medan", x: 350, y: 280, lat: 3.5952, lng: 98.6722 },
    { name: "Bandung", x: 430, y: 385, lat: -6.9175, lng: 107.6191 },
    { name: "Makassar", x: 540, y: 420, lat: -5.1477, lng: 119.4327 },
    { name: "Palembang", x: 400, y: 360, lat: -2.9761, lng: 104.7754 },
    { name: "Banjarmasin", x: 500, y: 400, lat: -3.3194, lng: 114.5906 },
    { name: "Manado", x: 580, y: 320, lat: 1.4748, lng: 124.8421 },
  ]

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
          onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="bg-white/90 backdrop-blur-sm"
          onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm" onClick={resetView}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Layer Info */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium">
        {selectedLayer === "landcover" && "🌿 Land Cover"}
        {selectedLayer === "satellite" && "🛰️ Satellite View"}
        {selectedLayer === "terrain" && "🏔️ Terrain"}
        {selectedLayer === "ndvi" && "🌱 Vegetation Index"}
        {selectedLayer === "temperature" && "🌡️ Temperature"}
        {selectedLayer === "fires" && "🔥 Fire Hotspots"}
      </div>

      {/* Zoom Level */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
        Zoom: {(zoom * 100).toFixed(0)}%
      </div>

      {/* SVG Map */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        className="cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleSVGClick}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Background */}
        <rect width="800" height="600" fill="url(#oceanGradient)" />

        {/* Gradients */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={getLayerColor()} stopOpacity={getLayerOpacity()} />
            <stop offset="100%" stopColor={getLayerColor()} stopOpacity={getLayerOpacity() * 0.7} />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Indonesia Main Islands - Simplified Paths */}

        {/* Sumatra */}
        <path
          d="M 280 200 L 320 180 L 360 200 L 380 240 L 390 280 L 400 320 L 410 360 L 400 400 L 380 420 L 360 400 L 340 380 L 320 360 L 300 340 L 280 320 L 270 280 L 260 240 Z"
          fill="url(#landGradient)"
          stroke="#065f46"
          strokeWidth="1"
          filter="url(#shadow)"
          className="hover:brightness-110 transition-all duration-200"
        />

        {/* Java */}
        <path
          d="M 400 380 L 500 375 L 520 380 L 540 385 L 560 390 L 580 395 L 590 400 L 580 410 L 560 415 L 540 410 L 520 405 L 500 400 L 480 395 L 460 390 L 440 385 L 420 382 Z"
          fill="url(#landGradient)"
          stroke="#065f46"
          strokeWidth="1"
          filter="url(#shadow)"
          className="hover:brightness-110 transition-all duration-200"
        />

        {/* Kalimantan (Borneo) */}
        <path
          d="M 460 300 L 520 290 L 560 300 L 580 320 L 590 340 L 600 360 L 590 380 L 580 400 L 560 420 L 540 430 L 520 425 L 500 420 L 480 410 L 460 400 L 450 380 L 440 360 L 450 340 L 460 320 Z"
          fill="url(#landGradient)"
          stroke="#065f46"
          strokeWidth="1"
          filter="url(#shadow)"
          className="hover:brightness-110 transition-all duration-200"
        />

        {/* Sulawesi */}
        <path
          d="M 540 320 L 560 310 L 580 315 L 590 325 L 585 335 L 575 345 L 570 355 L 575 365 L 585 375 L 580 385 L 570 390 L 560 385 L 550 380 L 545 370 L 540 360 L 535 350 L 540 340 L 545 330 Z"
          fill="url(#landGradient)"
          stroke="#065f46"
          strokeWidth="1"
          filter="url(#shadow)"
          className="hover:brightness-110 transition-all duration-200"
        />

        {/* Papua */}
        <path
          d="M 620 340 L 680 335 L 720 340 L 740 350 L 750 360 L 745 370 L 740 380 L 730 390 L 720 395 L 700 400 L 680 395 L 660 390 L 640 385 L 625 375 L 620 365 L 615 355 L 620 345 Z"
          fill="url(#landGradient)"
          stroke="#065f46"
          strokeWidth="1"
          filter="url(#shadow)"
          className="hover:brightness-110 transition-all duration-200"
        />

        {/* Smaller Islands */}
        <circle cx="430" cy="390" r="8" fill="url(#landGradient)" stroke="#065f46" strokeWidth="1" />
        <circle cx="520" cy="400" r="6" fill="url(#landGradient)" stroke="#065f46" strokeWidth="1" />
        <circle cx="600" cy="380" r="5" fill="url(#landGradient)" stroke="#065f46" strokeWidth="1" />
        <circle cx="650" cy="370" r="4" fill="url(#landGradient)" stroke="#065f46" strokeWidth="1" />

        {/* Fire Hotspots */}
        {selectedLayer === "fires" &&
          fireData.map((fire, index) => {
            const x = ((fire.longitude - 95) / 30) * 400 + 400
            const y = (-(fire.latitude - 2) / 15) * 300 + 300
            const size = Math.max(2, (fire.brightness - 280) / 20)
            const opacity = fire.confidence / 100

            return (
              <g key={index}>
                <circle cx={x} cy={y} r={size + 2} fill="#ff4444" opacity={opacity * 0.3} className="animate-pulse" />
                <circle cx={x} cy={y} r={size} fill="#ff0000" opacity={opacity} />
              </g>
            )
          })}

        {/* Cities */}
        {cities.map((city, index) => (
          <g key={index}>
            <circle
              cx={city.x}
              cy={city.y}
              r="4"
              fill="#1f2937"
              stroke="#ffffff"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200"
            />
            <text
              x={city.x + 8}
              y={city.y + 4}
              fontSize="12"
              fill="#1f2937"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              {city.name}
            </text>
          </g>
        ))}

        {/* Grid Lines (optional) */}
        {selectedLayer === "terrain" && (
          <g opacity="0.2">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" stroke="#374151" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#374151" strokeWidth="0.5" />
            ))}
          </g>
        )}

        {/* Layer-specific overlays */}
        {selectedLayer === "temperature" && (
          <g opacity="0.4">
            <circle cx="350" cy="300" r="50" fill="#ff4444" />
            <circle cx="500" cy="350" r="40" fill="#ff6666" />
            <circle cx="600" cy="380" r="35" fill="#ff8888" />
          </g>
        )}

        {selectedLayer === "ndvi" && (
          <g opacity="0.5">
            <rect x="280" y="200" width="120" height="200" fill="#22c55e" rx="10" />
            <rect x="460" y="300" width="140" height="130" fill="#16a34a" rx="10" />
            <rect x="620" y="340" width="130" height="60" fill="#15803d" rx="10" />
          </g>
        )}
      </svg>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600">
        🖱️ Drag to pan • 🔄 Scroll to zoom • 📍 Click for coordinates
      </div>
    </div>
  )
}
