// Moteur de traitement NextMove AI Assistant
import { AI_ASSISTANT_CONFIG, AIContext, AIIntent, AIResponse } from './ai-assistant-config'
import { NextMoveAITools } from './ai-assistant-tools'

export class NextMoveAIEngine {
  private context: AIContext
  private locale: string

  constructor(context: AIContext) {
    this.context = context
    this.locale = context.user.locale || AI_ASSISTANT_CONFIG.language.default
  }

  // Détection d'intention basée sur les utterances
  detectIntent(message: string): AIIntent {
    const normalizedMessage = message.toLowerCase().trim()
    
    for (const intent of AI_ASSISTANT_CONFIG.nlu.intents) {
      for (const utterance of intent.utterances) {
        if (utterance === "*") continue // Catch-all, traité en dernier
        
        // Correspondance exacte ou pattern matching simple
        if (utterance.includes("*")) {
          const pattern = utterance.replace("*", ".*")
          const regex = new RegExp(pattern, "i")
          if (regex.test(normalizedMessage)) {
            return {
              name: intent.name,
              confidence: 0.8,
              slots: this.extractSlots(normalizedMessage, intent.slots || [])
            }
          }
        } else if (normalizedMessage.includes(utterance)) {
          return {
            name: intent.name,
            confidence: 0.9,
            slots: this.extractSlots(normalizedMessage, intent.slots || [])
          }
        }
      }
    }

    // Intention générale par défaut
    return {
      name: "general_qa",
      confidence: 0.3,
      slots: {}
    }
  }

  // Extraction simple des slots depuis le message
  private extractSlots(message: string, slotNames: string[]): Record<string, any> {
    const slots: Record<string, any> = {}
    
    // Extraction de code de tracking (pattern alphanumérique)
    if (slotNames.includes("tracking_code")) {
      const trackingMatch = message.match(/[A-Z0-9]{8,20}/i)
      if (trackingMatch) {
        slots.tracking_code = trackingMatch[0].toUpperCase()
      }
    }

    // Extraction de numéro de facture
    if (slotNames.includes("invoice_no")) {
      const invoiceMatch = message.match(/INV[-_]?\d{4}[-_]?\d{3}/i)
      if (invoiceMatch) {
        slots.invoice_no = invoiceMatch[0].toUpperCase()
      }
    }

    // Extraction de poids (kg)
    if (slotNames.includes("weight_kg")) {
      const weightMatch = message.match(/(\d+(?:\.\d+)?)\s*kg/i)
      if (weightMatch) {
        slots.weight_kg = parseFloat(weightMatch[1])
      }
    }

    // Extraction de volume (m³)
    if (slotNames.includes("volume_m3")) {
      const volumeMatch = message.match(/(\d+(?:\.\d+)?)\s*m[³3]/i)
      if (volumeMatch) {
        slots.volume_m3 = parseFloat(volumeMatch[1])
      }
    }

    return slots
  }

  // Traitement principal du message
  async processMessage(message: string): Promise<AIResponse> {
    try {
      // 1. Détection de l'intention
      const intent = this.detectIntent(message)

      // 2. Traitement selon l'intention
      switch (intent.name) {
        case "suivi_colis":
          return await this.handleTrackingIntent(intent)
        
        case "pod":
          return await this.handlePODIntent(intent)
        
        case "factures":
          return await this.handleInvoiceIntent(intent)
        
        case "devis":
          return await this.handleQuoteIntent(intent, message)
        
        case "paiement_fractionne":
          return await this.handleSplitPaymentIntent()
        
        case "notifications":
          return await this.handleNotificationsIntent()
        
        case "marketing_roi":
          return await this.handleMarketingROIIntent()
        
        case "support":
          return await this.handleSupportIntent(message)
        
        case "connexion":
          return await this.handleLoginIntent()
        
        case "inscription":
          return await this.handleRegistrationIntent()
        
        default:
          return await this.handleGeneralQuery(message)
      }
    } catch (error) {
      return {
        text: "Désolé, j'ai rencontré une erreur technique. Un conseiller peut vous aider si nécessaire.",
        actions: [
          { type: "escalate", label: "Parler à un humain", data: { context: message } }
        ]
      }
    }
  }

