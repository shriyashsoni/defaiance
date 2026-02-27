"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Coins, Database, Shield, TrendingUp } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { ABIS, CONTRACTS, getContract, getReadProvider, toEth } from "@/lib/onchain"
import LiveMarketsPanel from "@/components/live-markets-panel"

export default function AIAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [tokenSupply, setTokenSupply] = useState<bigint>(0n)
  const [stakingSupply, setStakingSupply] = useState<bigint>(0n)
  const [rewardRate, setRewardRate] = useState<bigint>(0n)
  const [treasuryBNB, setTreasuryBNB] = useState<bigint>(0n)
  const [oracleMaxAge, setOracleMaxAge] = useState<bigint>(0n)

  const load = async () => {
    setLoading(true)
    try {
      const provider = getReadProvider()
      const token = getContract(CONTRACTS.defaianceToken, ABIS.erc20, provider)
      const staking = getContract(CONTRACTS.stakingRewards, ABIS.staking, provider)
      const oracle = getContract(CONTRACTS.oracleAdapter, ["function maxPriceAge() view returns (uint256)"], provider)

      const [supply, staked, rate, treasury, maxAge] = await Promise.all([
        token.totalSupply(),
        staking.totalSupply(),
        staking.rewardRate(),
        provider.getBalance(CONTRACTS.treasuryVault),
        oracle.maxPriceAge(),
      ])

      setTokenSupply(supply)
      setStakingSupply(staked)
      setRewardRate(rate)
      setTreasuryBNB(treasury)
      setOracleMaxAge(maxAge)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = window.setInterval(load, 20000)
    return () => window.clearInterval(interval)
  }, [])

  const stakingRatio = tokenSupply > 0n ? Number((stakingSupply * 10000n) / tokenSupply) / 100 : 0

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text font-futuristic">On-Chain Analytics</h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Protocol health metrics sourced directly from deployed smart contracts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">DFAI Supply</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : toEth(tokenSupply, 2)}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Staked DFAI</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : toEth(stakingSupply, 2)}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Staking Ratio</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : `${stakingRatio.toFixed(2)}%`}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Treasury BNB</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : toEth(treasuryBNB, 4)}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Oracle Max Age</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : `${oracleMaxAge.toString()}s`}</div></CardContent></Card>
        </div>

        <LiveMarketsPanel />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2"><Brain className="h-5 w-5" />Protocol Intelligence Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between"><span className="text-white/70">Treasury Coverage</span><Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{toEth(treasuryBNB, 2)} BNB</Badge></div>
              <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between"><span className="text-white/70">Staking Participation</span><Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{stakingRatio.toFixed(2)}%</Badge></div>
              <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between"><span className="text-white/70">Reward Emission Rate</span><Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{toEth(rewardRate, 8)} / sec</Badge></div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2"><Database className="h-5 w-5" />Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center gap-2"><Coins className="h-4 w-4 text-yellow-400" />DefaianceToken</div>
              <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center gap-2"><Shield className="h-4 w-4 text-yellow-400" />StakingRewards</div>
              <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-yellow-400" />OracleAdapter</div>
              <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center gap-2"><Database className="h-4 w-4 text-yellow-400" />TreasuryVault</div>
              <div className="text-xs text-white/50 mt-2">No mock/random chart dataset is used on this page.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
