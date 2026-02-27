import { NextResponse } from "next/server"

function extractMeta(content: string, key: string) {
  const regex = new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i")
  const match = content.match(regex)
  return match?.[1]?.trim() || ""
}

function extractTitle(content: string) {
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i)
  return titleMatch?.[1]?.trim() || ""
}

function extractH1(content: string) {
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!h1Match?.[1]) return ""
  return h1Match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
}

function toSymbol(name: string) {
  const cleaned = name
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")

  if (cleaned.length >= 3) return cleaned.slice(0, 8)

  const compact = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
  return (compact.slice(0, 6) || "PROD").slice(0, 8)
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url).searchParams.get("url")?.trim()
    if (!url) {
      return NextResponse.json({ error: "Missing url query param" }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "user-agent": "DefaianceBot/1.0 (+https://defaiance.app)",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Unable to fetch URL (${response.status})` }, { status: 400 })
    }

    const html = await response.text()
    const title = extractTitle(html)
    const description =
      extractMeta(html, "description") || extractMeta(html, "og:description") || extractMeta(html, "twitter:description")
    const h1 = extractH1(html)
    const bestName = h1 || title || parsedUrl.hostname.replace("www.", "")

    const aiSummary = [
      `Auto-detected project from ${parsedUrl.hostname}.`,
      description ? `Summary: ${description}` : "No public meta description detected.",
      "Review and edit before listing on-chain.",
    ].join(" ")

    return NextResponse.json({
      ok: true,
      data: {
        website: parsedUrl.toString(),
        name: bestName.slice(0, 64),
        symbol: toSymbol(bestName),
        description: aiSummary,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scrape product data" },
      { status: 500 },
    )
  }
}