  // Gestionnaires d'intentions spécifiques
  private async handleTrackingIntent(intent: AIIntent): Promise<AIResponse> {
    const trackingCode = intent.slots.tracking_code
    
    if (!trackingCode) {
      return {
        text: "Quel est le numéro de suivi de votre colis ? (Format: 8-20 caractères avec lettres et chiffres)",
        actions: [
          { type: "input", label: "Saisir code de suivi", data: { field: "tracking_code" } }
        ]
      }
    }

    const result = await NextMoveAITools.track_shipment(trackingCode)
    
    if (result.success && result.shipment) {
      const shipment = result.shipment
      return {
        text: `📦 **${trackingCode}** - ${shipment.status}\n\n` +
              `🚢 ${shipment.origin} → ${shipment.destination}\n` +
              `📍 Position actuelle: ${shipment.current_location}\n` +
              `📅 ETA: ${shipment.eta}\n` +
              `📊 Progression: ${shipment.progress}%`,
        actions: [
          { type: "pod", label: "Voir POD", data: { tracking_code: trackingCode } },
          { type: "notifications", label: "Activer notifications", data: { tracking_code: trackingCode } },
          { type: "support", label: "Signaler un problème", data: { tracking_code: trackingCode } }
        ]
      }
    } else {
      return {
        text: `❌ ${result.error}\n\nVérifiez le format de votre code de suivi (8-20 caractères avec au moins 1 lettre et 1 chiffre).`,
        actions: [
          { type: "input", label: "Réessayer", data: { field: "tracking_code" } },
          { type: "support", label: "Aide au suivi", data: { issue: "tracking_not_found" } }
        ]
      }
    }
  }

  private async handlePODIntent(intent: AIIntent): Promise<AIResponse> {
    const trackingCode = intent.slots.tracking_code
    
    if (!trackingCode) {
      // Utiliser les expéditions récentes du contexte
      if (this.context.recent_shipments && this.context.recent_shipments.length > 0) {
        const recentShipments = this.context.recent_shipments
          .map(s => `• **${s.code}** → ${s.destination} (${s.status})`)
          .join('\n')
        
        return {
          text: `Vos expéditions récentes :\n${recentShipments}\n\nPour quelle expédition voulez-vous la POD ?`,
          actions: recentShipments.length > 0 ? [
            { type: "pod", label: `POD ${this.context.recent_shipments[0].code}`, data: { tracking_code: this.context.recent_shipments[0].code } }
          ] : []
        }
      } else {
        return {
          text: "Pour quelle expédition voulez-vous la preuve de livraison ?",
          actions: [
            { type: "input", label: "Code de suivi", data: { field: "tracking_code" } }
          ]
        }
      }
    }

    const result = await NextMoveAITools.get_pod(trackingCode)
    
    if (result.success && result.pod) {
      const pod = result.pod
      return {
        text: `✅ **Preuve de livraison disponible**\n\n` +
              `📦 Colis: ${trackingCode}\n` +
              `📅 Livré le: ${pod.delivery_date}\n` +
              `👤 Destinataire: ${pod.recipient_name}\n` +
              `📍 Lieu: ${pod.location.address}\n\n` +
              `✍️ Signature électronique ✓\n` +
              `📸 Photo de livraison ✓\n` +
              `📄 Reçu PDF disponible`,
        actions: [
          { type: "download", label: "Télécharger PDF", data: { url: pod.receipt_pdf_url } },
          { type: "whatsapp", label: "Envoyer par WhatsApp", data: { pod_id: trackingCode } },
          { type: "email", label: "Envoyer par email", data: { pod_id: trackingCode } }
        ]
      }
    } else {
      return {
        text: `❌ Aucune preuve de livraison trouvée pour ${trackingCode}.\n\nLe colis est peut-être encore en transit.`,
        actions: [
          { type: "track", label: "Suivre le colis", data: { tracking_code: trackingCode } },
          { type: "support", label: "Signaler un problème", data: { tracking_code: trackingCode } }
        ]
      }
    }
  }

