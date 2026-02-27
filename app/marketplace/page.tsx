"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Coins, ExternalLink, Landmark, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import LiveMarketsPanel from "@/components/live-markets-panel"
import { ABIS, CONTRACTS, getContract, getReadProvider, toEth } from "@/lib/onchain"
import { WEB3_PROJECTS } from "@/lib/web3-projects"

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true)
  const [tokenSupply, setTokenSupply] = useState<bigint>(0n)
  const [stakingTotal, setStakingTotal] = useState<bigint>(0n)
  const [poolCount, setPoolCount] = useState(0)
  const [treasuryBNB, setTreasuryBNB] = useState<bigint>(0n)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [listedPools, setListedPools] = useState<Array<{ address: string; name: string; symbol: string }>>([])

  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "")

  const findMatchingPool = (projectTitle: string) => {
    const normalizedTitle = normalize(projectTitle)
    return listedPools.find((pool) => {
      const poolName = normalize(pool.name)
      const poolSymbol = normalize(pool.symbol)
      if (!poolName && !poolSymbol) return false
      return (
        normalizedTitle.includes(poolName) ||
        poolName.includes(normalizedTitle) ||
        normalizedTitle.includes(poolSymbol) ||
        (poolSymbol.length > 2 && poolName.includes(poolSymbol))
      )
    })
  }

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

      const pools = await Promise.all(
        Array.from({ length: Number(count) }, async (_, index) => {
          const address = await factory.allPools(index)
          const info = await factory.poolInfo(address)
          return { address, name: info.name as string, symbol: info.symbol as string }
        }),
      )
      setListedPools(pools)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = window.setInterval(load, 20000)
    return () => window.clearInterval(interval)
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    WEB3_PROJECTS.forEach((project) => project.tags.forEach((tag) => set.add(tag)))
    return ["All Categories", ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [])

  const featuredProjects = useMemo(() => WEB3_PROJECTS.filter((project) => project.featured), [])

  const filteredProjects = useMemo(() => {
    const searchLower = search.trim().toLowerCase()
    return WEB3_PROJECTS.filter((project) => {
      const inCategory = category === "All Categories" || project.tags.includes(category)
      const inSearch =
        !searchLower ||
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      return inCategory && inSearch
    })
  }, [category, search])

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

        <Card className="glass-card mb-8 border-yellow-400/30">
          <CardHeader>
            <CardTitle className="text-yellow-300 font-futuristic">Official Source</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-white/70 text-sm">
              Project examples on this page are curated from the official BNB Chain Cookbook.
            </p>
            <a href="https://www.bnbchain.org/en/cookbook" target="_blank" rel="noreferrer">
              <Button className="bg-yellow-400 hover:bg-yellow-300 text-black">
                Open BNB Cookbook <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="glass-card mb-8 border-yellow-400/30">
          <CardHeader>
            <CardTitle className="text-yellow-300 font-futuristic">Your Contribution Matters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-white/70 text-sm">Add your demo here and help build BNB Chain with real, investable products.</p>
            <Link href="/submit-product">
              <Button className="bg-yellow-400 hover:bg-yellow-300 text-black">Submit Your Product</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card mb-8 border-yellow-400/30">
          <CardHeader>
            <CardTitle className="text-yellow-300 font-futuristic">Featured: Real Web3 Projects You Can Learn From</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {featuredProjects.map((project) => (
                <div key={project.title} className="rounded-xl border border-yellow-400/30 p-4">
                  <div className="text-white font-semibold mb-2">{project.title}</div>
                  <div className="text-xs text-yellow-300/80 mb-2">Source: BNB Chain Cookbook</div>
                  <div className="text-white/70 text-sm mb-3">{project.description}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <Badge key={tag} className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={project.link} target="_blank" rel="noreferrer" className="inline-block">
                      <Button variant="outline" className="border-yellow-400/40 text-white">
                        Open Project <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                    {(() => {
                      const matched = findMatchingPool(project.title)
                      if (!matched) return null
                      return (
                        <Link href={`/product/${matched.address}`}>
                          <Button className="bg-yellow-400 hover:bg-yellow-300 text-black">Invest in this Project</Button>
                        </Link>
                      )
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-8 border-yellow-400/30">
          <CardHeader>
            <CardTitle className="text-yellow-300 font-futuristic">All Web3 Projects: Explore, Learn, Build</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-10 rounded-lg border border-yellow-400/40 bg-black px-3 text-white"
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 rounded-lg border border-yellow-400/40 bg-black px-3 text-white"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div key={project.title} className="rounded-xl border border-yellow-400/30 p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <div className="text-white font-semibold">{project.title}</div>
                      <div className="text-xs text-yellow-300/80 mt-1">Source: BNB Chain Cookbook</div>
                      <div className="text-white/70 text-sm mt-1">{project.description}</div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map((tag) => (
                          <Badge key={tag} className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href={project.link} target="_blank" rel="noreferrer">
                        <Button variant="outline" className="border-yellow-400/40 text-white w-full">
                          Open <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </a>
                      {(() => {
                        const matched = findMatchingPool(project.title)
                        if (!matched) return null
                        return (
                          <Link href={`/product/${matched.address}`}>
                            <Button className="bg-yellow-400 hover:bg-yellow-300 text-black w-full">Invest in this Project</Button>
                          </Link>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="rounded-xl border border-yellow-400/30 p-4 text-white/70 text-sm">
                  No projects found for current search/category.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
