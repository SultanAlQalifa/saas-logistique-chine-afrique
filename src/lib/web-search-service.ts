/**
 * Service de recherche web pour l'agent IA NextMove
 * Intègre plusieurs moteurs de recherche et APIs
 */

export interface WebSearchResult {
  title: string
  url: string
  snippet: string
  relevance: number
  domain: string
  publishedDate?: string
}

export interface SearchResponse {
  query: string
  results: WebSearchResult[]
  totalResults: number
  searchTime: number
  sources: string[]
}

export interface SearchConfig {
  maxResults?: number
  language?: string
  region?: string
  safeSearch?: boolean
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all'
}

export class WebSearchService {
  private static instance: WebSearchService
  private searchProviders: SearchProvider[] = []

  private constructor() {
    this.initializeProviders()
  }

  static getInstance(): WebSearchService {
    if (!WebSearchService.instance) {
      WebSearchService.instance = new WebSearchService()
    }
    return WebSearchService.instance
  }

  private initializeProviders() {
    // Ajouter les providers disponibles
    this.searchProviders = [
      new DuckDuckGoProvider(),
      new BingSearchProvider(),
      new GoogleSearchProvider(),
      new LogisticsSpecializedProvider()
    ]
  }

  async search(query: string, config: SearchConfig = {}): Promise<SearchResponse> {
    const startTime = Date.now()
    const enhancedQuery = this.enhanceQuery(query)
    
    try {
      // Essayer les providers dans l'ordre de priorité
      for (const provider of this.searchProviders) {
        if (await provider.isAvailable()) {
          try {
            const results = await provider.search(enhancedQuery, config)
            
            if (results && results.length > 0) {
              const processedResults = this.processResults(results, query)
              
              return {
                query: enhancedQuery,
                results: processedResults,
                totalResults: processedResults.length,
                searchTime: Date.now() - startTime,
                sources: [provider.getName()]
              }
            }
          } catch (error) {
            console.warn(`Provider ${provider.getName()} failed:`, error)
            continue
          }
        }
      }

      // Fallback vers recherche locale si aucun provider externe
      return this.fallbackLocalSearch(query, config)
      
    } catch (error) {
      console.error('Erreur recherche web:', error)
      return this.fallbackLocalSearch(query, config)
    }
  }

  private enhanceQuery(query: string): string {
    // Ajouter contexte logistique si pertinent
    const logisticsKeywords = ['transport', 'logistique', 'expédition', 'douane', 'import', 'export']
    const hasLogisticsContext = logisticsKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    )

    if (!hasLogisticsContext) {
      // Ajouter contexte selon le type de question
      if (query.includes('tarif') || query.includes('prix')) {
        return `${query} transport international logistique`
      }
      if (query.includes('délai') || query.includes('temps')) {
        return `${query} livraison transport international`
      }
      if (query.includes('document') || query.includes('réglementation')) {
        return `${query} douane import export international`
      }
    }

    return query
  }

  private processResults(results: WebSearchResult[], originalQuery: string): WebSearchResult[] {
    // Filtrer et scorer les résultats
    return results
      .filter(result => this.isRelevantResult(result, originalQuery))
      .map(result => ({
        ...result,
        relevance: this.calculateRelevance(result, originalQuery)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10) // Limiter à 10 résultats maximum
  }

  private isRelevantResult(result: WebSearchResult, query: string): boolean {
    const lowerQuery = query.toLowerCase()
    const lowerTitle = result.title.toLowerCase()
    const lowerSnippet = result.snippet.toLowerCase()

    // Filtrer les résultats non pertinents
    const irrelevantDomains = ['wikipedia.org', 'reddit.com', 'quora.com']
    if (irrelevantDomains.some(domain => result.url.includes(domain))) {
      return false
    }

    // Vérifier la pertinence du contenu
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 2)
    const matchCount = queryWords.filter(word => 
      lowerTitle.includes(word) || lowerSnippet.includes(word)
    ).length

    return matchCount >= Math.min(2, queryWords.length * 0.5)
  }

  private calculateRelevance(result: WebSearchResult, query: string): number {
    let score = 0
    const lowerQuery = query.toLowerCase()
    const lowerTitle = result.title.toLowerCase()
    const lowerSnippet = result.snippet.toLowerCase()

    // Score basé sur les mots-clés dans le titre (poids plus élevé)
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 2)
    queryWords.forEach(word => {
      if (lowerTitle.includes(word)) score += 3
      if (lowerSnippet.includes(word)) score += 1
    })

    // Bonus pour les domaines fiables
    const trustedDomains = [
      'gouv.fr', 'europa.eu', 'wto.org', 'iata.org', 
      'imo.org', 'douane.gouv.fr', 'service-public.fr'
    ]
    if (trustedDomains.some(domain => result.url.includes(domain))) {
      score += 5
    }

    // Bonus pour les domaines logistiques spécialisés
    const logisticsDomains = [
      'transportinfo.fr', 'logistiqueconseil.org', 'faq-logistique.com',
      'douane.gouv.fr', 'trade.gov', 'export.gov'
    ]
    if (logisticsDomains.some(domain => result.url.includes(domain))) {
      score += 3
    }

    return Math.min(score, 10) // Normaliser sur 10
  }

  private async fallbackLocalSearch(query: string, config: SearchConfig): Promise<SearchResponse> {
    // Base de connaissances locale en cas d'échec des APIs externes
    const localKnowledge = this.getLocalKnowledge(query)
    
    return {
      query,
      results: localKnowledge,
      totalResults: localKnowledge.length,
      searchTime: 50,
      sources: ['local_knowledge']
    }
  }

  private getLocalKnowledge(query: string): WebSearchResult[] {
    const lowerQuery = query.toLowerCase()
    
    // Base de connaissances statique pour les cas critiques
    const knowledgeBase: Record<string, WebSearchResult[]> = {
      'tarifs_transport': [{
        title: 'Tarifs de transport international Chine-Afrique',
        url: 'https://nextmove.local/tarifs',
        snippet: 'Transport maritime: 180-250€/m³, Transport aérien: 4-8€/kg, délais variables selon destination.',
        relevance: 8,
        domain: 'nextmove.local'
      }],
      'delais_livraison': [{
        title: 'Délais de livraison transport international',
        url: 'https://nextmove.local/delais',
        snippet: 'Maritime: 20-35 jours, Aérien: 3-7 jours, Terrestre: 15-25 jours selon la destination.',
        relevance: 8,
        domain: 'nextmove.local'
      }],
      'documents_douane': [{
        title: 'Documents requis pour import/export',
        url: 'https://nextmove.local/documents',
        snippet: 'Facture commerciale, liste de colisage, connaissement, certificat d\'origine selon les produits.',
        relevance: 8,
        domain: 'nextmove.local'
      }]
    }

    // Recherche dans la base locale
    for (const [key, results] of Object.entries(knowledgeBase)) {
      if (lowerQuery.includes(key.split('_')[0]) || lowerQuery.includes(key.split('_')[1])) {
        return results
      }
    }

    return [{
      title: 'Information générale NextMove',
      url: 'https://nextmove.local/info',
      snippet: 'NextMove propose des solutions de transport international Chine-Afrique avec suivi complet.',
      relevance: 5,
      domain: 'nextmove.local'
    }]
  }
}

