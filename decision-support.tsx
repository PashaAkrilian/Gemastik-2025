"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Target,
  BarChart3,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Settings,
  Download,
  Play,
} from "lucide-react"

interface Criterion {
  id: string
  name: string
  weight: number
  description: string
  category: "environmental" | "economic" | "social"
}

interface Alternative {
  id: string
  name: string
  description: string
  scores: { [criterionId: string]: number }
  totalScore: number
  rank: number
}

interface Scenario {
  id: string
  name: string
  description: string
  criteria: Criterion[]
  alternatives: Alternative[]
  createdAt: Date
}

export default function DecisionSupport() {
  const [currentStep, setCurrentStep] = useState(1)
  const [scenarioName, setScenarioName] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      id: "biodiversity",
      name: "Biodiversity Conservation",
      weight: 25,
      description: "Impact on species diversity and habitat protection",
      category: "environmental",
    },
    {
      id: "carbon",
      name: "Carbon Sequestration",
      weight: 20,
      description: "Carbon storage and climate change mitigation",
      category: "environmental",
    },
    {
      id: "economic",
      name: "Economic Benefits",
      weight: 20,
      description: "Economic returns and job creation",
      category: "economic",
    },
    {
      id: "social",
      name: "Social Impact",
      weight: 15,
      description: "Community benefits and livelihood improvement",
      category: "social",
    },
    {
      id: "sustainability",
      name: "Long-term Sustainability",
      weight: 20,
      description: "Long-term viability and resource management",
      category: "environmental",
    },
  ])

  const [alternatives] = useState<Alternative[]>([
    {
      id: "conservation",
      name: "Strict Conservation",
      description: "Complete protection with no development",
      scores: {
        biodiversity: 95,
        carbon: 90,
        economic: 30,
        social: 40,
        sustainability: 85,
      },
      totalScore: 0,
      rank: 0,
    },
    {
      id: "ecotourism",
      name: "Ecotourism Development",
      description: "Sustainable tourism with conservation focus",
      scores: {
        biodiversity: 75,
        carbon: 70,
        economic: 80,
        social: 85,
        sustainability: 75,
      },
      totalScore: 0,
      rank: 0,
    },
    {
      id: "agroforestry",
      name: "Agroforestry System",
      description: "Integrated agriculture and forestry",
      scores: {
        biodiversity: 60,
        carbon: 65,
        economic: 75,
        social: 80,
        sustainability: 70,
      },
      totalScore: 0,
      rank: 0,
    },
    {
      id: "selective",
      name: "Selective Logging",
      description: "Sustainable timber harvesting",
      scores: {
        biodiversity: 45,
        carbon: 50,
        economic: 85,
        social: 70,
        sustainability: 55,
      },
      totalScore: 0,
      rank: 0,
    },
  ])

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const calculateScores = () => {
    const updatedAlternatives = alternatives.map((alt) => {
      const totalScore = criteria.reduce((sum, criterion) => {
        return sum + (alt.scores[criterion.id] * criterion.weight) / 100
      }, 0)
      return { ...alt, totalScore }
    })

    // Rank alternatives
    updatedAlternatives.sort((a, b) => b.totalScore - a.totalScore)
    updatedAlternatives.forEach((alt, index) => {
      alt.rank = index + 1
    })

    return updatedAlternatives
  }

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setCriteria((prev) => prev.map((c) => (c.id === criterionId ? { ...c, weight: newWeight } : c)))
  }

  const runAnalysis = async () => {
    if (!scenarioName || !selectedRegion) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)

          // Create new scenario
          const newScenario: Scenario = {
            id: Date.now().toString(),
            name: scenarioName,
            description: `MCDA analysis for ${selectedRegion}`,
            criteria: [...criteria],
            alternatives: calculateScores(),
            createdAt: new Date(),
          }

          setScenarios((prev) => [newScenario, ...prev])
          setCurrentStep(4)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "environmental":
        return "bg-green-100 text-green-800"
      case "economic":
        return "bg-blue-100 text-blue-800"
      case "social":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200"
      case 3:
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  const currentAlternatives = calculateScores()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">Decision Support System</h1>
            <p className="text-gray-600">Multi-Criteria Decision Analysis for Land Management</p>
          </div>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          MCDA Wizard
        </Badge>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-purple-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div className={currentStep >= 1 ? "text-purple-600 font-medium" : "text-gray-500"}>Setup Scenario</div>
            <div className={currentStep >= 2 ? "text-purple-600 font-medium" : "text-gray-500"}>Define Criteria</div>
            <div className={currentStep >= 3 ? "text-purple-600 font-medium" : "text-gray-500"}>Run Analysis</div>
            <div className={currentStep >= 4 ? "text-purple-600 font-medium" : "text-gray-500"}>View Results</div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Tabs value={`step${currentStep}`} className="space-y-6">
        {/* Step 1: Setup Scenario */}
        <TabsContent value="step1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>Scenario Setup</span>
              </CardTitle>
              <CardDescription>Define your decision scenario and select the region for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input
                      id="scenario-name"
                      placeholder="e.g., Kalimantan Forest Management"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="region">Target Region</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kalimantan">Kalimantan</SelectItem>
                        <SelectItem value="sumatra">Sumatra</SelectItem>
                        <SelectItem value="papua">Papua</SelectItem>
                        <SelectItem value="sulawesi">Sulawesi</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Analysis Overview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Decision Alternatives:</span>
                      <span className="font-medium">4 options</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evaluation Criteria:</span>
                      <span className="font-medium">5 criteria</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Analysis Method:</span>
                      <span className="font-medium">Weighted Sum</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => setCurrentStep(2)} disabled={!scenarioName || !selectedRegion} className="w-full">
                Continue to Criteria Definition
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Define Criteria */}
        <TabsContent value="step2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <span>Criteria Weights</span>
              </CardTitle>
              <CardDescription>Adjust the importance weights for each evaluation criterion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={getCategoryColor(criterion.category)}>{criterion.category}</Badge>
                      <div>
                        <div className="font-medium">{criterion.name}</div>
                        <div className="text-sm text-gray-600">{criterion.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">{criterion.weight}%</div>
                    </div>
                  </div>

                  <Slider
                    value={[criterion.weight]}
                    onValueChange={(value) => handleWeightChange(criterion.id, value[0])}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Weight Summary</span>
                </div>
                <div className="text-sm text-blue-700">
                  Total weight: {criteria.reduce((sum, c) => sum + c.weight, 0)}%
                  {criteria.reduce((sum, c) => sum + c.weight, 0) !== 100 && (
                    <span className="text-red-600 ml-2">(Should equal 100%)</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={criteria.reduce((sum, c) => sum + c.weight, 0) !== 100}
                  className="flex-1"
                >
                  Continue to Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Run Analysis */}
        <TabsContent value="step3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span>Analysis Execution</span>
              </CardTitle>
              <CardDescription>Review your settings and run the multi-criteria decision analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Scenario Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">{scenarioName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Region:</span>
                      <span className="font-medium">{selectedRegion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alternatives:</span>
                      <span className="font-medium">{alternatives.length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Criteria Weights</h3>
                  <div className="space-y-2">
                    {criteria.map((criterion) => (
                      <div key={criterion.id} className="flex justify-between text-sm">
                        <span>{criterion.name}:</span>
                        <span className="font-medium">{criterion.weight}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Running MCDA analysis...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={runAnalysis} disabled={isAnalyzing} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Results */}
        <TabsContent value="step4" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span>Analysis Results</span>
              </CardTitle>
              <CardDescription>Decision alternatives ranked by weighted scores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {currentAlternatives.map((alternative, index) => (
                  <div
                    key={alternative.id}
                    className={`border rounded-lg p-4 ${
                      alternative.rank === 1 ? "border-yellow-300 bg-yellow-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getRankColor(alternative.rank)}>#{alternative.rank}</Badge>
                        <div>
                          <h3 className="font-semibold">{alternative.name}</h3>
                          <p className="text-sm text-gray-600">{alternative.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{alternative.totalScore.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Total Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {criteria.map((criterion) => (
                        <div key={criterion.id} className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-sm font-medium">{alternative.scores[criterion.id]}</div>
                          <div className="text-xs text-gray-600">{criterion.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  New Analysis
                </Button>
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Previous Scenarios */}
      {scenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <span>Previous Analyses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scenarios.slice(0, 3).map((scenario) => (
                <div key={scenario.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-sm text-gray-600">
                      {scenario.createdAt.toLocaleDateString()} • {scenario.alternatives.length} alternatives
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
