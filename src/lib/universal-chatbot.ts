import OpenAI from 'openai'
import { RAGKnowledgeBase, RAGResponse } from './rag-knowledge-base'
import { ChatbotTools, ToolExecutionResult } from './chatbot-tools'
import { ChatContextService, ChatContext } from './chatbot-context'

export interface UniversalChatbotResponse {
  message: string
  sources?: Array<{
    title: string
    url: string
    excerpt: string
  }>
  suggestions?: string[]
  actions?: Array<{
    type: string
    label: string
    data?: any
  }>
  toolResults?: ToolExecutionResult[]
  language: 'fr' | 'en'
  confidence: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class UniversalChatbot {
  private static instance: UniversalChatbot
  private openai: OpenAI | null = null
  private ragKB: RAGKnowledgeBase
  private tools: ChatbotTools
  private isDemo: boolean = false

  private constructor() {
    this.ragKB = RAGKnowledgeBase.getInstance()
    this.tools = ChatbotTools.getInstance()
    this.initializeOpenAI()
  }

  static getInstance(): UniversalChatbot {
    if (!UniversalChatbot.instance) {
      UniversalChatbot.instance = new UniversalChatbot()
    }
    return UniversalChatbot.instance
  }

  private async initializeOpenAI() {
    try {
      const apiKey = process.env.OPENAI_API_KEY
      if (apiKey && apiKey.startsWith('sk-')) {
        this.openai = new OpenAI({ apiKey })
        this.isDemo = false
        console.log('OpenAI initialisé avec clé réelle')
      } else {
        console.log('OpenAI non configuré - utilisation des réponses prédéfinies')
      }
    } catch (error) {
      console.error('Erreur initialisation OpenAI:', error)
    }
  }

  async processMessage(
    message: string,
    userId: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<UniversalChatbotResponse> {
    // 1. Détection de langue
    const language = this.detectLanguage(message)
    
    // 2. Récupération du contexte utilisateur
    const context = await ChatContextService.getFullContext(userId)
    
    // 3. Détection d'intention
    const intent = this.analyzeIntent(message, language)
    
    // 4. Traitement selon l'intention
    switch (intent.type) {
      case 'documentation':
        return this.handleDocumentationIntent(message, language)
      
      case 'action':
        return this.handleActionIntent(message, intent, context, language)
      
      case 'question':
        return this.handleQuestionIntent(message, context, conversationHistory, language)
      
      default:
        return this.handleGeneralIntent(message, context, conversationHistory, language)
    }
  }

  private detectLanguage(message: string): 'fr' | 'en' {
    const englishWords = ['hello', 'how', 'what', 'where', 'when', 'why', 'please', 'thank', 'help']
    const frenchWords = ['bonjour', 'comment', 'quoi', 'où', 'quand', 'pourquoi', 'merci', 'aide', 'salut']
    
    const lowerMessage = message.toLowerCase()
    const englishCount = englishWords.filter(word => lowerMessage.includes(word)).length
    const frenchCount = frenchWords.filter(word => lowerMessage.includes(word)).length
    
    return englishCount > frenchCount ? 'en' : 'fr'
  }

  private analyzeIntent(message: string, language: 'fr' | 'en'): {
    type: 'documentation' | 'action' | 'question' | 'general'
    confidence: number
    entities: string[]
    actionType?: string
  } {
    const lowerMessage = message.toLowerCase()
    
    // Documentation
    const docKeywords = language === 'fr' 
      ? ['documentation', 'guide', 'manuel', 'aide', 'tutoriel', 'comment faire']
      : ['documentation', 'guide', 'manual', 'help', 'tutorial', 'how to']
    
    if (docKeywords.some(kw => lowerMessage.includes(kw))) {
      return { type: 'documentation', confidence: 0.9, entities: [] }
    }
    
    // Actions
    const actionPatterns = {
      register: language === 'fr' ? ['inscription', 'créer compte', 'enregistrer'] : ['register', 'sign up', 'create account'],
      login: language === 'fr' ? ['connexion', 'connecter', 'login'] : ['login', 'sign in', 'connect'],
      track: language === 'fr' ? ['suivi', 'suivre', 'track'] : ['track', 'trace', 'follow'],
      invoice: language === 'fr' ? ['facture', 'télécharger facture'] : ['invoice', 'download invoice'],
      quote: language === 'fr' ? ['devis', 'tarif', 'prix'] : ['quote', 'price', 'rate']
    }
    
    for (const [action, keywords] of Object.entries(actionPatterns)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        return { 
          type: 'action', 
          confidence: 0.8, 
          entities: this.extractEntities(message),
          actionType: action
        }
      }
    }
    
    // Questions
    const questionWords = language === 'fr' 
      ? ['quoi', 'comment', 'où', 'quand', 'pourquoi', 'combien', 'quel']
      : ['what', 'how', 'where', 'when', 'why', 'how much', 'which']
    
    if (questionWords.some(qw => lowerMessage.includes(qw))) {
      return { type: 'question', confidence: 0.7, entities: this.extractEntities(message) }
    }
    
    return { type: 'general', confidence: 0.5, entities: [] }
  }

  private extractEntities(message: string): string[] {
    const entities: string[] = []
    
    // Numéros de suivi
    const trackingNumbers = message.match(/[A-Z]{2,3}[0-9]{6,}/g)
    if (trackingNumbers) entities.push(...trackingNumbers)
    
    // Références factures
    const invoiceRefs = message.match(/F-[0-9]{4}-[0-9]+/g)
    if (invoiceRefs) entities.push(...invoiceRefs)
    
    // Emails
    const emails = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g)
    if (emails) entities.push(...emails)
    
    return entities
  }

