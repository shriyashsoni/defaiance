"use client"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Briefcase,
  ChartCandlestick,
  Coins,
  HandCoins,
  Gavel,
  Globe,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  BarChart3,
  Users,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import FloatingElements from "@/components/floating-elements"
import LiveMarketsPanel from "@/components/live-markets-panel"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function DefaianceLanding() {
  const router = useRouter()
  const [typedChars, setTypedChars] = useState(0)
  const [typingPhase, setTypingPhase] = useState<"typing" | "holding" | "deleting">("typing")

  const terminalScript = useMemo(
    () =>
      [
        "$ connecting wallet provider...",
        "$ loading BSC contracts...",
        "$ syncing pools / governance / staking...",
        "$ status: READY",
      ].join("\n"),
    [],
  )

  useEffect(() => {
    const redirectIfConnected = async () => {
      if (typeof window.ethereum === "undefined") return

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (Array.isArray(accounts) && accounts.length > 0) {
          router.replace("/dashboard")
        }
      } catch {
      }
    }

    redirectIfConnected()
  }, [router])

  useEffect(() => {
    let timer: number

    if (typingPhase === "typing") {
      if (typedChars < terminalScript.length) {
        timer = window.setTimeout(() => {
          setTypedChars((current) => current + 1)
        }, 22)
      } else {
        timer = window.setTimeout(() => {
          setTypingPhase("holding")
        }, 1400)
      }
    } else if (typingPhase === "holding") {
      timer = window.setTimeout(() => {
        setTypingPhase("deleting")
      }, 900)
    } else {
      if (typedChars > 0) {
        timer = window.setTimeout(() => {
          setTypedChars((current) => Math.max(0, current - 1))
        }, 12)
      } else {
        timer = window.setTimeout(() => {
          setTypingPhase("typing")
        }, 240)
      }
    }

    return () => window.clearTimeout(timer)
  }, [typedChars, terminalScript, typingPhase])

  const modules = [
    { icon: <BarChart3 className="h-5 w-5" />, title: "Dashboard", desc: "Your full protocol command center", link: "/dashboard" },
    { icon: <HandCoins className="h-5 w-5" />, title: "Invest", desc: "Enter startup pools on-chain", link: "/invest" },
    { icon: <Coins className="h-5 w-5" />, title: "Marketplace", desc: "Tokenized startup exposure", link: "/marketplace" },
    { icon: <Gavel className="h-5 w-5" />, title: "DAO", desc: "Govern protocol decisions", link: "/dao" },
    { icon: <ChartCandlestick className="h-5 w-5" />, title: "AI Analytics", desc: "Live metrics and insights", link: "/ai-analytics" },
    { icon: <Layers className="h-5 w-5" />, title: "Portfolio", desc: "Track holdings and staking", link: "/portfolio" },
  ]

  const jobs = [
    { title: "Smart Contract Engineer", mode: "Remote", type: "Core", href: "/dashboard" },
    { title: "Growth & Community Lead", mode: "Hybrid", type: "Growth", href: "/dao" },
    { title: "Protocol Data Analyst", mode: "Remote", type: "Analytics", href: "/ai-analytics" },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />
      <Navigation />

      <section className="relative pt-28 pb-16">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <Badge className="mb-5 border border-yellow-400/50 bg-yellow-400/10 text-yellow-300">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Web3 Startup Investing Protocol
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-futuristic gradient-text mb-4">DEFAIANCE TERMINAL</h1>
            <p className="text-white/70 max-w-3xl mx-auto text-lg">
              Invest, govern, and track startup assets with live on-chain execution and real-time market intelligence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
          >
            <Card className="glass-card border-yellow-400/30 overflow-hidden">
              <CardHeader className="border-b border-yellow-400/20 pb-4">
                <CardTitle className="text-yellow-300 flex items-center gap-2 font-futuristic">
                  <TerminalSquare className="h-5 w-5" />
                  Protocol Boot Sequence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 font-mono text-sm leading-7 text-yellow-200/90 min-h-[170px]">
                  {terminalScript
                    .slice(0, typedChars)
                    .split("\n")
                    .map((line, index) => (
                      <div key={`${line}-${index}`}>
                        <span className="text-yellow-400">$</span>
                        {line.replace("$", "")}
                      </div>
                    ))}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                    className="inline-block ml-1 text-yellow-400"
                  >
                    ▋
                  </motion.span>
                </div>
                <div className="px-4 pb-5 flex flex-wrap gap-3">
                  <Link href="/dashboard">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                      Enter Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/invest">
                    <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                      Start Investing
                    </Button>
                  </Link>
                  <Link href="/markets">
                    <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                      Open Markets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Why Defaiance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/80">
                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 mt-1 text-yellow-400" />
                  <span>Global participation with wallet-native access and transparent on-chain state.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-1 text-yellow-400" />
                  <span>Community-led governance for proposal review, voting, and treasury direction.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Rocket className="h-4 w-4 mt-1 text-yellow-400" />
                  <span>Execution-first product flow: discover opportunities, invest, stake, and track returns.</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          >
            {[
              { label: "Chain", value: "BSC Testnet" },
              { label: "Mode", value: "On-Chain" },
              { label: "Data", value: "Live Markets" },
              { label: "Control", value: "DAO + Wallet" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-yellow-400/25 bg-black/60 p-4"
              >
                <div className="text-xs text-white/50 uppercase tracking-wider">{item.label}</div>
                <div className="text-lg text-yellow-300 font-semibold mt-1">{item.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <LiveMarketsPanel />

          <Card className="glass-card border-yellow-400/30 mt-6">
            <CardHeader>
              <CardTitle className="text-yellow-300 font-futuristic">Official Project Source</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-white/70 text-sm">
                Web3 learning projects showcased on DEFAIANCE are curated from the official BNB Chain Cookbook.
              </p>
              <a href="https://www.bnbchain.org/en/cookbook" target="_blank" rel="noreferrer">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300">
                  Open BNB Cookbook <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-futuristic gradient-text">Platform Modules</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-sans">
              Everything important is one click away.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <Link href={module.link}>
                  <Card className="glass-card border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="h-10 w-10 rounded-lg border border-yellow-400/40 bg-yellow-400/10 text-yellow-300 flex items-center justify-center mb-4">
                        {module.icon}
                      </div>
                      <h3 className="text-white font-semibold mb-2 font-futuristic">{module.title}</h3>
                      <p className="text-gray-400 text-sm">{module.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-futuristic gradient-text">Open Opportunities</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-sans">
              Join the team building the infrastructure for startup finance on-chain.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <Link href={job.href}>
                  <Card className="glass-card border-yellow-400/25 hover:border-yellow-400/50 transition-all duration-300 h-full">
                    <CardHeader>
                      <div className="h-10 w-10 rounded-lg border border-yellow-400/40 bg-yellow-400/10 text-yellow-300 flex items-center justify-center mb-2">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-white text-xl font-futuristic">{job.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between text-white/70">
                        <span>Work Mode</span>
                        <span className="text-yellow-300">{job.mode}</span>
                      </div>
                      <div className="flex items-center justify-between text-white/70">
                        <span>Team</span>
                        <span className="text-yellow-300">{job.type}</span>
                      </div>
                      <Button variant="outline" className="w-full border-yellow-400/40 text-white hover:bg-yellow-400/10">
                        View Role
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 font-futuristic gradient-text">
              Start Your On-Chain Workflow
            </motion.h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto font-sans">
              Connect your wallet, enter pools, participate in governance, and manage staking from one protocol surface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-4 text-lg"
                >
                  Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-400/40 text-white hover:bg-yellow-400/10 px-8 py-4 text-lg"
                >
                  Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 glass-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/logo.png" alt="DEFAIANCE" width={40} height={40} className="rounded-full" />
                <span className="text-xl font-bold font-futuristic gradient-text">DEFAIANCE</span>
              </div>
              <p className="text-gray-400 text-sm">The decentralized investment protocol for startup capital markets.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 font-futuristic">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/dashboard" className="animated-underline hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/invest" className="animated-underline hover:text-white transition-colors">
                    Invest
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="animated-underline hover:text-white transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/ai-analytics" className="animated-underline hover:text-white transition-colors">
                    AI Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/dao" className="animated-underline hover:text-white transition-colors">
                    DAO Governance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 font-futuristic">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/portfolio" className="animated-underline hover:text-white transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/ai-analytics" className="animated-underline hover:text-white transition-colors">
                    AI Analytics
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/shriyashsoni/defaiance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animated-underline hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://testnet.bscscan.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="animated-underline hover:text-white transition-colors"
                  >
                    BSC Testnet Explorer
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 DEFAIANCE. Built for on-chain startup finance.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
