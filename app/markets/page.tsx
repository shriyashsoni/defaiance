"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Newspaper } from "lucide-react"
import Navigation from "@/components/navigation"
import AnimatedBackground from "@/components/animated-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type MarketRow = {
  stock?: string
  link?: string
  name?: string
  price?: number
  extracted_price?: number
  currency?: string
  price_movement?: {
    percentage?: number
    value?: number
    movement?: string
  }
}

type NewsRow = {
  snippet?: string
  link?: string
  source?: string
  date?: string
}

type TrendRow = {
  title?: string
  link?: string
  results?: MarketRow[]
}

type Payload = {
  status: string
  provider?: string
  updatedAt: string
  markets: Record<string, MarketRow[]>
  marketTrends?: TrendRow[]
  topNews?: NewsRow | null
  newsResults?: NewsRow[]
  error?: string
}

const sectionLabel: Record<string, string> = {
  us: "US",
  europe: "Europe",
  asia: "Asia",
  currencies: "Currencies",
  crypto: "Crypto",
  futures: "Futures",
}

function fmt(value?: number) {
  if (typeof value !== "number") return "-"
  return value >= 1000
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : value.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

export default function MarketsPage() {
  const [data, setData] = useState<Payload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const response = await fetch("/api/markets", { cache: "no-store" })
      const json = (await response.json()) as Payload
      if (!response.ok) {
        throw new Error(json.error || "Unable to load market data")
      }
      setData(json)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load market data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = window.setInterval(load, 25000)
    return () => window.clearInterval(interval)
  }, [])

  const sections = useMemo(() => Object.entries(data?.markets || {}), [data])

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text font-futuristic mb-3">Global Markets Hub</h1>
          <p className="text-white/70 max-w-3xl mx-auto">
            All market sections, trends, and headlines in one page powered by Google Finance data via SerpAPI.
          </p>
          <p className="text-xs text-white/60 mt-3">
            {error
              ? error
              : `Provider: ${data?.provider || "-"} • Status: ${data?.status || "-"} • Updated: ${data?.updatedAt || "-"}`}
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map(([key, rows]) => (
            <Card key={key} className="glass-card border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic">{sectionLabel[key] || key}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {rows.slice(0, 8).map((row, idx) => (
                    <div key={`${row.stock || row.name || key}-${idx}`} className="rounded-lg border border-yellow-400/30 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-white truncate">{row.name || row.stock || "-"}</div>
                        <div className="text-xs text-white/70">{row.price_movement?.movement || "-"}</div>
                      </div>
                      <div className="text-xs text-white/60 mt-1 truncate">{row.stock || "-"}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-yellow-300 font-semibold">{fmt(row.price ?? row.extracted_price)}</div>
                        <div className="text-xs text-white/70">
                          {typeof row.price_movement?.percentage === "number"
                            ? `${row.price_movement.percentage.toFixed(2)}%`
                            : "-"}
                        </div>
                      </div>
                      {row.link && (
                        <a href={row.link} target="_blank" rel="noreferrer" className="inline-block mt-2">
                          <Button variant="outline" className="border-yellow-400/40 text-white h-8 px-3 text-xs">
                            Open Quote <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {!!data?.marketTrends?.length && (
            <Card className="glass-card border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic">Market Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.marketTrends.slice(0, 3).map((trend, index) => (
                  <div key={`${trend.title || "trend"}-${index}`} className="rounded-lg border border-yellow-400/30 p-3">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="text-white font-semibold">{trend.title || "Trend"}</div>
                      {trend.link && (
                        <a href={trend.link} target="_blank" rel="noreferrer">
                          <Button variant="outline" className="border-yellow-400/40 text-white h-8 px-3 text-xs">
                            Open <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(trend.results || []).slice(0, 6).map((item, idx) => (
                        <div key={`${item.stock || item.name || "r"}-${idx}`} className="rounded border border-yellow-400/20 p-2 text-sm">
                          <div className="text-white truncate">{item.name || item.stock || "-"}</div>
                          <div className="text-yellow-300">{fmt(item.extracted_price ?? item.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(data?.topNews || (data?.newsResults && data.newsResults.length > 0)) && (
            <Card className="glass-card border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-yellow-300 font-futuristic flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  Market News
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.topNews?.snippet && (
                  <div className="rounded-lg border border-yellow-400/30 p-3 bg-yellow-400/10">
                    <div className="text-white font-semibold">{data.topNews.snippet}</div>
                    <div className="text-xs text-white/70 mt-1">
                      {data.topNews.source || "Unknown source"} • {data.topNews.date || "-"}
                    </div>
                    {data.topNews.link && (
                      <a href={data.topNews.link} target="_blank" rel="noreferrer" className="inline-block mt-2">
                        <Button className="bg-yellow-400 hover:bg-yellow-300 text-black h-8 px-3 text-xs">
                          Read Top News <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </a>
                    )}
                  </div>
                )}

                {(data.newsResults || []).slice(0, 8).map((news, idx) => (
                  <div key={`${news.link || news.snippet || "news"}-${idx}`} className="rounded-lg border border-yellow-400/30 p-3">
                    <div className="text-white text-sm">{news.snippet || "News item"}</div>
                    <div className="text-xs text-white/70 mt-1">
                      {news.source || "Unknown source"} • {news.date || "-"}
                    </div>
                    {news.link && (
                      <a href={news.link} target="_blank" rel="noreferrer" className="inline-block mt-2">
                        <Button variant="outline" className="border-yellow-400/40 text-white h-8 px-3 text-xs">
                          Open Article <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!loading && !error && sections.length === 0 && (
            <Card className="glass-card border-yellow-400/30">
              <CardContent className="p-6 text-white/70 text-sm">No market data available right now.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
