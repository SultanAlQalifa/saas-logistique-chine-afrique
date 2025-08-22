export interface KnowledgeBaseEntry {
  id: string
  question: string
  answer: string
  category: 'douane' | 'transport' | 'tarification' | 'documentation' | 'incidents' | 'reglementation' | 'general'
  sourceUrl?: string
  sourceType: 'platform' | 'web' | 'manual'
  createdAt: Date
  lastUpdated: Date
  usageCount: number
  relevanceScore: number
  expiresAt?: Date
  tags: string[]
}

export interface WebSearchResult {
  query: string
  results: Array<{
    title: string
    url: string
    snippet: string
    relevance: number
  }>
  timestamp: Date
}

export class ChatbotKnowledgeBase {
  private static instance: ChatbotKnowledgeBase
  private knowledgeBase: Map<string, KnowledgeBaseEntry> = new Map()

  private constructor() {
    this.initializeDefaultKnowledge()
  }

  static getInstance(): ChatbotKnowledgeBase {
    if (!ChatbotKnowledgeBase.instance) {
      ChatbotKnowledgeBase.instance = new ChatbotKnowledgeBase()
    }
    return ChatbotKnowledgeBase.instance
  }

  private initializeDefaultKnowledge() {
    // Connaissances de base de la plateforme
    const defaultEntries: Omit<KnowledgeBaseEntry, 'id' | 'createdAt' | 'lastUpdated' | 'usageCount'>[] = [
      {
        question: 'calcul tarif maritime',
        answer: 'Tarif maritime = Volume (CBM) × Prix par CBM selon la route. Exemple: Dakar-Paris = 250€/CBM',
        category: 'tarification',
        sourceType: 'platform',
        relevanceScore: 1.0,
        tags: ['tarif', 'maritime', 'cbm', 'calcul']
      },
      {
        question: 'calcul tarif aerien',
        answer: 'Tarif aérien = max(Poids réel × Prix/kg, Volume × Prix/CBM). Plus rapide mais plus cher.',
        category: 'tarification',
        sourceType: 'platform',
        relevanceScore: 1.0,
        tags: ['tarif', 'aerien', 'poids', 'volume']
      },
      {
        question: 'documents export senegal',
        answer: 'Documents requis: Facture commerciale, Liste de colisage, Certificat d\'origine, Déclaration en douane, Preuve de paiement',
        category: 'documentation',
        sourceType: 'platform',
        relevanceScore: 1.0,
        tags: ['export', 'senegal', 'documents', 'douane']
      },
      {
        question: 'delais livraison maritime',
        answer: 'Délais maritimes moyens: Dakar-Paris 20-25j, Abidjan-Marseille 22-27j, Douala-Le Havre 25-30j',
        category: 'transport',
        sourceType: 'platform',
        relevanceScore: 1.0,
        tags: ['delais', 'maritime', 'livraison']
      },
      {
        question: 'delais livraison aerien',
        answer: 'Délais aériens moyens: Dakar-Paris 3-5j, Abidjan-Marseille 4-6j, Douala-Lyon 5-7j',
        category: 'transport',
        sourceType: 'platform',
        relevanceScore: 1.0,
        tags: ['delais', 'aerien', 'livraison']
      }
    ]

    defaultEntries.forEach((entry, index) => {
      const fullEntry: KnowledgeBaseEntry = {
        ...entry,
        id: `default_${index}`,
        createdAt: new Date(),
        lastUpdated: new Date(),
        usageCount: 0
      }
      this.knowledgeBase.set(fullEntry.id, fullEntry)
    })
  }

  async searchKnowledge(query: string, category?: string): Promise<KnowledgeBaseEntry[]> {
    const queryLower = query.toLowerCase()
    const results: Array<{ entry: KnowledgeBaseEntry; score: number }> = []

    for (const entry of Array.from(this.knowledgeBase.values())) {
      // Filtrer par catégorie si spécifiée
      if (category && entry.category !== category) continue

      // Calculer le score de pertinence
      let score = 0

      // Correspondance exacte dans la question
      if (entry.question.toLowerCase().includes(queryLower)) {
        score += 2.0
      }

      // Correspondance dans les tags
      const matchingTags = entry.tags.filter(tag => 
        queryLower.includes(tag.toLowerCase()) || tag.toLowerCase().includes(queryLower)
      )
      score += matchingTags.length * 0.5

      // Correspondance dans la réponse
      if (entry.answer.toLowerCase().includes(queryLower)) {
        score += 0.3
      }

      // Bonus pour les entrées fréquemment utilisées
      score += Math.min(entry.usageCount * 0.1, 1.0)

      // Bonus pour les entrées récentes (web search)
      if (entry.sourceType === 'web') {
        const daysSinceUpdate = (Date.now() - entry.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceUpdate < 7) score += 0.5
      }

      if (score > 0.5) {
        results.push({ entry, score })
      }
    }

    // Trier par score décroissant
    results.sort((a, b) => b.score - a.score)

    // Incrémenter le compteur d'usage pour les résultats retournés
    results.slice(0, 3).forEach(({ entry }) => {
      entry.usageCount++
      entry.lastUpdated = new Date()
    })

    return results.slice(0, 5).map(({ entry }) => entry)
  }