  private async handleDocumentationIntent(message: string, language: 'fr' | 'en'): Promise<UniversalChatbotResponse> {
    const sections = language === 'fr' ? [
      '📦 Suivi d\'un colis',
      '💰 Factures (consulter/télécharger)',
      '👤 Inscription & Connexion',
      '📋 Créer un devis',
      '❓ Autre question'
    ] : [
      '📦 Track a package',
      '💰 Invoices (view/download)',
      '👤 Registration & Login',
      '📋 Create a quote',
      '❓ Other question'
    ]

    const welcomeMsg = language === 'fr' 
      ? '📚 **Documentation NextMove Cargo**\n\nChoisissez une section :'
      : '📚 **NextMove Cargo Documentation**\n\nChoose a section:'

    return {
      message: welcomeMsg,
      suggestions: sections,
      actions: [
        { type: 'documentation_section', label: sections[0], data: { section: 'tracking' } },
        { type: 'documentation_section', label: sections[1], data: { section: 'invoices' } },
        { type: 'documentation_section', label: sections[2], data: { section: 'account' } },
        { type: 'documentation_section', label: sections[3], data: { section: 'quote' } },
        { type: 'documentation_section', label: sections[4], data: { section: 'general' } }
      ],
      language,
      confidence: 0.9
    }
  }

  private async handleActionIntent(
    message: string, 
    intent: any, 
    context: ChatContext | null, 
    language: 'fr' | 'en'
  ): Promise<UniversalChatbotResponse> {
    const { actionType, entities } = intent
    
    // Mapping des actions vers les tools
    const toolMapping: Record<string, string> = {
      'register': 'register',
      'login': 'login', 
      'track': 'track_shipment',
      'invoice': 'download_invoice',
      'quote': 'create_quote'
    }
    
    const toolName = toolMapping[actionType]
    if (!toolName) {
      return this.handleGeneralIntent(message, context, [], language)
    }
    
    // Extraction automatique des paramètres depuis les entités
    const params = this.extractToolParameters(toolName, entities, message)
    
    // Vérifier si tous les paramètres requis sont présents
    const tool = this.tools.getToolDescription(toolName)
    const missingParams = this.getMissingParameters(tool, params)
    
    if (missingParams.length > 0) {
      const promptMsg = language === 'fr'
        ? `Pour ${actionType === 'track' ? 'suivre votre colis' : 'continuer'}, j'ai besoin de :`
        : `To ${actionType === 'track' ? 'track your package' : 'continue'}, I need:`
      
      return {
        message: `${promptMsg}\n${missingParams.map(p => `• ${p}`).join('\n')}`,
        suggestions: this.generateParameterSuggestions(toolName, missingParams, language),
        language,
        confidence: 0.8
      }
    }
    
    // Exécuter le tool
    const result = await this.tools.executeTool(toolName, params)
    
    return {
      message: result.message,
      toolResults: [result],
      suggestions: this.generatePostActionSuggestions(actionType, language),
      actions: this.generatePostActionActions(actionType, result),
      language,
      confidence: result.success ? 0.9 : 0.6
    }
  }

