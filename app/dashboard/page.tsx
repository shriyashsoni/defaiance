"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Brain, Coins, Gavel, PieChart, Rocket } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { ABIS, CONTRACTS, getContract, getReadProvider, toEth } from "@/lib/onchain"
import LiveMarketsPanel from "@/components/live-markets-panel"

const dashboardLinks = [
  {
    title: "Invest",
    description: "Discover and fund startup campaigns",
    href: "/invest",
    icon: <Rocket className="h-6 w-6" />,
  },
  {
    title: "Marketplace",
    description: "Browse tokenized startup opportunities",
    href: "/marketplace",
    icon: <Coins className="h-6 w-6" />,
  },
  {
    title: "Portfolio",
    description: "Track your wallet positions and allocation",
    href: "/portfolio",
    icon: <PieChart className="h-6 w-6" />,
  },
  {
    title: "AI Analytics",
    description: "Review AI-generated startup insights",
    href: "/ai-analytics",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    title: "DAO",
    description: "Vote on proposals and governance decisions",
    href: "/dao",
    icon: <Gavel className="h-6 w-6" />,
  },
]

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [pools, setPools] = useState(0)
  const [supply, setSupply] = useState<bigint>(0n)
  const [treasury, setTreasury] = useState<bigint>(0n)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const provider = getReadProvider()
        const token = getContract(CONTRACTS.defaianceToken, ABIS.erc20, provider)
        const factory = getContract(CONTRACTS.startupPoolFactory, ABIS.poolFactory, provider)

        const [count, totalSupply, treasuryBalance] = await Promise.all([
          factory.poolsCount(),
          token.totalSupply(),
          provider.getBalance(CONTRACTS.treasuryVault),
        ])

        setPools(Number(count))
        setSupply(totalSupply)
        setTreasury(treasuryBalance)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <div className="min-h-screen bg-black text-yellow-400">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-28 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Badge className="mb-4 border-yellow-400/60 bg-black text-yellow-300">Wallet Dashboard</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-mono gradient-text">DEFAIANCE CONTROL CENTER</h1>
          <p className="text-yellow-200/80 max-w-3xl text-lg">
            All core pages are organized here. Connect your wallet and access investments, analytics, governance, and
            portfolio tracking in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card border-yellow-400/40">
            <CardContent className="p-4">
              <div className="text-white/70 text-sm">Investment Pools</div>
              <div className="text-2xl font-bold text-yellow-300">{loading ? "..." : pools}</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-yellow-400/40">
            <CardContent className="p-4">
              <div className="text-white/70 text-sm">DFAI Supply</div>
              <div className="text-2xl font-bold text-yellow-300">{loading ? "..." : toEth(supply, 2)}</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-yellow-400/40">
            <CardContent className="p-4">
              <div className="text-white/70 text-sm">Treasury BNB</div>
              <div className="text-2xl font-bold text-yellow-300">{loading ? "..." : toEth(treasury, 3)}</div>
            </CardContent>
          </Card>
        </div>

        <LiveMarketsPanel />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dashboardLinks.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 + index * 0.06 }}
            >
              <Card className="glass-card h-full border-yellow-400/40 hover:border-yellow-300 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-yellow-300">{item.icon}</div>
                    <BarChart3 className="h-5 w-5 text-yellow-400/80" />
                  </div>
                  <CardTitle className="font-mono text-yellow-300">{item.title}</CardTitle>
                  <CardDescription className="text-yellow-200/75">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={item.href}>
                    <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-semibold">
                      Open {item.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
