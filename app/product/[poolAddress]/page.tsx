"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Coins, ExternalLink, Layers } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ABIS, CONTRACTS, getContract, getReadProvider, toEth } from "@/lib/onchain"

type ProductPoolState = {
  pool: string
  name: string
  symbol: string
  asset: string
  totalShares: bigint
  accountedAssets: bigint
  pricePerShare: bigint
}

export default function ProductDetailsPage() {
  const params = useParams<{ poolAddress: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductPoolState | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const poolAddress = params.poolAddress
        if (!poolAddress) {
          throw new Error("Missing pool address")
        }

        const provider = getReadProvider()
        const factory = getContract(CONTRACTS.startupPoolFactory, ABIS.poolFactory, provider)
        const poolInfo = await factory.poolInfo(poolAddress)
        if (!poolInfo || !poolInfo.pool || poolInfo.pool.toLowerCase() !== poolAddress.toLowerCase()) {
          throw new Error("Pool not found")
        }

        const pool = getContract(poolAddress, ABIS.investmentPool, provider)
        const [totalShares, accountedAssets, pricePerShare] = await Promise.all([
          pool.totalShares(),
          pool.accountedAssets(),
          pool.pricePerShare(),
        ])

        setProduct({
          pool: poolAddress,
          name: poolInfo.name,
          symbol: poolInfo.symbol,
          asset: poolInfo.asset,
          totalShares,
          accountedAssets,
          pricePerShare,
        })
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load product")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [params.poolAddress])

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-5xl">
        {loading ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center text-white/70">Loading product page...</CardContent>
          </Card>
        ) : error ? (
          <Card className="glass-card border-red-500/30">
            <CardContent className="p-8 text-center text-red-300">{error}</CardContent>
          </Card>
        ) : product ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center">
              <Badge className="border border-yellow-400/40 bg-yellow-400/10 text-yellow-300 mb-4">On-Chain Product</Badge>
              <h1 className="text-4xl md:text-5xl font-bold gradient-text font-futuristic mb-3">{product.name}</h1>
              <p className="text-white/70">Public investment page generated from on-chain pool metadata.</p>
            </div>

            <Card className="glass-card border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Product Pool Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-yellow-400/30 p-4">
                    <div className="text-white/60">Pool Symbol</div>
                    <div className="text-yellow-300 font-semibold">{product.symbol}</div>
                  </div>
                  <div className="rounded-xl border border-yellow-400/30 p-4">
                    <div className="text-white/60">Asset</div>
                    <div className="text-yellow-300 font-semibold break-all">{product.asset}</div>
                  </div>
                  <div className="rounded-xl border border-yellow-400/30 p-4">
                    <div className="text-white/60">Accounted Assets</div>
                    <div className="text-yellow-300 font-semibold">{toEth(product.accountedAssets)} BNB</div>
                  </div>
                  <div className="rounded-xl border border-yellow-400/30 p-4">
                    <div className="text-white/60">Total Shares</div>
                    <div className="text-yellow-300 font-semibold">{toEth(product.totalShares)}</div>
                  </div>
                  <div className="rounded-xl border border-yellow-400/30 p-4 md:col-span-2">
                    <div className="text-white/60">Price Per Share</div>
                    <div className="text-yellow-300 font-semibold">{toEth(product.pricePerShare)} BNB</div>
                  </div>
                </div>

                <div className="text-xs text-white/60 break-all">Pool Address: {product.pool}</div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/invest">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                      <Coins className="h-4 w-4 mr-2" />
                      Invest in this Product
                    </Button>
                  </Link>
                  <a href={`https://testnet.bscscan.com/address/${product.pool}`} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                      View Contract <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                  <Link href="/submit-product">
                    <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                      Submit Another <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}