  private async handleInvoiceIntent(intent: AIIntent): Promise<AIResponse> {
    const invoiceNo = intent.slots.invoice_no
    
    if (invoiceNo) {
      const result = await NextMoveAITools.download_invoice_pdf(invoiceNo)
      if (result.success) {
        return {
          text: `📄 Facture ${invoiceNo} prête au téléchargement`,
          actions: [
            { type: "download", label: "Télécharger PDF", data: { url: result.pdf_url } }
          ]
        }
      }
    }

    // Lister les factures
    const result = await NextMoveAITools.list_invoices()
    
    if (result.success && result.invoices) {
      const invoicesList = result.invoices
        .map(inv => `• **${inv.invoice_no}** - ${inv.amount.toLocaleString()} XOF (${inv.status})`)
        .join('\n')
      
      const pendingInvoices = result.invoices.filter(inv => inv.status === 'PENDING')
      
      return {
        text: `💰 **Vos factures**\n\n${invoicesList}`,
        actions: [
          ...(pendingInvoices.length > 0 ? [
            { type: "pay", label: `Payer ${pendingInvoices[0].invoice_no}`, data: { invoice_no: pendingInvoices[0].invoice_no } }
          ] : []),
          { type: "split_payment", label: "Paiement fractionné", data: {} }
        ]
      }
    } else {
      return {
        text: "❌ Aucune facture trouvée.",
        actions: [
          { type: "support", label: "Contacter le support", data: { issue: "invoices" } }
        ]
      }
    }
  }

  private async handleQuoteIntent(intent: AIIntent, message: string): Promise<AIResponse> {
    // Extraction d'informations depuis le message
    const originMatch = message.match(/(?:de|from)\s+([a-zA-Z\s,]+?)(?:\s+(?:vers|to|à))/i)
    const destMatch = message.match(/(?:vers|to|à)\s+([a-zA-Z\s,]+?)(?:\s|$)/i)
    
    const origin = originMatch?.[1]?.trim() || intent.slots.origin
    const destination = destMatch?.[1]?.trim() || intent.slots.destination
    const weight = intent.slots.weight_kg
    const volume = intent.slots.volume_m3

    if (!origin || !destination) {
      return {
        text: "Pour créer un devis, j'ai besoin de :\n• Ville de départ\n• Ville d'arrivée\n• Poids approximatif\n• Volume approximatif\n\nExemple: \"Devis de Guangzhou vers Dakar, 500kg, 2m³\"",
        actions: [
          { type: "quote_form", label: "Formulaire de devis", data: {} }
        ]
      }
    }

    if (!weight || !volume) {
      return {
        text: `Devis ${origin} → ${destination}\n\nJ'ai besoin du poids (kg) et volume (m³) de votre marchandise.`,
        actions: [
          { type: "input", label: "Préciser poids/volume", data: { origin, destination } }
        ]
      }
    }

    // Recommandation d'itinéraire
    const routeResult = await NextMoveAITools.recommend_route_and_price(origin, destination, weight, volume)
    
    if (routeResult.success) {
      const routes = routeResult.routes!
      const recommended = routes.find(r => r.mode === routeResult.recommended)!
      
      const routesList = routes
        .map(r => `• **${r.mode.toUpperCase()}** : ${r.price_xof.toLocaleString()} XOF · ${r.transit_days}j`)
        .join('\n')
      
      return {
        text: `🚚 **Devis ${origin} → ${destination}**\n` +
              `📦 ${weight}kg / ${volume}m³\n\n` +
              `${routesList}\n\n` +
              `👉 **Recommandé**: ${recommended.mode.toUpperCase()} (${routeResult.reason})`,
        actions: [
          { type: "create_quote", label: `Devis ${recommended.mode}`, data: { mode: recommended.mode, origin, destination, weight, volume } },
          { type: "compare", label: "Comparer tous les modes", data: { routes } },
          { type: "split_payment", label: "Paiement fractionné", data: {} }
        ]
      }
    } else {
      return {
        text: "❌ Erreur lors du calcul du devis. Veuillez réessayer ou contacter le support.",
        actions: [
          { type: "support", label: "Aide devis", data: { issue: "quote_calculation" } }
        ]
      }
    }
  }

