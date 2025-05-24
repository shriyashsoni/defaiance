"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import StartupCard from "@/components/startup-card"
import InvestmentModal from "@/components/investment-modal"

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedStage, setSelectedStage] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [selectedStartup, setSelectedStartup] = useState<any>(null)
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false)

  const startups = [
    {
      id: "1",
      name: "QuantumAI Labs",
      industry: "AI/ML",
      stage: "Series A",
      raised: 2500000,
      target: 5000000,
      aiScore: 94,
      description: "Revolutionary quantum computing solutions for AI acceleration",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.25,
      totalTokens: 20000000,
      availableTokens: 10000000,
      investors: 234,
      daysLeft: 45,
      trending: true,
      featured: true,
    },
    {
      id: "2",
      name: "GreenTech Solutions",
      industry: "CleanTech",
      stage: "Seed",
      raised: 750000,
      target: 1500000,
      aiScore: 87,
      description: "Sustainable energy storage using advanced battery technology",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.15,
      totalTokens: 10000000,
      availableTokens: 5000000,
      investors: 156,
      daysLeft: 32,
      trending: false,
      featured: true,
    },
    {
      id: "3",
      name: "BioMed Innovations",
      industry: "Healthcare",
      stage: "Pre-Seed",
      raised: 300000,
      target: 800000,
      aiScore: 91,
      description: "AI-powered drug discovery platform for rare diseases",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.08,
      totalTokens: 10000000,
      availableTokens: 6250000,
      investors: 89,
      daysLeft: 67,
      trending: true,
      featured: false,
    },
    {
      id: "4",
      name: "CryptoSecure",
      industry: "Fintech",
      stage: "Series A",
      raised: 1800000,
      target: 3000000,
      aiScore: 88,
      description: "Next-generation blockchain security solutions for enterprises",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.3,
      totalTokens: 10000000,
      availableTokens: 4000000,
      investors: 312,
      daysLeft: 28,
      trending: false,
      featured: false,
    },
    {
      id: "5",
      name: "SpaceLogistics",
      industry: "Aerospace",
      stage: "Seed",
      raised: 950000,
      target: 2000000,
      aiScore: 85,
      description: "Autonomous satellite deployment and space logistics platform",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.2,
      totalTokens: 10000000,
      availableTokens: 5250000,
      investors: 178,
      daysLeft: 52,
      trending: true,
      featured: false,
    },
    {
      id: "6",
      name: "EduChain",
      industry: "EdTech",
      stage: "Pre-Seed",
      raised: 450000,
      target: 1000000,
      aiScore: 82,
      description: "Blockchain-based credential verification and learning platform",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.12,
      totalTokens: 8333333,
      availableTokens: 4583333,
      investors: 67,
      daysLeft: 41,
      trending: false,
      featured: false,
    },
  ]

  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || startup.industry === selectedIndustry
    const matchesStage = selectedStage === "all" || startup.stage === selectedStage

    return matchesSearch && matchesIndustry && matchesStage
  })

  const sortedStartups = [...filteredStartups].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return b.trending ? 1 : -1
      case "aiScore":
        return b.aiScore - a.aiScore
      case "raised":
        return b.raised - a.raised
      case "daysLeft":
        return a.daysLeft - b.daysLeft
      default:
        return 0
    }
  })

  const handleInvest = (startup: any) => {
    setSelectedStartup(startup)
    setIsInvestmentModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Investment Marketplace
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover and invest in tomorrow's unicorns with AI-powered insights and tokenized equity
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search startups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>

                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="CleanTech">CleanTech</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="Aerospace">Aerospace</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                    <SelectItem value="Seed">Seed</SelectItem>
                    <SelectItem value="Series A">Series A</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="aiScore">AI Score</SelectItem>
                    <SelectItem value="raised">Amount Raised</SelectItem>
                    <SelectItem value="daysLeft">Days Left</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-500">
              All ({sortedStartups.length})
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-purple-500">
              Featured ({sortedStartups.filter((s) => s.featured).length})
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-pink-500">
              Trending ({sortedStartups.filter((s) => s.trending).length})
            </TabsTrigger>
            <TabsTrigger value="ending-soon" className="data-[state=active]:bg-orange-500">
              Ending Soon ({sortedStartups.filter((s) => s.daysLeft <= 30).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedStartups.map((startup, index) => (
                <motion.div
                  key={startup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <StartupCard startup={startup} onInvest={() => handleInvest(startup)} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedStartups
                .filter((s) => s.featured)
                .map((startup, index) => (
                  <motion.div
                    key={startup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StartupCard startup={startup} onInvest={() => handleInvest(startup)} />
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedStartups
                .filter((s) => s.trending)
                .map((startup, index) => (
                  <motion.div
                    key={startup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StartupCard startup={startup} onInvest={() => handleInvest(startup)} />
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="ending-soon" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedStartups
                .filter((s) => s.daysLeft <= 30)
                .map((startup, index) => (
                  <motion.div
                    key={startup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <StartupCard startup={startup} onInvest={() => handleInvest(startup)} />
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Investment Modal */}
        <InvestmentModal
          startup={selectedStartup}
          isOpen={isInvestmentModalOpen}
          onClose={() => setIsInvestmentModalOpen(false)}
        />
      </div>
    </div>
  )
}
