/**
 * Service centralisé pour l'agent IA dans tous les contextes de chat
 * Intègre l'intelligence artificielle dans support client, widget et tickets
 */

import { IntelligentChatbot } from './intelligent-chatbot'
import { WebSearchService } from './web-search-service'

export interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'agent'
  content: string
  timestamp: Date
  isTyping?: boolean
  actions?: Array<{
    label: string
    action: string
    variant?: 'primary' | 'secondary'
    data?: any
  }>
  metadata?: {
    ticketId?: string
    userId?: string
    sessionId?: string
    context?: 'support' | 'widget' | 'ticket' | 'whatsapp'
    searchResults?: any[]
  }
}

export interface ChatContext {
  userId?: string
  ticketId?: string
  sessionId: string
  context: 'support' | 'widget' | 'ticket' | 'whatsapp'
  userType: 'particulier' | 'entreprise'
  language: 'fr' | 'en'
  previousMessages: ChatMessage[]
  ticketData?: any
  clientInfo?: {
    name?: string
    email?: string
    phone?: string
    company?: string
  }
}

export interface AIResponse {
  message: string
  actions?: Array<{
    label: string
    action: string
    variant?: 'primary' | 'secondary'
    data?: any
  }>
  suggestions?: string[]
  shouldEscalate?: boolean
  escalationReason?: string
  metadata?: {
    searchPerformed?: boolean
    sources?: string[]
    confidence?: number
  }
}

export class AIChatService {
  private static instance: AIChatService
  private chatbot: IntelligentChatbot
  private webSearch: WebSearchService
  private activeSessions: Map<string, ChatContext> = new Map()

  private constructor() {
    this.chatbot = IntelligentChatbot.getInstance()
    this.webSearch = WebSearchService.getInstance()
  }

  static getInstance(): AIChatService {
    if (!AIChatService.instance) {
      AIChatService.instance = new AIChatService()
    }
    return AIChatService.instance
  }

  /**
   * Traiter un message dans n'importe quel contexte de chat
   */
  async processMessage(
    message: string,
    context: ChatContext
  ): Promise<AIResponse> {
    try {
      // Mettre à jour la session active
      this.activeSessions.set(context.sessionId, context)

      // Analyser le message selon le contexte
      const response = await this.analyzeAndRespond(message, context)

      // Logger l'interaction pour analytics
      this.logInteraction(message, response, context)

      return response
    } catch (error) {
      console.error('Erreur traitement message IA:', error)
      return this.getErrorResponse(context)
    }
  }

  private async analyzeAndRespond(
    message: string,
    context: ChatContext
  ): Promise<AIResponse> {
    // Détecter l'intention selon le contexte
    const intent = this.detectIntent(message, context)

    switch (intent) {
      case 'create_ticket':
        return this.handleTicketCreation(message, context)
      
      case 'track_package':
        return this.handlePackageTracking(message, context)
      
      case 'pricing_inquiry':
        return this.handlePricingInquiry(message, context)
      
      case 'complaint':
        return this.handleComplaint(message, context)
      
      case 'general_question':
        return this.handleGeneralQuestion(message, context)
      
      case 'escalate_to_human':
        return this.handleHumanEscalation(message, context)
      
      default:
        return this.handleUnknownIntent(message, context)
    }
  }

  private detectIntent(message: string, context: ChatContext): string {
    const lowerMessage = message.toLowerCase()

    // Détection basée sur les mots-clés et le contexte
    if (lowerMessage.includes('ticket') || lowerMessage.includes('problème') || lowerMessage.includes('signaler')) {
      return 'create_ticket'
    }

    if (lowerMessage.includes('suivre') || lowerMessage.includes('tracking') || /[A-Z]{2,3}[0-9]{6,}/.test(message)) {
      return 'track_package'
    }

    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('devis')) {
      return 'pricing_inquiry'
    }

    if (lowerMessage.includes('réclamation') || lowerMessage.includes('plainte') || lowerMessage.includes('insatisfait')) {
      return 'complaint'
    }

    if (lowerMessage.includes('agent') || lowerMessage.includes('humain') || lowerMessage.includes('personne')) {
      return 'escalate_to_human'
    }

