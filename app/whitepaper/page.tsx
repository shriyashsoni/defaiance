"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sections = [
  {
    title: "1. Vision",
    body: "DEFAIANCE is a permissionless startup investment protocol on BNB Chain that combines on-chain capital formation, transparent governance, and data-assisted market intelligence.",
  },
  {
    title: "2. Problem",
    body: "Traditional early-stage investing is fragmented, region-locked, and opaque. Retail users have limited access while founders struggle with trust, discovery, and efficient capital routing.",
  },
  {
    title: "3. Protocol Architecture",
    body: "The system is built around DefaianceToken, TreasuryVault, permissionless StartupPoolFactory, InvestmentPool, MarketplaceEscrow, DefaianceDAO, StakingRewards, and TokenVesting contracts deployed on BSC testnet.",
  },
  {
    title: "4. Product Submission and Listing",
    body: "Builders can submit a product URL, auto-extract metadata via AI scrape, and create investable pools directly on-chain through StartupPoolFactory. Each pool gets a dedicated product page for investor discovery.",
  },
  {
    title: "5. Investment Mechanics",
    body: "Users deposit native BNB or approved ERC-20 assets depending on pool configuration. Shares track ownership proportion and can be redeemed using withdraw functions with transparent on-chain pricing.",
  },
  {
    title: "6. Governance",
    body: "Token holders vote on proposals through DefaianceDAO. Governance controls strategic protocol updates, treasury direction, and ecosystem-level decisions under auditable voting rules.",
  },
  {
    title: "7. Staking and Incentives",
    body: "DFAI holders can stake tokens in StakingRewards to align long-term participation. Reward emissions and balances are publicly verifiable through contract state.",
  },
  {
    title: "8. Data Layer and Markets",
    body: "The app integrates live market feeds via Google Finance through SerpAPI with fallback resilience. A dedicated Markets Hub aggregates regions, trends, and news in one interface.",
  },
  {
    title: "9. Security Model",
    body: "Core contracts use OpenZeppelin standards with role controls where needed, pausable safeguards, and non-reentrancy protections. User actions remain wallet-signed and transparent.",
  },
  {
    title: "10. Roadmap",
    body: "Next milestones include richer pool metadata indexing, stronger submission-to-pool matching, analytics ranking, improved DAO proposal UX, and expanded ecosystem integrations.",
  },
]

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <Badge className="border border-yellow-400/50 bg-yellow-400/10 text-yellow-300 mb-3">DEFAIANCE Docs</Badge>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text font-futuristic mb-3">Whitepaper</h1>
          <p className="text-white/70 max-w-3xl mx-auto">
            Detailed protocol overview covering architecture, token mechanics, governance, market intelligence, and roadmap.
          </p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.title} className="glass-card border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 leading-7">{section.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
