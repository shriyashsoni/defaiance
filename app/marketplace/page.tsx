"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Coins, ExternalLink, Landmark, ShieldCheck } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import LiveMarketsPanel from "@/components/live-markets-panel"
import { ABIS, CONTRACTS, getContract, getReadProvider, toEth } from "@/lib/onchain"

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true)
  const [tokenSupply, setTokenSupply] = useState<bigint>(0n)
  const [stakingTotal, setStakingTotal] = useState<bigint>(0n)
  const [poolCount, setPoolCount] = useState(0)
  const [treasuryBNB, setTreasuryBNB] = useState<bigint>(0n)

  const load = async () => {
    setLoading(true)
    try {
      const provider = getReadProvider()
      const token = getContract(CONTRACTS.defaianceToken, ABIS.erc20, provider)
      const staking = getContract(CONTRACTS.stakingRewards, ABIS.staking, provider)
      const factory = getContract(CONTRACTS.startupPoolFactory, ABIS.poolFactory, provider)

      const [supply, stakingSupply, count, treasuryBalance] = await Promise.all([
        token.totalSupply(),
        staking.totalSupply(),
        factory.poolsCount(),
        provider.getBalance(CONTRACTS.treasuryVault),
      ])

      setTokenSupply(supply)
      setStakingTotal(stakingSupply)
      setPoolCount(Number(count))
      setTreasuryBNB(treasuryBalance)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = window.setInterval(load, 20000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text font-futuristic">On-Chain Marketplace</h1>
          <p className="text-white/70 max-w-3xl mx-auto text-lg">
            Live protocol metrics powered by deployed BSC Testnet contracts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/70 text-sm">DFAI Total Supply</div>
                <Coins className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(tokenSupply, 2)}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/70 text-sm">Treasury BNB</div>
                <Landmark className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(treasuryBNB, 4)}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/70 text-sm">Staked DFAI</div>
                <ShieldCheck className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(stakingTotal, 2)}</div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/70 text-sm">Investment Pools</div>
                <Building2 className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : poolCount}</div>
            </CardContent>
          </Card>
        </div>

        <LiveMarketsPanel />

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-yellow-300 font-futuristic">Deployed Contract Registry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(CONTRACTS)
              .filter(([key]) => key !== "chainId" && key !== "rpcUrl")
              .map(([key, value]) => (
                <div key={key} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-yellow-400/30 p-3">
                  <div>
                    <div className="text-white font-medium">{key}</div>
                    <div className="text-white/60 text-xs break-all">{value}</div>
                  </div>
                  <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300 w-fit">BSC Testnet</Badge>
                </div>
              ))}

            <Button className="bg-yellow-400 hover:bg-yellow-300 text-black mt-2" asChild>
              <a href="https://testnet.bscscan.com" target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open BscScan
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
