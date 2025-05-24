"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Zap,
  Globe,
  Brain,
  Coins,
  Users,
  Rocket,
  Lock,
  ArrowRight,
  ChevronDown,
  PieChart,
  BookOpen,
  FileText,
  Gavel,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import StatsCounter from "@/components/stats-counter"
import StartupCard from "@/components/startup-card"
import FloatingElements from "@/components/floating-elements"

export default function DefaianceLanding() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const stats = [
    { label: "Total Capital Raised", value: 125000000, prefix: "$", suffix: "" },
    { label: "Startups Funded", value: 847, prefix: "", suffix: "" },
    { label: "Global Investors", value: 12500, prefix: "", suffix: "+" },
    { label: "Success Rate", value: 89, prefix: "", suffix: "%" },
  ]

  const features = [
    {
      icon: <Coins className="h-8 w-8" />,
      title: "Tokenized Equity",
      description:
        "Own fractional equity in startups through blockchain-based tokens with full transparency and liquidity.",
      link: "/marketplace",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Analytics",
      description:
        "Advanced AI analyzes founder credibility, market sentiment, and risk factors for informed decisions.",
      link: "/ai-analytics",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "DAO Governance",
      description: "Community-driven decisions through decentralized governance and milestone-based fund releases.",
      link: "/dao",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Liquidity",
      description: "Trade equity tokens on integrated DEXs with immediate settlement and global accessibility.",
      link: "/marketplace",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Cross-Chain Support",
      description: "Interoperable across Ethereum, Polygon, Solana, Arbitrum, and Binance Smart Chain.",
      link: "/documentation",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Vault Protection",
      description: "Milestone-based fund release system ensures accountability and investor protection.",
      link: "/resources",
    },
  ]

  const quickLinks = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Marketplace",
      description: "Explore investment opportunities",
      link: "/marketplace",
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Portfolio",
      description: "Track your investments",
      link: "/portfolio",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Analytics",
      description: "Smart investment insights",
      link: "/ai-analytics",
    },
    { icon: <Gavel className="h-6 w-6" />, title: "DAO Governance", description: "Vote on proposals", link: "/dao" },
    { icon: <BookOpen className="h-6 w-6" />, title: "Academy", description: "Learn Web3 investing", link: "/academy" },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Resources",
      description: "Documentation & guides",
      link: "/resources",
    },
  ]

  const startups = [
    {
      id: "1",
      name: "QuantumAI Labs",
      industry: "AI/ML",
      stage: "Series A",
      raised: 2500000,
      target: 5000000,
      aiScore: 94,
      description: "Revolutionary quantum computing solutions for AI acceleration",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.25,
      totalTokens: 20000000,
      availableTokens: 10000000,
    },
    {
      id: "2",
      name: "GreenTech Solutions",
      industry: "CleanTech",
      stage: "Seed",
      raised: 750000,
      target: 1500000,
      aiScore: 87,
      description: "Sustainable energy storage using advanced battery technology",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.15,
      totalTokens: 10000000,
      availableTokens: 5000000,
    },
    {
      id: "3",
      name: "BioMed Innovations",
      industry: "Healthcare",
      stage: "Pre-Seed",
      raised: 300000,
      target: 800000,
      aiScore: 91,
      description: "AI-powered drug discovery platform for rare diseases",
      logo: "/placeholder.svg?height=60&width=60",
      tokenPrice: 0.08,
      totalTokens: 10000000,
      availableTokens: 6250000,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f2c] text-white overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div className="text-center z-10 max-w-6xl mx-auto px-4" style={{ y, opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="mb-6"
            >
              <Badge className="mb-4 glass-card text-white border-0 px-6 py-3 text-lg neon-glow">
                🚀 The Web3 Investment Revolution
              </Badge>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 font-mono font-futuristic gradient-text"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              DEFAIANCE
            </motion.h1>

            <motion.p
              className="text-2xl md:text-3xl mb-4 text-gray-300 font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Invest in the future, backed by equity, governed by code.
            </motion.p>

            <motion.p
              className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-sans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              The decentralized investment platform that democratizes startup funding through Web3 technologies, DeFi
              infrastructure, and AI-driven analytics.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/invest">
              <Button
                size="lg"
                className="glass-card hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-mono font-futuristic neon-glow"
              >
                Start Investing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dao">
              <Button
                size="lg"
                variant="outline"
                className="glass-card hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-mono font-futuristic border-white/20 text-white hover:bg-white/10"
              >
                Join DAO <Users className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glass-card p-6 hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 font-mono font-futuristic">
                  <StatsCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 text-sm md:text-base font-sans">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono font-futuristic gradient-text">
              Platform Access
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-sans">
              Navigate to any section of the DEFAIANCE ecosystem
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Link href={link.link}>
                  <Card className="glass-card hover:bg-white/10 transition-all duration-300 h-full cursor-pointer neon-glow">
                    <CardContent className="p-6 text-center">
                      <div className="text-blue-400 group-hover:text-cyan-400 transition-colors duration-300 mb-4 flex justify-center">
                        {link.icon}
                      </div>
                      <h3 className="text-white font-semibold mb-2 font-mono font-futuristic">{link.title}</h3>
                      <p className="text-gray-400 text-sm font-sans">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono font-futuristic gradient-text">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-sans">
              Experience the future of investment with our cutting-edge Web3 platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group"
              >
                <Link href={feature.link}>
                  <Card className="glass-card hover:bg-white/10 transition-all duration-300 h-full cursor-pointer neon-glow">
                    <CardHeader>
                      <motion.div
                        className="text-blue-400 group-hover:text-cyan-400 transition-colors duration-300 mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle className="text-white text-xl font-mono font-futuristic">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400 text-base font-sans">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups Preview */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono font-futuristic gradient-text">
              Featured Investment Opportunities
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-sans">
              Discover and invest in tomorrow's unicorns with AI-powered insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {startups.map((startup, index) => (
              <StartupCard key={index} startup={startup} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/invest">
              <Button
                size="lg"
                className="glass-card hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-mono font-futuristic neon-glow"
              >
                View All Opportunities <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 font-mono font-futuristic gradient-text"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Join the Revolution
            </motion.h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto font-sans">
              Be part of the future where startup investing meets DeFi. Equity meets code. Power meets people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/invest">
                <Button
                  size="lg"
                  className="glass-card hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-mono font-futuristic neon-glow"
                >
                  Start Investing Today <Rocket className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/resources">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-card hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-mono font-futuristic border-white/20 text-white hover:bg-white/10"
                >
                  Read Whitepaper <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 glass-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image src="/logo.png" alt="DEFAIANCE" width={40} height={40} className="rounded-full" />
                <span className="text-xl font-bold font-mono font-futuristic gradient-text">DEFAIANCE</span>
              </div>
              <p className="text-gray-400 text-sm font-sans">The decentralized investment platform for the Web3 era.</p>

              {/* Team Social Links */}
              <div className="mt-4">
                <h4 className="text-white font-semibold mb-2 font-mono font-futuristic">Team</h4>
                <div className="space-y-1 text-gray-400 text-sm">
                  <a
                    href="https://x.com/shriyash_soni?t=8Mh_W6fG5hfabPzJNTW3lg&s=09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block animated-underline hover:text-blue-400 transition-colors"
                  >
                    @shriyash_soni
                  </a>
                  <a
                    href="https://x.com/harsh_hc07?t=r0lyLdmFPVZMQqyZZIkBTw&s=08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block animated-underline hover:text-blue-400 transition-colors"
                  >
                    @harsh_hc07
                  </a>
                  <a
                    href="https://x.com/shyamal_s19?t=IpDiCL7ntGZUmtNh88L3Kg&s=09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block animated-underline hover:text-blue-400 transition-colors"
                  >
                    @shyamal_s19
                  </a>
                  <a
                    href="https://github.com/shriyashsoni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block animated-underline hover:text-blue-400 transition-colors"
                  >
                    GitHub: shriyashsoni
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 font-mono font-futuristic">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
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
                <li>
                  <Link href="/academy" className="animated-underline hover:text-white transition-colors">
                    Academy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 font-mono font-futuristic">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/resources" className="animated-underline hover:text-white transition-colors">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="animated-underline hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="animated-underline hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="animated-underline hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 font-mono font-futuristic">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="animated-underline hover:text-white transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="animated-underline hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="animated-underline hover:text-white transition-colors">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="animated-underline hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 DEFAIANCE. All rights reserved. Built on Web3.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
