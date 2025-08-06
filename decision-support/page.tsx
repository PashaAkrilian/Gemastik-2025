"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Leaf,
  LayoutDashboard,
  MapPin,
  Settings,
  HelpCircle,
  Home,
  Map,
  AlertTriangle,
  TreePine,
  Brain,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
} from "lucide-react"
import Link from "next/link"

interface DecisionScenario {
  id: string
  title: string
  description: string
  category: "crop" | "land-use" | "conservation" | "investment" | "risk"
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "analyzing" | "completed"
  createdDate: string
  deadline: string
  factors: string[]
  recommendations: Recommendation[]
  riskLevel: number
  expectedROI: number
  confidence: number
}

interface Recommendation {
  id: string
  title: string
  description: string
  impact: "low" | "medium" | "high"
  feasibility: "low" | "medium" | "high"
  cost: number
  timeframe: string
  pros: string[]
  cons: string[]
}

export default function DecisionSupport() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [scenarios, setScenarios] = useState<DecisionScenario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewScenario, setShowNewScenario] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [newScenario, setNewScenario] = useState({
    title: "",
    description: "",
    category: "",
    deadline: "",
    factors: "",
  })

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load scenarios data
  useEffect(() => {
    loadScenariosData()
  }, [])

  const formatDate = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]

    return {
      dayName: days[date.getDay()],
      fullDate: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
      time: date.toLocaleTimeString("en-US", { hour12: false }),
    }
  }

  const dateInfo = formatDate(currentTime)

  const loadScenariosData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockScenarios: DecisionScenario[] = [
        {
          id: "1",
          title: "Rice vs Corn Crop Selection",
          description: "Deciding between rice and corn cultivation for the upcoming season based on market prices, weather forecasts, and soil conditions.",
          category: "crop",
          priority: "high",
          status: "completed",
          createdDate: "2025-01-20",
          deadline: "2025-02-15",
          factors: ["Market prices", "Weather forecast", "Soil moisture", "Labor availability"],
          recommendations: [
            {
              id: "1a",
              title: "Plant Rice in 70% of Area",
              description: "Focus on rice cultivation due to favorable water conditions and stable market demand.",
              impact: "high",
              feasibility: "high",
              cost: 15000,
              timeframe: "3-4 months",
              pros: ["Stable market demand", "Good water availability", "Proven expertise"],
              cons: ["Lower profit margins", "Pest risk"],
            },
            {
              id: "1b",
              title: "Mixed Cultivation Strategy",
              description: "Plant 50% rice and 50% corn to diversify risk and maximize returns.",
              impact: "medium",
              feasibility: "medium",
              cost: 18000,
              timeframe: "4-5 months",
              pros: ["Risk diversification", "Market flexibility", "Soil health benefits"],
              cons: ["Complex management", "Higher initial costs"],
            },
          ],
          riskLevel: 35,
          expectedROI: 22,
          confidence: 85,
        },
        {
          id: "2",
          title: "Forest Conservation vs Palm Oil",
          description: "Evaluating the trade-offs between maintaining forest cover and converting land for palm oil plantation.",
          category: "land-use",
          priority: "critical",
          status: "analyzing",
          createdDate: "2025-01-25",
          deadline: "2025-03-01",
          factors: ["Environmental impact", "Economic returns", "Regulations", "Community impact"],
          recommendations: [
            {
              id: "2a",
              title: "Maintain Forest Conservation",
              description: "Keep existing forest cover and explore eco-tourism and carbon credit opportunities.",
              impact: "high",
              feasibility: "medium",
              cost: 5000,
              timeframe: "Long-term",
              pros: ["Environmental benefits", "Carbon credits", "Biodiversity conservation"],
              cons: ["Lower immediate returns", "Limited income sources"],
            },
          ],
          riskLevel: 65,
          expectedROI: 8,
          confidence: 72,
        },
        {
          id: "3",
          title: "Irrigation System Investment",
          description: "Assessing the viability of installing a modern drip irrigation system to improve water efficiency.",
          category: "investment",
          priority: "medium",
          status: "pending",
          createdDate: "2025-01-28",
          deadline: "2025-02-28",
          factors: ["Water scarcity", "Crop yield improvement", "Installation costs", "Maintenance requirements"],
          recommendations: [],
          riskLevel: 25,
          expectedROI: 35,
          confidence: 68,
        },
        {
          id: "4",
          title: "Drought Risk Mitigation",
          description: "Developing strategies to minimize crop losses during extended dry periods based on climate projections.",
          category: "risk",
          priority: "high",
          status: "analyzing",
          createdDate: "2025-01-22",
          deadline: "2025-02-20",
          factors: ["Climate projections", "Water storage capacity", "Drought-resistant varieties", "Insurance options"],
          recommendations: [
            {
              id: "4a",
              title: "Implement Water Storage System",
              description: "Build rainwater harvesting and storage infrastructure to maintain water supply during dry periods.",
              impact: "high",
              feasibility: "medium",
              cost: 25000,
              timeframe: "6-8 months",
              pros: ["Water security", "Reduced dependency", "Long-term benefits"],
              cons: ["High initial investment", "Maintenance costs"],
            },
          ],
          riskLevel: 75,
          expectedROI: 18,
          confidence: 78,
        },
      ]

      setScenarios(mockScenarios)
    } catch (error) {
      console.error("Error loading scenarios data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200"
      case "high":
        return "text-orange-600 bg-orange-100 border-orange-200"
      case "critical":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-gray-600 bg-gray-100"
      case "analyzing":
        return "text-blue-600 bg-blue-100"
      case "completed":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "analyzing":
        return <Activity className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "crop":
        return <TreePine className="w-5 h-5 text-green-600" />
      case "land-use":
        return <MapPin className="w-5 h-5 text-blue-600" />
      case "conservation":
        return <Leaf className="w-5 h-5 text-emerald-600" />
      case "investment":
        return <DollarSign className="w-5 h-5 text-purple-600" />
      case "risk":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Brain className="w-5 h-5 text-gray-600" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "text-blue-600 bg-blue-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case "low":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const handleCreateScenario = () => {
    if (!newScenario.title || !newScenario.description || !newScenario.category) return

    const scenario: DecisionScenario = {
      id: Date.now().toString(),
      title: newScenario.title,
      description: newScenario.description,
      category: newScenario.category as any,
      priority: "medium",
      status: "pending",
      createdDate: new Date().toISOString().split('T')[0],
      deadline: newScenario.deadline,
      factors: newScenario.factors.split(',').map(f => f.trim()).filter(f => f),
      recommendations: [],
      riskLevel: Math.floor(Math.random() * 50) + 25,
      expectedROI: Math.floor(Math.random() * 30) + 10,
      confidence: Math.floor(Math.random() * 30) + 60,
    }

    setScenarios(prev => [scenario, ...prev])
    setNewScenario({
      title: "",
      description: "",
      category: "",
      deadline: "",
      factors: "",
    })
    setShowNewScenario(false)
  }

  const selectedScenarioData = selectedScenario ? scenarios.find(s => s.id === selectedScenario) : null

  const getOverallStats = () => {
    const total = scenarios.length
    const pending = scenarios.filter(s => s.status === "pending").length
    const analyzing = scenarios.filter(s => s.status === "analyzing").length
    const completed = scenarios.filter(s => s.status === "completed").length
    const highPriority = scenarios.filter(s => s.priority === "high" || s.priority === "critical").length

    return { total, pending, analyzing, completed, highPriority }
  }

  const stats = getOverallStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50 flex flex-col min-h-screen shadow-2xl border-r border-emerald-200/50 relative">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600"></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Header with enhanced styling */}
        <div className="relative z-10 flex items-center gap-3 p-6 pb-4 border-b border-emerald-200/30 bg-white/20 backdrop-blur-sm">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-emerald-800 tracking-wide">EcoSentra</span>
        </div>

        {/* Main Navigation */}
        <nav className="relative z-10 space-y-1 px-4 flex-1 py-6">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
          </Link>
          <Link href="/fields">
            <Button
              variant="ghost"
              className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
            >
              <MapPin className="w-4 h-4 mr-3" />
              My Fields
            </Button>
          </Link>
          <Link href="/maps">
            <Button
              variant="ghost"
              className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
            >
              <Map className="w-4 h-4 mr-3" />
              Maps & Export
            </Button>
          </Link>
          <Link href="/disaster-alerts">
            <Button
              variant="ghost"
              className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
            >
              <AlertTriangle className="w-4 h-4 mr-3" />
              Disaster Alerts
            </Button>
          </Link>
          <Link href="/eco-services">
            <Button
              variant="ghost"
              className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
            >
              <TreePine className="w-4 h-4 mr-3" />
              Eco Services
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="w-full justify-start bg-white/80 text-emerald-800 shadow-lg border border-emerald-200/50 hover:bg-white/90 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            <Brain className="w-4 h-4 mr-3" />
            Decision Support
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
            >
              <Home className="w-4 h-4 mr-3" />
              Main Menu
            </Button>
          </Link>
        </nav>

        {/* Bottom Navigation */}
        <div className="relative z-10 space-y-1 px-4 pb-6 border-t border-emerald-200/30 pt-4 bg-white/10 backdrop-blur-sm">
          <Button
            variant="ghost"
            className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-emerald-700 hover:bg-white/40 hover:shadow-md transition-all duration-300 hover:translate-x-1"
          >
            <HelpCircle className="w-4 h-4 mr-3" />
            Help Center
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Decision Support System</h1>
            <p className="\
