import { ChatbotKnowledgeBase } from './chatbot-knowledge-base'

export interface RAGDocument {
  id: string
  title: string
  content: string
  url: string
  category: 'website' | 'guide' | 'tarifs' | 'cgu' | 'procedures'
  chunks: RAGChunk[]
  lastIndexed: Date
  language: 'fr' | 'en'
}

export interface RAGChunk {
  id: string
  content: string
  embedding?: number[]
  metadata: {
    title: string
    url: string
    category: string
    position: number
  }
}

export interface RAGSearchResult {
  chunk: RAGChunk
  score: number
  relevance: 'high' | 'medium' | 'low'
}

export interface RAGResponse {
  answer: string
  sources: Array<{
    title: string
    url: string
    excerpt: string
  }>
  confidence: number
}

export class RAGKnowledgeBase {
  private static instance: RAGKnowledgeBase
  private documents: Map<string, RAGDocument> = new Map()
  private chunks: Map<string, RAGChunk> = new Map()
  private baseKB: ChatbotKnowledgeBase

  private constructor() {
    this.baseKB = ChatbotKnowledgeBase.getInstance()
    this.initializeWebsiteContent()
  }

  static getInstance(): RAGKnowledgeBase {
    if (!RAGKnowledgeBase.instance) {
      RAGKnowledgeBase.instance = new RAGKnowledgeBase()
    }
    return RAGKnowledgeBase.instance
  }

