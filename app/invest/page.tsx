"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, ExternalLink, Layers, Wallet } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import LiveMarketsPanel from "@/components/live-markets-panel"
import { ABIS, CONTRACTS, getContract, getReadProvider, getWalletContext, getWalletSigner, toEth } from "@/lib/onchain"
import { getProjectMetaByPool } from "@/lib/investment-projects"
import { parseEther } from "ethers"

type PoolView = {
  address: string
  name: string
  symbol: string
  asset: string
  totalShares: bigint
  accountedAssets: bigint
  pricePerShare: bigint
  myShares: bigint
}

export default function InvestPage() {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
  const [account, setAccount] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [pools, setPools] = useState<PoolView[]>([])
  const [txMessage, setTxMessage] = useState<string | null>(null)
  const [txLoadingPool, setTxLoadingPool] = useState<string | null>(null)
  const [poolDepositAmounts, setPoolDepositAmounts] = useState<Record<string, string>>({})
  const [poolRedeemPercents, setPoolRedeemPercents] = useState<Record<string, string>>({})

  const loadData = async () => {
    setLoading(true)
    try {
      const readProvider = getReadProvider()
      const { account: walletAccount } = await getWalletContext()
      setAccount(walletAccount)

      const factory = getContract(CONTRACTS.startupPoolFactory, ABIS.poolFactory, readProvider)
      const count = Number(await factory.poolsCount())

      const poolList: PoolView[] = []
      for (let index = 0; index < count; index++) {
        const poolAddress = await factory.allPools(index)
        const info = await factory.poolInfo(poolAddress)
        const poolContract = getContract(poolAddress, ABIS.investmentPool, readProvider)

        const [totalShares, accountedAssets, pricePerShare, myShares] = await Promise.all([
          poolContract.totalShares(),
          poolContract.accountedAssets(),
          poolContract.pricePerShare(),
          walletAccount ? poolContract.sharesOf(walletAccount) : Promise.resolve(0n),
        ])

        poolList.push({
          address: poolAddress,
          name: info.name,
          symbol: info.symbol,
          asset: info.asset,
          totalShares,
          accountedAssets,
          pricePerShare,
          myShares,
        })
      }

      setPools(poolList)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = window.setInterval(loadData, 20000)
    return () => window.clearInterval(interval)
  }, [])

  const totalAssets = useMemo(() => pools.reduce((acc, pool) => acc + pool.accountedAssets, 0n), [pools])
  const totalMyShares = useMemo(() => pools.reduce((acc, pool) => acc + pool.myShares, 0n), [pools])
  const totalRedeemableValue = useMemo(
    () => pools.reduce((acc, pool) => acc + (pool.myShares * pool.pricePerShare) / 10n ** 18n, 0n),
    [pools],
  )

  const handleDeposit = async (pool: PoolView) => {
    const signer = await getWalletSigner()
    if (!signer) {
      setTxMessage("Connect wallet first.")
      return
    }

    try {
      setTxLoadingPool(pool.address)
      const rawAmount = poolDepositAmounts[pool.address] ?? "0.01"
      const amount = parseEther(rawAmount || "0")
      if (amount <= 0n) {
        setTxMessage("Enter a valid invest amount.")
        return
      }

      const poolContract = getContract(pool.address, ABIS.investmentPool, signer)

      let tx
      if (pool.asset.toLowerCase() === ZERO_ADDRESS) {
        setTxMessage("Submitting native deposit transaction...")
        tx = await poolContract.deposit(0n, { value: amount })
      } else {
        setTxMessage("Checking token allowance...")
        const token = getContract(pool.asset, ABIS.erc20, signer)
        const owner = await signer.getAddress()
        const allowance = await token.allowance(owner, pool.address)
        if (allowance < amount) {
          const approveTx = await token.approve(pool.address, amount)
          await approveTx.wait()
        }

        setTxMessage("Submitting token deposit transaction...")
        tx = await poolContract.deposit(amount)
      }

      await tx.wait()
      setTxMessage("Deposit successful.")
      await loadData()
    } catch (error) {
      setTxMessage(error instanceof Error ? error.message : "Deposit failed")
    } finally {
      setTxLoadingPool(null)
    }
  }

  const handleWithdraw = async (pool: PoolView) => {
    if (pool.myShares === 0n) {
      setTxMessage("No shares available to withdraw.")
      return
    }

    const signer = await getWalletSigner()
    if (!signer) {
      setTxMessage("Connect wallet first.")
      return
    }

    try {
      setTxLoadingPool(pool.address)
      setTxMessage("Submitting withdraw transaction...")
      const redeemPercent = Number(poolRedeemPercents[pool.address] ?? "10")
      const boundedPercent = Number.isFinite(redeemPercent) ? Math.max(1, Math.min(100, redeemPercent)) : 10
      let sharesToBurn = (pool.myShares * BigInt(Math.floor(boundedPercent * 100))) / 10000n
      if (sharesToBurn <= 0n) {
        sharesToBurn = pool.myShares
      }
      const poolContract = getContract(pool.address, ABIS.investmentPool, signer)
      const tx = await poolContract.withdraw(sharesToBurn)
      await tx.wait()
      setTxMessage("Withdraw successful.")
      await loadData()
    } catch (error) {
      setTxMessage(error instanceof Error ? error.message : "Withdraw failed")
    } finally {
      setTxLoadingPool(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text font-futuristic">Invest On-Chain</h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            Live data from StartupPoolFactory and InvestmentPool contracts on BSC Testnet.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="text-white/70 text-sm mb-1">Active Pools</div>
              <div className="text-3xl font-bold text-yellow-400">{pools.length}</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="text-white/70 text-sm mb-1">Total Pool Assets</div>
              <div className="text-3xl font-bold text-yellow-400">{toEth(totalAssets)} BNB</div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-5">
              <div className="text-white/70 text-sm mb-1">Your Total Shares</div>
              <div className="text-3xl font-bold text-yellow-400">{account ? toEth(totalMyShares) : "Connect"}</div>
            </CardContent>
          </Card>
          <Card className="glass-card md:col-span-3">
            <CardContent className="p-5">
              <div className="text-white/70 text-sm mb-1">Estimated Redeem Value (All Your Shares)</div>
              <div className="text-3xl font-bold text-yellow-400">{account ? `${toEth(totalRedeemableValue)} BNB` : "Connect"}</div>
            </CardContent>
          </Card>
        </div>

        <LiveMarketsPanel />

        {txMessage && (
          <div className="mb-6 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">
            {txMessage}
          </div>
        )}

        {loading ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center text-white/70">Loading on-chain pools...</CardContent>
          </Card>
        ) : pools.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Layers className="h-10 w-10 mx-auto text-yellow-400 mb-3" />
              <div className="text-lg font-semibold">No pools found on-chain</div>
              <div className="text-white/70 text-sm mt-1">Create pools via StartupPoolFactory from your contracts setup.</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pools.map((pool) => (
              <Card key={pool.address} className="glass-card">
                <CardHeader>
                  {(() => {
                    const projectMeta = getProjectMetaByPool(pool.name, pool.symbol)
                    if (!projectMeta) return null
                    return (
                      <img
                        src={projectMeta.preview}
                        alt={projectMeta.name}
                        className="w-full h-40 object-cover rounded-lg border border-yellow-400/30 mb-3"
                      />
                    )
                  })()}
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-yellow-300 font-futuristic">{pool.name || "Unnamed Pool"}</CardTitle>
                    <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{pool.symbol || "POOL"}</Badge>
                  </div>
                  {(() => {
                    const projectMeta = getProjectMetaByPool(pool.name, pool.symbol)
                    if (!projectMeta) return null
                    return <p className="text-xs text-white/70 mt-2">{projectMeta.description}</p>
                  })()}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-yellow-400/30 p-3">
                      <div className="text-white/60">Accounted Assets</div>
                      <div className="text-yellow-300 font-semibold">{toEth(pool.accountedAssets)} BNB</div>
                    </div>
                    <div className="rounded-xl border border-yellow-400/30 p-3">
                      <div className="text-white/60">Total Shares</div>
                      <div className="text-yellow-300 font-semibold">{toEth(pool.totalShares)}</div>
                    </div>
                    <div className="rounded-xl border border-yellow-400/30 p-3">
                      <div className="text-white/60">Price / Share</div>
                      <div className="text-yellow-300 font-semibold">{toEth(pool.pricePerShare)} BNB</div>
                    </div>
                    <div className="rounded-xl border border-yellow-400/30 p-3">
                      <div className="text-white/60">Your Shares</div>
                      <div className="text-yellow-300 font-semibold">{account ? toEth(pool.myShares) : "Connect"}</div>
                    </div>
                    <div className="rounded-xl border border-yellow-400/30 p-3 col-span-2">
                      <div className="text-white/60">Estimated Redeem Value</div>
                      <div className="text-yellow-300 font-semibold">
                        {account ? `${toEth((pool.myShares * pool.pricePerShare) / 10n ** 18n)} BNB` : "Connect"}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-white/60 break-all">Pool: {pool.address}</div>
                  <div className="pt-1">
                    <div className="text-xs text-white/60 mb-2">Invest Amount</div>
                    <input
                      value={poolDepositAmounts[pool.address] ?? "0.01"}
                      onChange={(event) =>
                        setPoolDepositAmounts((prev) => ({
                          ...prev,
                          [pool.address]: event.target.value,
                        }))
                      }
                      className="h-10 rounded-lg border border-yellow-400/40 bg-black px-3 text-white w-full"
                      placeholder="0.01"
                    />
                  </div>
                  <div className="pt-1">
                    <div className="text-xs text-white/60 mb-2">Redeem Percent (1-100)</div>
                    <input
                      value={poolRedeemPercents[pool.address] ?? "10"}
                      onChange={(event) =>
                        setPoolRedeemPercents((prev) => ({
                          ...prev,
                          [pool.address]: event.target.value,
                        }))
                      }
                      className="h-10 rounded-lg border border-yellow-400/40 bg-black px-3 text-white w-full"
                      placeholder="10"
                    />
                    <div className="text-xs text-yellow-200 mt-2">
                      Estimated redeem at selected percent: {account
                        ? `${toEth(
                            (pool.myShares * pool.pricePerShare * BigInt(Math.max(1, Math.min(100, Number(poolRedeemPercents[pool.address] ?? "10") || 10)))) /
                              (10n ** 18n * 100n),
                          )} BNB`
                        : "Connect"}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button className="bg-yellow-400 hover:bg-yellow-300 text-black" asChild>
                      <a href={`https://testnet.bscscan.com/address/${pool.address}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Contract
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-yellow-400/40 text-white"
                      disabled={txLoadingPool === pool.address}
                      onClick={() => handleDeposit(pool)}
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      {txLoadingPool === pool.address
                        ? "Processing..."
                        : pool.asset.toLowerCase() === ZERO_ADDRESS
                          ? `Invest ${poolDepositAmounts[pool.address] ?? "0.01"} BNB`
                          : `Invest ${poolDepositAmounts[pool.address] ?? "0.01"} Tokens`}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-yellow-400/40 text-white"
                      disabled={txLoadingPool === pool.address || pool.myShares === 0n}
                      onClick={() => handleWithdraw(pool)}
                    >
                      Redeem Selected %
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!account && (
          <div className="mt-6 text-sm text-white/70 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-yellow-400" />
            Connect wallet to see your pool shares and invest directly.
          </div>
        )}
      </div>
    </div>
  )
}
