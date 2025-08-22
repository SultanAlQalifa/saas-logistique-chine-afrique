/**
 * NextMove AI - Version simplifiée pour intégration rapide
 * Interface IA intelligente avec réponses contextuelles
 */

export interface SimpleAIResponse {
  message: string
  ctas?: Array<{ text: string; action: string }>
  confidence?: number
}

export class NextMoveAISimple {
  private knowledgeBase = {
    greetings: [
      "👋 Bonjour ! Je suis NextMove AI, votre assistant logistique intelligent. Comment puis-je vous aider aujourd'hui ?",
      "🌟 Salut ! Je suis là pour vous accompagner dans tous vos besoins logistiques. Que puis-je faire pour vous ?",
      "🚀 Bienvenue ! NextMove AI à votre service pour optimiser vos expéditions Chine-Afrique."
    ],
    
    tracking: {
      patterns: ['suiv', 'track', 'colis', 'package', 'livraison', 'où est'],
      responses: [
        "📦 Pour suivre votre colis, donnez-moi votre numéro de suivi (format: NM-XXXXXXXX) et je vous fournirai toutes les informations en temps réel.",
        "🔍 Je peux vous aider à localiser votre expédition ! Partagez-moi votre code de suivi NextMove.",
        "📍 Suivi en temps réel disponible ! Quel est votre numéro de tracking ?"
      ]
    },
    
    pricing: {
      patterns: ['prix', 'tarif', 'coût', 'combien', 'devis', 'quote'],
      responses: [
        "💰 Pour un devis personnalisé, j'ai besoin de connaître : origine, destination, poids/dimensions et mode de transport souhaité.",
        "📊 Nos tarifs varient selon le mode (aérien/maritime), le volume et la destination. Voulez-vous un calcul instantané ?",
        "💵 Je peux vous proposer les meilleures options tarifaires ! Décrivez-moi votre expédition."
      ]
    },
    
    pod: {
      patterns: ['preuve', 'livraison', 'reçu', 'signature', 'pod', 'proof'],
      responses: [
        "📋 Nos preuves de livraison incluent signature électronique, photo géolocalisée et reçu automatique. Quel colis vous intéresse ?",
        "✅ Toutes nos livraisons sont sécurisées avec POD digitale. Donnez-moi votre numéro de suivi pour les détails.",
        "📸 Preuve de livraison complète disponible : signature + photo + géolocalisation. Numéro de colis ?"
      ]
    },
    
    invoice: {
      patterns: ['facture', 'invoice', 'paiement', 'payment', 'bill'],
      responses: [
        "🧾 Je peux vous aider avec vos factures ! Souhaitez-vous consulter, télécharger ou avoir des informations sur un paiement ?",
        "💳 Gestion complète de vos factures disponible. Que recherchez-vous exactement ?",
        "📄 Accès à toutes vos factures et historique de paiements. Comment puis-je vous assister ?"
      ]
    },
    
    support: {
      patterns: ['aide', 'help', 'problème', 'issue', 'support', 'agent'],
      responses: [
        "🎧 Notre équipe support est disponible 24/7 ! Décrivez-moi votre problème ou souhaitez-vous parler directement à un conseiller ?",
        "👨‍💼 Je peux résoudre la plupart des questions ou vous mettre en contact avec un expert humain. Que préférez-vous ?",
        "🆘 Support immédiat disponible ! Expliquez-moi votre situation ou demandez un agent humain."
      ]
    }
  }

  /**
   * Génère une salutation personnalisée
   */
  generateGreeting(): SimpleAIResponse {
    const greeting = this.knowledgeBase.greetings[Math.floor(Math.random() * this.knowledgeBase.greetings.length)]
    
    return {
      message: greeting,
      ctas: [
        { text: "📦 Suivre un colis", action: "track_package" },
        { text: "💰 Demander un devis", action: "pricing_info" },
        { text: "🎫 Créer un ticket", action: "create_ticket" },
        { text: "👨‍💼 Agent humain", action: "human_contact" }
      ],
      confidence: 1.0
    }
  }

  /**
   * Traite un message utilisateur avec intelligence contextuelle
   */
  processMessage(message: string): SimpleAIResponse {
    const input = message.toLowerCase().trim()
    
    // Détection d'intention par mots-clés
    if (this.matchesPattern(input, this.knowledgeBase.tracking.patterns)) {
      return this.handleTracking(input)
    }
    
    if (this.matchesPattern(input, this.knowledgeBase.pricing.patterns)) {
      return this.handlePricing(input)
    }
    
    if (this.matchesPattern(input, this.knowledgeBase.pod.patterns)) {
      return this.handlePOD(input)
    }
    
    if (this.matchesPattern(input, this.knowledgeBase.invoice.patterns)) {
      return this.handleInvoice(input)
    }
    
    if (this.matchesPattern(input, this.knowledgeBase.support.patterns)) {
      return this.handleSupport(input)
    }
    
    // Détection de numéro de suivi
    if (this.isTrackingNumber(input)) {
      return this.handleTrackingNumber(input)
    }
    
    // Salutations
    if (this.matchesPattern(input, ['bonjour', 'salut', 'hello', 'hi', 'bonsoir'])) {
      return {
        message: "👋 Ravi de vous revoir ! Comment puis-je vous aider aujourd'hui ?",
        ctas: [
          { text: "📦 Suivi de colis", action: "track_package" },
          { text: "💰 Tarification", action: "pricing_info" },
          { text: "🎧 Support", action: "human_contact" }
        ],
        confidence: 0.9
      }
    }
    
    // Remerciements
    if (this.matchesPattern(input, ['merci', 'thanks', 'thank you'])) {
      return {
        message: "😊 De rien ! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider !",
        ctas: [
          { text: "🚀 Autre question", action: "new_question" },
          { text: "📞 Contact support", action: "human_contact" }
        ],
        confidence: 0.9
      }
    }
    
    // Réponse par défaut intelligente
    return this.handleDefault(input)
  }

