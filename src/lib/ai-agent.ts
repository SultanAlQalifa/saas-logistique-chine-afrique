import { RAGKnowledgeBase } from './rag-knowledge-base'
import { webSearch } from './web-search'

interface AIAgentConfig {
  name: string
  role: string
  personality: {
    tone: 'chaleureux' | 'professionnel' | 'direct' | 'amical'
    style: 'conversationnel' | 'formel' | 'décontracté'
    expertise: string[]
  }
  capabilities: {
    languages: string[]
    services: string[]
    maxResponseTime: number // en millisecondes
  }
}

interface ConversationContext {
  userId: string
  userRole: 'PROSPECT' | 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN'
  conversationHistory: Message[]
  userProfile?: {
    name?: string
    company?: string
    country?: string
    language: string
    timezone: string
    previousInteractions: number
  }
  currentIntent: 'INFORMATION' | 'SUPPORT' | 'SALES' | 'COMPLAINT' | 'TECHNICAL'
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
  metadata?: {
    sentiment?: 'positive' | 'neutral' | 'negative'
    confidence?: number
    detectedIntent?: string
    suggestedActions?: string[]
  }
}

interface AgentConfig {
  name: string
  role: string
  personality: AgentPersonality
  knowledgeBase: KnowledgeBase
  capabilities?: string[]
}

interface AgentPersonality {
  tone: 'chaleureux' | 'professionnel' | 'direct' | 'amical'
  style: 'conversationnel' | 'formel' | 'décontracté'
  expertise: string[]
}

interface KnowledgeBase {
  get: (key: string) => any
  set: (key: string, value: any) => void
}

export class AIAgent {
  private name: string
  private role: string
  private personality: AgentPersonality
  private knowledgeBase: KnowledgeBase
  private conversationHistory: Map<string, ConversationContext[]> = new Map()
  private activeConversations: Map<string, ConversationContext> = new Map()

  constructor(config: AgentConfig) {
    this.name = config.name
    this.role = config.role
    this.personality = config.personality
    this.knowledgeBase = config.knowledgeBase
  }

  // Obtenir le nom adaptatif selon l'utilisateur
  getAdaptiveName(userProfile?: {
    country?: string
    language?: string
    preferredGender?: 'male' | 'female' | 'unisex'
  }): string {
    const { getAgentFullName } = require('./african-names')
    return getAgentFullName(
      userProfile?.country,
      userProfile?.language,
      userProfile?.preferredGender
    )
  }

  // Obtenir une introduction personnalisée
  getPersonalizedIntroduction(userProfile?: {
    country?: string
    language?: string
    preferredGender?: 'male' | 'female' | 'unisex'
  }): string {
    const { getAgentIntroduction } = require('./african-names')
    return getAgentIntroduction(
      userProfile?.country,
      userProfile?.language,
      userProfile?.preferredGender
    )
  }