  async saveWebSearchResult(
    query: string,
    answer: string,
    sourceUrl: string,
    category: KnowledgeBaseEntry['category']
  ): Promise<string> {
    const id = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const entry: KnowledgeBaseEntry = {
      id,
      question: query,
      answer: `${answer}\n\nℹ️ Information mise à jour depuis sources externes`,
      category,
      sourceUrl,
      sourceType: 'web',
      createdAt: new Date(),
      lastUpdated: new Date(),
      usageCount: 0,
      relevanceScore: 0.8,
      expiresAt: this.calculateExpirationDate(category),
      tags: this.extractTags(query, answer)
    }

    this.knowledgeBase.set(id, entry)
    
    // Sauvegarder en base de données (simulation)
    await this.persistToDatabase(entry)
    
    return id
  }

  private calculateExpirationDate(category: KnowledgeBaseEntry['category']): Date {
    const now = new Date()
    const expirationDays = {
      'incidents': 7,        // Les incidents sont temporaires
      'reglementation': 90,  // Les réglementations changent occasionnellement
      'douane': 60,         // Les procédures douanières évoluent
      'transport': 30,      // Les conditions de transport peuvent changer
      'tarification': 14,   // Les tarifs peuvent fluctuer
      'documentation': 180, // La documentation est plus stable
      'general': 30
    }

    now.setDate(now.getDate() + (expirationDays[category] || 30))
    return now
  }

  private extractTags(query: string, answer: string): string[] {
    const text = `${query} ${answer}`.toLowerCase()
    const commonTags = [
      'tarif', 'prix', 'cout', 'maritime', 'aerien', 'delai', 'livraison',
      'douane', 'document', 'export', 'import', 'senegal', 'cote_ivoire',
      'mali', 'burkina', 'france', 'cbm', 'poids', 'volume', 'suivi',
      'retard', 'probleme', 'facture', 'paiement'
    ]

    return commonTags.filter(tag => text.includes(tag))
  }

  async searchWeb(query: string): Promise<WebSearchResult | null> {
    try {
      // Simulation d'une recherche web - à remplacer par une vraie API
      const mockResults = await this.mockWebSearch(query)
      
      return {
        query,
        results: mockResults,
        timestamp: new Date()
      }
    } catch (error) {
      console.error('Erreur lors de la recherche web:', error)
      return null
    }
  }

  private async mockWebSearch(query: string): Promise<WebSearchResult['results']> {
    // Simulation de résultats de recherche web
    const mockResults = [
      {
        title: 'Nouvelles réglementations douanières 2024',
        url: 'https://douanes.gouv.fr/nouvelles-reglementations-2024',
        snippet: 'Les nouvelles procédures douanières entrent en vigueur...',
        relevance: 0.9
      },
      {
        title: 'Grève portuaire Abidjan - Mise à jour',
        url: 'https://port-abidjan.ci/actualites/greve-dockers',
        snippet: 'Mouvement de grève des dockers causant des retards...',
        relevance: 0.8
      }
    ]

    return mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet.toLowerCase().includes(query.toLowerCase())
    )
  }

  async cleanExpiredEntries(): Promise<number> {
    const now = new Date()
    let cleanedCount = 0

    for (const [id, entry] of Array.from(this.knowledgeBase.entries())) {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.knowledgeBase.delete(id)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      console.log(`Nettoyage automatique: ${cleanedCount} entrées expirées supprimées`)
    }

    return cleanedCount
  }

  async getStats(): Promise<{
    totalEntries: number
    byCategory: Record<string, number>
    bySource: Record<string, number>
    mostUsed: KnowledgeBaseEntry[]
  }> {
    const stats = {
      totalEntries: this.knowledgeBase.size,
      byCategory: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      mostUsed: [] as KnowledgeBaseEntry[]
    }

    for (const entry of Array.from(this.knowledgeBase.values())) {
      stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1
      stats.bySource[entry.sourceType] = (stats.bySource[entry.sourceType] || 0) + 1
    }

    // Top 5 des entrées les plus utilisées
    stats.mostUsed = Array.from(this.knowledgeBase.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5)

    return stats
  }

  private async persistToDatabase(entry: KnowledgeBaseEntry): Promise<void> {
    // Simulation de sauvegarde en base de données
    // À implémenter avec votre ORM/base de données
    console.log(`Sauvegarde en BDD: ${entry.id} - ${entry.question}`)
  }

  async loadFromDatabase(): Promise<void> {
    // Simulation de chargement depuis la base de données
    // À implémenter avec votre ORM/base de données
    console.log('Chargement de la base de connaissances depuis la BDD')
  }
}
