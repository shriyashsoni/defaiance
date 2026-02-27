"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type MarketRow = {
  stock?: string
  name?: string
  price?: number
  extracted_price?: number
  price_movement?: {
    percentage?: number
    movement?: string
  }
}

type MarketPayload = {
  status: string
  provider?: string
  updatedAt: string
  markets: Record<string, MarketRow[]>
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

export default function LiveMarketsPanel() {
  const [data, setData] = useState<MarketPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const response = await fetch("/api/markets", { cache: "no-store" })
      const json = (await response.json()) as MarketPayload
      if (!response.ok) {
        throw new Error(json.error || "Market feed unavailable")
      }
      setData(json)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Market feed unavailable")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = window.setInterval(load, 25000)
    return () => window.clearInterval(id)
  }, [])

  const sections = useMemo(() => Object.entries(data?.markets || {}), [data])

  return (
    <Card className="glass-card mb-8">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-yellow-300 font-futuristic">Real-Time Global Markets</CardTitle>
          <Badge className="bg-yellow-400/20 border-yellow-400/40 text-yellow-300">
            {loading ? "Loading" : "Auto refresh 25s"}
          </Badge>
        </div>
        <p className="text-xs text-white/60">
          {error
            ? error
            : `Provider: ${data?.provider || "-"} • Status: ${data?.status || "-"} • Updated: ${data?.updatedAt || "-"}`}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {sections.length === 0 && !loading && <div className="text-white/70 text-sm">No market rows returned.</div>}

        {sections.map(([key, rows]) => (
          <div key={key}>
            <h3 className="text-sm font-semibold text-yellow-300 mb-2">{sectionLabel[key] || key}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              {rows.slice(0, 6).map((row, idx) => {
                const price = row.price ?? row.extracted_price
                const up = (row.price_movement?.movement || "").toLowerCase() === "up"
                return (
                  <div key={`${row.stock || row.name || "m"}-${idx}`} className="rounded-lg border border-yellow-400/30 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-white truncate">{row.name || row.stock || "-"}</div>
                      <span className={up ? "text-yellow-300 text-xs" : "text-white/70 text-xs"}>
                        {row.price_movement?.movement || "-"}
                      </span>
                    </div>
                    <div className="text-xs text-white/55 truncate">{row.stock || "-"}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-yellow-300 font-mono text-sm">{fmt(price)}</div>
                      <div className="text-xs text-white/70">
                        {typeof row.price_movement?.percentage === "number"
                          ? `${row.price_movement.percentage.toFixed(2)}%`
                          : "-"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