  private async initializeWebsiteContent() {
    // Base de connaissances complète NextMove Cargo
    const websiteContent = [
      {
        title: 'Présentation NextMove Cargo',
        url: 'https://agencenextmove.com/about',
        content: `NextMove Cargo est votre plateforme de logistique spécialisée dans les échanges Chine-Afrique.

        Notre mission:
        • Simplifier vos expéditions entre la Chine et l'Afrique
        • Vous faire économiser temps et argent
        • Vous accompagner à chaque étape

        Nos services:
        • Transport maritime & aérien (groupage et conteneur complet)
        • Dédouanement et formalités administratives
        • Suivi en temps réel de vos colis
        • Assurance cargo pour protéger vos marchandises
        • Stockage temporaire dans nos entrepôts

        Nos routes principales:
        • Chine → Sénégal, Côte d'Ivoire, Mali, Burkina Faso...
        • Tarifs compétitifs et délais maîtrisés

        Pourquoi nous choisir:
        • 15+ ans d'expérience Chine-Afrique
        • Équipe bilingue (français/chinois)
        • Technologie moderne
        • Support 24/7`,
        category: 'website' as const
      },
      {
        title: 'Services de Transport Maritime',
        url: 'https://agencenextmove.com/services/maritime',
        content: `NextMove Cargo propose des services de transport maritime entre la Chine et l'Afrique. 
        
        Nos routes principales incluent:
        - Guangzhou → Dakar (20-25 jours)
        - Shanghai → Abidjan (22-27 jours)
        - Shenzhen → Douala (25-30 jours)
        - Ningbo → Tema (24-28 jours)
        - Qingdao → Conakry (26-30 jours)
        
        Types de services:
        • Groupage (LCL): À partir de 1 CBM
        • Conteneur complet (FCL): 20' et 40'
        • Maritime Express: Service accéléré (-10 jours)
        
        Tarifs maritimes: 
        • Standard: 180-280€/CBM selon destination
        • Express: 220-350€/CBM selon destination
        
        Services inclus: dédouanement, livraison finale, assurance cargo optionnelle.
        Délais de transit moyens: 20-30 jours selon la destination.`,
        category: 'website' as const
      },
      {
        title: 'Transport Aérien Express',
        url: 'https://agencenextmove.com/services/aerien',
        content: `Service de fret aérien pour vos envois urgents:
        
        Délais de livraison:
        • Chine → Dakar: 3-5 jours
        • Chine → Abidjan: 4-6 jours  
        • Chine → Douala: 5-7 jours
        • Chine → Bamako: 4-6 jours
        • Chine → Ouagadougou: 5-7 jours
        
        Tarifs aériens:
        • Au poids: 4-8€/kg selon destination
        • Au volume: 800-1200€/CBM
        • Minimum facturable: 45kg ou 0.3 CBM
        
        Parfait pour: produits périssables, échantillons, documents importants, commandes urgentes.
        Suivi en temps réel disponible via notre plateforme.
        
        Avantages:
        • Rapidité maximale
        • Sécurité renforcée
        • Priorité dédouanement
        • Livraison express finale`,
        category: 'website' as const
      },
      {
        title: 'Incoterms Supportés',
        url: 'https://agencenextmove.com/incoterms',
        content: `NextMove Cargo gère tous les Incoterms principaux:
        
        EXW (Ex Works): Client récupère en usine Chine
        FCA (Free Carrier): Livraison au transporteur désigné
        FOB (Free On Board): Livraison port chinois
        CIF (Cost Insurance Freight): Transport + assurance inclus
        DDP (Delivered Duty Paid): Livraison porte-à-porte, droits payés
        
        Recommandation: CIF pour débutants, DDP pour simplicité maximale.`,
        category: 'website' as const
      },
      {
        title: 'Documentation Douanière',
        url: 'https://agencenextmove.com/douanes',
        content: `Documents requis pour export Chine vers Afrique:
        
        Documents obligatoires:
        - Facture commerciale (en anglais/français)
        - Liste de colisage détaillée
        - Certificat d'origine (Chambre de Commerce)
        - Déclaration d'exportation
        
        Documents spécifiques par pays:
        - Sénégal: Certificat de conformité COTECNA
        - Côte d'Ivoire: Déclaration préalable d'importation
        - Mali: Certificat phytosanitaire (produits agricoles)`,
        category: 'website' as const
      },
      {
        title: 'Assurance Cargo',
        url: 'https://agencenextmove.com/assurance',
        content: `Protection de vos marchandises en transit:
        
        Couverture standard: 110% de la valeur facture
        Risques couverts: avarie commune, vol, dommages
        Prime: 0.3-0.8% de la valeur déclarée
        
        Exclusions: guerre, grève, vice propre de la marchandise
        Délai de déclaration sinistre: 30 jours max
        
        Recommandé pour: électronique, textile, produits fragiles`,
        category: 'website' as const
      },
      {
        title: 'Zones Desservies et Destinations',
        url: 'https://agencenextmove.com/destinations',
        content: `Destinations principales en Afrique de l'Ouest et Centrale:
        
        Pays côtiers (ports directs):
        • Sénégal: Dakar (port principal)
        • Côte d'Ivoire: Abidjan, San Pedro
        • Ghana: Tema, Takoradi
        • Cameroun: Douala, Kribi
        • Guinea: Conakry
        • Togo: Lomé
        • Bénin: Cotonou
        
        Pays enclavés (via transit):
        • Mali: Bamako (via Dakar)
        • Burkina Faso: Ouagadougou (via Abidjan/Lomé)
        • Niger: Niamey (via Lomé/Cotonou)
        • Tchad: N'Djamena (via Douala)
        
        Services de livraison finale:
        • Disponible dans toutes les capitales
        • Réseau de partenaires locaux
        • Délais supplémentaires pays enclavés: +3-5 jours
        • Suivi jusqu'à destination finale`,
        category: 'website' as const
      },
      {
        title: 'Procédures de Commande et Réservation',
        url: 'https://agencenextmove.com/procedures/commande',
        content: `Comment passer commande avec NextMove Cargo:

        Étape 1: Demande de devis
        • Remplir le formulaire en ligne
        • Indiquer: origine, destination, poids, dimensions
        • Préciser le type de marchandise
        • Choisir le mode de transport souhaité

        Étape 2: Validation du devis
        • Réception du devis sous 2h ouvrées
        • Validation des conditions commerciales
        • Signature du contrat de transport

        Étape 3: Préparation de l'expédition
        • Envoi des documents requis
        • Coordination avec le fournisseur en Chine
        • Planification de l'enlèvement

        Étape 4: Suivi de l'expédition
        • Notifications automatiques par email/SMS
        • Suivi en temps réel sur la plateforme
        • Assistance dédiée jusqu'à livraison

        Documents requis:
        • Facture commerciale
        • Liste de colisage
        • Bon de commande fournisseur`,
        category: 'procedures' as const
      },
      {
        title: 'Tarification et Modes de Paiement',
        url: 'https://agencenextmove.com/tarifs/paiement',
        content: `Structure tarifaire NextMove Cargo:

        Calcul des tarifs:
        • Maritime: au CBM (mètre cube)
        • Aérien: au kg ou CBM (le plus avantageux)
        • Frais fixes: dédouanement, livraison finale

        Modes de paiement acceptés:
        • Virement bancaire (SEPA, SWIFT)
        • Carte bancaire (Visa, Mastercard)
        • Mobile Money (Orange Money, MTN Money)
        • Espèces (dans nos agences)

        Conditions de paiement:
        • Particuliers: 100% à la commande
        • Entreprises: 50% à la commande, 50% avant livraison
        • Clients réguliers: crédit 30 jours possible

        Frais additionnels possibles:
        • Assurance cargo: 0.3-0.8% de la valeur
        • Stockage prolongé: 5€/CBM/semaine
        • Livraison express: +50€
        • Manutention spéciale: sur devis`,
        category: 'tarifs' as const
      },
      {
        title: 'Suivi et Tracking des Expéditions',
        url: 'https://agencenextmove.com/services/suivi',
        content: `Système de suivi NextMove Cargo:

        Numérotation des expéditions:
        • Format: 3 lettres + 6 chiffres (ex: DKR240815)
        • Première partie: code destination
        • Deuxième partie: date + numéro séquentiel

        Statuts de suivi disponibles:
        • EN_PREPARATION: Collecte des documents
        • EXPEDIE: Départ de Chine confirmé
        • EN_TRANSIT: Transport en cours
        • ARRIVEE_PORT: Arrivé au port de destination
        • DEDOUANEMENT: Procédures douanières
        • EN_LIVRAISON: Transport vers destination finale
        • LIVRE: Livraison effectuée

        Notifications automatiques:
        • Email à chaque changement de statut
        • SMS pour les étapes importantes
        • WhatsApp sur demande

        Accès au suivi:
        • Plateforme web 24/7
        • Application mobile
        • API pour intégration entreprise`,
        category: 'website' as const
      }
    ]

    for (const content of websiteContent) {
      await this.indexDocument(content.title, content.content, content.url, content.category)
    }
  }