  private initializeKnowledgeBase() {
    // Base de connaissances sur la plateforme
    this.knowledgeBase.set('services', {
      'transport-maritime': {
        description: 'Transport maritime Chine-Afrique',
        delais: '18-35 jours',
        tarifs: 'À partir de 2€/kg',
        avantages: ['Économique', 'Gros volumes', 'Sécurisé']
      },
      'transport-aerien': {
        description: 'Transport aérien express',
        delais: '3-7 jours',
        tarifs: 'À partir de 8€/kg',
        avantages: ['Rapide', 'Fiable', 'Suivi temps réel']
      },
      'consolidation': {
        description: 'Service de consolidation de colis',
        delais: 'Variable selon destination',
        tarifs: 'Économies jusqu\'à 60%',
        avantages: ['Économique', 'Flexible', 'Groupage optimisé']
      }
    })

    this.knowledgeBase.set('subscriptions', {
      'starter': {
        name: 'Starter',
        price: 29000, // XOF
        currency: 'XOF',
        features: ['5 colis/mois', 'Suivi basique', 'Support email'],
        target: 'Petites entreprises'
      },
      'professional': {
        name: 'Professional',
        price: 59000,
        currency: 'XOF',
        features: ['50 colis/mois', 'Suivi avancé', 'Support prioritaire', 'API access'],
        target: 'Entreprises moyennes'
      },
      'enterprise': {
        name: 'Enterprise',
        price: 149000,
        currency: 'XOF',
        features: ['Colis illimités', 'Suivi premium', 'Support dédié', 'Intégrations', 'Tarifs négociés'],
        target: 'Grandes entreprises'
      }
    })

    this.knowledgeBase.set('faq', {
      'delais-livraison': 'Les délais varient selon le mode de transport : 3-7 jours en aérien, 18-35 jours en maritime.',
      'tarification': 'Nos tarifs dépendent du poids, volume, destination et mode de transport. Contactez-nous pour un devis personnalisé.',
      'suivi-colis': 'Vous pouvez suivre vos colis 24/7 sur notre plateforme avec votre numéro de suivi.',
      'assurance': 'Tous nos envois sont assurés. L\'assurance couvre jusqu\'à 100% de la valeur déclarée.',
      'douane': 'Nous gérons toutes les formalités douanières. Vous recevez tous les documents nécessaires.',
      'zones-couvertes': 'Nous couvrons tous les pays UEMOA et CEMAC depuis la Chine.'
    })

    this.knowledgeBase.set('objections', {
      'prix-trop-cher': {
        response: 'Je comprends votre préoccupation sur les coûts. Permettez-moi de vous expliquer la valeur que nous apportons...',
        arguments: [
          'Assurance incluse à 100%',
          'Suivi temps réel',
          'Support 24/7',
          'Pas de frais cachés',
          'Garantie de livraison'
        ]
      },
      'delais-trop-longs': {
        response: 'Les délais sont effectivement un point important. Nous avons plusieurs options...',
        arguments: [
          'Transport aérien express disponible',
          'Notification à chaque étape',
          'Délais respectés à 95%',
          'Compensation en cas de retard'
        ]
      },
      'concurrence-moins-cher': {
        response: 'Il est vrai que certains concurrents pratiquent des prix plus bas, mais...',
        arguments: [
          'Qualité de service supérieure',
          'Taux de perte 0% en 2024',
          'Support multilingue',
          'Plateforme technologique avancée'
        ]
      }
    })
  }

  async processMessage(userId: string, message: string, context?: Partial<ConversationContext>): Promise<string> {
    // Analyser le message et le contexte
    const conversationContext = this.getOrCreateContext(userId, context)
    const analysis = await this.analyzeMessage(message, conversationContext)
    
    // Mettre à jour le contexte
    conversationContext.conversationHistory.push({
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      metadata: analysis
    })

    // Générer la réponse appropriée avec vouvoiement
    const response = await this.generateResponse(analysis, conversationContext)
    
    // Enregistrer la réponse
    conversationContext.conversationHistory.push({
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'agent',
      timestamp: new Date()
    })

    // Mettre à jour le contexte global
    this.activeConversations.set(userId, conversationContext)
    
    return response
  }

  private getOrCreateContext(userId: string, context?: Partial<ConversationContext>): ConversationContext {
    let existingContext = this.activeConversations.get(userId)
    
    if (!existingContext) {
      existingContext = {
        userId,
        userRole: 'PROSPECT',
        conversationHistory: [],
        currentIntent: 'INFORMATION',
        urgencyLevel: 'LOW',
        ...context
      }
    } else {
      // Mettre à jour avec le nouveau contexte si fourni
      Object.assign(existingContext, context)
    }
    
    return existingContext
  }