  private async handleQuestionIntent(
    message: string,
    context: ChatContext | null,
    history: ChatMessage[],
    language: 'fr' | 'en'
  ): Promise<UniversalChatbotResponse> {
    // 1. Recherche RAG d'abord
    const ragResponse = await this.ragKB.generateRAGResponse(message)
    
    if (ragResponse && ragResponse.confidence >= 0.62) {
      // Améliorer la réponse avec OpenAI si disponible
      let finalMessage = ragResponse.answer
      
      if (!this.isDemo && this.openai) {
        try {
          const enhancedResponse = await this.enhanceWithOpenAI(message, ragResponse.answer, language)
          finalMessage = enhancedResponse
        } catch (error) {
          console.error('Erreur amélioration OpenAI:', error)
        }
      }
      
      return {
        message: finalMessage,
        sources: ragResponse.sources,
        suggestions: this.generateQuestionSuggestions(message, language),
        language,
        confidence: ragResponse.confidence
      }
    }
    
    // 2. Fallback vers réponse contextuelle ou OpenAI
    if (context) {
      const contextualResponse = this.generateContextualResponse(message, context, language)
      if (contextualResponse) {
        return contextualResponse
      }
    }
    
    // 3. Réponse OpenAI pure si disponible
    if (!this.isDemo && this.openai) {
      try {
        const openaiResponse = await this.generateOpenAIResponse(message, history, language)
        return openaiResponse
      } catch (error) {
        console.error('Erreur OpenAI:', error)
      }
    }
    
    // 4. Réponse par défaut
    const noInfoMsg = language === 'fr'
      ? "Je n'ai pas d'information fiable à ce sujet. Puis-je vous aider autrement ?"
      : "I don't have reliable information about this. Can I help you with something else?"
    
    return {
      message: noInfoMsg,
      suggestions: this.generateFallbackSuggestions(language),
      actions: [
        { type: 'contact_agent', label: language === 'fr' ? '💬 Contacter le support' : '💬 Contact support', data: {} }
      ],
      language,
      confidence: 0.3
    }
  }

  private async handleGeneralIntent(
    message: string,
    context: ChatContext | null,
    history: ChatMessage[],
    language: 'fr' | 'en'
  ): Promise<UniversalChatbotResponse> {
    // Salutations personnalisées
    if (this.isGreeting(message, language)) {
      if (context) {
        const greeting = ChatContextService.generateContextualGreeting(context)
        return {
          message: greeting,
          language,
          confidence: 0.9
        }
      }
    }

    // Réponses conversationnelles pour les questions générales
    const lowerMessage = message.toLowerCase()
    
    // Réponses à "tu vas bien" et variations
    if (lowerMessage.includes('tu vas bien') || lowerMessage.includes('ça va') || lowerMessage.includes('comment vas-tu')) {
      const casualResponses = [
        "Ça va très bien, merci ! 😊 Et vous, comment ça se passe de votre côté ?",
        "Tout va bien par ici ! 👍 Merci de demander. Comment puis-je vous aider aujourd'hui ?",
        "Je vais très bien, merci beaucoup ! 😄 Et vous, tout se passe bien avec vos expéditions ?",
        "Ça roule ! 🚀 Merci de prendre des nouvelles. Que puis-je faire pour vous ?"
      ]
      
      const randomResponse = casualResponses[Math.floor(Math.random() * casualResponses.length)]
      
      return {
        message: randomResponse,
        language,
        confidence: 0.9
      }
    }

    // Explication du concept de la plateforme
    if (lowerMessage.includes('concept') || lowerMessage.includes('plateforme') || lowerMessage.includes('nextmove') || 
        lowerMessage.includes('expliquer') || lowerMessage.includes('présenter') || lowerMessage.includes('c\'est quoi')) {
      
      const platformExplanation = `Ah parfait ! 🌟 Laissez-moi vous expliquer NextMove Cargo !

🚢 **NextMove Cargo** est votre plateforme de logistique spécialisée dans les échanges **Chine ↔ Afrique**.

**🎯 Notre mission :**
• Simplifier vos expéditions entre la Chine et l'Afrique
• Vous faire économiser temps et argent
• Vous accompagner à chaque étape

**📦 Nos services :**
• **Transport maritime & aérien** (groupage et conteneur complet)
• **Dédouanement** et formalités administratives
• **Suivi en temps réel** de vos colis
• **Assurance cargo** pour protéger vos marchandises
• **Stockage temporaire** dans nos entrepôts

**🌍 Nos routes principales :**
• Chine → Sénégal, Côte d'Ivoire, Mali, Burkina Faso...
• Tarifs compétitifs et délais maîtrisés

**💡 Pourquoi nous choisir ?**
• 15+ ans d'expérience Chine-Afrique
• Équipe bilingue (français/chinois)
• Technologie moderne (cette plateforme !)
• Support 24/7 (c'est moi ! 😄)

Des questions sur un service en particulier ?`

      return {
        message: platformExplanation,
        language,
        confidence: 0.95
      }
    }
    
    // Réponse générale avec raccourcis
    const welcomeMsg = language === 'fr'
      ? `Salut ! 👋\n\nJe suis Amadou, votre assistant NextMove Cargo. Comment puis-je vous aider aujourd'hui ?`
      : `Hello! 👋\n\nI'm Amadou, your NextMove Cargo assistant. How can I help you today?`
    
    return {
      message: welcomeMsg,
      language,
      confidence: 0.7
    }
  }