  private async handleSplitPaymentIntent(): Promise<AIResponse> {
    if (!this.context.active_features?.includes("split_payments")) {
      return {
        text: "❌ Le paiement fractionné n'est pas activé sur votre compte.\n\nContactez votre gestionnaire de compte pour l'activer.",
        actions: [
          { type: "support", label: "Demander activation", data: { feature: "split_payments" } }
        ]
      }
    }

    return {
      text: "💳 **Paiement fractionné disponible**\n\n" +
            "Options :\n" +
            "• **30% à la commande** + 70% à la livraison\n" +
            "• **50% à la commande** + 50% à la POD validée\n" +
            "• **Personnalisé** selon vos besoins\n\n" +
            "Quelle option préférez-vous ?",
      actions: [
        { type: "split_payment", label: "30/70 à la livraison", data: { upfront: 30, trigger: "delivery" } },
        { type: "split_payment", label: "50/50 à la POD", data: { upfront: 50, trigger: "pod_validated" } },
        { type: "custom_split", label: "Personnalisé", data: {} }
      ]
    }
  }

  private async handleNotificationsIntent(): Promise<AIResponse> {
    const channels = AI_ASSISTANT_CONFIG.business_rules.notifications_multichannel.channels
    
    return {
      text: "🔔 **Configuration des notifications**\n\n" +
            "Canaux disponibles :\n" +
            channels.map(ch => `• ${ch.toUpperCase()}`).join('\n') + "\n\n" +
            "Recevez des alertes pour :\n" +
            "• Mises à jour de suivi\n" +
            "• Livraisons confirmées\n" +
            "• Factures dues\n" +
            "• Promotions personnalisées",
      actions: [
        { type: "notifications", label: "Activer WhatsApp", data: { channels: ["whatsapp"] } },
        { type: "notifications", label: "Activer SMS", data: { channels: ["sms"] } },
        { type: "notifications", label: "Tout activer", data: { channels } }
      ]
    }
  }

  private async handleMarketingROIIntent(): Promise<AIResponse> {
    const result = await NextMoveAITools.marketing_roi_overview()
    
    if (result.success) {
      const summary = result.summary!
      const providers = result.providers!
      
      const providersList = Object.entries(providers)
        .map(([name, data]: [string, any]) => 
          `• **${name.toUpperCase()}** : ${data.conversions} conv · ROI ${data.roi}x · ${data.spend_xof.toLocaleString()} XOF`
        ).join('\n')
      
      return {
        text: `📊 **Performance Marketing** (${result.period})\n\n` +
              `${providersList}\n\n` +
              `🎯 **Résumé global**\n` +
              `• Total dépensé : ${summary.total_spend_xof.toLocaleString()} XOF\n` +
              `• Conversions : ${summary.total_conversions}\n` +
              `• ROI moyen : ${summary.average_roi}x`,
        actions: [
          { type: "optimize", label: "Optimiser campagnes", data: {} },
          { type: "report", label: "Rapport détaillé", data: {} },
          { type: "budget", label: "Ajuster budget", data: {} }
        ]
      }
    } else {
      return {
        text: "❌ Impossible de récupérer les données ROI marketing.",
        actions: [
          { type: "support", label: "Support marketing", data: { issue: "roi_data" } }
        ]
      }
    }
  }

