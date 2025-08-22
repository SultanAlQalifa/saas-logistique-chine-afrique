import OpenAIService, { ChatMessage } from './openai'
import { ChatContextService, ChatContext } from './chatbot-context'
import { ChatbotKnowledgeBase } from './chatbot-knowledge-base'
import { NextMoveAI } from './nextmove-ai'
import { WebSearchService } from './web-search-service'

export interface ChatbotResponse {
  message: string
  context: 'platform' | 'web' | 'escalation'
  suggestions?: string[]
  actions?: Array<{
    type: 'view_shipment' | 'download_invoice' | 'contact_agent' | 'create_quote'
    label: string
    data?: any
  }>
  escalation?: {
    reason: string
    urgency: 'low' | 'medium' | 'high'
    department: 'commercial' | 'logistique' | 'technique' | 'general'
  }
}

export interface ChatbotMetrics {
  totalQueries: number
  resolvedAutomatically: number
  escalatedToHuman: number
  averageResponseTime: number
  satisfactionScore: number
  platformDataUsage: number
  webSearchUsage: number
}

export class IntelligentChatbot {
  private static instance: IntelligentChatbot
  private knowledgeBase: ChatbotKnowledgeBase
  private contextService: ChatContextService
  private openAI: any
  private nextMoveAI: NextMoveAI
  private webSearchService: WebSearchService
  private metrics: ChatbotMetrics

  private constructor() {
    this.knowledgeBase = ChatbotKnowledgeBase.getInstance()
    this.contextService = ChatContextService
    this.openAI = OpenAIService
    this.nextMoveAI = new NextMoveAI()
    this.webSearchService = WebSearchService.getInstance()
    this.metrics = {
      totalQueries: 0,
      resolvedAutomatically: 0,
      escalatedToHuman: 0,
      averageResponseTime: 0,
      satisfactionScore: 0,
      platformDataUsage: 0,
      webSearchUsage: 0
    }
  }

  static getInstance(): IntelligentChatbot {
    if (!IntelligentChatbot.instance) {
      IntelligentChatbot.instance = new IntelligentChatbot()
    }
    return IntelligentChatbot.instance
  }

