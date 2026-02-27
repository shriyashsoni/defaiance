import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type RawMarketRow = {
  stock?: string
  name?: string
  price?: number
  extracted_price?: number
  price_movement?: {
    percentage?: number
    value?: number
    movement?: string
  }
}

type RawSerpApiResponse = {
  search_metadata?: {
    status?: string
    processed_at?: string
  }
  markets?: Record<string, RawMarketRow[]>
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

    const json = (await response.json()) as RawSerpApiResponse

    const markets = sections.reduce<Record<string, RawMarketRow[]>>((acc, section) => {
      acc[section] = (json.markets?.[section] || []).slice(0, 6)
      return acc
    }, {})

    return NextResponse.json(
      {
        status: json.search_metadata?.status || "Unknown",
        updatedAt: json.search_metadata?.processed_at || new Date().toISOString(),
        markets,
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
