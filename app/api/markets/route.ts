import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type BinanceTicker = {
  symbol: string
  lastPrice: string
  priceChangePercent: string
}

type MarketRow = {
  stock: string
  name?: string
  price: number
  extracted_price: number
  price_movement?: {
    percentage: number
    movement?: string
  }
}

const sections: Record<string, string[]> = {
  crypto: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "DOGEUSDT"],
  bnb: ["BNBUSDT", "BNBBTC", "BNBETH", "BNBUSDC", "BNBFDUSD", "BNBEUR"],
  defi: ["UNIUSDT", "AAVEUSDT", "LINKUSDT", "SUSHIUSDT", "MKRUSDT", "SNXUSDT"],
  layer2: ["OPUSDT", "ARBUSDT", "MATICUSDT", "IMXUSDT", "METISUSDT", "LRCUSDT"],
}

const nameMap: Record<string, string> = {
  BTCUSDT: "Bitcoin / Tether",
  ETHUSDT: "Ethereum / Tether",
  BNBUSDT: "BNB / Tether",
  SOLUSDT: "Solana / Tether",
  XRPUSDT: "XRP / Tether",
  DOGEUSDT: "Dogecoin / Tether",
  BNBBTC: "BNB / Bitcoin",
  BNBETH: "BNB / Ethereum",
  BNBUSDC: "BNB / USDC",
  BNBFDUSD: "BNB / FDUSD",
  BNBEUR: "BNB / EUR",
  UNIUSDT: "Uniswap / Tether",
  AAVEUSDT: "Aave / Tether",
  LINKUSDT: "Chainlink / Tether",
  SUSHIUSDT: "Sushi / Tether",
  MKRUSDT: "Maker / Tether",
  SNXUSDT: "Synthetix / Tether",
  OPUSDT: "Optimism / Tether",
  ARBUSDT: "Arbitrum / Tether",
  MATICUSDT: "Polygon / Tether",
  IMXUSDT: "Immutable / Tether",
  METISUSDT: "Metis / Tether",
  LRCUSDT: "Loopring / Tether",
}

export async function GET() {
  const apiKey = process.env.BINANCE_API_KEY

  const allSymbols = Array.from(new Set(Object.values(sections).flat()))

  try {
    const endpoint = new URL("https://api.binance.com/api/v3/ticker/24hr")
    endpoint.searchParams.set("symbols", JSON.stringify(allSymbols))

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      cache: "no-store",
      headers: apiKey
        ? {
            "X-MBX-APIKEY": apiKey,
          }
        : undefined,
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed loading market feed" }, { status: response.status })
    }

    const tickers = (await response.json()) as BinanceTicker[]
    const bySymbol = new Map(tickers.map((item) => [item.symbol, item]))

    const markets = Object.entries(sections).reduce<Record<string, MarketRow[]>>((acc, [section, symbols]) => {
      acc[section] = symbols
        .map((symbol) => {
          const ticker = bySymbol.get(symbol)
          if (!ticker) return null

          const percentage = Number(ticker.priceChangePercent)
          const price = Number(ticker.lastPrice)

          return {
            stock: ticker.symbol,
            name: nameMap[ticker.symbol] || ticker.symbol,
            price,
            extracted_price: price,
            price_movement: {
              percentage,
              movement: percentage >= 0 ? "up" : "down",
            },
          }
        })
        .filter(Boolean) as MarketRow[]
      return acc
    }, {})

    return NextResponse.json(
      {
        status: "Live",
        provider: "Binance",
        updatedAt: new Date().toISOString(),
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