  private async analyzeMessage(message: string, context: ConversationContext): Promise<any> {
    const lowerMessage = message.toLowerCase()
    
    // Détection d'intention
    let intent = 'INFORMATION'
    let sentiment = 'neutral'
    let urgencyLevel = 'LOW'
    let confidence = 0.8

    // Mots-clés pour les intentions
    const intentKeywords = {
      'SALES': ['prix', 'tarif', 'abonnement', 'souscription', 'acheter', 'commander', 'devis'],
      'SUPPORT': ['problème', 'aide', 'assistance', 'bug', 'erreur', 'ne fonctionne pas'],
      'COMPLAINT': ['mécontent', 'insatisfait', 'réclamation', 'remboursement', 'annuler'],
      'TECHNICAL': ['api', 'intégration', 'technique', 'développeur', 'code', 'webhook']
    }

    // Mots-clés pour le sentiment
    const sentimentKeywords = {
      'positive': ['merci', 'excellent', 'parfait', 'super', 'génial', 'satisfait'],
      'negative': ['nul', 'mauvais', 'décevant', 'problème', 'mécontent', 'insatisfait']
    }

    // Mots-clés pour l'urgence
    const urgencyKeywords = {
      'HIGH': ['urgent', 'rapidement', 'immédiatement', 'critique', 'important'],
      'CRITICAL': ['bloqué', 'panne', 'arrêt', 'critique', 'perte']
    }

    // Analyser l'intention
    for (const [intentType, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        intent = intentType
        break
      }
    }

    // Analyser le sentiment
    for (const [sentimentType, keywords] of Object.entries(sentimentKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        sentiment = sentimentType
        break
      }
    }

    // Analyser l'urgence
    for (const [urgencyType, keywords] of Object.entries(urgencyKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        urgencyLevel = urgencyType as typeof urgencyLevel
        break
      }
    }

    return {
      sentiment,
      confidence,
      detectedIntent: intent,
      urgencyLevel,
      suggestedActions: this.getSuggestedActions(intent, sentiment)
    }
  }

  private getSuggestedActions(intent: string, sentiment: string): string[] {
    const actions = []

    switch (intent) {
      case 'SALES':
        actions.push('Présenter les offres', 'Proposer un devis', 'Programmer un appel')
        break
      case 'SUPPORT':
        actions.push('Diagnostiquer le problème', 'Proposer une solution', 'Escalader si nécessaire')
        break
      case 'COMPLAINT':
        actions.push('Écouter activement', 'Proposer compensation', 'Suivre la résolution')
        break
      case 'TECHNICAL':
        actions.push('Fournir documentation', 'Proposer assistance technique', 'Programmer formation')
        break
    }

    if (sentiment === 'negative') {
      actions.unshift('Apaiser la situation', 'Montrer de l\'empathie')
    }

    return actions
  }

  private async generateResponse(analysis: any, context: ConversationContext): Promise<string> {
    const { detectedIntent, sentiment, urgencyLevel } = analysis
    const { userProfile, conversationHistory } = context

    // Personnaliser selon le profil utilisateur
    const greeting = this.getPersonalizedGreeting(userProfile, conversationHistory.length)
    
    // Générer la réponse selon l'intention
    let response = ''

    switch (detectedIntent) {
      case 'SALES':
        response = await this.generateSalesResponse(context, analysis)
        break
      case 'SUPPORT':
        response = await this.generateSupportResponse(context, analysis)
        break
      case 'COMPLAINT':
        response = await this.generateComplaintResponse(context, analysis)
        break
      case 'TECHNICAL':
        response = await this.generateTechnicalResponse(context, analysis)
        break
      default:
        response = await this.generateInformationalResponse(context, analysis)
    }

    // Ajouter le greeting si c'est le début de conversation
    if (conversationHistory.length <= 1) {
      response = `${greeting}\n\n${response}`
    }

    // Adapter le ton selon l'urgence et le sentiment
    response = this.adaptTone(response, sentiment, urgencyLevel)

    return response
  }

