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
  markets?: Record<string, MarketRow[]>
  market_trends?: TrendRow[]
  top_news?: NewsRow
  news_results?: NewsRow[]
  discover_more?: Array<{ title?: string; items?: MarketRow[] }>
}

const sections = ["us", "europe", "asia", "currencies", "crypto", "futures"] as const

export async function GET() {
  const apiKey = process.env.SERPAPI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MARKET_ANALYTICS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Missing SERPAPI_API_KEY" }, { status: 500 })
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

    const markets = sections.reduce<Record<string, MarketRow[]>>((acc, section) => {
      acc[section] = (json.markets?.[section] || []).slice(0, 8)
      return acc
    }, {})

    return NextResponse.json(
      {
        status: json.search_metadata?.status || "Unknown",
        provider: "Google Finance via SerpAPI",
        updatedAt: json.search_metadata?.processed_at || new Date().toISOString(),
        markets,
        marketTrends: json.market_trends || [],
        topNews: json.top_news || null,
        newsResults: json.news_results || [],
        discoverMore: json.discover_more || [],
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected market api error",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    )
  }
}