// Interface pour les providers de recherche
abstract class SearchProvider {
  abstract getName(): string
  abstract isAvailable(): Promise<boolean>
  abstract search(query: string, config: SearchConfig): Promise<WebSearchResult[]>
}

// Provider DuckDuckGo (gratuit, sans API key)
class DuckDuckGoProvider extends SearchProvider {
  getName(): string {
    return 'DuckDuckGo'
  }

  async isAvailable(): Promise<boolean> {
    return true // DuckDuckGo est toujours disponible
  }

  async search(query: string, config: SearchConfig): Promise<WebSearchResult[]> {
    try {
      // Simulation d'appel DuckDuckGo API
      // En production, utiliser l'API officielle ou scraping légal
      const mockResults: WebSearchResult[] = [
        {
          title: `Résultats pour: ${query}`,
          url: 'https://example.com/result1',
          snippet: `Informations pertinentes sur ${query} trouvées via DuckDuckGo.`,
          relevance: 7,
          domain: 'example.com'
        }
      ]
      
      return mockResults
    } catch (error) {
      console.error('Erreur DuckDuckGo:', error)
      return []
    }
  }
}

// Provider Bing Search (avec API key)
class BingSearchProvider extends SearchProvider {
  private apiKey = process.env.BING_SEARCH_API_KEY

  getName(): string {
    return 'Bing'
  }

  async isAvailable(): Promise<boolean> {
    return !!this.apiKey
  }

  async search(query: string, config: SearchConfig): Promise<WebSearchResult[]> {
    if (!this.apiKey) return []

    try {
      // Appel API Bing Search
      const response = await fetch(
        `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${config.maxResults || 10}`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.apiKey
          }
        }
      )

      const data = await response.json()
      
      return data.webPages?.value?.map((item: any) => ({
        title: item.name,
        url: item.url,
        snippet: item.snippet,
        relevance: 8,
        domain: new URL(item.url).hostname
      })) || []
      
    } catch (error) {
      console.error('Erreur Bing Search:', error)
      return []
    }
  }
}

// Provider Google Search (avec API key)
class GoogleSearchProvider extends SearchProvider {
  private apiKey = process.env.GOOGLE_SEARCH_API_KEY
  private searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

  getName(): string {
    return 'Google'
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.apiKey && this.searchEngineId)
  }

  async search(query: string, config: SearchConfig): Promise<WebSearchResult[]> {
    if (!this.apiKey || !this.searchEngineId) return []

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&num=${config.maxResults || 10}`
      )

      const data = await response.json()
      
      return data.items?.map((item: any) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        relevance: 9,
        domain: new URL(item.link).hostname
      })) || []
      
    } catch (error) {
      console.error('Erreur Google Search:', error)
      return []
    }
  }
}

// Provider spécialisé logistique
class LogisticsSpecializedProvider extends SearchProvider {
  getName(): string {
    return 'LogisticsSpecialized'
  }

  async isAvailable(): Promise<boolean> {
    return true
  }

  async search(query: string, config: SearchConfig): Promise<WebSearchResult[]> {
    // Sources spécialisées en logistique
    const specializedSources = [
      'https://www.douane.gouv.fr',
      'https://www.service-public.fr',
      'https://europa.eu/youreurope',
      'https://www.trade.gov',
      'https://www.iata.org'
    ]

    // Simulation de recherche dans sources spécialisées
    return [{
      title: `Guide logistique: ${query}`,
      url: specializedSources[0],
      snippet: `Information officielle sur ${query} dans le domaine du transport international.`,
      relevance: 9,
      domain: 'douane.gouv.fr'
    }]
  }
}