  private getPersonalizedGreeting(userProfile?: ConversationContext['userProfile'], messageCount: number = 0): string {
    const timeOfDay = new Date().getHours()
    let timeGreeting = 'Bonjour'
    
    if (timeOfDay >= 18) timeGreeting = 'Bonsoir'
    else if (timeOfDay >= 12) timeGreeting = 'Bon après-midi'

    if (messageCount === 0) {
      // Utiliser le nom adaptatif africain
      const adaptiveName = this.getAdaptiveName(userProfile)
      
      if (userProfile?.name) {
        return `${timeGreeting} ${userProfile.name} ! 👋 Je suis ${adaptiveName}, votre assistant IA dédié chez NextMove Chine-Afrique. Je suis ravi de pouvoir vous accompagner dans vos projets logistiques.`
      }
      return this.getPersonalizedIntroduction(userProfile)
    }

    return ''
  }

  private async generateSalesResponse(context: ConversationContext, analysis: any): Promise<string> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content.toLowerCase()
    
    // Identifier le besoin spécifique
    if (lastMessage.includes('prix') || lastMessage.includes('tarif')) {
      return this.generatePricingResponse(context)
    }
    
    if (lastMessage.includes('abonnement') || lastMessage.includes('souscription')) {
      return this.generateSubscriptionResponse(context)
    }

    if (lastMessage.includes('devis')) {
      return this.generateQuoteResponse(context)
    }

