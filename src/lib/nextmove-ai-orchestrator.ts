/**
 * NextMove AI - Orchestrateur de conversation principal
 * Gère le flux de conversation, les slots et les business rules
 */

import { NextMoveNLU, NLUResult } from './nextmove-ai-nlu'
import { NextMoveAITools, UserContext } from './nextmove-ai-tools'
import { NEXTMOVE_AI_CONFIG, AISession } from './nextmove-ai-config'

export interface ConversationResponse {
  message: string
  ctas?: Array<{ text: string; action?: string }>
  requires_input?: boolean
  escalated?: boolean
  session_updated?: boolean
}

export interface ConversationContext {
  user_id: string
  channel_id: string
  session?: AISession
  user_context?: UserContext
}

export class NextMoveAIOrchestrator {
  private nlu: NextMoveNLU
  private tools: NextMoveAITools
  private config = NEXTMOVE_AI_CONFIG
  private sessions: Map<string, AISession> = new Map()

  constructor() {
    this.nlu = new NextMoveNLU()
    this.tools = new NextMoveAITools()
  }

  /**
   * Point d'entrée principal pour traiter un message utilisateur
   */
  async processMessage(
    input: string, 
    context: ConversationContext
  ): Promise<ConversationResponse> {
    try {
      // 1. Récupération/création de session
      const session = await this.getOrCreateSession(context)
      
      // 2. Récupération du contexte utilisateur
      const userContext = await this.tools.getUserContext(context.user_id)
      
      // 3. Détection de locale et normalisation
      const locale = this.detectLocale(input, userContext, session)
      
      // 4. Analyse NLU
      const nluResult = await this.nlu.analyze(input, { session, userContext })
      
      // 5. Orchestration selon l'intention
      const response = await this.orchestrateByIntent(nluResult, session, userContext, locale)
      
      // 6. Mise à jour de session
      await this.updateSession(session, nluResult, response)
      
      return response
      
    } catch (error) {
      console.error('Erreur orchestration:', error)
      return this.handleError(error, context)
    }
  }

  /**
   * Récupère ou crée une session utilisateur
   */
  private async getOrCreateSession(context: ConversationContext): Promise<AISession> {
    const sessionKey = `${context.user_id}_${context.channel_id}`
    
    let session = this.sessions.get(sessionKey)
    if (!session) {
      session = {
        user_id: context.user_id,
        channel_id: context.channel_id,
        user_prefs: { locale: this.config.default_locale },
        created_at: new Date(),
        updated_at: new Date()
      }
      this.sessions.set(sessionKey, session)
    }
    
    return session
  }

  /**
   * Détecte la locale à utiliser
   */
  private detectLocale(input: string, userContext: UserContext, session: AISession): string {
    // Priorité: message > profil utilisateur > session > défaut
    if (this.containsFrenchWords(input)) return 'fr'
    if (this.containsEnglishWords(input)) return 'en'
    
    return userContext.locale || session.user_prefs?.locale || this.config.default_locale
  }

  private containsFrenchWords(input: string): boolean {
    const frenchWords = ['bonjour', 'suivre', 'suivi', 'colis', 'facture', 'devis', 'merci', 'où', 'combien']
    return frenchWords.some(word => input.toLowerCase().includes(word))
  }

  private containsEnglishWords(input: string): boolean {
    const englishWords = ['hello', 'track', 'tracking', 'package', 'invoice', 'quote', 'thank', 'where', 'how much']
    return englishWords.some(word => input.toLowerCase().includes(word))
  }

  /**
   * Orchestration principale selon l'intention détectée
   */
  private async orchestrateByIntent(
    nluResult: NLUResult,
    session: AISession,
    userContext: UserContext,
    locale: string
  ): Promise<ConversationResponse> {
    const { intent, slots } = nluResult

    switch (intent) {
      case 'smalltalk':
        return this.handleSmalltalk(userContext, locale)

      case 'track_shipment':
        return this.handleTrackingRequest(slots, session, locale)

      case 'pod':
        return this.handlePODRequest(slots, session, locale)

      case 'invoices':
        return this.handleInvoicesRequest(slots, session, locale)

      case 'create_quote':
        return this.handleQuoteRequest(slots, session, locale)

      case 'notifications':
        return this.handleNotificationsRequest(slots, session, locale)

      case 'support_human':
        return this.handleHumanEscalation(session, locale)

      default:
        return this.handleFallback(nluResult, session, locale)
    }
  }

