"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Sparkles, UploadCloud, Wand2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { ABIS, CONTRACTS, getContract, getWalletContext, getWalletSigner } from "@/lib/onchain"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export default function SubmitProductPage() {
  const [scrapeUrl, setScrapeUrl] = useState("")
  const [website, setWebsite] = useState("")
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [description, setDescription] = useState("")
  const [manager, setManager] = useState("")
  const [assetMode, setAssetMode] = useState<"native" | "custom">("native")
  const [assetAddress, setAssetAddress] = useState("")
  const [busyScrape, setBusyScrape] = useState(false)
  const [busySubmit, setBusySubmit] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [createdPool, setCreatedPool] = useState<string | null>(null)

  const resolvedAsset = useMemo(() => {
    if (assetMode === "native") return ZERO_ADDRESS
    return assetAddress.trim()
  }, [assetAddress, assetMode])

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) {
      setStatus("Add a product website URL first.")
      return
    }

    try {
      setBusyScrape(true)
      setStatus("Running AI scrape and preparing autofill...")
      const response = await fetch(`/api/product-scrape?url=${encodeURIComponent(scrapeUrl.trim())}`)
      const payload = await response.json()

      if (!response.ok || !payload?.data) {
        throw new Error(payload?.error || "Unable to scrape this URL")
      }

      setWebsite(payload.data.website || "")
      setName(payload.data.name || "")
      setSymbol(payload.data.symbol || "")
      setDescription(payload.data.description || "")
      setStatus("AI scrape complete. Review fields and list on-chain.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Scrape failed")
    } finally {
      setBusyScrape(false)
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !symbol.trim()) {
      setStatus("Name and symbol are required.")
      return
    }

    const signer = await getWalletSigner()
    if (!signer) {
      setStatus("Connect wallet first.")
      return
    }

    try {
      setBusySubmit(true)
      setCreatedPool(null)
      const { account } = await getWalletContext()
      const managerAddress = manager.trim() || account
      if (!managerAddress) {
        setStatus("Unable to resolve manager address from wallet.")
        return
      }

      setStatus("Submitting on-chain listing transaction...")
      const factory = getContract(CONTRACTS.startupPoolFactory, ABIS.poolFactory, signer)
      const tx = await factory.createPool(resolvedAsset, managerAddress, name.trim(), symbol.trim())
      await tx.wait()

      const totalPools = await factory.poolsCount()
      const poolAddress = await factory.allPools(totalPools - 1n)
      setCreatedPool(poolAddress)
      setStatus("Product listed on-chain successfully.")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Listing failed"
      setStatus(message)
    } finally {
      setBusySubmit(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="border border-yellow-400/50 bg-yellow-400/10 text-yellow-300 mb-3">
              <UploadCloud className="h-3.5 w-3.5 mr-2" />
              Submit Product on BNB
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text font-futuristic mb-3">AI Listing Terminal</h1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Paste your website, auto-scrape product details, and list your product on-chain for public investment.
            </p>
          </div>

          <Card className="glass-card border-yellow-400/30 mb-6">
            <CardHeader>
              <CardTitle className="text-yellow-300 font-futuristic">Official Source</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-white/70 text-sm">Reference projects are sourced from the official BNB Chain Cookbook.</p>
              <a href="https://www.bnbchain.org/en/cookbook" target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                  BNB Cookbook <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-400/30 mb-6">
            <CardHeader>
              <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Scrape
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  value={scrapeUrl}
                  onChange={(event) => setScrapeUrl(event.target.value)}
                  placeholder="https://your-startup-website.com"
                  className="h-11 rounded-lg border border-yellow-400/40 bg-black px-3 text-white flex-1"
                />
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300" disabled={busyScrape} onClick={handleScrape}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {busyScrape ? "Scraping..." : "AI Scrape & Autofill"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-yellow-300 font-futuristic">Product Listing Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Product Name"
                  className="h-11 rounded-lg border border-yellow-400/40 bg-black px-3 text-white"
                />
                <input
                  value={symbol}
                  onChange={(event) => setSymbol(event.target.value.toUpperCase().slice(0, 8))}
                  placeholder="Symbol"
                  className="h-11 rounded-lg border border-yellow-400/40 bg-black px-3 text-white"
                />
              </div>

              <input
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="Website URL"
                className="h-11 rounded-lg border border-yellow-400/40 bg-black px-3 text-white w-full"
              />

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="min-h-[120px] rounded-lg border border-yellow-400/40 bg-black px-3 py-2 text-white w-full"
              />

              <input
                value={manager}
                onChange={(event) => setManager(event.target.value)}
                placeholder="Manager Address (optional: defaults to connected wallet)"
                className="h-11 rounded-lg border border-yellow-400/40 bg-black px-3 text-white w-full"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={assetMode}
                  onChange={(event) => setAssetMode(event.target.value as "native" | "custom")}
                  className="h-11 rounded-lg border border-yellow-400/40 bg-black px-3 text-white"
                >
                  <option value="native">Native BNB Pool</option>
                  <option value="custom">Custom ERC20 Asset</option>
                </select>

                <input
                  value={assetAddress}
                  onChange={(event) => setAssetAddress(event.target.value)}
                  placeholder={assetMode === "native" ? "Not needed for native BNB" : "ERC20 Asset Address"}
                  disabled={assetMode === "native"}
                  className="h-11 rounded-lg border border-yellow-400/40 bg-black px-3 text-white disabled:opacity-50"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-300" disabled={busySubmit} onClick={handleSubmit}>
                  {busySubmit ? "Listing..." : "List Product On-Chain"}
                </Button>
                <Link href="/invest">
                  <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                    Open Invest Page <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {status && <div className="text-sm text-yellow-200 border border-yellow-400/30 rounded-lg p-3">{status}</div>}

              {createdPool && (
                <div className="space-y-3 rounded-lg border border-yellow-400/30 p-3 bg-yellow-400/10">
                  <div className="text-sm text-yellow-200">Pool created: {createdPool}</div>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/product/${createdPool}`}>
                      <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                        Open Product Page
                      </Button>
                    </Link>
                    <a href={`https://testnet.bscscan.com/address/${createdPool}`} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="border-yellow-400/40 text-white hover:bg-yellow-400/10">
                        View On BscScan
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