  async indexDocument(title: string, content: string, url: string, category: RAGDocument['category']): Promise<string> {
    const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Chunking du contenu (800-1200 caractères, overlap 150)
    const chunks = this.chunkContent(content, title, url, category)
    
    const document: RAGDocument = {
      id: docId,
      title,
      content,
      url,
      category,
      chunks,
      lastIndexed: new Date(),
      language: 'fr'
    }

    this.documents.set(docId, document)
    
    // Indexer les chunks
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk)
    }

    console.log(`Document indexé: ${title} (${chunks.length} chunks)`)
    return docId
  }

  private chunkContent(content: string, title: string, url: string, category: string): RAGChunk[] {
    const chunks: RAGChunk[] = []
    const chunkSize = 1000
    const overlap = 150
    
    // Diviser par paragraphes d'abord
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    
    let currentChunk = ''
    let position = 0
    
    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
        // Créer un chunk
        chunks.push({
          id: `chunk_${Date.now()}_${position}`,
          content: currentChunk.trim(),
          metadata: {
            title,
            url,
            category,
            position
          }
        })
        
        // Commencer nouveau chunk avec overlap
        const words = currentChunk.split(' ')
        const overlapWords = words.slice(-Math.floor(overlap / 6)) // ~150 chars = ~25 mots
        currentChunk = overlapWords.join(' ') + ' ' + paragraph
        position++
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph
      }
    }
    
    // Dernier chunk
    if (currentChunk.trim().length > 0) {
      chunks.push({
        id: `chunk_${Date.now()}_${position}`,
        content: currentChunk.trim(),
        metadata: {
          title,
          url,
          category,
          position
        }
      })
    }
    
    return chunks
  }

  async search(query: string, topK: number = 6, scoreThreshold: number = 0.62): Promise<RAGSearchResult[]> {
    const results: RAGSearchResult[] = []
    const queryLower = query.toLowerCase()
    
    // Recherche hybride: sémantique + mots-clés
    for (const chunk of Array.from(this.chunks.values())) {
      let score = 0
      
      // Score basé sur les mots-clés
      const chunkLower = chunk.content.toLowerCase()
      const queryWords = queryLower.split(' ').filter(w => w.length > 2)
      
      for (const word of queryWords) {
        if (chunkLower.includes(word)) {
          score += 0.3
        }
      }
      
      // Score basé sur la correspondance de phrases
      const querySentences = query.split(/[.!?]/).filter(s => s.trim().length > 5)
      for (const sentence of querySentences) {
        if (chunkLower.includes(sentence.toLowerCase().trim())) {
          score += 0.5
        }
      }
      
      // Bonus pour correspondance dans le titre
      if (chunk.metadata.title.toLowerCase().includes(queryLower)) {
        score += 0.4
      }
      
      // Score de pertinence thématique
      const thematicScore = this.calculateThematicScore(query, chunk)
      score += thematicScore
      
      if (score >= scoreThreshold) {
        const relevance: RAGSearchResult['relevance'] = 
          score >= 0.9 ? 'high' : score >= 0.7 ? 'medium' : 'low'
        
        results.push({
          chunk,
          score,
          relevance
        })
      }
    }
    
    // Trier par score décroissant et limiter
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  private calculateThematicScore(query: string, chunk: RAGChunk): number {
    const queryLower = query.toLowerCase()
    let score = 0
    
    // Thèmes logistiques
    const themes = {
      transport: ['transport', 'livraison', 'expédition', 'envoi'],
      maritime: ['maritime', 'bateau', 'mer', 'port', 'cbm'],
      aerien: ['aérien', 'avion', 'air', 'express', 'rapide'],
      tarifs: ['prix', 'tarif', 'coût', 'euro', '€'],
      douane: ['douane', 'document', 'certificat', 'déclaration'],
      incoterms: ['incoterm', 'exw', 'fob', 'cif', 'ddp', 'fca'],
      assurance: ['assurance', 'couverture', 'protection', 'risque'],
      suivi: ['suivi', 'track', 'statut', 'où est']
    }
    
    for (const [theme, keywords] of Object.entries(themes)) {
      const queryHasTheme = keywords.some(kw => queryLower.includes(kw))
      const chunkHasTheme = keywords.some(kw => chunk.content.toLowerCase().includes(kw))
      
      if (queryHasTheme && chunkHasTheme) {
        score += 0.2
      }
    }
    
    return score
  }

  async generateRAGResponse(query: string): Promise<RAGResponse | null> {
    const searchResults = await this.search(query, 3, 0.62)
    
    if (searchResults.length === 0) {
      return null
    }
    
    // Construire la réponse avec les meilleures sources
    const topResults = searchResults.slice(0, 3)
    const sources = topResults.map(result => ({
      title: result.chunk.metadata.title,
      url: result.chunk.metadata.url,
      excerpt: result.chunk.content.substring(0, 200) + '...'
    }))
    
    // Synthèse basée sur les chunks trouvés
    const combinedContent = topResults.map(r => r.chunk.content).join('\n\n')
    const answer = this.synthesizeAnswer(query, combinedContent)
    
    const avgScore = topResults.reduce((sum, r) => sum + r.score, 0) / topResults.length
    const confidence = Math.min(avgScore, 1.0)
    
    return {
      answer,
      sources,
      confidence
    }
  }

  private synthesizeAnswer(query: string, content: string): string {
    // Synthèse simple basée sur le contenu trouvé
    const lines = content.split('\n').filter(line => line.trim().length > 0)
    
    // Prendre les phrases les plus pertinentes
    const relevantLines = lines.filter(line => {
      const queryWords = query.toLowerCase().split(' ')
      return queryWords.some(word => word.length > 2 && line.toLowerCase().includes(word))
    })
    
    if (relevantLines.length > 0) {
      return relevantLines.slice(0, 3).join('\n\n')
    }
    
    return lines.slice(0, 2).join('\n\n')
  }

  async indexWebsite(baseUrl: string): Promise<void> {
    // Simulation d'indexation du site web
    console.log(`Indexation du site: ${baseUrl}`)
    
    // Dans une vraie implémentation, on utiliserait un crawler
    // Pour l'instant, on utilise le contenu simulé déjà chargé
  }

  getStats(): {
    totalDocuments: number
    totalChunks: number
    categoriesCount: Record<string, number>
  } {
    const stats = {
      totalDocuments: this.documents.size,
      totalChunks: this.chunks.size,
      categoriesCount: {} as Record<string, number>
    }
    
    for (const doc of Array.from(this.documents.values())) {
      stats.categoriesCount[doc.category] = (stats.categoriesCount[doc.category] || 0) + 1
    }
    
    return stats
  }
}
