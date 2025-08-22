export interface WebSearchSource {
  title: string
  url: string
  excerpt?: string
}

export interface WebSearchResponse {
  answer: string
  sources: WebSearchSource[]
  confidence: number
}

// Lightweight web search using DuckDuckGo Instant Answer API (no API key required)
// Note: This is a best-effort fallback. Some environments may block cross-origin requests from the browser.
export async function webSearch(query: string): Promise<WebSearchResponse | null> {
  try {
    const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
    const res = await fetch(endpoint, { cache: 'no-store' as RequestCache })
    if (!res.ok) return null
    const data = await res.json() as any

    const sources: WebSearchSource[] = []

    // Primary abstract
    if (data.AbstractText && data.AbstractURL) {
      sources.push({ title: data.Heading || 'DuckDuckGo Result', url: data.AbstractURL, excerpt: data.AbstractText })
    }

    // Related topics often include additional links
    if (Array.isArray(data.RelatedTopics)) {
      for (const item of data.RelatedTopics) {
        if (item && typeof item === 'object') {
          if (item.FirstURL && item.Text) {
            sources.push({ title: item.Text.slice(0, 80), url: item.FirstURL, excerpt: item.Text })
          } else if (Array.isArray(item.Topics)) {
            for (const sub of item.Topics) {
              if (sub.FirstURL && sub.Text) {
                sources.push({ title: sub.Text.slice(0, 80), url: sub.FirstURL, excerpt: sub.Text })
              }
            }
          }
        }
      }
    }

    // Build a concise answer from abstract or related excerpts
    let answer = ''
    if (data.AbstractText) {
      answer = data.AbstractText
    } else if (sources.length > 0 && sources[0].excerpt) {
      answer = sources[0].excerpt!
    } else {
      answer = 'Je ai trouvé des sources pertinentes en ligne. Voici les liens les plus utiles.'
    }

    // Keep top 3 sources to avoid clutter
    const topSources = sources.slice(0, 3)

    // Heuristic confidence: higher if we have an abstract, else medium if we have sources
    const confidence = data.AbstractText ? 0.78 : (topSources.length > 0 ? 0.65 : 0.0)

    return {
      answer,
      sources: topSources,
      confidence
    }
  } catch (e) {
    // Network/CORS errors: fail gracefully
    return null
  }
}