    // Réponse générale de vente
    return `Je vois que vous vous intéressez à nos services ! 🚀

Nous vous proposons des solutions logistiques complètes entre la Chine et l'Afrique :

📦 **Transport Maritime** - À partir de 2€/kg (18-35 jours)
✈️ **Transport Aérien** - À partir de 8€/kg (3-7 jours)  
🔄 **Consolidation** - Économies jusqu'à 60%

Pour vous proposer la meilleure offre, j'aurais besoin de quelques informations :
• Quel type de produits souhaitez-vous expédier ?
• Quel volume mensuel estimez-vous ?
• Quelles sont vos destinations principales ?

Je peux vous préparer un devis personnalisé en moins de 5 minutes ! 💪`
  }

  private generatePricingResponse(context: ConversationContext): string {
    return `Excellente question sur nos tarifs ! 💰

**Nos prix transparents :**

🌊 **Maritime (18-35 jours)**
• 2-4€/kg selon destination
• Volume minimum : 100kg
• Assurance incluse

✈️ **Aérien (3-7 jours)**  
• 8-15€/kg selon destination
• Pas de minimum
• Livraison express

🎯 **Avantages inclus GRATUITEMENT :**
✅ Suivi temps réel 24/7
✅ Assurance tous risques  
✅ Gestion douanière complète
✅ Support multilingue
✅ Pas de frais cachés

Souhaitez-vous que je calcule un tarif précis pour votre envoi ? Il me suffit de connaître :
• Poids et dimensions
• Destination
• Type de produit

Je vous donne un prix exact en 30 secondes ! ⚡`
  }

  private generateSubscriptionResponse(context: ConversationContext): string {
    const subscriptions = this.knowledgeBase.get('subscriptions')
    
    return `Parfait ! Nos abonnements sont conçus pour optimiser vos coûts logistiques 📈

🥉 **STARTER** - 29 000 XOF/mois
• 5 colis inclus
• Suivi basique
• Support email
• *Idéal pour tester nos services*

🥈 **PROFESSIONAL** - 59 000 XOF/mois  
• 50 colis inclus
• Suivi avancé + notifications
• Support prioritaire
• Accès API
• *Notre formule la plus populaire*

🥇 **ENTERPRISE** - 149 000 XOF/mois
• Colis ILLIMITÉS
• Suivi premium
• Account manager dédié
• Intégrations sur mesure
• Tarifs négociés
• *Pour les gros volumes*

🎁 **OFFRE SPÉCIALE** : 14 jours d'essai gratuit + 20% de réduction sur votre premier mois !

Quel volume mensuel prévoyez-vous ? Je peux vous recommander la formule parfaite ! 🎯`
  }

  private generateQuoteResponse(context: ConversationContext): string {
    return `Avec plaisir ! Je vais vous préparer un devis personnalisé 📋

Pour un devis précis et compétitif, j'ai besoin de ces informations :

📦 **Votre envoi :**
• Poids total (kg)
• Dimensions (L x l x H en cm)
• Nombre de colis
• Type de produits

📍 **Itinéraire :**
• Ville de départ en Chine
• Destination en Afrique
• Adresse de livraison

⚡ **Préférences :**
• Maritime (économique) ou Aérien (rapide) ?
• Date d'expédition souhaitée
• Services additionnels (emballage, stockage...)

💡 **Astuce** : Plus vous me donnez d'infos, plus je peux négocier un prix avantageux !

Vous pouvez me donner ces détails maintenant ou préférez-vous que je vous envoie un formulaire par email ? 📧`
  }

  private async generateSupportResponse(context: ConversationContext, analysis: any): Promise<string> {
    const urgency = analysis.urgencyLevel
    
    let response = `Je suis là pour vous aider ! 🛠️\n\n`
    
    if (urgency === 'CRITICAL') {
      response += `⚠️ **URGENCE DÉTECTÉE** - Je prends votre demande en priorité absolue !\n\n`
    } else if (urgency === 'HIGH') {
      response += `🔥 **PRIORITÉ ÉLEVÉE** - Je traite votre demande immédiatement !\n\n`
    }

    response += `Pour vous assister efficacement, pouvez-vous me préciser :

🎯 **Votre problème :**
• Que se passe-t-il exactement ?
• Depuis quand rencontrez-vous ce problème ?
• Avez-vous un message d'erreur ?

📋 **Contexte :**
• Numéro de suivi ou commande concernée
• Navigateur utilisé (Chrome, Safari...)
• Appareil (ordinateur, mobile)

💪 **Solutions immédiates que je peux proposer :**
• Vérification de statut en temps réel
• Réinitialisation de compte
• Guide pas-à-pas personnalisé
• Escalade vers notre équipe technique

Je reste en ligne jusqu'à résolution complète ! 🚀`

    return response
  }

  private async generateComplaintResponse(context: ConversationContext, analysis: any): Promise<string> {
    return `Je comprends parfaitement votre frustration et je vous présente mes excuses pour cette expérience décevante. 😔

**Je prends votre réclamation très au sérieux** et je vais personnellement m'assurer qu'elle soit résolue rapidement.

🎯 **Actions immédiates :**
• Investigation complète de votre dossier
• Contact direct avec les équipes concernées  
• Suivi personnalisé jusqu'à résolution
• Rapport détaillé sous 24h

💪 **Mes engagements :**
✅ Transparence totale sur les causes
✅ Mesures correctives concrètes
✅ Compensation appropriée si justifiée
✅ Amélioration de nos processus

Pouvez-vous me donner plus de détails sur :
• Le problème rencontré précisément
• L'impact sur votre activité
• Vos attentes pour la résolution

**Votre satisfaction est ma priorité absolue.** Je ne lâcherai pas tant que vous ne serez pas pleinement satisfait ! 🎯

Numéro de dossier : REC-${Date.now()}`
  }

  private async generateTechnicalResponse(context: ConversationContext, analysis: any): Promise<string> {
    return `Parfait ! Je vais vous accompagner sur les aspects techniques 👨‍💻

**Nos ressources techniques disponibles :**

📚 **Documentation complète :**
• API REST avec authentification OAuth2
• Webhooks temps réel pour le suivi
• SDK disponibles (PHP, Node.js, Python)
• Postman collection prête à l'emploi

🔧 **Intégrations populaires :**
• WooCommerce / Shopify
• ERP (SAP, Odoo, Sage)
• Systèmes de gestion d'entrepôt
• Plateformes e-commerce

⚡ **Support technique :**
• Environnement de test (sandbox)
• Clés API gratuites
• Support développeur dédié
• Formation technique personnalisée

De quoi avez-vous besoin spécifiquement ?
• Intégration API ?
• Configuration webhook ?
• Aide au développement ?
• Formation de votre équipe ?

Je peux vous mettre en relation avec notre CTO ou organiser une session technique en visio ! 🚀`
  }

  private async generateInformationalResponse(context: ConversationContext, analysis: any): Promise<string> {
    const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.content.toLowerCase()
    
    // Rechercher dans la FAQ
    const faq = this.knowledgeBase.get('faq')
    for (const [key, answer] of Object.entries(faq)) {
      if (lastMessage.includes(key.replace('-', ' '))) {
        return `${answer}\n\nAvez-vous d'autres questions ? Je suis là pour vous aider ! 😊`
      }
    }

    // 1) Tentative RAG interne (documentation/website simulés)
    try {
      const rag = RAGKnowledgeBase.getInstance()
      const ragResp = await rag.generateRAGResponse(lastMessage)
      if (ragResp && ragResp.answer) {
        const sourcesBlock = ragResp.sources.length
          ? `\n\nSources internes :\n${ragResp.sources
              .map((s, i) => `• [${i + 1}] ${s.title} — ${s.url}`)
              .join('\n')}`
          : ''
        return `${ragResp.answer}${sourcesBlock}\n\nSouhaitez-vous plus de détails sur l'un de ces points ? 😊`
      }
    } catch (_) {
      // Ignorer silencieusement, on passera au fallback web
    }

    // 2) Fallback web search si rien d'interne n'est pertinent
    try {
      const web = await webSearch(lastMessage)
      if (web && web.answer) {
        const sourcesBlock = web.sources.length
          ? `\n\nSources en ligne :\n${web.sources
              .map((s, i) => `• [${i + 1}] ${s.title} — ${s.url}`)
              .join('\n')}`
          : ''
        return `${web.answer}${sourcesBlock}\n\nSouhaitez-vous que je vérifie un point spécifique ou que je prépare un devis ?`
      }
    } catch (_) {
      // En cas d'échec réseau/CORS, continuer vers message générique
    }

    // 3) Réponse générale informative si aucune source pertinente
    return `Je suis ravi de pouvoir vous renseigner ! 📚

**NextMove Chine-Afrique** est votre partenaire de confiance pour tous vos besoins logistiques entre la Chine et l'Afrique.

🌟 **Nos services phares :**
• Transport maritime & aérien
• Consolidation de colis
• Gestion douanière complète
• Suivi temps réel 24/7
• Assurance tous risques

🎯 **Pourquoi nous choisir :**
✅ 15 pays UEMOA/CEMAC couverts
✅ 99.8% de taux de livraison
✅ Support multilingue 24/7
✅ Tarifs transparents sans surprise
✅ Plateforme technologique avancée

Que souhaitez-vous savoir précisément ? Je peux vous parler de :
• Nos tarifs et délais
• Le processus d'expédition
• Nos garanties et assurances
• Comment créer votre compte

Je suis là pour répondre à toutes vos questions ! 🚀`
  }

  private adaptTone(response: string, sentiment: string, urgencyLevel: string): string {
    // Adapter selon le sentiment
    if (sentiment === 'negative') {
      response = response.replace(/!/g, '.')
      response = `Je comprends votre situation et je vais tout faire pour vous aider.\n\n${response}`
    }

    // Adapter selon l'urgence
    if (urgencyLevel === 'CRITICAL') {
      response = `🚨 TRAITEMENT PRIORITAIRE 🚨\n\n${response}\n\n⚡ Je reste disponible en permanence pour le suivi de votre dossier.`
    }

    return response
  }

  // Méthodes pour la prospection automatique
  async generateProspectingMessage(prospect: any): Promise<string> {
    const { company, industry, country, estimatedVolume } = prospect

    return `Bonjour ! 👋

Je suis Alex, assistant IA chez NextMove Chine-Afrique.

J'ai remarqué que ${company} opère dans le secteur ${industry} au ${country}. Nous accompagnons de nombreuses entreprises similaires dans l'optimisation de leur chaîne logistique Chine-Afrique.

🎯 **Résultats typiques pour vos pairs :**
• Réduction des coûts logistiques de 25-40%
• Amélioration des délais de 30%
• Visibilité complète sur les expéditions
• Zéro perte de marchandise

Seriez-vous intéressé par un audit gratuit de vos flux logistiques actuels ? 

Je peux vous proposer un créneau de 15 minutes cette semaine pour vous présenter comment nous pourrions optimiser vos opérations.

Cordialement,
Alex - Assistant IA
NextMove Chine-Afrique`
  }

  // Méthode pour le closing automatique
  async generateClosingMessage(context: ConversationContext): Promise<string> {
    const { userProfile, conversationHistory } = context
    
    // Analyser l'historique pour identifier les signaux d'achat
    const buyingSignals = this.detectBuyingSignals(conversationHistory)
    
    if (buyingSignals.length > 0) {
      return `Je sens que vous êtes prêt à passer à l'action ! 🚀

Basé sur notre conversation, voici ce que je vous propose :

🎯 **Offre personnalisée pour ${userProfile?.company || 'votre entreprise'} :**
• Essai gratuit 14 jours (valeur 29 000 XOF)
• 20% de réduction sur votre premier mois
• Configuration gratuite de votre compte
• Formation personnalisée de votre équipe

⏰ **Cette offre expire dans 48h** - Je peux la réserver maintenant !

Dois-je préparer votre contrat ? Il ne me faut que 2 minutes pour tout configurer ! 

Cliquez ici pour valider : [LIEN_SOUSCRIPTION]

Ou préférez-vous que je vous appelle directement ? 📞`
    }

    return `Merci pour cet échange enrichissant ! 

Je reste à votre disposition 24/7 pour toute question. N'hésitez pas à revenir vers moi quand vous serez prêt à optimiser votre logistique ! 

À très bientôt ! 👋`
  }

  private detectBuyingSignals(history: Message[]): string[] {
    const signals = []
    const recentMessages = history.slice(-5).map(m => m.content.toLowerCase())
    
    const buyingKeywords = [
      'combien ça coûte',
      'je suis intéressé',
      'comment on fait',
      'quand peut-on commencer',
      'quel est le processus',
      'je veux essayer',
      'c\'est parfait',
      'ça me convient'
    ]

    for (const message of recentMessages) {
      for (const keyword of buyingKeywords) {
        if (message.includes(keyword)) {
          signals.push(keyword)
        }
      }
    }

    return signals
  }
}