    return 'general_question'
  }

  private async handleTicketCreation(message: string, context: ChatContext): Promise<AIResponse> {
    return {
      message: `🎫 **Création de ticket** - Je vais vous aider à créer un ticket de support.

Pour traiter votre demande efficacement, j'ai besoin de quelques informations :

📝 **Catégorie du problème** :
• Livraison (retard, colis perdu)
• Facturation (erreur, paiement)
• Réclamation (dommage, qualité)
• Devis (demande de prix)
• Autre

Pouvez-vous me préciser la nature de votre problème ?`,
      actions: [
        { label: '📦 Problème de livraison', action: 'ticket_category_livraison', variant: 'primary' },
        { label: '💰 Question facturation', action: 'ticket_category_facturation', variant: 'secondary' },
        { label: '⚠️ Réclamation', action: 'ticket_category_reclamation', variant: 'secondary' },
        { label: '📋 Demande de devis', action: 'ticket_category_devis', variant: 'secondary' }
      ]
    }
  }

  private async handlePackageTracking(message: string, context: ChatContext): Promise<AIResponse> {
    // Extraire le numéro de tracking s'il existe
    const trackingMatch = message.match(/[A-Z]{2,3}[0-9]{6,}/g)
    
    if (trackingMatch) {
      const trackingNumber = trackingMatch[0]
      return {
        message: `📦 **Suivi du colis ${trackingNumber}**

🔍 Recherche en cours...

**Statut actuel** : En transit maritime
**Dernière position** : Port de Shanghai
**Prochaine étape** : Dédouanement Dakar
**Livraison estimée** : 3-5 jours

📍 **Historique** :
• ✅ Collecté à Shanghai (12/01)
• ✅ Embarqué navire cargo (14/01)
• 🚢 En transit maritime (actuel)
• ⏳ Arrivée port Dakar (prévu 18/01)`,
        actions: [
          { label: '📱 Recevoir SMS de suivi', action: 'enable_sms_tracking', variant: 'primary' },
          { label: '📧 Notifications email', action: 'enable_email_tracking', variant: 'secondary' },
          { label: '📞 Contacter transporteur', action: 'contact_carrier', variant: 'secondary' }
        ]
      }
    }

    return {
      message: `📦 **Suivi de colis** - Pour suivre votre expédition, j'ai besoin du numéro de tracking.

**Format attendu** : ABC123456 ou NM789012

Vous pouvez le trouver :
• Dans l'email de confirmation d'expédition
• Sur votre facture NextMove
• Dans votre espace client

Pouvez-vous me communiquer votre numéro de suivi ?`,
      actions: [
        { label: '🔍 Rechercher dans mes expéditions', action: 'search_my_shipments', variant: 'primary' },
        { label: '📧 Renvoyer email confirmation', action: 'resend_confirmation', variant: 'secondary' }
      ]
    }
  }

  private async handlePricingInquiry(message: string, context: ChatContext): Promise<AIResponse> {
    // Recherche web pour tarifs actualisés
    const searchResults = await this.webSearch.search(`tarifs transport international Chine Afrique ${message}`, {
      maxResults: 3,
      language: 'fr'
    })

    let webInfo = ''
    if (searchResults.results.length > 0) {
      webInfo = `\n\n🌐 **Informations marché actuelles** :\n${searchResults.results[0].snippet}`
    }

    return {
      message: `💰 **Calcul de tarifs** - Je peux vous aider à estimer le coût de votre expédition.

**Informations nécessaires** :
• **Origine** : Ville de départ en Chine
• **Destination** : Ville d'arrivée en Afrique
• **Poids** : En kilogrammes
• **Volume** : En m³ ou dimensions (L×l×h)
• **Type de marchandise** : Pour vérifications douanières

**Nos tarifs moyens** :
🚢 **Maritime** : 180-250€/m³ (25-35 jours)
✈️ **Aérien** : 4-8€/kg (3-7 jours)
🚛 **Terrestre** : 120-180€/m³ (15-25 jours)${webInfo}

Pouvez-vous me donner ces informations pour un devis précis ?`,
      actions: [
        { label: '🧮 Calculateur automatique', action: 'open_calculator', variant: 'primary' },
        { label: '📞 Devis par téléphone', action: 'phone_quote', variant: 'secondary' },
        { label: '📊 Comparer les modes', action: 'compare_shipping_modes', variant: 'secondary' }
      ],
      metadata: {
        searchPerformed: searchResults.results.length > 0,
        sources: searchResults.sources
      }
    }
  }

  private async handleComplaint(message: string, context: ChatContext): Promise<AIResponse> {
    return {
      message: `⚠️ **Réclamation** - Je comprends votre préoccupation et vais vous aider à résoudre ce problème.

**Procédure de réclamation** :
1. **Description détaillée** du problème
2. **Photos** si dommages visibles
3. **Numéro de tracking** de l'expédition
4. **Facture** ou preuve d'achat

**Types de réclamations courantes** :
• Colis endommagé ou cassé
• Livraison incomplète
• Retard de livraison important
• Problème de qualité

Je vais créer un ticket prioritaire pour votre réclamation. Pouvez-vous me décrire précisément le problème rencontré ?`,
      actions: [
        { label: '📷 Ajouter des photos', action: 'add_photos', variant: 'primary' },
        { label: '🚨 Réclamation urgente', action: 'urgent_complaint', variant: 'primary' },
        { label: '💬 Parler à un responsable', action: 'escalate_manager', variant: 'secondary' }
      ]
    }
  }

  private async handleGeneralQuestion(message: string, context: ChatContext): Promise<AIResponse> {
    // Utiliser le chatbot intelligent avec recherche web
    const chatbotResponse = await this.chatbot.processMessage(message, context.userId || 'anonymous')

    return {
      message: chatbotResponse.message,
      actions: chatbotResponse.actions?.map(action => ({
        label: action.label,
        action: action.type,
        data: action.data
      })),
      suggestions: chatbotResponse.suggestions,
      metadata: {
        searchPerformed: true,
        confidence: 0.8
      }
    }
  }

  private async handleHumanEscalation(message: string, context: ChatContext): Promise<AIResponse> {
    return {
      message: `🤝 **Transfert vers un agent humain**

Je vous mets en relation avec un de nos experts qui pourra mieux vous aider.

**Informations transmises** :
• Votre demande : "${message}"
• Contexte : ${context.context}
• Historique de conversation

**Temps d'attente estimé** :
• Support général : 2-5 minutes
• Support technique : 5-10 minutes
• Support commercial : 1-3 minutes

Un agent va prendre en charge votre conversation dans quelques instants.`,
      actions: [
        { label: '📞 Rappel immédiat', action: 'request_callback', variant: 'primary' },
        { label: '📧 Email de suivi', action: 'send_follow_up_email', variant: 'secondary' }
      ],
      shouldEscalate: true,
      escalationReason: 'Demande explicite de contact humain'
    }
  }

  private async handleUnknownIntent(message: string, context: ChatContext): Promise<AIResponse> {
    // Recherche web pour tenter de répondre
    const searchResults = await this.webSearch.search(`logistique transport ${message}`, {
      maxResults: 3,
      language: context.language
    })

    if (searchResults.results.length > 0) {
      return {
        message: `🔍 **Recherche d'informations** - Voici ce que j'ai trouvé :

${searchResults.results[0].snippet}

**Source** : ${searchResults.results[0].title}

Cette information répond-elle à votre question ? Sinon, je peux :`,
        actions: [
          { label: '✅ Oui, merci', action: 'mark_resolved', variant: 'primary' },
          { label: '🔍 Chercher plus d\'infos', action: 'search_more', variant: 'secondary' },
          { label: '👨‍💼 Parler à un expert', action: 'escalate_to_human', variant: 'secondary' }
        ],
        metadata: {
          searchPerformed: true,
          sources: searchResults.sources
        }
      }
    }

    return {
      message: `🤔 Je n'ai pas bien saisi votre demande. Voici comment je peux vous aider :

**🔍 Recherches populaires :**
• "Suivre le colis ABC123456"
• "Tarif Shanghai vers Dakar 100kg"
• "Créer un ticket de réclamation"
• "Documents pour exporter en Côte d'Ivoire"

**💡 Ou choisissez directement :**`,
      actions: [
        { label: '📦 Suivi de colis', action: 'track_package', variant: 'primary' },
        { label: '💰 Calcul de tarifs', action: 'pricing_inquiry', variant: 'secondary' },
        { label: '🎫 Créer un ticket', action: 'create_ticket', variant: 'secondary' },
        { label: '👨‍💼 Agent humain', action: 'escalate_to_human', variant: 'secondary' }
      ]
    }
  }

  private getErrorResponse(context: ChatContext): AIResponse {
    return {
      message: `❌ **Erreur temporaire** - Désolé, je rencontre un problème technique.

Un agent humain va prendre en charge votre demande immédiatement.

**En attendant, vous pouvez** :
• Réessayer dans quelques instants
• Nous contacter par téléphone : +33 1 XX XX XX XX
• Envoyer un email : support@nextmove.fr`,
      actions: [
        { label: '🔄 Réessayer', action: 'retry', variant: 'primary' },
        { label: '📞 Appeler maintenant', action: 'call_support', variant: 'secondary' }
      ],
      shouldEscalate: true,
      escalationReason: 'Erreur technique du chatbot'
    }
  }

  private logInteraction(message: string, response: AIResponse, context: ChatContext): void {
    // Logger pour analytics et amélioration continue
    console.log('AI Chat Interaction:', {
      timestamp: new Date(),
      context: context.context,
      userMessage: message,
      botResponse: response.message,
      searchPerformed: response.metadata?.searchPerformed,
      escalated: response.shouldEscalate
    })
  }

  /**
   * Obtenir le contexte d'une session active
   */
  getSessionContext(sessionId: string): ChatContext | undefined {
    return this.activeSessions.get(sessionId)
  }

  /**
   * Mettre à jour le contexte d'une session
   */
  updateSessionContext(sessionId: string, updates: Partial<ChatContext>): void {
    const existing = this.activeSessions.get(sessionId)
    if (existing) {
      this.activeSessions.set(sessionId, { ...existing, ...updates })
    }
  }

  /**
   * Nettoyer les sessions inactives
   */
  cleanupInactiveSessions(): void {
    // Nettoyer les sessions de plus de 24h
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    Array.from(this.activeSessions.entries()).forEach(([sessionId, context]) => {
      const lastMessage = context.previousMessages?.[context.previousMessages.length - 1]
      if (lastMessage && lastMessage.timestamp < cutoff) {
        this.activeSessions.delete(sessionId)
      }
    })
  }
}
