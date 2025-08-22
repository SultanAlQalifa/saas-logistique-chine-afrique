import OpenAI from 'openai'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

// Fonction pour récupérer la configuration IA depuis l'API
async function getAIConfig() {
  try {
    // Try to get config from ConfigManager first (server-side)
    if (typeof window === 'undefined') {
      try {
        const { ConfigManager } = await import('@/lib/config-manager')
        const config = await ConfigManager.getAIConfig()
        if (config) {
          console.log('Configuration IA récupérée via ConfigManager:', { hasApiKey: !!config.openaiApiKey })
          return config
        }
      } catch (error) {
        console.warn('Erreur lors de la récupération via ConfigManager:', error)
      }
    }

    // Fallback to API call
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/ai-config`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Configuration IA récupérée via API:', data)
      return data.config
    } else {
      console.warn('Erreur HTTP lors de la récupération de la config IA:', response.status)
    }
  } catch (error) {
    console.warn('Impossible de récupérer la configuration IA:', error)
  }
  
  // Return default config with environment variable
  const envApiKey = process.env.OPENAI_API_KEY
  return {
    openaiApiKey: envApiKey && envApiKey.startsWith('sk-') ? envApiKey : '',
    gpt5Enabled: true,
    gpt5Model: 'gpt-4o',
    maxTokens: 4096,
    temperature: 0.7,
    systemPrompt: 'Vous êtes un assistant IA spécialisé en logistique Chine-Afrique.',
    autoResponse: true,
    responseDelay: 1000,
    fallbackModel: 'gpt-4o',
    contextWindow: 128000,
    streamingEnabled: true
  }
}

export class OpenAIService {
  private static instance: OpenAIService
  private client: OpenAI | null | string

  private constructor() {
    this.client = null
    this.initializeClient()
  }

  private async initializeClient() {
    const config = await getAIConfig()
    console.log('Initialisation client OpenAI avec config:', config) // Debug
    if (config.openaiApiKey && config.openaiApiKey !== '' && config.openaiApiKey.startsWith('sk-')) {
      try {
        this.client = new OpenAI({ apiKey: config.openaiApiKey })
        console.log('Client OpenAI initialisé avec succès') // Debug
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du client OpenAI:', error)
        this.client = null
      }
    } else {
      console.warn('Clé API OpenAI manquante ou invalide:', config.openaiApiKey) // Debug
    }
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService()
    }
    return OpenAIService.instance
  }

  // Méthode pour réinitialiser le client avec une nouvelle clé API
  public async updateApiKey(apiKey: string) {
    if (apiKey && apiKey.startsWith('sk-')) {
      try {
        this.client = new OpenAI({ apiKey })
        console.log('Client OpenAI mis à jour avec nouvelle clé API')
        return true
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la clé API:', error)
        this.client = null
        return false
      }
    }
    return false
  }

  /**
   * Generate a chat completion using OpenAI GPT
   */
  async generateChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    if (!this.client) {
      return this.generateProductionResponse(messages[messages.length - 1]?.content || '')
    }
    
    // Vérifier si le client est initialisé
    if (!this.client || typeof this.client === 'string') {
      return this.generateProductionResponse(messages[messages.length - 1]?.content || '')
    }
    
    try {
      const {
        model = 'gpt-4o',
        temperature = 0.7,
        maxTokens = 1000,
        systemPrompt
      } = options

      // Add system prompt if provided
      const finalMessages: ChatMessage[] = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages

      const completion = await (this.client as OpenAI).chat.completions.create({
        model,
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      })

      return completion.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'
    } catch (error) {
      console.error('OpenAI API Error:', error)
      
      // En cas d'erreur API (rate limit, modèle indisponible, etc.), utiliser les réponses de production
      const userMessage = messages[messages.length - 1]?.content || ''
      console.log('Fallback vers réponses de production pour:', userMessage)
      return this.generateProductionResponse(userMessage)
    }
  }

  /**
   * Generate production-ready streaming fallback for when OpenAI API is unavailable
   */
  private async *generateProductionStreamingFallback(userMessage: string): AsyncIterable<string> {
    const response = this.generateProductionResponse(userMessage)
    const words = response.split(' ')
    
    for (let i = 0; i < words.length; i++) {
      const chunk = i === 0 ? words[i] : ' ' + words[i]
      yield chunk
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  private generateProductionResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase().trim()
    
    // Messages très courts (cc, ok, etc.)
    if (lowerMessage.match(/^(cc|ok|d'accord|oui|non|merci|thanks)$/)) {
      return '👍 **Parfait !**\n\nY a-t-il autre chose que je puisse faire pour vous ?\n\n• 📦 Vérifier un suivi de colis\n• 💰 Obtenir un devis\n• 📞 Contacter un agent humain\n• ❓ Poser une question spécifique'
    }
    
    // Salutations
    if (lowerMessage.match(/^(bonjour|salut|hello|hi|bonsoir|cv|ça va|comment allez-vous)$/)) {
      return '👋 **Bonjour !** Je suis votre assistant NextMove Cargo.\n\n🎯 **Comment puis-je vous aider aujourd\'hui ?**\n\n• 📦 **Suivi de colis** - Vérifiez où se trouve votre envoi\n• 💰 **Devis personnalisé** - Calculez vos frais de transport\n• ⏰ **Délais de livraison** - Planifiez vos expéditions\n• 📋 **Documentation** - Préparez vos papiers d\'exportation\n• 🌍 **Zones couvertes** - Découvrez nos destinations\n\nTapez simplement votre question ou choisissez un sujet !'
    }
    
    // Suivi de colis
    if (lowerMessage.includes('suivi') || lowerMessage.includes('track') || lowerMessage.includes('colis') || lowerMessage.includes('co-')) {
      return '🚚 **Suivi de colis NextMove Cargo**\n\nPour suivre votre colis :\n\n1️⃣ **Saisissez votre numéro** (ex: CO-001234)\n2️⃣ **Consultez le statut** en temps réel\n3️⃣ **Recevez des notifications** automatiques\n\n📍 **Statuts possibles** :\n• En préparation (Chine)\n• Expédié (en transit)\n• Arrivé au port (dédouanement)\n• En livraison\n• Livré\n\n💡 Donnez-moi votre numéro de suivi pour plus de détails !'
    }
    
    // Tarifs et prix
    if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('devis')) {
      return '💰 **Tarification NextMove Cargo**\n\n📊 **Facteurs de prix** :\n• Poids et dimensions\n• Destination en Afrique\n• Mode de transport\n• Services additionnels\n\n🚢 **Maritime** (économique) :\n• 5kg → Sénégal : 25 000 FCFA\n• 10kg → Côte d\'Ivoire : 35 000 FCFA\n• 20kg → Mali : 55 000 FCFA\n\n✈️ **Aérien** (rapide) :\n• 5kg → Sénégal : 45 000 FCFA\n• 10kg → Côte d\'Ivoire : 75 000 FCFA\n\n🎯 **Demandez un devis personnalisé** pour vos besoins spécifiques !'
    }
    
    // Délais de livraison
    if (lowerMessage.includes('délai') || lowerMessage.includes('livraison') || lowerMessage.includes('temps') || lowerMessage.includes('combien')) {
      return '⏰ **Délais de livraison NextMove Cargo**\n\n🚢 **Transport Maritime** :\n• Chine → Sénégal : 20-25 jours\n• Chine → Côte d\'Ivoire : 22-27 jours\n• Chine → Mali : 25-30 jours\n• Chine → Burkina Faso : 25-30 jours\n\n✈️ **Transport Aérien** :\n• Chine → Sénégal : 5-7 jours\n• Chine → Côte d\'Ivoire : 6-8 jours\n• Chine → Mali : 8-10 jours\n\n⚠️ *Délais indicatifs hors formalités douanières et jours fériés*'
    }
    
    // Documentation
    if (lowerMessage.includes('document') || lowerMessage.includes('douane') || lowerMessage.includes('papier') || lowerMessage.includes('formalité')) {
      return '📋 **Documents requis - NextMove Cargo**\n\n📤 **Pour expédier depuis la Chine** :\n• Facture commerciale (en anglais)\n• Liste de colisage détaillée\n• Certificat d\'origine (si requis)\n• Déclaration de valeur\n• Photos des produits\n\n📥 **Pour réceptionner en Afrique** :\n• Pièce d\'identité valide\n• Justificatif de domicile récent\n• Numéro de suivi NextMove\n• Preuve de paiement\n\n🤝 **Notre équipe vous accompagne** dans toutes les démarches administratives !'
    }
    
    // Contact et support
    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('aide') || lowerMessage.includes('agent') || lowerMessage.includes('humain')) {
      return '🤝 **Support NextMove Cargo**\n\n📞 **Téléphone** : +221 33 123 45 67\n⏰ Lun-Ven 8h-18h, Sam 9h-13h\n\n📧 **Email** : support@nextmovecargo.com\n⚡ Réponse sous 2h en moyenne\n\n💬 **WhatsApp** : +221 77 123 45 67\n🌍 Disponible 24h/24\n\n👨‍💼 **Souhaitez-vous que je vous transfère vers un agent humain ?**'
    }
    
    // Problèmes techniques
    if (lowerMessage.includes('problème') || lowerMessage.includes('erreur') || lowerMessage.includes('bug') || lowerMessage.includes('marche pas')) {
      return '🔧 **Support technique NextMove Cargo**\n\n🚨 **Problème détecté** - Je vous aide !\n\n📝 **Décrivez votre problème** :\n• Que faisiez-vous ?\n• Quel message d\'erreur avez-vous vu ?\n• Sur quelle page ?\n\n⚡ **Solutions rapides** :\n• Actualisez la page (F5)\n• Videz le cache navigateur\n• Vérifiez votre connexion\n\n👨‍💻 **Besoin d\'aide avancée ?** Je peux vous transférer vers notre équipe technique.'
    }
    
    return '🤖 **Assistant IA NextMove Cargo**\n\nJe suis là pour vous aider avec la logistique Chine-Afrique !\n\n🎯 **Mes spécialités** :\n• 📦 Suivi et gestion de colis\n• 💰 Calculs tarifaires personnalisés\n• ⏰ Planification des délais\n• 📋 Assistance documentaire\n• 🌍 Informations sur nos zones\n\n💡 **Astuce** : Soyez spécifique dans vos questions pour obtenir une aide personnalisée !\n\n❓ **Que puis-je faire pour vous aujourd\'hui ?**'
  }

  /**
   * Generate a streaming chat completion
   */
  async generateStreamingCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {}
  ): Promise<AsyncIterable<string>> {
    if (!this.client) {
      // Fallback pour streaming : retourner la réponse de production en chunks
      return this.generateProductionStreamingFallback(messages[messages.length - 1]?.content || '')
    }
    
    try {
      const {
        model = 'gpt-4o',
        temperature = 0.7,
        maxTokens = 1000,
        systemPrompt
      } = options

      const finalMessages: ChatMessage[] = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages

      const stream = await (this.client as OpenAI).chat.completions.create({
        model,
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      })

      return this.processStream(stream)
    } catch (error) {
      console.error('OpenAI Streaming Error:', error)
      throw new Error('Erreur lors de la génération de la réponse en streaming')
    }
  }

  private async * processStream(stream: any): AsyncIterable<string> {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  }

  /**
   * Generate logistics-specific responses
   */
  async generateLogisticsResponse(
    userMessage: string,
    context?: string
  ): Promise<string> {
    if (!this.client) {
      return this.generateProductionResponse(userMessage)
    }
    const systemPrompt = `Tu es un assistant IA spécialisé dans la logistique entre la Chine et l'Afrique pour NextMove Cargo. 
    
    Contexte de l'entreprise:
    - NextMove Cargo est une plateforme SaaS de logistique
    - Spécialisée dans les échanges commerciaux Chine-Afrique
    - Services: suivi de colis, gestion des expéditions, documentation douanière
    - Zones couvertes: Afrique de l'Ouest et Centrale, principalement depuis la Chine
    
    Instructions:
    - Réponds en français
    - Sois professionnel mais accessible
    - Fournis des informations précises sur la logistique
    - Propose des solutions concrètes
    - Mentionne les services NextMove Cargo quand pertinent
    - Si tu ne connais pas une information spécifique, recommande de contacter le support
    
    ${context ? `Contexte supplémentaire: ${context}` : ''}`

    const messages: ChatMessage[] = [
      { role: 'user', content: userMessage }
    ]

    try {
      return await this.generateChatCompletion(messages, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 800
      })
    } catch (error) {
      console.error('Erreur génération réponse logistique:', error)
      return this.generateProductionResponse(userMessage)
    }
  }

  /**
   * Generate FAQ responses
   */
  async generateFAQResponse(
    question: string,
    category?: string
  ): Promise<string> {
    if (!this.client) {
      return this.generateProductionResponse(question)
    }
    const systemPrompt = `Tu es un assistant pour la FAQ de NextMove Cargo. 
    
    Réponds aux questions fréquentes sur:
    - Suivi de colis
    - Délais de livraison
    - Frais de transport
    - Documentation nécessaire
    - Processus d'expédition
    - Zones de couverture
    
    Sois concis, précis et utile. Fournis des étapes claires quand nécessaire.
    ${category ? `Catégorie de la question: ${category}` : ''}`

    const messages: ChatMessage[] = [
      { role: 'user', content: question }
    ]

    try {
      return await this.generateChatCompletion(messages, {
        systemPrompt,
        temperature: 0.5,
        maxTokens: 500
      })
    } catch (error) {
      console.error('Erreur génération réponse FAQ:', error)
      return this.generateProductionResponse(question)
    }
  }

  /**
   * Analyze and categorize user messages
   */
  async categorizeMessage(message: string): Promise<{
    category: string
    intent: string
    confidence: number
  }> {
    if (!this.client) {
      return {
        category: 'general',
        intent: 'unknown',
        confidence: 0
      }
    }
    const systemPrompt = `Analyse le message de l'utilisateur et détermine:
    1. La catégorie (suivi, tarifs, documentation, support, général)
    2. L'intention (question, demande, plainte, compliment)
    3. Le niveau de confiance (0-1)
    
    Réponds uniquement en JSON avec cette structure:
    {
      "category": "string",
      "intent": "string", 
      "confidence": number
    }`

    const messages: ChatMessage[] = [
      { role: 'user', content: message }
    ]

    try {
      const response = await this.generateChatCompletion(messages, {
        systemPrompt,
        temperature: 0.3,
        maxTokens: 100
      })

      return JSON.parse(response)
    } catch (error) {
      return {
        category: 'général',
        intent: 'question',
        confidence: 0.5
      }
    }
  }
}

export default OpenAIService.getInstance()