  /**
   * Gestion des salutations et small talk
   */
  private async handleSmalltalk(userContext: UserContext, locale: string): Promise<ConversationResponse> {
    const greeting = userContext.name 
      ? `Bonjour ${userContext.name} ! 👋` 
      : 'Bonjour ! 👋'

    const responses = [
      `${greeting} Je suis votre assistant NextMove AI spécialisé en logistique Chine-Afrique. Je peux vous aider avec :

🚚 **Suivi de colis** - Vérifiez le statut de vos expéditions en temps réel
💰 **Calculs de tarifs** - Obtenez des devis personnalisés pour vos envois
📋 **Gestion de factures** - Consultez et téléchargez vos documents
📦 **Preuves de livraison** - Accédez à vos POD avec signature et géolocalisation
🔔 **Notifications** - Configurez vos alertes WhatsApp, SMS ou Email

Que puis-je faire pour vous aujourd'hui ?`,

      `${greeting} Ravi de vous retrouver ! En tant qu'expert logistique NextMove, je peux vous accompagner sur :

✈️ **Transport aérien** - Livraisons express 3-7 jours
🚢 **Transport maritime** - Solutions économiques 25-35 jours  
🚛 **Transport terrestre** - Liaisons régionales optimisées
📊 **Analytics** - Suivez vos performances logistiques
🤝 **Support 24/7** - Assistance multilingue français/anglais/chinois

Comment puis-je optimiser votre chaîne logistique aujourd'hui ?`,

      `${greeting} Votre assistant logistique intelligent est là ! Je maîtrise parfaitement :

🌍 **Routes Chine-Afrique** - Guangzhou, Shanghai, Shenzhen vers Dakar, Abidjan, Casablanca
📈 **Optimisation coûts** - Comparaisons automatiques air/mer/route
🔒 **Sécurité cargo** - Assurance et traçabilité complète
📱 **Intégration API** - Connectez vos systèmes existants
🎯 **Recommandations IA** - Suggestions personnalisées basées sur vos habitudes

Quel défi logistique puis-je résoudre pour vous ?`
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      message: randomResponse,
      ctas: [
        { text: '📦 Suivre un colis', action: 'track_package' },
        { text: '💰 Calculer un tarif', action: 'create_quote' },
        { text: '📋 Mes factures', action: 'view_invoices' },
        { text: '🔔 Configurer notifications', action: 'setup_notifications' },
        { text: '👨‍💼 Parler à un expert', action: 'human_contact' }
      ]
    }
  }

  /**
   * Gestion des demandes de suivi de colis
   */
  private async handleTrackingRequest(
    slots: Record<string, any>,
    session: AISession,
    locale: string
  ): Promise<ConversationResponse> {
    // Vérification des slots requis
    if (!slots.tracking_code) {
      return {
        message: this.config.slot_filling.polite_ask_fr.tracking_code,
        requires_input: true
      }
    }

    try {
      const trackingResult = await this.tools.trackShipment(slots.tracking_code)
      
      // Template de réponse avec données réelles
      let message = this.config.response_templates.tracking_success_fr
        .replace('{{code}}', trackingResult.code)
        .replace('{{status}}', trackingResult.status)
        .replace('{{from}}', trackingResult.from)
        .replace('{{to}}', trackingResult.to)
        .replace('{{eta}}', trackingResult.eta)

      // Ajout des événements récents
      if (trackingResult.events.length > 0) {
        const recentEvents = trackingResult.events.slice(0, 3)
          .map(event => `• ${event.ts} — ${event.label}`)
          .join('\n')
        message = message.replace('{{#if has_events}}Derniers événements :\n{{#each events.slice(0,3)}}• {{this.ts}} — {{this.label}}\n{{/each}}{{/if}}', 
          `Derniers événements :\n${recentEvents}`)
      }

      return {
        message,
        ctas: this.config.ctas.tracking.map(text => ({ text }))
      }
    } catch (error) {
      return {
        message: this.config.response_templates.tracking_not_found_fr
          .replace('{{code_input}}', slots.tracking_code),
        ctas: ['Réessayer avec un autre code', 'Parler à un conseiller'].map(text => ({ text }))
      }
    }
  }

