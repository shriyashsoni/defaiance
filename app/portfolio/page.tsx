"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, Coins, Layers, Landmark, Gavel, Store, Rocket, ExternalLink } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { ABIS, CONTRACTS, getContract, getReadProvider, getWalletContext, getWalletSigner, toEth } from "@/lib/onchain"
import Link from "next/link"
import LiveMarketsPanel from "@/components/live-markets-panel"
import { parseEther } from "ethers"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

type Holding = {
  pool: string
  name: string
  symbol: string
  shares: bigint
  redeemValue: bigint
}

type MarketsPayload = {
  markets?: Record<string, Array<{ stock?: string; name?: string; price?: number; extracted_price?: number }>>
}

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState<string | null>(null)
  const [walletBNB, setWalletBNB] = useState<bigint>(0n)
  const [walletDFAI, setWalletDFAI] = useState<bigint>(0n)
  const [stakedDFAI, setStakedDFAI] = useState<bigint>(0n)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [proposalCount, setProposalCount] = useState<bigint>(0n)
  const [recentProposalIds, setRecentProposalIds] = useState<number[]>([])
  const [poolCount, setPoolCount] = useState(0)
  const [totalPoolAssets, setTotalPoolAssets] = useState<bigint>(0n)
  const [bnbUsd, setBnbUsd] = useState<number | null>(null)
  const [stakeAmount, setStakeAmount] = useState("10")
  const [stakingTxMessage, setStakingTxMessage] = useState<string | null>(null)
  const [stakingBusy, setStakingBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const provider = getReadProvider()
      const { account: walletAccount } = await getWalletContext()
      setAccount(walletAccount)

      if (!walletAccount) {
        setWalletBNB(0n)
        setWalletDFAI(0n)
        setStakedDFAI(0n)
        setHoldings([])
        return
      }

      const token = getContract(CONTRACTS.defaianceToken, ABIS.erc20, provider)
      const staking = getContract(CONTRACTS.stakingRewards, ABIS.staking, provider)
      const factory = getContract(CONTRACTS.startupPoolFactory, ABIS.poolFactory, provider)
      const dao = getContract(CONTRACTS.defaianceDAO, ABIS.dao, provider)

      const [bnb, dfai, staked, poolCountRaw, proposalCountRaw] = await Promise.all([
        provider.getBalance(walletAccount),
        token.balanceOf(walletAccount),
        staking.balanceOf(walletAccount),
        factory.poolsCount(),
        dao.proposalCount(),
      ])

      setWalletBNB(bnb)
      setWalletDFAI(dfai)
      setStakedDFAI(staked)
      setPoolCount(Number(poolCountRaw))
      setProposalCount(proposalCountRaw)

      const latestProposal = Number(proposalCountRaw)
      const proposalIds: number[] = []
      for (let id = latestProposal; id >= Math.max(1, latestProposal - 2); id--) {
        proposalIds.push(id)
      }
      setRecentProposalIds(proposalIds)

      const rows: Holding[] = []
      let assetsAcc = 0n
      for (let index = 0; index < Number(poolCountRaw); index++) {
        const poolAddress = await factory.allPools(index)
        const info = await factory.poolInfo(poolAddress)
        const pool = getContract(poolAddress, ABIS.investmentPool, provider)
        const [shares, accountedAssets, pricePerShare] = await Promise.all([
          pool.sharesOf(walletAccount),
          pool.accountedAssets(),
          pool.pricePerShare(),
        ])

        assetsAcc += accountedAssets
        if (shares > 0n) {
          rows.push({
            pool: poolAddress,
            name: info.name,
            symbol: info.symbol,
            shares,
            redeemValue: (shares * pricePerShare) / 10n ** 18n,
          })
        }
      }

      setTotalPoolAssets(assetsAcc)
      setHoldings(rows)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = window.setInterval(load, 20000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const loadMarket = async () => {
      try {
        const response = await fetch("/api/markets", { cache: "no-store" })
        const json = (await response.json()) as MarketsPayload
        const allRows = Object.values(json.markets || {}).flat()

        const candidate = allRows.find((row) => {
          const stock = (row.stock || "").toUpperCase()
          return stock.includes("BNBUSDT") || stock.includes("BNB-USD") || stock.includes("BNBUSD")
        })

        const bnbPrice = candidate?.price ?? candidate?.extracted_price
        if (typeof bnbPrice === "number" && Number.isFinite(bnbPrice)) {
          setBnbUsd(bnbPrice)
        }
      } catch {
      }
    }

    loadMarket()
    const marketInterval = window.setInterval(loadMarket, 25000)
    return () => window.clearInterval(marketInterval)
  }, [])

  const totalShares = useMemo(() => holdings.reduce((acc, item) => acc + item.shares, 0n), [holdings])
  const totalRedeemable = useMemo(() => holdings.reduce((acc, item) => acc + item.redeemValue, 0n), [holdings])
  const totalPortfolioBNB = useMemo(() => walletBNB + totalRedeemable, [walletBNB, totalRedeemable])
  const totalPortfolioUsd = useMemo(() => (bnbUsd ? Number(toEth(totalPortfolioBNB, 6)) * bnbUsd : null), [bnbUsd, totalPortfolioBNB])

  const allocationChartData = useMemo(
    () =>
      holdings.map((item, index) => ({
        name: item.symbol,
        value: Number(toEth(item.redeemValue, 6)),
        color: index % 3 === 0 ? "#facc15" : index % 3 === 1 ? "#fef08a" : "#fde047",
      })),
    [holdings],
  )

  const valueBreakdownChartData = useMemo(
    () => [
      { name: "Wallet BNB", value: Number(toEth(walletBNB, 6)), color: "#facc15" },
      { name: "Redeemable", value: Number(toEth(totalRedeemable, 6)), color: "#fde047" },
      { name: "Staked DFAI", value: Number(toEth(stakedDFAI, 6)), color: "#fef08a" },
    ],
    [walletBNB, totalRedeemable, stakedDFAI],
  )

  const handleStake = async () => {
    const signer = await getWalletSigner()
    if (!signer) {
      setStakingTxMessage("Connect wallet first.")
      return
    }

    try {
      setStakingBusy(true)
      const amount = parseEther(stakeAmount || "0")
      if (amount <= 0n) {
        setStakingTxMessage("Enter valid stake amount.")
        return
      }

      const token = getContract(CONTRACTS.defaianceToken, ABIS.erc20, signer)
      const staking = getContract(CONTRACTS.stakingRewards, ABIS.staking, signer)

      setStakingTxMessage("Checking allowance...")
      const owner = await signer.getAddress()
      const allowance = await token.allowance(owner, CONTRACTS.stakingRewards)
      if (allowance < amount) {
        const approveTx = await token.approve(CONTRACTS.stakingRewards, amount)
        await approveTx.wait()
      }

      setStakingTxMessage("Submitting stake transaction...")
      const stakeTx = await staking.stake(amount)
      await stakeTx.wait()
      setStakingTxMessage("Stake successful.")
      await load()
    } catch (error) {
      setStakingTxMessage(error instanceof Error ? error.message : "Stake failed")
    } finally {
      setStakingBusy(false)
    }
  }

  const handleUnstake = async () => {
    const signer = await getWalletSigner()
    if (!signer) {
      setStakingTxMessage("Connect wallet first.")
      return
    }

    try {
      setStakingBusy(true)
      const amount = parseEther(stakeAmount || "0")
      if (amount <= 0n) {
        setStakingTxMessage("Enter valid unstake amount.")
        return
      }

      setStakingTxMessage("Submitting unstake transaction...")
      const staking = getContract(CONTRACTS.stakingRewards, ABIS.staking, signer)
      const tx = await staking.withdraw(amount)
      await tx.wait()
      setStakingTxMessage("Unstake successful.")
      await load()
    } catch (error) {
      setStakingTxMessage(error instanceof Error ? error.message : "Unstake failed")
    } finally {
      setStakingBusy(false)
    }
  }

  const handleClaim = async () => {
    const signer = await getWalletSigner()
    if (!signer) {
      setStakingTxMessage("Connect wallet first.")
      return
    }

    try {
      setStakingBusy(true)
      setStakingTxMessage("Submitting reward claim transaction...")
      const staking = getContract(CONTRACTS.stakingRewards, ABIS.staking, signer)
      const tx = await staking.getReward()
      await tx.wait()
      setStakingTxMessage("Reward claim successful.")
      await load()
    } catch (error) {
      setStakingTxMessage(error instanceof Error ? error.message : "Claim failed")
    } finally {
      setStakingBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 gradient-text font-futuristic">On-Chain Portfolio</h1>
          <p className="text-white/70 text-lg">Wallet balances and pool shares read directly from deployed contracts.</p>
        </motion.div>

        {!account ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Wallet className="h-12 w-12 mx-auto text-yellow-400 mb-3" />
              <div className="text-xl font-semibold">Connect your wallet</div>
              <div className="text-white/70 text-sm mt-1">Portfolio data appears automatically after wallet connection.</div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">Wallet BNB</div>
                  <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(walletBNB)}</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">Wallet DFAI</div>
                  <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(walletDFAI)}</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">Staked DFAI</div>
                  <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(stakedDFAI)}</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">Total Pool Shares</div>
                  <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(totalShares)}</div>
                </CardContent>
              </Card>
              <Card className="glass-card md:col-span-2">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">Portfolio Value (BNB)</div>
                  <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : toEth(totalPortfolioBNB, 4)}</div>
                </CardContent>
              </Card>
              <Card className="glass-card md:col-span-2">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">Portfolio Value (USD, Real-Time)</div>
                  <div className="text-2xl font-semibold text-yellow-300">
                    {loading ? "..." : totalPortfolioUsd ? `$${totalPortfolioUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "-"}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">Marketplace Pools</div>
                  <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : poolCount}</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="text-white/70 text-sm mb-1">DAO Proposals</div>
                  <div className="text-2xl font-semibold text-yellow-300">{loading ? "..." : proposalCount.toString()}</div>
                </CardContent>
              </Card>
            </div>

            <LiveMarketsPanel />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-yellow-300 font-futuristic">Allocation Pie Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  {allocationChartData.length === 0 ? (
                    <div className="text-white/70 text-sm">No holdings available for chart.</div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={allocationChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                            {allocationChartData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-yellow-300 font-futuristic">Value Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={valueBreakdownChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={90}>
                          {valueBreakdownChartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Staking Actions (On-Chain)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
                  <input
                    value={stakeAmount}
                    onChange={(event) => setStakeAmount(event.target.value)}
                    className="h-10 rounded-lg border border-yellow-400/40 bg-black px-3 text-white"
                    placeholder="Amount DFAI"
                  />
                  <Button className="bg-yellow-400 hover:bg-yellow-300 text-black" disabled={stakingBusy} onClick={handleStake}>
                    Approve + Stake
                  </Button>
                  <Button variant="outline" className="border-yellow-400/40 text-white" disabled={stakingBusy} onClick={handleUnstake}>
                    Unstake
                  </Button>
                  <Button variant="outline" className="border-yellow-400/40 text-white" disabled={stakingBusy} onClick={handleClaim}>
                    Claim Rewards
                  </Button>
                </div>
                {stakingTxMessage && <div className="text-sm text-yellow-200">{stakingTxMessage}</div>}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Invest Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between">
                    <span className="text-white/70">Your Total Pool Shares</span>
                    <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{toEth(totalShares)}</Badge>
                  </div>
                  <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between">
                    <span className="text-white/70">Total On-Chain Pool Assets</span>
                    <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{toEth(totalPoolAssets, 2)} BNB</Badge>
                  </div>
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300" asChild>
                    <Link href="/invest">Open Invest</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Marketplace Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between">
                    <span className="text-white/70">Registered Pools</span>
                    <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{poolCount}</Badge>
                  </div>
                  <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between">
                    <span className="text-white/70">Treasury (Wallet view)</span>
                    <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{toEth(walletBNB, 2)} BNB</Badge>
                  </div>
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300" asChild>
                    <Link href="/marketplace">Open Marketplace</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                    <Gavel className="h-5 w-5" />
                    DAO Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between">
                    <span className="text-white/70">Total Proposals</span>
                    <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">{proposalCount.toString()}</Badge>
                  </div>
                  <div className="rounded-xl border border-yellow-400/30 p-3">
                    <div className="text-white/70 mb-2">Recent Proposal IDs</div>
                    <div className="flex flex-wrap gap-2">
                      {recentProposalIds.length > 0 ? (
                        recentProposalIds.map((id) => (
                          <Badge key={id} className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">#{id}</Badge>
                        ))
                      ) : (
                        <span className="text-white/50">No proposals</span>
                      )}
                    </div>
                  </div>
                  <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300" asChild>
                    <Link href="/dao">Open DAO</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Pool Holdings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {holdings.length === 0 ? (
                  <div className="text-white/70">No pool share positions found for this wallet.</div>
                ) : (
                  holdings.map((item) => (
                    <div key={item.pool} className="rounded-xl border border-yellow-400/30 p-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-white/60 break-all">{item.pool}</div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300 mb-1">{item.symbol}</Badge>
                        <div className="text-yellow-300 font-semibold">{toEth(item.shares)} shares</div>
                        <div className="text-xs text-white/70">Redeem est: {toEth(item.redeemValue, 4)} BNB</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="mt-4 text-xs text-white/50 flex items-center gap-2">
              <Landmark className="h-3.5 w-3.5" />
              Data source: BSC Testnet smart contracts only (no random/mock data).
            </div>

            <div className="mt-4 text-xs text-white/50 flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              Integrated sections: Invest + Marketplace + DAO are summarized in this portfolio view.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