  async processMessage(
    userMessage: string,
    userId: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatbotResponse> {
    const startTime = Date.now()
    this.metrics.totalQueries++

    try {
      // 1. Récupérer le contexte utilisateur complet
      const context = await ChatContextService.getFullContext(userId)
      if (!context) {
        return this.createErrorResponse('Impossible de récupérer vos informations. Veuillez vous reconnecter.')
      }

      // 2. Analyser l'intention du message
      const intent = await this.analyzeIntent(userMessage, context)

      // 3. Vérifier si escalade nécessaire
      const escalation = this.checkEscalation(userMessage, intent, context)
      if (escalation) {
        this.metrics.escalatedToHuman++
        return {
          message: this.generateEscalationMessage(escalation),
          context: 'escalation',
          escalation,
          actions: [{
            type: 'contact_agent',
            label: 'Parler à un expert maintenant',
            data: { department: escalation.department, urgency: escalation.urgency }
          }]
        }
      }

      // 4. Rechercher dans la base de connaissances plateforme
      let response = await this.searchPlatformKnowledge(userMessage, context)
      
      if (response) {
        this.metrics.resolvedAutomatically++
        this.metrics.platformDataUsage++
        
        const responseTime = Date.now() - startTime
        this.updateMetrics(responseTime)
        
        return {
          message: response.message,
          context: 'platform',
          suggestions: response.suggestions,
          actions: response.actions
        }
      }

      // 5. Recherche web en fallback
      response = await this.searchWebKnowledge(userMessage, context)
      
      if (response) {
        this.metrics.resolvedAutomatically++
        this.metrics.webSearchUsage++
        
        const responseTime = Date.now() - startTime
        this.updateMetrics(responseTime)
        
        return {
          message: response.message,
          context: 'web',
          suggestions: response.suggestions
        }
      }

      // 6. Génération IA contextuelle en dernier recours
      const aiResponse = await this.generateContextualResponse(userMessage, context, conversationHistory)
      this.metrics.resolvedAutomatically++
      
      const responseTime = Date.now() - startTime
      this.updateMetrics(responseTime)
      
      return {
        message: aiResponse.message,
        context: 'platform',
        suggestions: aiResponse.suggestions,
        actions: aiResponse.actions
      }

    } catch (error) {
      console.error('Erreur lors du traitement du message:', error)
      return this.createErrorResponse('Une erreur technique est survenue. Un agent va vous contacter.')
    }
  }

  private async analyzeIntent(message: string, context: ChatContext): Promise<{
    category: string
    intent: string
    entities: string[]
    urgency: 'low' | 'medium' | 'high'
  }> {
    const lowerMessage = message.toLowerCase()
    
    // Détection d'urgence
    const urgencyKeywords = {
      high: ['urgent', 'problème grave', 'bloqué', 'perdu', 'volé', 'cassé'],
      medium: ['retard', 'problème', 'erreur', 'question importante'],
      low: ['information', 'renseignement', 'comment', 'quand']
    }
    
    let urgency: 'low' | 'medium' | 'high' = 'low'
    for (const [level, keywords] of Object.entries(urgencyKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        urgency = level as 'low' | 'medium' | 'high'
        break
      }
    }

    // Détection de catégorie
    const categories = {
      suivi: ['suivi', 'track', 'où est', 'statut', 'colis'],
      facturation: ['facture', 'paiement', 'prix', 'coût', 'tarif'],
      livraison: ['livraison', 'délai', 'retard', 'quand'],
      documentation: ['document', 'papier', 'certificat', 'douane'],
      technique: ['bug', 'erreur', 'marche pas', 'problème technique']
    }

    let category = 'general'
    for (const [cat, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        category = cat
        break
      }
    }

    // Extraction d'entités (numéros de suivi, références, etc.)
    const entities: string[] = []
    const trackingRegex = /[A-Z]{2,3}[0-9]{6,}/g
    const invoiceRegex = /F-[0-9]{4}-[0-9]+/g
    
    entities.push(...(message.match(trackingRegex) || []))
    entities.push(...(message.match(invoiceRegex) || []))

    return {
      category,
      intent: this.determineIntent(lowerMessage),
      entities,
      urgency
    }
  }

  private determineIntent(message: string): string {
    if (message.includes('où') || message.includes('statut')) return 'status_inquiry'
    if (message.includes('combien') || message.includes('prix')) return 'price_inquiry'
    if (message.includes('comment') || message.includes('procédure')) return 'how_to'
    if (message.includes('problème') || message.includes('erreur')) return 'issue_report'
    if (message.includes('nouveau') || message.includes('créer')) return 'create_request'
    return 'general_inquiry'
  }

  private checkEscalation(
    message: string, 
    intent: any, 
    context: ChatContext
  ): ChatbotResponse['escalation'] | null {
    const lowerMessage = message.toLowerCase()

    // Demande explicite d'agent humain
    if (lowerMessage.includes('agent') || lowerMessage.includes('humain') || 
        lowerMessage.includes('parler à quelqu\'un')) {
      return {
        reason: 'Demande explicite d\'agent humain',
        urgency: 'medium',
        department: 'general'
      }
    }

    // Problèmes financiers importants
    const amounts = message.match(/(\d+)\s*€/g)
    if (amounts && intent.category === 'facturation') {
      const maxAmount = Math.max(...amounts.map(a => parseInt(a.replace('€', ''))))
      if (maxAmount > 500) {
        return {
          reason: 'Réclamation financière importante',
          urgency: 'high',
          department: 'commercial'
        }
      }
    }

    // Retards critiques
    if (intent.urgency === 'high' && intent.category === 'livraison') {
      return {
        reason: 'Retard critique signalé',
        urgency: 'high',
        department: 'logistique'
      }
    }

    // Problèmes techniques répétés
    if (intent.category === 'technique' && context.supportHistory.recentTickets.length > 2) {
      return {
        reason: 'Problèmes techniques récurrents',
        urgency: 'medium',
        department: 'technique'
      }
    }

    return null
  }

  private async searchPlatformKnowledge(
    message: string, 
    context: ChatContext
  ): Promise<{ message: string; suggestions?: string[]; actions?: any[] } | null> {
    const lowerMessage = message.toLowerCase()

    // Recherche spécifique aux données utilisateur
    if (lowerMessage.includes('mes expéditions') || lowerMessage.includes('mes colis')) {
      return this.generateShipmentsResponse(context)
    }

    if (lowerMessage.includes('mes factures') || lowerMessage.includes('mes paiements')) {
      return this.generateInvoicesResponse(context)
    }

    // Recherche de numéro de suivi spécifique
    const trackingNumbers = message.match(/[A-Z]{2,3}[0-9]{6,}/g)
    if (trackingNumbers && trackingNumbers.length > 0) {
      return this.generateTrackingResponse(trackingNumbers[0], context)
    }

    // Calculs tarifaires personnalisés
    if (lowerMessage.includes('tarif') || lowerMessage.includes('prix')) {
      return this.generatePricingResponse(message, context)
    }

    // Recherche dans la base de connaissances
    const kbResults = await this.knowledgeBase.searchKnowledge(message)
    if (kbResults.length > 0) {
      const bestResult = kbResults[0]
      return {
        message: `🏢 ${bestResult.answer}`,
        suggestions: this.generateSuggestions(bestResult.category, context)
      }
    }

    return null
  }

  private async searchWebKnowledge(
    message: string, 
    context: ChatContext
  ): Promise<{ message: string; suggestions?: string[] } | null> {
    try {
      // Recherche web intelligente avec requêtes optimisées
      const searchQuery = this.optimizeSearchQuery(message)
      
      // Utiliser le nouveau service de recherche web
      const webResults = await this.webSearchService.search(searchQuery, {
        maxResults: 5,
        language: 'fr',
        region: 'fr'
      })
      
      if (webResults && webResults.results.length > 0) {
        // Analyser et synthétiser plusieurs résultats
        const synthesizedAnswer = await this.synthesizeWebResults(webResults.results, message)
        
        if (synthesizedAnswer) {
          // Sauvegarder dans la base de connaissances pour réutilisation
          await this.knowledgeBase.saveWebSearchResult(
            message,
            synthesizedAnswer.content,
            webResults.results[0].url,
            this.categorizeQuery(message) as 'general' | 'douane' | 'documentation' | 'transport' | 'tarification' | 'incidents' | 'reglementation'
          )
          
          // Incrémenter les métriques de recherche web
          this.metrics.webSearchUsage++
          
          return {
            message: synthesizedAnswer.content,
            suggestions: synthesizedAnswer.suggestions
          }
        }
      }
    } catch (error) {
      console.error('Erreur recherche web:', error)
    }
    
    return null
  }

  private optimizeSearchQuery(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()
    
    // Optimisations spécifiques au domaine logistique
    if (lowerMessage.includes('tarif') || lowerMessage.includes('prix')) {
      return `tarifs transport maritime aérien Chine Afrique ${userMessage}`
    }
    
    if (lowerMessage.includes('délai') || lowerMessage.includes('temps')) {
      return `délais livraison transport international Chine Afrique ${userMessage}`
    }
    
    if (lowerMessage.includes('document') || lowerMessage.includes('douane')) {
      return `documents douane import export Chine Afrique ${userMessage}`
    }
    
    if (lowerMessage.includes('réglementation') || lowerMessage.includes('interdit')) {
      return `réglementation import export produits interdits ${userMessage}`
    }
    
    // Ajouter contexte logistique général
    return `logistique transport international ${userMessage}`
  }

  private async synthesizeWebResults(results: any[], originalQuery: string): Promise<{
    content: string;
    suggestions: string[];
  } | null> {
    try {
      // Prendre les 3 meilleurs résultats pour synthèse
      const topResults = results.slice(0, 3)
      
      // Construire une réponse synthétisée
      let synthesizedContent = `🌐 **Informations actualisées** :\n\n`
      
      // Analyser le type de question pour structurer la réponse
      const queryType = this.categorizeQuery(originalQuery)
      
      switch (queryType) {
        case 'tarification':
          synthesizedContent += this.synthesizePricingInfo(topResults)
          break
        case 'reglementation':
          synthesizedContent += this.synthesizeRegulationInfo(topResults)
          break
        case 'transport':
          synthesizedContent += this.synthesizeTransportInfo(topResults)
          break
        default:
          synthesizedContent += this.synthesizeGeneralInfo(topResults)
      }
      
      // Ajouter sources
      synthesizedContent += `\n\n📚 **Sources** :\n`
      topResults.forEach((result, index) => {
        synthesizedContent += `${index + 1}. [${result.title}](${result.url})\n`
      })
      
      // Ajouter disclaimer
      synthesizedContent += `\n⚠️ *Informations mises à jour en temps réel. Vérifiez toujours auprès des autorités compétentes.*`
      
      const suggestions = this.generateWebSearchSuggestions(queryType)
      
      return {
        content: synthesizedContent,
        suggestions
      }
    } catch (error) {
      console.error('Erreur synthèse résultats web:', error)
      return null
    }
  }

  private categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('prix') || lowerQuery.includes('tarif') || lowerQuery.includes('coût')) {
      return 'tarification'
    }
    
