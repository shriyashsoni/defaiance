"use client"

import { useEffect, useState } from "react"
import { formatEther } from "ethers"
import { Card, CardContent } from "@/components/ui/card"
import { ABIS, CONTRACTS, getReadContract, getReadProvider } from "@/lib/contracts"

type OverviewState = {
  tokenSupply: string
  poolCount: number
  proposalCount: number
  treasuryBnb: string
}

export default function ContractOverview() {
  const [overview, setOverview] = useState<OverviewState>({
    tokenSupply: "0",
    poolCount: 0,
    proposalCount: 0,
    treasuryBnb: "0",
  })

  useEffect(() => {
    const load = async () => {
      try {
        const token = getReadContract(CONTRACTS.DefaianceToken, ABIS.token)
        const factory = getReadContract(CONTRACTS.StartupPoolFactory, ABIS.factory)
        const dao = getReadContract(CONTRACTS.DefaianceDAO, ABIS.dao)
        const provider = getReadProvider()

        const [supplyRaw, poolCountRaw, proposalCountRaw, treasuryRaw] = await Promise.all([
          token.totalSupply(),
          factory.poolsCount(),
          dao.proposalCount(),
          provider.getBalance(CONTRACTS.TreasuryVault),
        ])

        setOverview({
          tokenSupply: Number(formatEther(supplyRaw)).toLocaleString(undefined, { maximumFractionDigits: 0 }),
          poolCount: Number(poolCountRaw),
          proposalCount: Number(proposalCountRaw),
          treasuryBnb: Number(formatEther(treasuryRaw)).toFixed(3),
        })
      } catch {
      }
    }

    load()
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="glass-card text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold gradient-text">{overview.poolCount}</div>
          <div className="text-sm text-gray-300">On-chain Pools</div>
        </CardContent>
      </Card>
      <Card className="glass-card text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold gradient-text">{overview.proposalCount}</div>
          <div className="text-sm text-gray-300">DAO Proposals</div>
        </CardContent>
      </Card>
      <Card className="glass-card text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold gradient-text">{overview.treasuryBnb}</div>
          <div className="text-sm text-gray-300">Treasury BNB</div>
        </CardContent>
      </Card>
      <Card className="glass-card text-center p-4">
        <CardContent className="p-0">
          <div className="text-2xl font-bold gradient-text">{overview.tokenSupply}</div>
          <div className="text-sm text-gray-300">DFAI Supply</div>
        </CardContent>
      </Card>
    </div>
  )
}