  /**
   * Gestion des demandes de POD
   */
  private async handlePODRequest(
    slots: Record<string, any>,
    session: AISession,
    locale: string
  ): Promise<ConversationResponse> {
    if (!slots.tracking_code) {
      return {
        message: this.config.slot_filling.polite_ask_fr.tracking_code,
        requires_input: true
      }
    }

    try {
      const podResult = await this.tools.getPOD(slots.tracking_code)
      
      const message = this.config.response_templates.pod_offer_fr
        .replace('{{code}}', slots.tracking_code)

      return {
        message,
        ctas: ['Envoyer par email', 'Lien WhatsApp', 'Télécharger PDF'].map(text => ({ text }))
      }
    } catch (error) {
      return {
        message: `Désolé, la preuve de livraison pour **${slots.tracking_code}** n'est pas encore disponible. Elle sera générée dès la livraison du colis.`,
        ctas: ['Suivre le colis', 'Activer notification POD'].map(text => ({ text }))
      }
    }
  }

  /**
   * Gestion des demandes de factures
   */
  private async handleInvoicesRequest(
    slots: Record<string, any>,
    session: AISession,
    locale: string
  ): Promise<ConversationResponse> {
    try {
      const invoicesResult = await this.tools.listInvoices()
      
      let message = this.config.response_templates.invoice_list_fr
      const invoicesList = invoicesResult.items
        .map(inv => `• **${inv.id}** — ${inv.total.toLocaleString('fr-FR')} ${inv.currency} — ${this.translateStatus(inv.status)} (échéance ${inv.due_at})`)
        .join('\n')
      
      message = message.replace('{{#each items}}\n• **{{this.id}}** — {{this.total}} {{this.currency}} — {{this.status}} (échéance {{this.due_at}})\n{{/each}}', invoicesList)

      return {
        message,
        ctas: this.config.ctas.invoices.map(text => ({ text }))
      }
    } catch (error) {
      return {
        message: 'Impossible de récupérer vos factures pour le moment. Voulez-vous que je vous mette en relation avec un conseiller ?',
        ctas: ['Parler à un conseiller', 'Réessayer plus tard'].map(text => ({ text }))
      }
    }
  }

  /**
   * Gestion des demandes de devis
   */
  private async handleQuoteRequest(
    slots: Record<string, any>,
    session: AISession,
    locale: string
  ): Promise<ConversationResponse> {
    const requiredSlots = ['origin', 'destination', 'weight_kg', 'volume_m3']
    const missingSlots = requiredSlots.filter(slot => !slots[slot])

    if (missingSlots.length > 0) {
      const nextSlot = missingSlots[0]
      return {
        message: this.config.slot_filling.polite_ask_fr[nextSlot] || `Pouvez-vous préciser : ${nextSlot} ?`,
        requires_input: true
      }
    }

    try {
      const recommendation = await this.tools.recommendRouteAndPrice(
        slots.origin,
        slots.destination,
        slots.weight_kg,
        slots.volume_m3
      )

      let message = this.config.response_templates.quote_recommendation_fr
        .replace('{{origin}}', recommendation.origin)
        .replace('{{destination}}', recommendation.destination)
        .replace('{{weight_kg}}', recommendation.weight_kg.toString())
        .replace('{{volume_m3}}', recommendation.volume_m3.toString())
        .replace('{{air.price}}', recommendation.air.price.toLocaleString('fr-FR'))
        .replace('{{air.days}}', recommendation.air.days.toString())
        .replace('{{sea.price}}', recommendation.sea.price.toLocaleString('fr-FR'))
        .replace('{{sea.days}}', recommendation.sea.days.toString())
        .replace('{{road.price}}', recommendation.road.price.toLocaleString('fr-FR'))
        .replace('{{road.days}}', recommendation.road.days.toString())
        .replace('{{best.mode}}', this.translateMode(recommendation.best.mode))
        .replace('{{best.reason}}', recommendation.best.reason)

      return {
        message,
        ctas: this.config.ctas.quotes.map(text => ({ text }))
      }
    } catch (error) {
      return {
        message: 'Impossible de calculer les tarifs pour le moment. Voulez-vous que je vous mette en relation avec un conseiller ?',
        ctas: ['Parler à un conseiller', 'Réessayer plus tard'].map(text => ({ text }))
      }
    }
  }