    if (lowerQuery.includes('réglementation') || lowerQuery.includes('interdit') || lowerQuery.includes('autorisé')) {
      return 'reglementation'
    }
    
    if (lowerQuery.includes('délai') || lowerQuery.includes('transport') || lowerQuery.includes('livraison')) {
      return 'transport'
    }
    
    if (lowerQuery.includes('document') || lowerQuery.includes('douane') || lowerQuery.includes('certificat')) {
      return 'documentation'
    }
    
    return 'general'
  }

  private synthesizePricingInfo(results: any[]): string {
    let content = `💰 **Informations tarifaires actuelles** :\n\n`
    
    results.forEach((result, index) => {
      if (result.snippet) {
        content += `**${index + 1}.** ${result.snippet}\n\n`
      }
    })
    
    content += `💡 **Conseil NextMove** : Les tarifs varient selon la saison, le volume et la destination. Contactez-nous pour un devis personnalisé et actualisé.`
    
    return content
  }

  private synthesizeRegulationInfo(results: any[]): string {
    let content = `⚖️ **Réglementations actuelles** :\n\n`
    
    results.forEach((result, index) => {
      if (result.snippet) {
        content += `**${index + 1}.** ${result.snippet}\n\n`
      }
    })
    
    content += `🛡️ **NextMove vous accompagne** : Nos experts vérifient la conformité de vos expéditions selon les dernières réglementations.`
    
    return content
  }

  private synthesizeTransportInfo(results: any[]): string {
    let content = `🚚 **Informations transport actuelles** :\n\n`
    
    results.forEach((result, index) => {
      if (result.snippet) {
        content += `**${index + 1}.** ${result.snippet}\n\n`
      }
    })
    
    content += `⏱️ **Suivi NextMove** : Nous surveillons en temps réel les conditions de transport pour optimiser vos délais.`
    
    return content
  }

  private synthesizeGeneralInfo(results: any[]): string {
    let content = ``
    
    results.forEach((result, index) => {
      if (result.snippet) {
        content += `**${index + 1}.** ${result.snippet}\n\n`
      }
    })
    
    content += `🤝 **Support NextMove** : Notre équipe reste disponible pour approfondir ces informations selon vos besoins spécifiques.`
    
    return content
  }

  private generateWebSearchSuggestions(category: string): string[] {
    const suggestions: Record<string, string[]> = {
      'tarification': [
        'Calculer un devis personnalisé',
        'Comparer avec nos tarifs',
        'Voir les promotions actuelles',
        'Parler à un expert tarifaire'
      ],
      'reglementation': [
        'Vérifier mes produits',
        'Documents nécessaires',
        'Conseil réglementaire',
        'Mise à jour réglementaire'
      ],
      'transport': [
        'Suivre mes expéditions',
        'Optimiser mes délais',
        'Choisir le bon mode',
        'Alertes transport'
      ],
      'documentation': [
        'Liste documents complète',
        'Aide à la préparation',
        'Vérification documents',
        'Support douanier'
      ],
      'general': [
        'Recherche plus précise',
        'Parler à un expert',
        'Voir nos services',
        'FAQ complète'
      ]
    }
    
    return suggestions[category] || suggestions['general']
  }

  private async generateContextualResponse(
    message: string,
    context: ChatContext,
    history: ChatMessage[]
  ): Promise<{ message: string; suggestions?: string[]; actions?: any[] }> {
    // Toujours utiliser les réponses contextuelles même sans OpenAI
    const contextualResponse = this.generateSmartContextualResponse(message, context)
    
    if (contextualResponse) {
      return contextualResponse
    }

    // Fallback vers OpenAI seulement si disponible
    const systemPrompt = this.buildContextualPrompt(context)
    
    const messages: ChatMessage[] = [
      ...history.slice(-5), // Garder les 5 derniers messages pour le contexte
      { role: 'user', content: message }
    ]

    try {
      const response = await this.openAI.generateChatCompletion(messages, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1000
      })

      // Si OpenAI retourne le message d'erreur, utiliser notre réponse contextuelle
      if (response.includes('fonctionnalités IA sont actuellement indisponibles')) {
        return this.generateFallbackResponse(message, context)
      }

      return {
        message: response,
        suggestions: this.generateContextualSuggestions(message, context),
        actions: this.generateContextualActions(message, context)
      }
    } catch (error) {
      console.error('Erreur génération IA:', error)
      return this.generateFallbackResponse(message, context)
    }
  }

  private generateSmartContextualResponse(
    message: string,
    context: ChatContext
  ): { message: string; suggestions?: string[]; actions?: any[] } | null {
    const lowerMessage = message.toLowerCase()

    // Réponses spécifiques aux données utilisateur
    if (lowerMessage.includes('mes expéditions') || lowerMessage.includes('mes colis')) {
      return this.generateShipmentsResponse(context)
    }

    if (lowerMessage.includes('mes factures') || lowerMessage.includes('mes paiements')) {
      return this.generateInvoicesResponse(context)
    }

    // Recherche de numéro de suivi
    const trackingNumbers = message.match(/[A-Z]{2,3}[0-9]{6,}/g)
    if (trackingNumbers && trackingNumbers.length > 0) {
      return this.generateTrackingResponse(trackingNumbers[0], context)
    }

    // Calculs tarifaires
    if (lowerMessage.includes('tarif') || lowerMessage.includes('prix')) {
      return this.generatePricingResponse(message, context)
    }

    // Salutations personnalisées
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      return {
        message: ChatContextService.generateContextualGreeting(context),
        suggestions: this.generateContextualSuggestions(message, context),
        actions: this.generateContextualActions(message, context)
      }
    }

    // Demandes d'inscription
    if (lowerMessage.includes('inscription') || lowerMessage.includes('inscrire') || lowerMessage.includes('créer compte')) {
      return {
        message: `📝 **Inscription NextMove Cargo**\n\nPour créer votre compte professionnel :\n\n🔹 **Particuliers** : Inscription gratuite\n• Suivi de colis\n• Devis en ligne\n• Support client\n\n🔹 **Entreprises** : Compte business\n• Tarifs préférentiels\n• Gestionnaire dédié\n• API d'intégration\n\n**Prêt à commencer ?**`,
        suggestions: ['Inscription particulier', 'Compte entreprise', 'En savoir plus'],
        actions: [
          {
            type: 'create_quote',
            label: '📝 S\'inscrire maintenant',
            data: { type: 'registration' }
          },
          {
            type: 'contact_agent',
            label: '💬 Parler à un conseiller',
            data: { topic: 'inscription' }
          }
        ]
      }
    }

    return null
  }

  private generateFallbackResponse(
    message: string,
    context: ChatContext
  ): { message: string; suggestions?: string[]; actions?: any[] } {
    return {
      message: `Bonjour ${context.user.name} ! 👋\n\nJe peux vous aider avec :\n• Suivi de vos expéditions\n• Consultation de vos factures\n• Calculs de tarifs\n• Informations générales\n\nQue souhaitez-vous faire ?`,
      suggestions: this.generateContextualSuggestions(message, context),
      actions: this.generateContextualActions(message, context)
    }
  }

  private buildContextualPrompt(context: ChatContext): string {
    let prompt = `Tu es l'assistant IA NextMove Cargo, expert en logistique Chine-Afrique.

CONTEXTE UTILISATEUR:
- Nom: ${context.user.name}
- Entreprise: ${context.user.company || 'Non spécifiée'}
- Routes habituelles: ${context.user.preferences.habitualRoutes.join(', ')}
- Mode préféré: ${context.user.preferences.preferredTransportMode}

EXPÉDITIONS ACTIVES:`

    context.activeShipments.forEach(shipment => {
      prompt += `\n- ${shipment.trackingNumber}: ${shipment.origin}→${shipment.destination}, ${shipment.cbm}CBM, ${shipment.status}`
    })

    prompt += `\n\nFACTURES EN ATTENTE:`
    context.pendingInvoices.forEach(invoice => {
      const daysLeft = Math.ceil((new Date(invoice.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      prompt += `\n- ${invoice.reference}: ${invoice.amount}€, échéance dans ${daysLeft} jours`
    })

    prompt += `\n\nTARIFS ACTUELS:`
    context.platformData.routes.forEach(route => {
      prompt += `\n- ${route.origin}→${route.destination}: Maritime ${route.maritimePrice}€/CBM (${route.transitTime.maritime}j), Aérien ${route.aerienPrice}€/CBM (${route.transitTime.aerien}j)`
    })

    prompt += `\n\nINSTRUCTIONS:
- Utilise TOUJOURS les données contextuelles ci-dessus
- Personnalise tes réponses avec le nom de l'utilisateur
- Référence ses expéditions et factures spécifiques quand pertinent
- Calcule les tarifs avec les prix actuels de la plateforme
- Sois proactif: propose des actions concrètes
- Utilise des emojis pour rendre les réponses plus engageantes
- Si tu ne peux pas répondre précisément, propose de contacter un expert`

    return prompt
  }

  private generateShipmentsResponse(context: ChatContext): { message: string; suggestions: string[]; actions: any[] } {
    let message = `📦 **Vos expéditions en cours, ${context.user.name}** :\n\n`
    
    context.activeShipments.forEach(shipment => {
      const status = this.getStatusEmoji(shipment.status)
      message += `${status} **${shipment.trackingNumber}**\n`
      message += `   ${shipment.origin} → ${shipment.destination}\n`
      message += `   ${shipment.cbm} CBM • ${shipment.transportMode} • ${shipment.description}\n`
      message += `   Livraison prévue: ${shipment.estimatedDelivery.toLocaleDateString('fr-FR')}\n\n`
    })

    return {
      message,
      suggestions: ['Suivre une expédition', 'Créer nouvelle expédition', 'Voir l\'historique'],
      actions: context.activeShipments.map(shipment => ({
        type: 'view_shipment',
        label: `Détails ${shipment.trackingNumber}`,
        data: { shipmentId: shipment.id }
      }))
    }
  }

  private generateInvoicesResponse(context: ChatContext): { message: string; suggestions: string[]; actions: any[] } {
    let message = `💰 **Vos factures, ${context.user.name}** :\n\n`
    
    context.pendingInvoices.forEach(invoice => {
      const daysLeft = Math.ceil((new Date(invoice.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      const urgency = daysLeft <= 3 ? '🔴' : daysLeft <= 7 ? '🟡' : '🟢'
      
      message += `${urgency} **${invoice.reference}** - ${invoice.amount}€\n`
      message += `   ${invoice.description}\n`
      message += `   Échéance: ${invoice.dueDate.toLocaleDateString('fr-FR')} (${daysLeft} jours)\n\n`
    })

    return {
      message,
      suggestions: ['Payer une facture', 'Télécharger PDF', 'Demander un délai'],
      actions: context.pendingInvoices.map(invoice => ({
        type: 'download_invoice',
        label: `Télécharger ${invoice.reference}`,
        data: { invoiceId: invoice.id }
      }))
    }
  }

  private generateTrackingResponse(trackingNumber: string, context: ChatContext): { message: string; actions: any[] } | null {
    const shipment = context.activeShipments.find(s => s.trackingNumber === trackingNumber)
    
    if (!shipment) {
      return {
        message: `❌ Numéro de suivi ${trackingNumber} non trouvé dans vos expéditions actives.`,
        actions: [{
          type: 'contact_agent',
          label: 'Vérifier avec un agent',
          data: { query: `Suivi ${trackingNumber}` }
        }]
      }
    }

    const statusEmoji = this.getStatusEmoji(shipment.status)
    const daysLeft = Math.ceil((shipment.estimatedDelivery.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    
    let message = `${statusEmoji} **Suivi ${trackingNumber}**\n\n`
    message += `📍 **Trajet**: ${shipment.origin} → ${shipment.destination}\n`
    message += `📦 **Contenu**: ${shipment.description} (${shipment.cbm} CBM)\n`
    message += `🚚 **Transport**: ${shipment.transportMode}\n`
    message += `📅 **Livraison prévue**: ${shipment.estimatedDelivery.toLocaleDateString('fr-FR')} (${daysLeft} jours)\n`
    message += `💰 **Valeur**: ${shipment.value}€\n\n`
    message += `**Statut actuel**: ${this.getStatusText(shipment.status)}`

    return {
      message,
      actions: [{
        type: 'view_shipment',
        label: 'Voir détails complets',
        data: { shipmentId: shipment.id }
      }]
    }
  }

  private generatePricingResponse(message: string, context: ChatContext): { message: string; actions: any[] } | null {
    // Extraction des paramètres de la demande
    const weightMatch = message.match(/(\d+)\s*kg/i)
    const volumeMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:cbm|m3)/i)
    
    if (!weightMatch && !volumeMatch) {
      return {
        message: `💰 **Calculateur de tarifs personnalisé**\n\nPour calculer un tarif précis, j'ai besoin de :\n• Poids (en kg)\n• Volume (en CBM) ou dimensions\n• Destination\n\nExemple: "Tarif pour 100kg vers Paris"`,
        actions: [{
          type: 'create_quote',
          label: 'Créer un devis détaillé',
          data: {}
        }]
      }
    }

    // Utiliser la route habituelle par défaut
    const defaultRoute = context.platformData.routes.find(r => 
      context.user.preferences.habitualRoutes.some(hr => hr.includes(r.destination))
    ) || context.platformData.routes[0]

    if (!defaultRoute) return null

    const weight = weightMatch ? parseFloat(weightMatch[1]) : 0
    const volume = volumeMatch ? parseFloat(volumeMatch[1]) : weight * 0.002 // Estimation CBM

    const maritimePrice = volume * defaultRoute.maritimePrice
    const aerienPrice = Math.max(weight * 2.5, volume * defaultRoute.aerienPrice) // Prix aérien basé sur poids/volume

    let response = `💰 **Tarification ${defaultRoute.origin} → ${defaultRoute.destination}**\n\n`
    response += `📦 **Votre envoi**: ${weight}kg • ${volume.toFixed(2)} CBM\n\n`
    response += `🚢 **Maritime**: ${maritimePrice.toFixed(0)}€\n`
    response += `   • Délai: ${defaultRoute.transitTime.maritime} jours\n`
    response += `   • Économique et écologique\n\n`
    response += `✈️ **Aérien**: ${aerienPrice.toFixed(0)}€\n`
    response += `   • Délai: ${defaultRoute.transitTime.aerien} jours\n`
    response += `   • Rapide et sécurisé\n\n`
    
    const savings = aerienPrice - maritimePrice
    response += `💡 **Économie maritime**: ${savings.toFixed(0)}€ (${((savings/aerienPrice)*100).toFixed(0)}%)`

    return {
      message: response,
      actions: [
        {
          type: 'create_quote',
          label: 'Devis maritime détaillé',
          data: { mode: 'maritime', price: maritimePrice }
        },
        {
          type: 'create_quote',
          label: 'Devis aérien détaillé',
          data: { mode: 'aerien', price: aerienPrice }
        }
      ]
    }
  }

  private generateSuggestions(category: string, context: ChatContext): string[] {
    const suggestions: Record<string, string[]> = {
      'tarification': [
        'Calculer un devis',
        'Comparer les modes de transport',
        'Voir les tarifs par destination'
      ],
      'transport': [
        'Suivre mon colis',
        'Créer un envoi',
        'Voir les délais de livraison'
      ],
      'douane': [
        'Documents requis',
        'Procédures douanières',
        'Taxes et droits'
      ],
      'general': [
        'Parler à un agent',
        'Voir mes commandes',
        'Aide générale'
      ]
    }
    
    return suggestions[category] || suggestions['general']
  }

  private generateContextualSuggestions(message: string, context: ChatContext): string[] {
    const base = ['Mes expéditions', 'Créer un devis', 'Contacter un expert']
    
    // Ajouter des suggestions basées sur le contexte
    if (context.pendingInvoices.length > 0) {
      base.unshift('Voir mes factures')
    }
    
    if (context.activeShipments.some(s => s.status === 'transit')) {
      base.unshift('Suivre mes colis')
    }
    
    return base.slice(0, 4)
  }

  private generateContextualActions(message: string, context: ChatContext): any[] {
    const actions = []
    
    // Actions basées sur les expéditions actives
    if (context.activeShipments.length > 0) {
      actions.push({
        type: 'view_shipment',
        label: 'Voir mes expéditions',
        data: {}
      })
    }
    
    // Actions basées sur les factures
    if (context.pendingInvoices.length > 0) {
      actions.push({
        type: 'download_invoice',
        label: 'Télécharger factures',
        data: {}
      })
    }
    
    return actions
  }

  private getStatusEmoji(status: string): string {
    const emojis: Record<string, string> = {
      'preparation': '📋',
      'expedie': '🚚',
      'transit': '🌊',
      'douane': '🏛️',
      'livraison': '📦',
      'livre': '✅'
    }
    return emojis[status] || '📦'
  }

  private getStatusText(status: string): string {
    const texts: Record<string, string> = {
      'preparation': 'En préparation dans nos entrepôts',
      'expedie': 'Expédié et en route',
      'transit': 'En transit maritime/aérien',
      'douane': 'En cours de dédouanement',
      'livraison': 'En cours de livraison',
      'livre': 'Livré avec succès'
    }
    return texts[status] || status
  }

  private generateEscalationMessage(escalation: ChatbotResponse['escalation']): string {
    const messages = {
      'general': 'Je vous mets en relation avec un de nos experts qui pourra mieux vous aider.',
      'commercial': 'Votre demande nécessite l\'intervention de notre équipe commerciale.',
      'logistique': 'Je transfère votre demande à notre équipe logistique spécialisée.',
      'technique': 'Notre équipe technique va prendre en charge votre problème.'
    }
    
    return `🤝 ${messages[escalation?.department || 'general']}\n\nUn agent vous contactera sous peu selon l'urgence de votre demande.`
  }

  private createErrorResponse(message: string): ChatbotResponse {
    return {
      message: `❌ ${message}`,
      context: 'escalation',
      actions: [{
        type: 'contact_agent',
        label: 'Contacter le support',
        data: { urgency: 'high' }
      }]
    }
  }

  private updateMetrics(responseTime: number): void {
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime + responseTime) / 2
  }

  async getMetrics(): Promise<ChatbotMetrics> {
    return { ...this.metrics }
  }

  async resetMetrics(): Promise<void> {
    this.metrics = {
      totalQueries: 0,
      resolvedAutomatically: 0,
      escalatedToHuman: 0,
      averageResponseTime: 0,
      satisfactionScore: 0,
      platformDataUsage: 0,
      webSearchUsage: 0
    }
  }
}