  private matchesPattern(input: string, patterns: string[]): boolean {
    return patterns.some(pattern => input.includes(pattern))
  }

  private isTrackingNumber(input: string): boolean {
    // Format NextMove: NM-XXXXXXXX ou similaire
    return /nm-\w{8}|nm\w{8}|\w{2}-\w{8}|\w{10,}/i.test(input)
  }

  private handleTracking(input: string): SimpleAIResponse {
    const response = this.knowledgeBase.tracking.responses[Math.floor(Math.random() * this.knowledgeBase.tracking.responses.length)]
    
    return {
      message: response,
      ctas: [
        { text: "📝 Saisir numéro", action: "enter_tracking" },
        { text: "📱 Scanner QR", action: "scan_qr" },
        { text: "📞 Aide support", action: "human_contact" }
      ],
      confidence: 0.85
    }
  }

  private handleTrackingNumber(input: string): SimpleAIResponse {
    // Extraction du numéro de suivi
    const trackingMatch = input.match(/nm-\w{8}|nm\w{8}|\w{2}-\w{8}|\w{10,}/i)
    const trackingNumber = trackingMatch ? trackingMatch[0].toUpperCase() : input.toUpperCase()
    
    return {
      message: `🔍 Recherche en cours pour le colis ${trackingNumber}...\n\n📦 **Statut**: En transit\n📍 **Position**: Douanes Dakar\n🚚 **Prochaine étape**: Livraison prévue demain\n⏰ **Dernière MAJ**: Il y a 2h`,
      ctas: [
        { text: "📱 Notifications SMS", action: "enable_sms" },
        { text: "📋 Preuve livraison", action: "pod_info" },
        { text: "📞 Contacter transporteur", action: "contact_carrier" }
      ],
      confidence: 0.9
    }
  }

  private handlePricing(input: string): SimpleAIResponse {
    const response = this.knowledgeBase.pricing.responses[Math.floor(Math.random() * this.knowledgeBase.pricing.responses.length)]
    
    return {
      message: response,
      ctas: [
        { text: "🧮 Calculateur rapide", action: "price_calculator" },
        { text: "📊 Comparer modes", action: "compare_modes" },
        { text: "💬 Devis personnalisé", action: "custom_quote" }
      ],
      confidence: 0.8
    }
  }

  private handlePOD(input: string): SimpleAIResponse {
    const response = this.knowledgeBase.pod.responses[Math.floor(Math.random() * this.knowledgeBase.pod.responses.length)]
    
    return {
      message: response,
      ctas: [
        { text: "📋 Voir POD", action: "view_pod" },
        { text: "📧 Envoyer par email", action: "email_pod" },
        { text: "📱 Télécharger PDF", action: "download_pod" }
      ],
      confidence: 0.85
    }
  }

  private handleInvoice(input: string): SimpleAIResponse {
    const response = this.knowledgeBase.invoice.responses[Math.floor(Math.random() * this.knowledgeBase.invoice.responses.length)]
    
    return {
      message: response,
      ctas: [
        { text: "📄 Mes factures", action: "view_invoices" },
        { text: "💳 Statut paiement", action: "payment_status" },
        { text: "📧 Renvoyer facture", action: "resend_invoice" }
      ],
      confidence: 0.8
    }
  }

  private handleSupport(input: string): SimpleAIResponse {
    const response = this.knowledgeBase.support.responses[Math.floor(Math.random() * this.knowledgeBase.support.responses.length)]
    
    return {
      message: response,
      ctas: [
        { text: "🎫 Créer ticket", action: "create_ticket" },
        { text: "💬 Chat direct", action: "live_chat" },
        { text: "📞 Appel urgent", action: "urgent_call" }
      ],
      confidence: 0.9
    }
  }

  private handleDefault(input: string): SimpleAIResponse {
    const suggestions = [
      "🤔 Je comprends votre demande. Pouvez-vous être plus spécifique ?",
      "💡 Je peux vous aider avec le suivi, les tarifs, les factures ou le support. Que souhaitez-vous ?",
      "🎯 Pour mieux vous assister, précisez si c'est pour un suivi de colis, un devis ou une question support."
    ]
    
    const message = suggestions[Math.floor(Math.random() * suggestions.length)]
    
    return {
      message,
      ctas: [
        { text: "📦 Suivi colis", action: "track_package" },
        { text: "💰 Devis", action: "pricing_info" },
        { text: "🎧 Support", action: "human_contact" },
        { text: "🚀 Chatbot complet", action: "open_full_chat" }
      ],
      confidence: 0.6
    }
  }

  /**
   * Valide un numéro de suivi NextMove
   */
  validateTrackingCode(code: string): boolean {
    return /^NM-[A-Z0-9]{8}$/i.test(code)
  }

  /**
   * Génère un message d'escalade vers un humain
   */
  escalateToHuman(reason?: string): SimpleAIResponse {
    return {
      message: `👨‍💼 Je vous mets en contact avec un conseiller humain${reason ? ` pour : ${reason}` : ''}.\n\n⏱️ **Temps d'attente estimé** : 2-3 minutes\n🌍 **Support disponible** : 24/7 en français et anglais`,
      ctas: [
        { text: "📞 Appel immédiat", action: "request_call" },
        { text: "💬 Chat prioritaire", action: "priority_chat" },
        { text: "📧 Email support", action: "email_support" }
      ],
      confidence: 1.0
    }
  }
}

// Instance singleton
export const nextMoveAI = new NextMoveAISimple()