  /**
   * Gestion des notifications
   */
  private async handleNotificationsRequest(
    slots: Record<string, any>,
    session: AISession,
    locale: string
  ): Promise<ConversationResponse> {
    if (!slots.channels) {
      return {
        message: 'Quels canaux souhaitez-vous activer ? **WhatsApp**, **SMS**, **Email** ou **Telegram** ?',
        requires_input: true
      }
    }

    try {
      await this.tools.setupNotifications(slots.channels, true)
      
      const channelsText = Array.isArray(slots.channels) 
        ? slots.channels.join(', ')
        : slots.channels

      const message = this.config.response_templates.notifications_ok_fr
        .replace('{{channels_human}}', channelsText)

      return {
        message,
        ctas: ['Tester les notifications', 'Modifier les préférences'].map(text => ({ text }))
      }
    } catch (error) {
      return {
        message: 'Impossible de configurer les notifications. Voulez-vous réessayer ?',
        ctas: ['Réessayer', 'Parler à un conseiller'].map(text => ({ text }))
      }
    }
  }

  /**
   * Escalade vers un humain
   */
  private async handleHumanEscalation(session: AISession, locale: string): Promise<ConversationResponse> {
    try {
      const escalationResult = await this.tools.escalateToHuman({
        session_summary: session.last_intent,
        user_context: session.conversation_topic
      })

      const message = this.config.response_templates.escalated_fr
        .replace('{{eta_minutes}}', escalationResult.eta_minutes.toString())

      return {
        message,
        escalated: true
      }
    } catch (error) {
      return {
        message: 'Le service support est temporairement indisponible. Puis-je vous aider autrement ?',
        ctas: this.config.ctas.general.map(text => ({ text }))
      }
    }
  }

  /**
   * Gestion des cas non compris (fallback)
   */
  private async handleFallback(
    nluResult: NLUResult,
    session: AISession,
    locale: string
  ): Promise<ConversationResponse> {
    // Tentative de détection d'entités utiles
    if (nluResult.entities.tracking_code) {
      return this.handleTrackingRequest({ tracking_code: nluResult.entities.tracking_code.value }, session, locale)
    }

    // Réponses contextuelles intelligentes selon les mots-clés
    const input = nluResult.input?.toLowerCase() || ''
    
    // Détection de questions sur les tarifs
    if (input.includes('prix') || input.includes('tarif') || input.includes('coût') || input.includes('combien')) {
      return {
        message: `💰 **Questions tarifaires** - Je peux vous aider à calculer des tarifs personnalisés !

Pour obtenir un devis précis, j'ai besoin de :
• **Origine** (ville de départ en Chine)
• **Destination** (ville d'arrivée en Afrique)  
• **Poids** (en kg)
• **Volume** (en m³) ou dimensions

**Exemple** : "Tarif de Shanghai vers Dakar, 500kg, 2m³"

Nos **tarifs moyens** :
🚢 Maritime : 180-250€/m³ (25-35 jours)
✈️ Aérien : 4-8€/kg (3-7 jours)
🚛 Terrestre : 120-180€/m³ (15-25 jours)`,
        ctas: [
          { text: '🧮 Calculateur de prix', action: 'create_quote' },
          { text: '📊 Comparer les modes', action: 'compare_modes' },
          { text: '💬 Parler à un expert', action: 'human_contact' }
        ]
      }
    }

    // Détection de questions sur les délais
    if (input.includes('délai') || input.includes('temps') || input.includes('durée') || input.includes('quand')) {
      return {
        message: `⏰ **Délais de livraison Chine-Afrique** - Voici nos temps de transit moyens :

🚢 **Maritime** (le plus économique)
• Chine → Afrique de l'Ouest : 25-30 jours
• Chine → Afrique du Nord : 20-25 jours  
• Chine → Afrique de l'Est : 15-20 jours

✈️ **Aérien** (le plus rapide)
• Toutes destinations : 3-7 jours
• Express premium : 2-3 jours

🚛 **Terrestre** (via Europe)
• Chine → Afrique du Nord : 15-20 jours
• Solution hybride mer + route

Les délais incluent le dédouanement et la livraison finale.`,
        ctas: [
          { text: '📦 Suivre un envoi', action: 'track_package' },
          { text: '🚚 Modes de transport', action: 'transport_modes' },
          { text: '📞 Urgence ? Contactez-nous', action: 'human_contact' }
        ]
      }
    }

    // Détection de questions sur la documentation
    if (input.includes('document') || input.includes('papier') || input.includes('douane') || input.includes('certificat')) {
      return {
        message: `📋 **Documentation douanière** - Voici les documents essentiels :

**Documents obligatoires :**
• **Facture commerciale** (3 exemplaires minimum)
• **Liste de colisage** (packing list détaillée)
• **Connaissement** (Bill of Lading - B/L)
• **Certificat d'origine** (si applicable)

**Selon la marchandise :**
• **Certificat sanitaire** (alimentaire, cosmétique)
• **Certificat de conformité** (électronique, textile)
• **Licence d'importation** (produits réglementés)
• **Certificat phytosanitaire** (produits végétaux)

**NextMove s'occupe de :**
✅ Vérification documentaire avant expédition
✅ Dédouanement dans le pays de destination
✅ Suivi des formalités administratives`,
        ctas: [
          { text: '📄 Liste complète documents', action: 'document_list' },
          { text: '🏛️ Procédures douanières', action: 'customs_info' },
          { text: '🤝 Assistance documentaire', action: 'human_contact' }
        ]
      }
    }

    // Détection de questions sur les produits interdits
    if (input.includes('interdit') || input.includes('autorisé') || input.includes('légal') || input.includes('réglementation')) {
      return {
        message: `⚠️ **Produits réglementés** - Attention aux restrictions :

**❌ Produits INTERDITS :**
• Armes et munitions
• Drogues et stupéfiants  
• Contrefaçons et copies
• Produits radioactifs
• Certains produits chimiques

**⚡ Produits RÉGLEMENTÉS :**
• **Électronique** : Certificats CE, FCC requis
• **Alimentaire** : Autorisations sanitaires
• **Médicaments** : Licences pharmaceutiques
• **Cosmétiques** : Certifications ANSM/FDA
• **Textiles** : Étiquetage obligatoire

**✅ NextMove vérifie :**
• Conformité réglementaire avant expédition
• Documentation requise par pays
• Restrictions spécifiques par destination`,
        ctas: [
          { text: '📋 Vérifier un produit', action: 'product_check' },
          { text: '🌍 Réglementations par pays', action: 'country_regulations' },
          { text: '⚖️ Conseil juridique', action: 'human_contact' }
        ]
      }
    }

    // Fallback général avec suggestions intelligentes
    return {
      message: `🤔 Je n'ai pas bien saisi votre demande. Voici ce que je peux faire pour vous :

**🔍 Recherches populaires :**
• "Suivre le colis ABC123456"
• "Tarif Shanghai vers Dakar 100kg"
• "Mes factures en attente"
• "Documents pour exporter en Côte d'Ivoire"
• "Délai maritime Chine vers Sénégal"

**💡 Ou choisissez directement :**`,
      ctas: [
        { text: '📦 Suivi de colis', action: 'track_package' },
        { text: '💰 Calcul de tarifs', action: 'create_quote' },
        { text: '📋 Mes factures', action: 'view_invoices' },
        { text: '📞 Parler à un expert', action: 'human_contact' },
        { text: '❓ FAQ complète', action: 'faq' }
      ]
    }
  }

