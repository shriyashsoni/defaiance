import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type MarketRow = {
  stock?: string
  link?: string
  serpapi_link?: string
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
  thumbnail?: string
}

type TrendRow = {
  title?: string
  link?: string
  serpapi_link?: string
  results?: MarketRow[]
}

type RawResponse = {
  search_metadata?: {
    status?: string
    processed_at?: string
  }
  markets?: Record<string, unknown>
  market_trends?: TrendRow[]
  top_news?: NewsRow
  news_results?: NewsRow[]
  discover_more?: Array<{ title?: string; items?: MarketRow[] }>
  error?: string
}

const sections = ["us", "europe", "asia", "currencies", "crypto", "futures"] as const

async function getBinanceFallbackMarkets() {
  const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT"]
  const endpoint = new URL("https://api.binance.com/api/v3/ticker/24hr")
  endpoint.searchParams.set("symbols", JSON.stringify(symbols))

  const response = await fetch(endpoint.toString(), { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Fallback provider unavailable")
  }

  const rows = ((await response.json()) as Array<{ symbol: string; lastPrice: string; priceChangePercent: string }>).map(
    (item) => {
      const pct = Number(item.priceChangePercent)
      const price = Number(item.lastPrice)
      return {
        stock: item.symbol,
        name: item.symbol,
        price,
        extracted_price: price,
        price_movement: {
          percentage: pct,
          movement: pct >= 0 ? "Up" : "Down",
        },
      }
    },
  )

  return {
    status: "Fallback",
    provider: "Binance (Fallback)",
    updatedAt: new Date().toISOString(),
    markets: {
      us: [],
      europe: [],
      asia: [],
      currencies: [],
      crypto: rows,
      futures: [],
    },
    marketTrends: [],
    topNews: null,
    newsResults: [],
    discoverMore: [],
  }
}

export async function GET() {
  const apiKey = process.env.SERPAPI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MARKET_ANALYTICS_API_KEY

  if (!apiKey) {
    try {
      const fallback = await getBinanceFallbackMarkets()
      return NextResponse.json(fallback, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      })
    } catch {
      return NextResponse.json({ error: "Missing SERPAPI_API_KEY and fallback unavailable" }, { status: 500 })
    }
  }

  try {
    const endpoint = new URL("https://serpapi.com/search.json")
    endpoint.searchParams.set("engine", "google_finance_markets")
    endpoint.searchParams.set("trend", "indexes")
    endpoint.searchParams.set("hl", "en")
    endpoint.searchParams.set("api_key", apiKey)

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed loading market feed" }, { status: response.status })
    }

    const json = (await response.json()) as RawResponse

    if (json.error) {
      throw new Error(json.error)
    }

    const marketsObj = json.markets || {}

    const getSectionRows = (section: (typeof sections)[number]) => {
      const raw = marketsObj[section]
      return Array.isArray(raw) ? (raw as MarketRow[]).slice(0, 8) : []
    }

    const nestedTopNews = marketsObj["top_news"] as NewsRow | undefined
    const nestedNewsResults = marketsObj["news_results"] as NewsRow[] | undefined

    const markets = sections.reduce<Record<string, MarketRow[]>>((acc, section) => {
      acc[section] = getSectionRows(section)
      return acc
    }, {})

    return NextResponse.json(
      {
        status: json.search_metadata?.status || "Unknown",
        provider: "Google Finance via SerpAPI",
        updatedAt: json.search_metadata?.processed_at || new Date().toISOString(),
        markets,
        marketTrends: json.market_trends || [],
        topNews: json.top_news || nestedTopNews || null,
        newsResults: json.news_results || nestedNewsResults || [],
        discoverMore: json.discover_more || [],
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    try {
      const fallback = await getBinanceFallbackMarkets()
      return NextResponse.json(fallback, {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      })
    } catch {
      return NextResponse.json(
        {
          error: "Unexpected market api error",
          details: error instanceof Error ? error.message : "Unknown",
        },
        { status: 500 },
      )
    }
  }
}
