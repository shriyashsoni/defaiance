"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Brain, TrendingUp, Target, AlertTriangle, Search, Star, Activity, Zap, DollarSign } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"

export default function AIAnalytics() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStartup, setSelectedStartup] = useState("QuantumAI Labs")

  const marketTrends = [
    { month: "Jan", aiml: 85, fintech: 78, cleantech: 72, healthcare: 80 },
    { month: "Feb", aiml: 88, fintech: 82, cleantech: 75, healthcare: 83 },
    { month: "Mar", aiml: 92, fintech: 85, cleantech: 78, healthcare: 86 },
    { month: "Apr", aiml: 89, fintech: 88, cleantech: 82, healthcare: 89 },
    { month: "May", aiml: 94, fintech: 91, cleantech: 85, healthcare: 92 },
    { month: "Jun", aiml: 96, fintech: 89, cleantech: 88, healthcare: 94 },
  ]

  const riskAssessment = [
    { subject: "Team", A: 92, B: 85, fullMark: 100 },
    { subject: "Market", A: 88, B: 78, fullMark: 100 },
    { subject: "Technology", A: 95, B: 82, fullMark: 100 },
    { subject: "Financial", A: 85, B: 90, fullMark: 100 },
    { subject: "Competition", A: 78, B: 75, fullMark: 100 },
    { subject: "Execution", A: 90, B: 88, fullMark: 100 },
  ]

  const industryPerformance = [
    { name: "AI/ML", value: 35, growth: 15.2, color: "#3B82F6" },
    { name: "Fintech", value: 25, growth: 8.7, color: "#8B5CF6" },
    { name: "CleanTech", value: 17, growth: 12.1, color: "#10B981" },
    { name: "Healthcare", value: 13, growth: 9.8, color: "#F59E0B" },
    { name: "Others", value: 10, growth: 6.3, color: "#EF4444" },
  ]

  const aiInsights = [
    {
      type: "opportunity",
      title: "High Growth Potential Detected",
      description: "QuantumAI Labs shows 94% probability of 10x returns based on team credentials and market timing.",
      confidence: 94,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      type: "warning",
      title: "Market Saturation Risk",
      description: "AI/ML sector showing signs of oversaturation. Consider diversification strategies.",
      confidence: 78,
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      type: "recommendation",
      title: "Optimal Investment Window",
      description: "Current market conditions favor early-stage CleanTech investments with 85% success rate.",
      confidence: 85,
      icon: <Target className="h-5 w-5" />,
    },
  ]

  const startupAnalysis = {
    "QuantumAI Labs": {
      overallScore: 94,
      teamScore: 92,
      marketScore: 88,
      techScore: 95,
      financialScore: 85,
      riskLevel: "Low",
      growthPotential: "Very High",
      recommendation: "Strong Buy",
      keyMetrics: {
        founderExperience: 15,
        marketSize: "12.5B",
        competitorCount: 8,
        fundingHistory: "Series A",
      },
    },
  }

  const currentAnalysis = startupAnalysis[selectedStartup as keyof typeof startupAnalysis]

  return (
    <div className="min-h-screen bg-[#0a0f2c] text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron gradient-text">AI Analytics Dashboard</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-inter">
            Intelligent investing powered by advanced AI algorithms and real-time market analysis
          </p>
        </motion.div>

        {/* AI Insights Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {aiInsights.map((insight, index) => (
            <Card key={index} className="glass-card neon-glow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-lg ${
                      insight.type === "opportunity"
                        ? "bg-green-500/20 text-green-400"
                        : insight.type === "warning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {insight.icon}
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20">{insight.confidence}% confidence</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-white mb-2 font-orbitron">{insight.title}</h3>
                <p className="text-gray-400 text-sm font-inter">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Search and Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white font-orbitron flex items-center">
                <Brain className="h-6 w-6 mr-2 text-blue-400" />
                DEFAI Intelligence Engine
              </CardTitle>
              <CardDescription className="text-gray-400 font-inter">
                Enter a startup name to get AI-powered investment analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search startup for AI analysis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-card border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <Button className="glass-card neon-glow font-orbitron">
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Analytics Dashboard */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card border border-white/10 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 font-orbitron">
              Overview
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-purple-500 font-orbitron">
              Market Trends
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-pink-500 font-orbitron">
              Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="predictions" className="data-[state=active]:bg-orange-500 font-orbitron">
              Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Startup Analysis */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron">Startup Analysis: {selectedStartup}</CardTitle>
                  <CardDescription className="text-gray-400 font-inter">
                    Comprehensive AI-powered evaluation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2 font-orbitron">
                      {currentAnalysis.overallScore}/100
                    </div>
                    <div className="text-gray-400 font-inter">Overall AI Score</div>
                    <Badge
                      className={`mt-2 ${
                        currentAnalysis.overallScore >= 90
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : currentAnalysis.overallScore >= 80
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }`}
                    >
                      {currentAnalysis.recommendation}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 font-inter">Team Score</span>
                        <span className="text-white font-semibold">{currentAnalysis.teamScore}/100</span>
                      </div>
                      <Progress value={currentAnalysis.teamScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 font-inter">Market Score</span>
                        <span className="text-white font-semibold">{currentAnalysis.marketScore}/100</span>
                      </div>
                      <Progress value={currentAnalysis.marketScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 font-inter">Technology Score</span>
                        <span className="text-white font-semibold">{currentAnalysis.techScore}/100</span>
                      </div>
                      <Progress value={currentAnalysis.techScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 font-inter">Financial Score</span>
                        <span className="text-white font-semibold">{currentAnalysis.financialScore}/100</span>
                      </div>
                      <Progress value={currentAnalysis.financialScore} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div>
                      <div className="text-gray-400 text-sm font-inter">Risk Level</div>
                      <div className="text-white font-semibold font-orbitron">{currentAnalysis.riskLevel}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm font-inter">Growth Potential</div>
                      <div className="text-white font-semibold font-orbitron">{currentAnalysis.growthPotential}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Industry Performance */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron">Industry Performance</CardTitle>
                  <CardDescription className="text-gray-400 font-inter">
                    Investment distribution and growth rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={industryPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {industryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {industryPerformance.map((industry, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: industry.color }} />
                          <span className="text-gray-400 font-inter">{industry.name}</span>
                        </div>
                        <span className={`font-semibold ${industry.growth > 10 ? "text-green-400" : "text-blue-400"}`}>
                          +{industry.growth}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">Key Metrics & Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text mb-1 font-orbitron">
                      {currentAnalysis.keyMetrics.founderExperience}
                    </div>
                    <div className="text-gray-400 text-sm font-inter">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text mb-1 font-orbitron">
                      ${currentAnalysis.keyMetrics.marketSize}
                    </div>
                    <div className="text-gray-400 text-sm font-inter">Market Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text mb-1 font-orbitron">
                      {currentAnalysis.keyMetrics.competitorCount}
                    </div>
                    <div className="text-gray-400 text-sm font-inter">Competitors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text mb-1 font-orbitron">
                      {currentAnalysis.keyMetrics.fundingHistory}
                    </div>
                    <div className="text-gray-400 text-sm font-inter">Stage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">Market Trend Analysis</CardTitle>
                <CardDescription className="text-gray-400 font-inter">
                  Industry performance over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="aiml" stroke="#3B82F6" strokeWidth={3} name="AI/ML" />
                    <Line type="monotone" dataKey="fintech" stroke="#8B5CF6" strokeWidth={3} name="Fintech" />
                    <Line type="monotone" dataKey="cleantech" stroke="#10B981" strokeWidth={3} name="CleanTech" />
                    <Line type="monotone" dataKey="healthcare" stroke="#F59E0B" strokeWidth={3} name="Healthcare" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">Risk Assessment Radar</CardTitle>
                <CardDescription className="text-gray-400 font-inter">
                  Comprehensive risk analysis across multiple dimensions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={riskAssessment}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF" }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9CA3AF" }} />
                    <Radar
                      name="Current Startup"
                      dataKey="A"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Industry Average"
                      dataKey="B"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron">AI Predictions</CardTitle>
                  <CardDescription className="text-gray-400 font-inter">
                    Machine learning-based forecasts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-green-400 font-semibold font-orbitron">High Confidence</span>
                    </div>
                    <p className="text-gray-300 text-sm font-inter">
                      94% probability of achieving 10x returns within 3-5 years based on current trajectory and market
                      conditions.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Activity className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-blue-400 font-semibold font-orbitron">Market Timing</span>
                    </div>
                    <p className="text-gray-300 text-sm font-inter">
                      Optimal investment window detected. Market conditions favor early-stage AI investments.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-purple-400 font-semibold font-orbitron">Exit Potential</span>
                    </div>
                    <p className="text-gray-300 text-sm font-inter">
                      Strong acquisition potential from major tech companies within 2-3 years.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron">Investment Recommendations</CardTitle>
                  <CardDescription className="text-gray-400 font-inter">
                    AI-generated investment strategies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-semibold font-orbitron">Recommended Allocation</div>
                      <div className="text-gray-400 text-sm font-inter">Based on risk profile</div>
                    </div>
                    <div className="text-2xl font-bold gradient-text font-orbitron">15%</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-semibold font-orbitron">Optimal Entry Point</div>
                      <div className="text-gray-400 text-sm font-inter">Price target</div>
                    </div>
                    <div className="text-2xl font-bold gradient-text font-orbitron">$0.22</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-semibold font-orbitron">Expected ROI</div>
                      <div className="text-gray-400 text-sm font-inter">3-year projection</div>
                    </div>
                    <div className="text-2xl font-bold gradient-text font-orbitron">850%</div>
                  </div>

                  <Button className="w-full glass-card neon-glow font-orbitron">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Invest Based on AI Recommendation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
