"use client"

import { useEffect, useMemo, useState } from "react"
import { formatEther } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ABIS, CONTRACTS, getReadContract } from "@/lib/contracts"

type PoolItem = {
  address: string
  name: string
  symbol: string
  asset: string
  accountedAssets: string
  totalShares: string
  pricePerShare: string
}

type PoolsGridProps = {
  search?: string
}

export default function PoolsGrid({ search = "" }: PoolsGridProps) {
  const [pools, setPools] = useState<PoolItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const factory = getReadContract(CONTRACTS.StartupPoolFactory, ABIS.factory)
        const countRaw = await factory.poolsCount()
        const count = Number(countRaw)

        const list: PoolItem[] = []
        for (let i = 0; i < count; i += 1) {
          const poolAddress = (await factory.allPools(i)) as string
          const info = await factory.poolInfo(poolAddress)
          const pool = getReadContract(poolAddress, ABIS.pool)

          const [assetsRaw, sharesRaw, ppsRaw] = await Promise.all([
            pool.accountedAssets(),
            pool.totalShares(),
            pool.pricePerShare(),
          ])

          list.push({
            address: poolAddress,
            name: info.name || `Pool #${i + 1}`,
            symbol: info.symbol || "POOL",
            asset: info.asset,
            accountedAssets: Number(formatEther(assetsRaw)).toFixed(4),
            totalShares: Number(formatEther(sharesRaw)).toFixed(4),
            pricePerShare: Number(formatEther(ppsRaw)).toFixed(6),
          })
        }

        setPools(list)
      } catch {
        setPools([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return pools
    return pools.filter((pool) => pool.name.toLowerCase().includes(q) || pool.symbol.toLowerCase().includes(q))
  }, [pools, search])

  if (loading) {
    return <div className="text-gray-300">Loading on-chain pools...</div>
  }

  if (!filtered.length) {
    return <div className="text-gray-300">No on-chain pools found. Create a pool via smart contracts first.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((pool) => (
        <Card key={pool.address} className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-white text-lg">{pool.name}</CardTitle>
              <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/40">{pool.symbol}</Badge>
            </div>
            <CardDescription className="text-gray-300 break-all text-xs">{pool.address}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Asset</span><span className="text-white">{pool.asset}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Accounted Assets</span><span className="text-white">{pool.accountedAssets}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Shares</span><span className="text-white">{pool.totalShares}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Price / Share</span><span className="text-white">{pool.pricePerShare}</span></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
