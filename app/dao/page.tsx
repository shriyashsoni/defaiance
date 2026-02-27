"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gavel, Shield, Vote, Clock3 } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { ABIS, CONTRACTS, getContract, getReadProvider, getWalletSigner, toEth } from "@/lib/onchain"
import LiveMarketsPanel from "@/components/live-markets-panel"

type ProposalRow = {
  id: number
  proposer: string
  description: string
  startBlock: bigint
  endBlock: bigint
  forVotes: bigint
  againstVotes: bigint
  abstainVotes: bigint
  executed: boolean
  canceled: boolean
}

export default function DaoPage() {
  const [loading, setLoading] = useState(true)
  const [proposalCount, setProposalCount] = useState<bigint>(0n)
  const [proposalThreshold, setProposalThreshold] = useState<bigint>(0n)
  const [quorumBps, setQuorumBps] = useState<bigint>(0n)
  const [votingDelayBlocks, setVotingDelayBlocks] = useState<bigint>(0n)
  const [votingPeriodBlocks, setVotingPeriodBlocks] = useState<bigint>(0n)
  const [proposals, setProposals] = useState<ProposalRow[]>([])
  const [votingProposalId, setVotingProposalId] = useState<number | null>(null)
  const [voteMessage, setVoteMessage] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const provider = getReadProvider()
      const dao = getContract(CONTRACTS.defaianceDAO, ABIS.dao, provider)

      const [count, threshold, quorum, delay, period] = await Promise.all([
        dao.proposalCount(),
        dao.proposalThreshold(),
        dao.quorumBps(),
        dao.votingDelayBlocks(),
        dao.votingPeriodBlocks(),
      ])

      setProposalCount(count)
      setProposalThreshold(threshold)
      setQuorumBps(quorum)
      setVotingDelayBlocks(delay)
      setVotingPeriodBlocks(period)

      const latest = Number(count)
      const start = Math.max(1, latest - 4)
      const rows: ProposalRow[] = []

      for (let id = latest; id >= start; id--) {
        const data = await dao.proposals(id)
        rows.push({
          id,
          proposer: data.proposer,
          description: data.description,
          startBlock: data.startBlock,
          endBlock: data.endBlock,
          forVotes: data.forVotes,
          againstVotes: data.againstVotes,
          abstainVotes: data.abstainVotes,
          executed: data.executed,
          canceled: data.canceled,
        })
      }

      setProposals(rows)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = window.setInterval(load, 20000)
    return () => window.clearInterval(interval)
  }, [])

  const activeEstimate = useMemo(
    () => proposals.filter((p) => !p.executed && !p.canceled).length,
    [proposals],
  )

  const vote = async (proposalId: number, support: 0 | 1 | 2) => {
    const signer = await getWalletSigner()
    if (!signer) {
      setVoteMessage("Connect wallet first.")
      return
    }

    try {
      setVotingProposalId(proposalId)
      setVoteMessage("Submitting vote transaction...")
      const dao = getContract(CONTRACTS.defaianceDAO, ABIS.dao, signer)
      const tx = await dao.castVote(proposalId, support)
      await tx.wait()
      setVoteMessage(`Vote submitted for proposal #${proposalId}.`)
      await load()
    } catch (error) {
      setVoteMessage(error instanceof Error ? error.message : "Vote transaction failed")
    } finally {
      setVotingProposalId(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text font-futuristic">DAO Governance</h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">Live governance parameters and proposal snapshots from DefaianceDAO contract.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Proposals</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : proposalCount.toString()}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Active (estimate)</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : activeEstimate}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Threshold</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : toEth(proposalThreshold, 2)}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Quorum BPS</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : quorumBps.toString()}</div></CardContent></Card>
          <Card className="glass-card"><CardContent className="p-5"><div className="text-white/70 text-sm">Voting Period</div><div className="text-yellow-300 text-2xl font-semibold">{loading ? "..." : votingPeriodBlocks.toString()}</div></CardContent></Card>
        </div>

        <LiveMarketsPanel />

        {voteMessage && (
          <div className="mb-6 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">
            {voteMessage}
          </div>
        )}

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2"><Shield className="h-5 w-5" />Governance Parameters</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-yellow-400/30 p-3"><div className="text-white/60">Voting Delay (blocks)</div><div className="text-white font-semibold">{votingDelayBlocks.toString()}</div></div>
            <div className="rounded-xl border border-yellow-400/30 p-3"><div className="text-white/60">Voting Period (blocks)</div><div className="text-white font-semibold">{votingPeriodBlocks.toString()}</div></div>
            <div className="rounded-xl border border-yellow-400/30 p-3"><div className="text-white/60">Quorum (%)</div><div className="text-white font-semibold">{(Number(quorumBps) / 100).toFixed(2)}%</div></div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2"><Gavel className="h-5 w-5" />Recent Proposals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proposals.length === 0 ? (
              <div className="text-white/70">No proposals found yet on-chain.</div>
            ) : (
              proposals.map((proposal) => (
                <div key={proposal.id} className="rounded-xl border border-yellow-400/30 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="font-semibold text-white">Proposal #{proposal.id}</div>
                    <div className="flex gap-2">
                      {proposal.executed && <Badge className="bg-yellow-400/20 border-yellow-400/30 text-yellow-300">Executed</Badge>}
                      {proposal.canceled && <Badge className="bg-white/10 border-white/20 text-white">Canceled</Badge>}
                      {!proposal.executed && !proposal.canceled && <Badge className="bg-yellow-400/20 border-yellow-400/30 text-yellow-300">Open/Queued</Badge>}
                    </div>
                  </div>
                  <div className="text-white/75 text-sm mb-2">{proposal.description || "No description"}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/70">
                    <div className="flex items-center gap-2"><Vote className="h-3.5 w-3.5 text-yellow-400" />For: {toEth(proposal.forVotes, 2)} • Against: {toEth(proposal.againstVotes, 2)} • Abstain: {toEth(proposal.abstainVotes, 2)}</div>
                    <div className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-yellow-400" />Blocks: {proposal.startBlock.toString()} → {proposal.endBlock.toString()}</div>
                  </div>
                  <div className="text-[11px] text-white/50 mt-2 break-all">Proposer: {proposal.proposer}</div>
                  {!proposal.executed && !proposal.canceled && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-300 text-black"
                        disabled={votingProposalId === proposal.id}
                        onClick={() => vote(proposal.id, 1)}
                      >
                        Vote For
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-400/40 text-white"
                        disabled={votingProposalId === proposal.id}
                        onClick={() => vote(proposal.id, 0)}
                      >
                        Vote Against
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-400/40 text-white"
                        disabled={votingProposalId === proposal.id}
                        onClick={() => vote(proposal.id, 2)}
                      >
                        Abstain
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
