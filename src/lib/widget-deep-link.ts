export interface DeepLinkParams {
  chat?: 'open'
  chan?: 'web' | 'wa'
  ref?: string
  topic?: 'tracking' | 'invoice' | 'quote' | 'welcome'
}

export interface ContextualMessage {
  message: string
  suggestions?: string[]
  actions?: Array<{
    type: string
    label: string
    data?: any
  }>
}

export class WidgetDeepLink {
  private static instance: WidgetDeepLink
  private listeners: Array<(params: DeepLinkParams) => void> = []

  private constructor() {
    this.initializeUrlListener()
  }

  static getInstance(): WidgetDeepLink {
    if (!WidgetDeepLink.instance) {
      WidgetDeepLink.instance = new WidgetDeepLink()
    }
    return WidgetDeepLink.instance
  }

  private initializeUrlListener() {
    if (typeof window === 'undefined') return

    // Écouter les changements d'URL et les paramètres de deep-link
    const checkDeepLink = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const params: DeepLinkParams = {}

      if (urlParams.get('chat') === 'open') {
        params.chat = 'open'
        
        if (urlParams.get('chan')) {
          params.chan = urlParams.get('chan') as 'web' | 'wa'
        }
        
        if (urlParams.get('ref')) {
          params.ref = urlParams.get('ref') || undefined
        }
        
        if (urlParams.get('topic')) {
          params.topic = urlParams.get('topic') as 'tracking' | 'invoice' | 'quote' | 'welcome'
        }

        // Notifier tous les listeners
        this.listeners.forEach(listener => listener(params))

        // Nettoyer l'URL après traitement
        this.cleanUrl()
      }
    }

    // Vérifier au chargement de la page
    checkDeepLink()

    // Écouter les changements d'URL (navigation)
    window.addEventListener('popstate', checkDeepLink)
    
    // Écouter les changements de hash
    window.addEventListener('hashchange', checkDeepLink)
  }

  private cleanUrl() {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    url.searchParams.delete('chat')
    url.searchParams.delete('chan')
    url.searchParams.delete('ref')
    url.searchParams.delete('topic')

    // Remplacer l'URL sans recharger la page
    window.history.replaceState({}, document.title, url.toString())
  }

  addListener(callback: (params: DeepLinkParams) => void) {
    this.listeners.push(callback)
  }

  removeListener(callback: (params: DeepLinkParams) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }

  generateContextualMessage(params: DeepLinkParams): ContextualMessage {
    const { topic, ref } = params

    switch (topic) {
      case 'tracking':
        return {
          message: `🚢 Vous avez demandé le suivi de ${ref || 'votre expédition'}. Souhaitez-vous voir le statut maintenant ?`,
          suggestions: [
            `Suivre ${ref}`,
            'Voir tous mes colis',
            'Parler à un conseiller'
          ],
          actions: [
            {
              type: 'track_shipment',
              label: '📦 Voir statut',
              data: { shipmentId: ref }
            },
            {
              type: 'contact_agent',
              label: '💬 Parler à un conseiller',
              data: { reason: 'tracking_help', shipmentId: ref }
            }
          ]
        }

      case 'invoice':
        return {
          message: `💰 Vous avez demandé de l'aide sur la facture ${ref || 'en question'}. Besoin du PDF ?`,
          suggestions: [
            `Télécharger ${ref}`,
            'Voir toutes mes factures',
            'Question sur paiement'
          ],
          actions: [
            {
              type: 'download_invoice',
              label: '📄 Télécharger PDF',
              data: { invoiceId: ref }
            },
            {
              type: 'contact_agent',
              label: '💬 Parler à un conseiller',
              data: { reason: 'invoice_help', invoiceId: ref }
            }
          ]
        }

      case 'quote':
        return {
          message: `📋 Concernant votre devis ${ref || 'en cours'}. Souhaitez-vous le consulter ou le modifier ?`,
          suggestions: [
            `Voir devis ${ref}`,
            'Modifier le devis',
            'Confirmer la commande'
          ],
          actions: [
            {
              type: 'view_quote',
              label: '📋 Voir devis',
              data: { quoteId: ref }
            },
            {
              type: 'contact_agent',
              label: '💬 Parler à un conseiller',
              data: { reason: 'quote_help', quoteId: ref }
            }
          ]
        }

      case 'welcome':
        return {
          message: `🎉 Bienvenue sur NextMove ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?`,
          suggestions: [
            'Créer un devis',
            'Suivre un colis',
            'Voir mes factures',
            'Découvrir nos services'
          ],
          actions: [
            {
              type: 'create_quote',
              label: '📋 Créer un devis',
              data: {}
            },
            {
              type: 'documentation',
              label: '📚 Nos services',
              data: { section: 'services' }
            }
          ]
        }

      default:
        return {
          message: `👋 Bonjour ! Vous arrivez depuis WhatsApp. Comment puis-je vous aider ?`,
          suggestions: [
            'Suivre un colis',
            'Mes factures',
            'Créer un devis',
            'Parler à un conseiller'
          ],
          actions: [
            {
              type: 'contact_agent',
              label: '💬 Parler à un conseiller',
              data: { reason: 'general_help' }
            }
          ]
        }
    }
  }

  // Méthodes utilitaires pour générer des deep-links
  static generateChatLink(options: {
    channel?: 'web' | 'wa'
    ref?: string
    topic?: 'tracking' | 'invoice' | 'quote' | 'welcome'
    baseUrl?: string
  }): string {
    const { channel, ref, topic, baseUrl = 'https://agencenextmove.com' } = options
    
    const params = new URLSearchParams()
    params.set('chat', 'open')
    
    if (channel) params.set('chan', channel)
    if (ref) params.set('ref', ref)
    if (topic) params.set('topic', topic)
    
    return `${baseUrl}/?${params.toString()}`
  }

  static generateTrackingLink(shipmentId: string, baseUrl?: string): string {
    return this.generateChatLink({
      channel: 'wa',
      ref: shipmentId,
      topic: 'tracking',
      baseUrl
    })
  }

  static generateInvoiceLink(invoiceId: string, baseUrl?: string): string {
    return this.generateChatLink({
      channel: 'wa',
      ref: invoiceId,
      topic: 'invoice',
      baseUrl
    })
  }

  static generateQuoteLink(quoteId: string, baseUrl?: string): string {
    return this.generateChatLink({
      channel: 'wa',
      ref: quoteId,
      topic: 'quote',
      baseUrl
    })
  }

  static generateWelcomeLink(baseUrl?: string): string {
    return this.generateChatLink({
      channel: 'wa',
      topic: 'welcome',
      baseUrl
    })
  }

  // Gestion du localStorage pour la persistance de session
  saveConversationContext(conversationId: string, context: any) {
    if (typeof window === 'undefined') return

    try {
      const contextData = {
        conversationId,
        context,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('nextmove_chat_context', JSON.stringify(contextData))
    } catch (error) {
      console.warn('Erreur sauvegarde contexte conversation:', error)
    }
  }

  loadConversationContext(): { conversationId: string; context: any; timestamp: string } | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem('nextmove_chat_context')
      if (!stored) return null

      const contextData = JSON.parse(stored)
      
      // Vérifier que le contexte n'est pas trop ancien (24h)
      const timestamp = new Date(contextData.timestamp)
      const now = new Date()
      const diffHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
      
      if (diffHours > 24) {
        localStorage.removeItem('nextmove_chat_context')
        return null
      }
      
      return contextData
    } catch (error) {
      console.warn('Erreur chargement contexte conversation:', error)
      return null
    }
  }

  clearConversationContext() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('nextmove_chat_context')
  }
}