// Configuration de l'agent principal
export const mainAIAgent = new AIAgent({
  name: 'Alex',
  role: 'Assistant Commercial et Support',
  personality: {
    tone: 'chaleureux',
    style: 'conversationnel',
    expertise: ['logistique', 'commerce international', 'service client', 'vente']
  },
  knowledgeBase: {
    get: (key: string) => {
      // Base de connaissances simulée
      const data: { [key: string]: any } = {
        services: {
          'transport-maritime': {
            description: 'Transport maritime Chine-Afrique',
            delais: '18-35 jours',
            tarifs: 'À partir de 2€/kg',
            avantages: ['Économique', 'Gros volumes', 'Sécurisé']
          },
          'transport-aerien': {
            description: 'Transport aérien express',
            delais: '3-7 jours',
            tarifs: 'À partir de 8€/kg',
            avantages: ['Rapide', 'Fiable', 'Suivi temps réel']
          }
        },
        subscriptions: {
          starter: { price: 29000, currency: 'XOF', features: ['5 colis', 'Suivi basique'] },
          professional: { price: 59000, currency: 'XOF', features: ['50 colis', 'Suivi avancé', 'API'] },
          enterprise: { price: 149000, currency: 'XOF', features: ['Illimité', 'Account manager', 'Tarifs négociés'] }
        }
      }
      return data[key]
    },
    set: (key: string, value: any) => {
      // Implémentation de stockage simulée
    }
  },
  capabilities: ['support', 'sales', 'prospecting', 'technical', 'multilingual']
})

export default AIAgent
