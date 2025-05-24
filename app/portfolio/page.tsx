"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Wallet, ArrowUpRight, Activity } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import WalletConnect from "@/components/wallet-connect"

export default function Portfolio() {
  const [isConnected, setIsConnected] = useState(false)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalReturns, setTotalReturns] = useState(0)

  // Mock portfolio data
  const portfolioData = [
    { name: "QuantumAI Labs", value: 2500, tokens: 10000, change: 15.2, industry: "AI/ML" },
    { name: "GreenTech Solutions", value: 1200, tokens: 8000, change: -3.1, industry: "CleanTech" },
    { name: "BioMed Innovations", value: 800, tokens: 10000, change: 8.7, industry: "Healthcare" },
    { name: "CryptoSecure", value: 1800, tokens: 6000, change: 12.4, industry: "Fintech" },
    { name: "SpaceLogistics", value: 1000, tokens: 5000, change: 5.8, industry: "Aerospace" },
  ]

  const performanceData = [
    { month: "Jan", value: 5000, invested: 5000 },
    { month: "Feb", value: 5200, invested: 5000 },
    { month: "Mar", value: 5800, invested: 6000 },
    { month: "Apr", value: 6200, invested: 6000 },
    { month: "May", value: 6800, invested: 7000 },
    { month: "Jun", value: 7300, invested: 7000 },
  ]

  const industryDistribution = [
    { name: "AI/ML", value: 35, color: "#3B82F6" },
    { name: "Fintech", value: 25, color: "#8B5CF6" },
    { name: "CleanTech", value: 17, color: "#10B981" },
    { name: "Healthcare", value: 13, color: "#F59E0B" },
    { name: "Aerospace", value: 10, color: "#EF4444" },
  ]

  const recentActivity = [
    {
      type: "investment",
      startup: "QuantumAI Labs",
      amount: 500,
      date: "2 hours ago",
      icon: <ArrowUpRight className="h-4 w-4" />,
    },
    {
      type: "dividend",
      startup: "GreenTech Solutions",
      amount: 25,
      date: "1 day ago",
      icon: <DollarSign className="h-4 w-4" />,
    },
    { type: "vote", startup: "BioMed Innovations", amount: 0, date: "3 days ago", icon: <Users className="h-4 w-4" /> },
    {
      type: "investment",
      startup: "CryptoSecure",
      amount: 300,
      date: "1 week ago",
      icon: <ArrowUpRight className="h-4 w-4" />,
    },
  ]

  useEffect(() => {
    // Calculate portfolio metrics
    const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)
    const totalInv = 7000 // Mock total invested
    const returns = totalValue - totalInv

    setPortfolioValue(totalValue)
    setTotalInvested(totalInv)
    setTotalReturns(returns)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400"
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <AnimatedBackground />
        <Navigation />

        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm max-w-md w-full">
              <CardHeader className="text-center">
                <Wallet className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-white text-2xl">Connect Your Wallet</CardTitle>
                <CardDescription className="text-gray-400">
                  Connect your wallet to view your investment portfolio and track your returns
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <WalletConnect onConnect={() => setIsConnected(true)} />
                <p className="text-gray-500 text-sm mt-4">
                  Supported wallets: MetaMask, WalletConnect, Coinbase Wallet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Portfolio Dashboard
          </h1>
          <p className="text-xl text-gray-400">
            Track your investments, monitor performance, and manage your Web3 portfolio
          </p>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(portfolioValue)}</p>
                </div>
                <div className="text-blue-400">
                  <PieChart className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Invested</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
                </div>
                <div className="text-purple-400">
                  <Target className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Returns</p>
                  <p className={`text-2xl font-bold ${getChangeColor(totalReturns)}`}>{formatCurrency(totalReturns)}</p>
                </div>
                <div className={getChangeColor(totalReturns)}>{getChangeIcon(totalReturns)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">ROI</p>
                  <p className={`text-2xl font-bold ${getChangeColor(totalReturns)}`}>
                    {((totalReturns / totalInvested) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-green-400">
                  <Activity className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="holdings" className="data-[state=active]:bg-purple-500">
              Holdings
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-pink-500">
              Performance
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-orange-500">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Distribution */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Investment allocation by industry</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={industryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {industryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Portfolio Performance</CardTitle>
                  <CardDescription className="text-gray-400">Value vs invested over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
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
                      <Area
                        type="monotone"
                        dataKey="value"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        name="Portfolio Value"
                      />
                      <Area
                        type="monotone"
                        dataKey="invested"
                        stackId="2"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                        name="Total Invested"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Holdings */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Top Holdings</CardTitle>
                <CardDescription className="text-gray-400">Your largest investments by value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.slice(0, 3).map((holding, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">{holding.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{holding.name}</h3>
                          <p className="text-gray-400 text-sm">{holding.industry}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{formatCurrency(holding.value)}</p>
                        <p className={`text-sm ${getChangeColor(holding.change)}`}>
                          {holding.change > 0 ? "+" : ""}
                          {holding.change.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holdings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioData.map((holding, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-lg">{holding.name}</CardTitle>
                          <CardDescription className="text-gray-400">{holding.industry}</CardDescription>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {holding.tokens.toLocaleString()} tokens
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Current Value</span>
                          <span className="text-white font-semibold">{formatCurrency(holding.value)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">24h Change</span>
                          <span className={`font-semibold ${getChangeColor(holding.change)}`}>
                            {holding.change > 0 ? "+" : ""}
                            {holding.change.toFixed(1)}%
                          </span>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Performance Analytics</CardTitle>
                <CardDescription className="text-gray-400">Detailed performance metrics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
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
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} name="Portfolio Value" />
                    <Line type="monotone" dataKey="invested" stroke="#8B5CF6" strokeWidth={3} name="Total Invested" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Your latest transactions and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          {activity.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold capitalize">{activity.type}</h3>
                          <p className="text-gray-400 text-sm">{activity.startup}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount > 0 && (
                          <p className="text-white font-semibold">{formatCurrency(activity.amount)}</p>
                        )}
                        <p className="text-gray-400 text-sm">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