  private async handleSupportIntent(message: string): Promise<AIResponse> {
    return {
      text: `🎧 **Support NextMove**\n\n` +
            `Je peux vous aider avec :\n` +
            `• Suivi de colis et POD\n` +
            `• Factures et paiements\n` +
            `• Devis et tarification\n` +
            `• Configuration de compte\n\n` +
            `Ou vous mettre en relation avec un conseiller humain.`,
      actions: [
        { type: "escalate", label: "Parler à un humain", data: { context: message } },
        { type: "ticket", label: "Créer un ticket", data: { subject: message } },
        { type: "faq", label: "FAQ", data: {} }
      ]
    }
  }

  private async handleLoginIntent(): Promise<AIResponse> {
    return {
      text: "🔐 **Connexion à votre compte NextMove**\n\n" +
            "Utilisez vos identifiants pour accéder à votre espace personnel.",
      actions: [
        { type: "login", label: "Se connecter", data: {} },
        { type: "forgot_password", label: "Mot de passe oublié", data: {} }
      ]
    }
  }

  private async handleRegistrationIntent(): Promise<AIResponse> {
    return {
      text: "✨ **Créer votre compte NextMove**\n\n" +
            "Rejoignez des milliers d'entreprises qui font confiance à NextMove pour leurs expéditions Chine ↔ Afrique.\n\n" +
            "**Avantages** :\n" +
            "• Suivi en temps réel\n" +
            "• Preuves de livraison (POD)\n" +
            "• Paiement fractionné\n" +
            "• Support 24/7",
      actions: [
        { type: "register", label: "Créer un compte", data: {} },
        { type: "demo", label: "Demander une démo", data: {} }
      ]
    }
  }

  private async handleGeneralQuery(message: string): Promise<AIResponse> {
    // Recherche RAG basique (mock)
    const keywords = message.toLowerCase().split(' ')
    let response = ""
    let actions: any[] = []

    if (keywords.some(k => ['tarif', 'prix', 'coût', 'combien'].includes(k))) {
      response = "💰 **Tarification NextMove**\n\n" +
                "Nos tarifs dépendent de :\n" +
                "• Mode de transport (air/mer/route)\n" +
                "• Poids et volume\n" +
                "• Origine et destination\n" +
                "• Incoterm choisi\n\n" +
                "Je peux calculer un devis personnalisé !"
      actions = [
        { type: "quote", label: "Créer un devis", data: {} }
      ]
    } else if (keywords.some(k => ['délai', 'temps', 'durée', 'quand'].includes(k))) {
      response = "⏱️ **Délais de livraison**\n\n" +
                "• **Aérien** : 3-7 jours\n" +
                "• **Maritime** : 20-35 jours\n" +
                "• **Routier** : 10-20 jours\n\n" +
                "Les délais varient selon la destination et les formalités douanières."
      actions = [
        { type: "track", label: "Suivre un colis", data: {} }
      ]
    } else {
      response = `Bonjour ${this.context.user.name || ''} 👋\n\n` +
                "Je suis NextMove AI, votre assistant logistique Chine ↔ Afrique.\n\n" +
                "Je peux vous aider avec :\n" +
                "• 📦 Suivi de colis\n" +
                "• 💰 Factures et paiements\n" +
                "• 📋 Devis et tarification\n" +
                "• 📊 Analytics marketing\n" +
                "• 🎧 Support client"
      
      actions = [
        { type: "track", label: "Suivre un colis", data: {} },
        { type: "quote", label: "Créer un devis", data: {} },
        { type: "invoices", label: "Mes factures", data: {} }
      ]
    }

    return { text: response, actions }
  }
}
