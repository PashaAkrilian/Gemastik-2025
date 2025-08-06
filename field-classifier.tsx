"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Satellite, Upload, Brain, BarChart3, Play, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react"

interface ClassificationJob {
  id: string
  name: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  model: string
  accuracy: number
  createdAt: Date
  region: string
  imageCount: number
  results?: {
    forest: number
    agriculture: number
    urban: number
    water: number
    other: number
  }
}

interface MLModel {
  id: string
  name: string
  description: string
  accuracy: number
  trainingData: string
  processingTime: string
  recommended: boolean
}

export default function FieldClassifier() {
  const [jobs, setJobs] = useState<ClassificationJob[]>([])
  const [selectedModel, setSelectedModel] = useState("")
  const [jobName, setJobName] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const models: MLModel[] = [
    {
      id: "random-forest",
      name: "Random Forest Classifier",
      description: "Ensemble method with high accuracy for land cover classification",
      accuracy: 94.2,
      trainingData: "Landsat 8/9 + Sentinel-2",
      processingTime: "~15 minutes",
      recommended: true
    },
    {
      id: "svm",
      name: "Support Vector Machine",
      description: "Robust classifier for complex land cover patterns",
      accuracy: 91.8,
      trainingData: "Multi-spectral imagery",
      processingTime: "~20 minutes",
      recommended: false
    },
    {
      id: "neural-network",
      name: "Deep Neural Network",
      description: "Advanced deep learning model for high-resolution classification",
      accuracy: 96.5,
      trainingData: "High-res satellite + UAV",
      processingTime: "~45 minutes",
      recommended: true
    },
    {
      id: "gradient-boost",
      name: "Gradient Boosting",
      description: "Fast and efficient classifier for large-scale analysis",
      accuracy: 89.3,
      trainingData: "Landsat time series",
      processingTime: "~10 minutes",
      recommended: false
    }
  ]

  useEffect(() => {
    // Initialize with some sample jobs
    const sampleJobs: ClassificationJob[] = [
      {
        id: "1",
        name: "Kalimantan Forest Analysis",
        status: "completed",
        progress: 100,
        model: "Random Forest",
        accuracy: 94.2,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        region: "Central Kalimantan",
        imageCount: 156,
        results: {
          forest: 68.5,
          agriculture: 18.2,
          urban: 3.1,
          water: 7.8,
          other: 2.4
        }
      },
      {
        id: "2",
        name: "Java Agricultural Mapping",
        status: "processing",
        progress: 73,
        model: "Neural Network",
        accuracy: 0,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        region: "West Java",
        imageCount: 89,
      },
      {
        id: "3",
        name: "Sumatra Deforestation Study",
        status: "failed",
        progress: 45,
        model: "SVM",
        accuracy: 0,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        region: "North Sumatra",
        imageCount: 203,
      }
    ]
    setJobs(sampleJobs)
  }, [])

  const handleStartClassification = async () => {
    if (!jobName || !selectedRegion || !selectedModel) return

    setIsProcessing(true)
    setUploadProgress(0)

    const newJob: ClassificationJob = {
      id: Date.now().toString(),
      name: jobName,
      status: "pending",
      progress: 0,
      model: models.find(m => m.id === selectedModel)?.name || "",
      accuracy: 0,
      createdAt: new Date(),
      region: selectedRegion,
      imageCount: Math.floor(Math.random() * 200) + 50,
    }

    setJobs(prev => [newJob, ...prev])

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          
          // Start processing
          setTimeout(() => {
            setJobs(prev => prev.map(job => 
              job.id === newJob.id 
                ? { ...job, status: "processing", progress: 10 }
                : job
            ))
            
            // Simulate processing progress
            const processInterval = setInterval(() => {
              setJobs(prev => prev.map(job => {
                if (job.id === newJob.id && job.status === "processing") {
                  const newProgress = job.progress + Math.random() * 15
                  if (newProgress >= 100) {
                    clearInterval(processInterval)
                    return {
                      ...job,
                      status: "completed",
                      progress: 100,
                      accuracy: models.find(m => m.id === selectedModel)?.accuracy || 90,
                      results: {
                        forest: Math.random() * 40 + 30,
                        agriculture: Math.random() * 30 + 20,
                        urban: Math.random() * 10 + 5,
                        water: Math.random() * 15 + 5,
                        other: Math.random() * 10 + 2
                      }
                    }
                  }
                  return { ...job, progress: Math.min(newProgress, 99) }
                }
                return job
              }))
            }, 1000)
          }, 2000)
          
          setIsProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Reset form
    setJobName("")
    setSelectedRegion("")
    setSelectedModel("")
  }

  const getStatusColor = (status: ClassificationJob["status"]) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: ClassificationJob["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />
      case "processing": return <Zap className="w-4 h-4 text-blue-600" />
      case "pending": return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed": return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Satellite className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Field Classification System</h1>
            <p className="text-gray-600">Machine learning pipeline for satellite image classification</p>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          ML Pipeline
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Jobs</p>
                <p className="text-3xl font-bold text-blue-700">{jobs.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-3xl font-bold text-green-700">
                  {jobs.filter(j => j.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Processing</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {jobs.filter(j => j.status === "processing").length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg. Accuracy</p>
                <p className="text-3xl font-bold text-purple-700">
                  {jobs.filter(j => j.accuracy > 0).length > 0 
                    ? (jobs.filter(j => j.accuracy > 0).reduce((sum, j) => sum + j.accuracy, 0) / jobs.filter(j => j.accuracy > 0).length).toFixed(1)
                    : "0"}%
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="new-job" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-job" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>New Classification</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Job History</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>ML Models</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-job" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Start New Classification Job</span>
              </CardTitle>
              <CardDescription>
                Configure and launch a new satellite image classification task
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="job-name">Job Name</Label>
                    <Input
                      id="job-name"
                      placeholder="e.g., Papua Forest Classification"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
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
                        <SelectItem value="bali">Bali & Nusa Tenggara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="model">ML Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose classification model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              {model.recommended && (
                                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Selected Model Details</h3>
                    {selectedModel ? (
                      <div className="space-y-2 text-sm">
                        {(() => {
                          const model = models.find(m => m.id === selectedModel)
                          return model ? (
                            <>
                              <div className="flex justify-between">
                                <span>Accuracy:</span>
                                <span className="font-medium">{model.accuracy}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Training Data:</span>
                                <span className="font-medium">{model.trainingData}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Processing Time:</span>
                                <span className="font-medium">{model.processingTime}</span>
                              </div>
                              <p className="text-gray-600 mt-2">{model.description}</p>
                            </>
                          ) : null
                        })()}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Select a model to view details</p>
                    )}
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading satellite data...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleStartClassification}
                disabled={!jobName || !selectedRegion || !selectedModel || isProcessing}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? "Starting Classification..." : "Start Classification Job"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <span>Classification Job History</span>
              </CardTitle>
              <CardDescription>
                Track and manage your satellite image classification tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <h3 className="font-semibold">{job.name}</h3>
                          <p className="text-sm text-gray-600">
                            {job.region} • {job.imageCount} images • {formatTimeAgo(job.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.toUpperCase()}
                        </Badge>
                        {job.accuracy > 0 && (
                          <Badge variant="outline">
                            {job.accuracy}% accuracy
                          </Badge>
                        )}
                      </div>
                    </div>

                    {job.status === "processing" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Processing with {job.model}...</span>
                          <span>{job.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={job.progress} className="w-full" />
                      </div>
                    )}

                    {job.results && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-700">
                            {job.results.forest.toFixed(1)}\