  private extractToolParameters(toolName: string, entities: string[], message: string): any {
    const params: any = {}
    
    switch (toolName) {
      case 'track_shipment':
        const trackingNumber = entities.find(e => /^[A-Z]{2,3}[0-9]{6,}$/.test(e))
        if (trackingNumber) params.shipment_id = trackingNumber
        break
        
      case 'download_invoice_pdf':
        const invoiceRef = entities.find(e => /^F-[0-9]{4}-[0-9]+$/.test(e))
        if (invoiceRef) params.invoice_no = invoiceRef
        break
        
      case 'login_user':
        const email = entities.find(e => /@/.test(e))
        if (email) params.email = email
        break
    }
    
    return params
  }

  private getMissingParameters(tool: any, params: any): string[] {
    if (!tool) return []
    
    const missing: string[] = []
    for (const [key, config] of Object.entries(tool.parameters)) {
      const configTyped = config as any
      if (configTyped.required && (!params || params[key] === undefined)) {
        missing.push(configTyped.description || key)
      }
    }
    
    return missing
  }

  private async enhanceWithOpenAI(question: string, ragAnswer: string, language: 'fr' | 'en'): Promise<string> {
    const systemPrompt = language === 'fr'
      ? `Tu es Amadou, l'assistant NextMove Cargo. Tu es chaleureux et conversationnel. Améliore cette réponse pour qu'elle soit plus naturelle et humaine. Utilise des expressions comme "Ah oui !", "Bien sûr !", "Je vois", etc. Garde le même contenu factuel mais rends-la plus amicale et moins robotique.`
      : `You are Amadou, the NextMove Cargo assistant. You are warm and conversational. Enhance this response to make it more natural and human. Use expressions like "Oh yes!", "Of course!", "I see", etc. Keep the same factual content but make it more friendly and less robotic.`
    
    const completion = await this.openai!.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Question: ${question}\n\nRéponse à améliorer: ${ragAnswer}` }
      ],
      temperature: 0.8,
      max_tokens: 500
    })
    
    return completion.choices[0]?.message?.content || ragAnswer
  }

  private async generateOpenAIResponse(
    message: string,
    history: ChatMessage[],
    language: 'fr' | 'en'
  ): Promise<UniversalChatbotResponse> {
    const systemPrompt = language === 'fr'
      ? `Tu es Amadou, l'assistant IA NextMove Cargo, expert en logistique Chine-Afrique. Tu es chaleureux, amical et conversationnel comme un vrai humain. Tu utilises un langage naturel, des expressions familières et tu montres de l'empathie. Tu peux dire "Ah oui !", "Bien sûr !", "Je vois", "Parfait !" etc. Tu réponds comme si tu parlais à un ami tout en restant professionnel. Évite les réponses trop formelles ou robotiques.`
      : `You are Amadou, the NextMove Cargo AI assistant, expert in China-Africa logistics. You are warm, friendly and conversational like a real human. You use natural language, familiar expressions and show empathy. You can say "Oh yes!", "Of course!", "I see", "Perfect!" etc. You respond as if talking to a friend while remaining professional. Avoid overly formal or robotic responses.`
    
    const completion = await this.openai!.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-5),
        { role: 'user', content: message }
      ],
      temperature: 0.8,
      max_tokens: 800
    })
    
    const response = completion.choices[0]?.message?.content || ''
    
    return {
      message: response,
      language,
      confidence: 0.8
    }
  }

  private generateContextualResponse(message: string, context: ChatContext, language: 'fr' | 'en'): UniversalChatbotResponse | null {
    // Utiliser la logique existante du chatbot contextuel
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('expédition') || lowerMessage.includes('colis')) {
      const shipmentInfo = context.activeShipments.length > 0
        ? context.activeShipments[0]
        : null
      
      if (shipmentInfo) {
        const msg = language === 'fr'
          ? `📦 Votre expédition ${shipmentInfo.trackingNumber} (${shipmentInfo.origin}→${shipmentInfo.destination}) est actuellement ${shipmentInfo.status}.`
          : `📦 Your shipment ${shipmentInfo.trackingNumber} (${shipmentInfo.origin}→${shipmentInfo.destination}) is currently ${shipmentInfo.status}.`
        
        return {
          message: msg,
          suggestions: this.generateShipmentSuggestions(language),
          language,
          confidence: 0.9
        }
      }
    }
    
    return null
  }

  private isGreeting(message: string, language: 'fr' | 'en'): boolean {
    const greetings = language === 'fr'
      ? ['bonjour', 'salut', 'hello', 'bonsoir']
      : ['hello', 'hi', 'good morning', 'good afternoon']
    
    return greetings.some(g => message.toLowerCase().includes(g))
  }

  // Méthodes de génération de suggestions
  private generateHomeSuggestions(language: 'fr' | 'en'): string[] {
    return language === 'fr' ? [
      'Suivre mes colis',
      'Voir mes factures', 
      'Créer un devis',
      'Documentation'
    ] : [
      'Track my packages',
      'View my invoices',
      'Create a quote', 
      'Documentation'
    ]
  }

  private generateHomeActions(language: 'fr' | 'en'): any[] {
    const labels = language === 'fr' ? {
      register: '👤 Inscription',
      login: '🔑 Connexion',
      track: '📦 Suivre mes colis',
      invoices: '💰 Voir mes factures',
      quote: '📋 Créer un devis',
      docs: '📚 Documentation'
    } : {
      register: '👤 Registration',
      login: '🔑 Login',
      track: '📦 Track packages',
      invoices: '💰 View invoices',
      quote: '📋 Create quote',
      docs: '📚 Documentation'
    }

    return [
      { type: 'register', label: labels.register, data: {} },
      { type: 'login', label: labels.login, data: {} },
      { type: 'track', label: labels.track, data: {} },
      { type: 'invoices', label: labels.invoices, data: {} },
      { type: 'quote', label: labels.quote, data: {} },
      { type: 'documentation', label: labels.docs, data: {} }
    ]
  }

  private generateQuestionSuggestions(message: string, language: 'fr' | 'en'): string[] {
    return language === 'fr' ? [
      'Incoterms supportés',
      'Zones desservies',
      'Assurance cargo',
      'Documents douaniers'
    ] : [
      'Supported Incoterms',
      'Service areas',
      'Cargo insurance',
      'Customs documents'
    ]
  }

  private generateFallbackSuggestions(language: 'fr' | 'en'): string[] {
    return language === 'fr' ? [
      'Reformuler la question',
      'Contacter le support',
      'Voir la documentation',
      'Retour à l\'accueil'
    ] : [
      'Rephrase the question',
      'Contact support',
      'View documentation',
      'Back to home'
    ]
  }

  private generateParameterSuggestions(toolName: string, missingParams: string[], language: 'fr' | 'en'): string[] {
    // Suggestions contextuelles selon le tool et les paramètres manquants
    if (toolName === 'track_shipment') {
      return language === 'fr' ? ['DKR240815', 'ABJ240820'] : ['DKR240815', 'ABJ240820']
    }
    
    return []
  }

  private generatePostActionSuggestions(actionType: string, language: 'fr' | 'en'): string[] {
    const suggestions: Record<string, Record<string, string[]>> = {
      'fr': {
        'track': ['Voir détails complets', 'Contacter transporteur', 'Signaler un problème'],
        'invoice': ['Voir mes factures', 'Demander support comptable', 'Télécharger autres docs'],
        'quote': ['Modifier ce devis', 'Créer nouvel envoi', 'Comparer tarifs']
      },
      'en': {
        'track': ['View full details', 'Contact carrier', 'Report issue'],
        'invoice': ['View my invoices', 'Request accounting support', 'Download other docs'],
        'quote': ['Modify this quote', 'Create new shipment', 'Compare rates']
      }
    }
    
    return suggestions[language]?.[actionType] || []
  }

  private generatePostActionActions(actionType: string, result: ToolExecutionResult): any[] {
    const actions = []
    
    if (actionType === 'track' && result.success) {
      actions.push(
        { type: 'view_shipment', label: '📋 Détails complets', data: result.data },
        { type: 'download_documents', label: '📄 Documents', data: result.data }
      )
    }
    
    if (actionType === 'invoice' && result.success) {
      actions.push(
        { type: 'download_pdf', label: '📥 Télécharger PDF', data: result.data }
      )
    }
    
    return actions
  }

  private generateShipmentSuggestions(language: 'fr' | 'en'): string[] {
    return language === 'fr' ? [
      'Détails du suivi',
      'Documents de transport',
      'Contacter transporteur'
    ] : [
      'Tracking details',
      'Transport documents', 
      'Contact carrier'
    ]
  }
}
