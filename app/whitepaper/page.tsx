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
    body: "The protocol is composed of modular smart contracts on BSC testnet: DefaianceToken, TreasuryVault, StartupPoolFactory, InvestmentPool, MarketplaceEscrow, DefaianceDAO, StakingRewards, TokenVesting, and OracleAdapter. These contracts expose independent responsibilities and are orchestrated by the frontend through wallet-signed transactions.",
  },
  {
    title: "4. Smart Contracts Inventory",
    body: "DefaianceToken handles utility token supply and balances. StartupPoolFactory permissionlessly deploys investment pools. Each InvestmentPool manages deposits, shares, and redemption logic. TreasuryVault tracks treasury balances and secure custody logic. DefaianceDAO governs proposal and voting lifecycle. StakingRewards manages rewards distribution for aligned token holders. TokenVesting controls schedule-based token unlocks. MarketplaceEscrow supports trust-minimized deal settlement. OracleAdapter is reserved for external data normalization pathways.",
  },
  {
    title: "5. Product Submission and Listing",
    body: "Builders can submit a product URL, auto-extract metadata via AI scrape, and create investable pools directly on-chain through StartupPoolFactory. Each pool gets a dedicated product page for investor discovery.",
  },
  {
    title: "6. Investment Mechanics",
    body: "Users invest through on-chain `deposit` transactions into each pool. Native pools use BNB value transfer; token pools require ERC-20 allowance + deposit. Shares represent proportional ownership and `pricePerShare` informs valuation. Redeem value is estimated in-app and executed through on-chain withdraw calls.",
  },
  {
    title: "7. Redemption and Liquidity",
    body: "Redemption is deterministic and on-chain. Users choose a redeem percentage and submit wallet-signed withdraw transactions. Payouts are computed from shares burned and pool accounting state. This enables transparent capital exit logic without opaque intermediaries.",
  },
  {
    title: "8. Governance",
    body: "Token holders vote on proposals through DefaianceDAO. Governance controls strategic protocol updates, treasury direction, and ecosystem-level decisions under auditable voting rules.",
  },
  {
    title: "9. Staking and Incentives",
    body: "DFAI holders can stake tokens in StakingRewards to align long-term participation. Reward emissions and balances are publicly verifiable through contract state.",
  },
  {
    title: "10. Data Layer and Markets",
    body: "The app integrates live market feeds via Google Finance through SerpAPI with fallback resilience. A dedicated Markets Hub aggregates regions, trends, and news in one interface.",
  },
  {
    title: "11. Token and Treasury Model",
    body: "DFAI acts as governance and incentive utility across staking and protocol participation. TreasuryVault tracks strategic reserves and can be governed through DAO policy over time. Vesting logic enforces schedule-based emission control for long-term sustainability.",
  },
  {
    title: "12. Security and Risk Controls",
    body: "Contracts leverage OpenZeppelin standards, explicit access controls, and safeguarded execution patterns. Operational risks include market volatility, oracle quality, governance capture, and smart-contract risk. Mitigations include auditable on-chain state, modular upgrades, and phased rollout strategy.",
  },
  {
    title: "13. Compliance and Transparency",
    body: "All user-sensitive actions remain wallet-authorized and publicly traceable on chain. Product data submitted by builders is explicit and reviewable. The protocol emphasizes transparent data surfaces rather than hidden scoring and custodial decisioning.",
  },
  {
    title: "14. Roadmap",
    body: "Near-term milestones include richer pool media metadata, stronger project-to-pool indexing, advanced investor analytics, governance UX upgrades, and broader ecosystem integrations. Mid-term goals include higher reliability indexing services, improved risk scoring modules, and advanced portfolio performance tooling.",
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
