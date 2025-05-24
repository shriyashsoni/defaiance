"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Star, Users, DollarSign, Clock, Zap } from "lucide-react"
import Image from "next/image"

interface Startup {
  id: string
  name: string
  industry: string
  stage: string
  raised: number
  target: number
  aiScore: number
  description: string
  logo: string
  tokenPrice: number
  totalTokens: number
  availableTokens: number
  investors?: number
  daysLeft?: number
  trending?: boolean
  featured?: boolean
}

interface StartupCardProps {
  startup: Startup
  onInvest?: () => void
}

export default function StartupCard({ startup, onInvest }: StartupCardProps) {
  const progressPercentage = (startup.raised / startup.target) * 100

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-500/20 border-green-500/30"
    if (score >= 80) return "text-blue-400 bg-blue-500/20 border-blue-500/30"
    if (score >= 70) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
    return "text-red-400 bg-red-500/20 border-red-500/30"
  }

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "pre-seed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "seed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "series a":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ duration: 0.2 }} className="relative">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full relative overflow-hidden">
        {/* Trending/Featured Badges */}
        {(startup.trending || startup.featured) && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {startup.trending && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                <Zap className="w-3 h-3 mr-1" />
                Trending
              </Badge>
            )}
            {startup.featured && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <Image
                  src={startup.logo || "/placeholder.svg"}
                  alt={startup.name}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </motion.div>
              <div>
                <CardTitle className="text-white text-lg">{startup.name}</CardTitle>
                <CardDescription className="text-gray-400">{startup.industry}</CardDescription>
              </div>
            </div>
            <Badge className={getScoreColor(startup.aiScore)}>
              <Star className="w-3 h-3 mr-1" />
              {startup.aiScore}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm line-clamp-2">{startup.description}</p>

          <div className="flex items-center justify-between">
            <Badge className={getStageColor(startup.stage)}>{startup.stage}</Badge>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              {startup.investors && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {startup.investors}
                </div>
              )}
              {startup.daysLeft && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {startup.daysLeft}d
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Raised</span>
              <span className="text-white font-medium">
                {formatCurrency(startup.raised)} / {formatCurrency(startup.target)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-gray-400">{progressPercentage.toFixed(1)}% funded</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Token Price</span>
              <div className="text-white font-semibold">${startup.tokenPrice}</div>
            </div>
            <div>
              <span className="text-gray-400">Available</span>
              <div className="text-white font-semibold">
                {((startup.availableTokens / startup.totalTokens) * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              size="sm"
              onClick={onInvest}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transform hover:scale-105 transition-all duration-300"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Invest
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Details
            </Button>
          </div>
        </CardContent>

        {/* Animated border effect */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </Card>
    </motion.div>
  )
}
