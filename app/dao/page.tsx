"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gavel, Users, Vote, Clock, CheckCircle, XCircle, Plus, Shield, Coins, Target } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"

export default function DAOGovernance() {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null)
  const [newProposal, setNewProposal] = useState({ title: "", description: "" })
  const [userVotingPower, setUserVotingPower] = useState(2500)

  const proposals = [
    {
      id: "1",
      title: "Increase AI Analytics Budget by 25%",
      description:
        "Proposal to allocate additional funds for enhancing our AI analytics capabilities and hiring more data scientists.",
      status: "active",
      votesFor: 15420,
      votesAgainst: 3280,
      totalVotes: 18700,
      quorum: 20000,
      timeLeft: "2 days",
      proposer: "0x742d...4f2a",
      category: "Budget",
      impact: "Medium",
    },
    {
      id: "2",
      title: "Add Solana Chain Support",
      description:
        "Integrate Solana blockchain to expand our multi-chain capabilities and reach new investor communities.",
      status: "active",
      votesFor: 22150,
      votesAgainst: 1890,
      totalVotes: 24040,
      quorum: 20000,
      timeLeft: "5 days",
      proposer: "0x8a3b...7c9d",
      category: "Technical",
      impact: "High",
    },
    {
      id: "3",
      title: "Reduce Platform Fees to 2%",
      description: "Lower transaction fees to make the platform more competitive and attract more investors.",
      status: "passed",
      votesFor: 28750,
      votesAgainst: 8420,
      totalVotes: 37170,
      quorum: 20000,
      timeLeft: "Ended",
      proposer: "0x1f5e...9b2c",
      category: "Economic",
      impact: "High",
    },
    {
      id: "4",
      title: "Implement Staking Rewards Program",
      description:
        "Create a staking mechanism for DEFX token holders to earn rewards and increase platform engagement.",
      status: "failed",
      votesFor: 12340,
      votesAgainst: 18650,
      totalVotes: 30990,
      quorum: 20000,
      timeLeft: "Ended",
      proposer: "0x6d8a...3e7f",
      category: "Tokenomics",
      impact: "Medium",
    },
  ]

  const daoStats = [
    { label: "Total Members", value: 12847, icon: <Users className="h-5 w-5" /> },
    { label: "Active Proposals", value: 8, icon: <Gavel className="h-5 w-5" /> },
    { label: "Total Votes Cast", value: 156420, icon: <Vote className="h-5 w-5" /> },
    { label: "Treasury Value", value: 2850000, prefix: "$", icon: <Coins className="h-5 w-5" /> },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "passed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    // Simulate voting logic
    console.log(`Voted ${vote} on proposal ${proposalId}`)
  }

  const handleCreateProposal = () => {
    if (newProposal.title && newProposal.description) {
      console.log("Creating proposal:", newProposal)
      setNewProposal({ title: "", description: "" })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f2c] text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-orbitron gradient-text">DAO Governance</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-inter">
            Participate in decentralized decision-making and shape the future of DEFAIANCE
          </p>
        </motion.div>

        {/* DAO Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          {daoStats.map((stat, index) => (
            <Card key={index} className="glass-card text-center">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-3 text-blue-400">{stat.icon}</div>
                <div className="text-2xl font-bold gradient-text mb-1 font-orbitron">
                  {stat.prefix || ""}
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm font-inter">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Your Voting Power */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white font-orbitron flex items-center">
                <Shield className="h-6 w-6 mr-2 text-blue-400" />
                Your Voting Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold gradient-text font-orbitron">
                    {userVotingPower.toLocaleString()} DEFX
                  </div>
                  <div className="text-gray-400 font-inter">Voting tokens held</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-white font-orbitron">
                    {((userVotingPower / 50000) * 100).toFixed(2)}%
                  </div>
                  <div className="text-gray-400 text-sm font-inter">of total voting power</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="proposals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card border border-white/10 mb-8">
            <TabsTrigger value="proposals" className="data-[state=active]:bg-blue-500 font-orbitron">
              Active Proposals
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-purple-500 font-orbitron">
              Voting History
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-green-500 font-orbitron">
              Create Proposal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proposals
                .filter((p) => p.status === "active")
                .map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="glass-card hover:bg-white/10 transition-all duration-300 neon-glow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white font-orbitron mb-2">{proposal.title}</CardTitle>
                            <CardDescription className="text-gray-400 font-inter">
                              {proposal.description}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                            <Badge className={getImpactColor(proposal.impact)}>{proposal.impact} Impact</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-inter">Votes For</span>
                            <span className="text-green-400 font-semibold">{proposal.votesFor.toLocaleString()}</span>
                          </div>
                          <Progress value={(proposal.votesFor / proposal.quorum) * 100} className="h-2" />

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400 font-inter">Votes Against</span>
                            <span className="text-red-400 font-semibold">{proposal.votesAgainst.toLocaleString()}</span>
                          </div>
                          <Progress value={(proposal.votesAgainst / proposal.quorum) * 100} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {proposal.timeLeft} left
                          </div>
                          <div className="text-gray-400 font-inter">
                            Quorum: {((proposal.totalVotes / proposal.quorum) * 100).toFixed(0)}%
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleVote(proposal.id, "for")}
                            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-orbitron"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Vote For
                          </Button>
                          <Button
                            onClick={() => handleVote(proposal.id, "against")}
                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-orbitron"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Vote Against
                          </Button>
                        </div>

                        <div className="pt-2 border-t border-white/10 text-xs text-gray-500 font-inter">
                          Proposed by: {proposal.proposer} • Category: {proposal.category}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {proposals
                .filter((p) => p.status !== "active")
                .map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="glass-card">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1 font-orbitron">{proposal.title}</h3>
                            <p className="text-gray-400 text-sm mb-2 font-inter">{proposal.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-green-400">For: {proposal.votesFor.toLocaleString()}</span>
                              <span className="text-red-400">Against: {proposal.votesAgainst.toLocaleString()}</span>
                              <span className="text-gray-400 font-inter">
                                Total: {proposal.totalVotes.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                            <Badge className={getImpactColor(proposal.impact)}>{proposal.impact}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white font-orbitron flex items-center">
                  <Plus className="h-6 w-6 mr-2 text-blue-400" />
                  Create New Proposal
                </CardTitle>
                <CardDescription className="text-gray-400 font-inter">
                  Submit a proposal for community voting. Requires minimum 1000 DEFX tokens.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-white font-inter">
                    Proposal Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter proposal title..."
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                    className="mt-2 glass-card border-white/10 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white font-inter">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed description of your proposal..."
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                    className="mt-2 glass-card border-white/10 text-white placeholder-gray-400 min-h-[120px]"
                  />
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2 font-orbitron">Proposal Guidelines</h4>
                  <ul className="text-gray-300 text-sm space-y-1 font-inter">
                    <li>• Clearly state the problem and proposed solution</li>
                    <li>• Include implementation timeline and budget if applicable</li>
                    <li>• Consider the impact on the community and platform</li>
                    <li>• Proposals require 48 hours for community review before voting</li>
                  </ul>
                </div>

                <Button
                  onClick={handleCreateProposal}
                  disabled={!newProposal.title || !newProposal.description || userVotingPower < 1000}
                  className="w-full glass-card neon-glow font-orbitron"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Submit Proposal
                </Button>

                {userVotingPower < 1000 && (
                  <p className="text-red-400 text-sm text-center font-inter">
                    You need at least 1000 DEFX tokens to create a proposal
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