  /**
   * Met à jour la session avec les nouvelles informations
   */
  private async updateSession(
    session: AISession,
    nluResult: NLUResult,
    response: ConversationResponse
  ): Promise<void> {
    session.last_intent = nluResult.intent
    session.last_entities = nluResult.entities
    session.conversation_topic = this.inferTopic(nluResult.intent)
    session.updated_at = new Date()

    // Sauvegarde des slots en cours si nécessaire
    if (response.requires_input) {
      session.pending_slots = nluResult.slots
    } else {
      session.pending_slots = undefined
    }
  }

  /**
   * Gestion des erreurs
   */
  private handleError(error: any, context: ConversationContext): ConversationResponse {
    console.error('Erreur orchestrateur:', error)
    
    return {
      message: 'Désolé, je rencontre un problème technique. Voulez-vous que je vous mette en relation avec un conseiller ?',
      ctas: ['Parler à un conseiller', 'Réessayer'].map(text => ({ text }))
    }
  }

  /**
   * Utilitaires de traduction
   */
  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      'paid': 'Payée',
      'pending': 'En attente',
      'overdue': 'En retard',
      'cancelled': 'Annulée'
    }
    return translations[status] || status
  }

  private translateMode(mode: string): string {
    const translations: Record<string, string> = {
      'air': 'Aérien',
      'sea': 'Maritime',
      'road': 'Routier'
    }
    return translations[mode] || mode
  }

  private inferTopic(intent: string): string {
    const topicMap: Record<string, string> = {
      'track_shipment': 'tracking',
      'pod': 'tracking',
      'invoices': 'billing',
      'create_quote': 'quote',
      'notifications': 'notifications'
    }
    return topicMap[intent] || 'general'
  }
}
