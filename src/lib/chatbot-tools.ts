export interface ChatbotTool {
  name: string
  description: string
  parameters: Record<string, any>
  execute: (params: any) => Promise<any>
}

export interface ToolExecutionResult {
  success: boolean
  data?: any
  error?: string
  message: string
}

export class ChatbotTools {
  private static instance: ChatbotTools
  private tools: Map<string, ChatbotTool> = new Map()

  private constructor() {
    this.initializeTools()
  }

  static getInstance(): ChatbotTools {
    if (!ChatbotTools.instance) {
      ChatbotTools.instance = new ChatbotTools()
    }
    return ChatbotTools.instance
  }

  private initializeTools() {
    // Tool: Register User
    this.registerTool({
      name: 'register_user',
      description: 'Créer un nouveau compte utilisateur',
      parameters: {
        name: { type: 'string', required: true, description: 'Nom complet' },
        email: { type: 'string', required: true, description: 'Adresse email' },
        phone: { type: 'string', required: true, description: 'Numéro de téléphone' },
        password: { type: 'string', required: true, description: 'Mot de passe' },
        consent_tos: { type: 'boolean', required: true, description: 'Acceptation CGU' }
      },
      execute: this.registerUser.bind(this)
    })

    // Tool: Login User
    this.registerTool({
      name: 'login_user',
      description: 'Connexion utilisateur',
      parameters: {
        email: { type: 'string', required: true, description: 'Adresse email' },
        password: { type: 'string', required: true, description: 'Mot de passe' },
        otp: { type: 'string', required: false, description: 'Code OTP si activé' }
      },
      execute: this.loginUser.bind(this)
    })

    // Tool: Track Shipment
    this.registerTool({
      name: 'track_shipment',
      description: 'Suivre une expédition par numéro',
      parameters: {
        shipment_id: { type: 'string', required: true, description: 'Numéro de suivi (ex: DKR240815)' }
      },
      execute: this.trackShipment.bind(this)
    })

    // Tool: List Invoices
    this.registerTool({
      name: 'list_invoices',
      description: 'Lister les factures utilisateur',
      parameters: {
        status: { type: 'string', required: false, description: 'Statut: pending, paid, overdue' },
        page: { type: 'number', required: false, description: 'Page (défaut: 1)' }
      },
      execute: this.listInvoices.bind(this)
    })

    // Tool: Download Invoice PDF
    this.registerTool({
      name: 'download_invoice_pdf',
      description: 'Télécharger une facture en PDF',
      parameters: {
        invoice_no: { type: 'string', required: true, description: 'Référence facture (ex: F-2024-1205)' }
      },
      execute: this.downloadInvoicePdf.bind(this)
    })

    // Tool: Create Quote
    this.registerTool({
      name: 'create_quote',
      description: 'Créer un devis personnalisé',
      parameters: {
        origin: { type: 'string', required: true, description: 'Ville d\'origine (ex: Guangzhou)' },
        destination: { type: 'string', required: true, description: 'Ville de destination (ex: Dakar)' },
        mode: { type: 'string', required: true, description: 'Mode: maritime ou aerien' },
        incoterm: { type: 'string', required: true, description: 'Incoterm: EXW, FCA, FOB, CIF, DDP' },
        weight_kg: { type: 'number', required: true, description: 'Poids en kg' },
        volume_m3: { type: 'number', required: true, description: 'Volume en m³ (CBM)' },
        declared_value: { type: 'number', required: true, description: 'Valeur déclarée en EUR' },
        ready_date: { type: 'string', required: true, description: 'Date de disponibilité (YYYY-MM-DD)' },
        notes: { type: 'string', required: false, description: 'Notes additionnelles' }
      },
      execute: this.createQuote.bind(this)
    })
  }

  private registerTool(tool: ChatbotTool) {
    this.tools.set(tool.name, tool)
  }

  async executeTool(toolName: string, params: any): Promise<ToolExecutionResult> {
    const tool = this.tools.get(toolName)
    
    if (!tool) {
      return {
        success: false,
        error: `Tool '${toolName}' non trouvé`,
        message: 'Outil non disponible'
      }
    }

    try {
      // Validation des paramètres
      const validation = this.validateParameters(tool.parameters, params)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
          message: `Paramètres manquants: ${validation.missing?.join(', ')}`
        }
      }

      const result = await tool.execute(params)
      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Erreur lors de l\'exécution'
      }
    }
  }

  private validateParameters(schema: Record<string, any>, params: any): {
    valid: boolean
    error?: string
    missing?: string[]
  } {
    const missing: string[] = []
    
    for (const [key, config] of Object.entries(schema)) {
      if (config.required && (!params || params[key] === undefined || params[key] === '')) {
        missing.push(key)
      }
    }
    
    if (missing.length > 0) {
      return {
        valid: false,
        error: `Paramètres requis manquants: ${missing.join(', ')}`,
        missing
      }
    }
    
    return { valid: true }
  }

  // Implémentation des tools
  private async registerUser(params: any): Promise<ToolExecutionResult> {
    const { name, email, phone, password, consent_tos } = params
    
    // Simulation d'inscription
    if (!consent_tos) {
      return {
        success: false,
        message: 'Vous devez accepter les conditions générales d\'utilisation'
      }
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Format d\'email invalide'
      }
    }

    // Simulation de création de compte
    const userData = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    return {
      success: true,
      data: userData,
      message: `✅ Compte créé avec succès pour ${name}!\n\nVotre identifiant: ${userData.id}\nEmail: ${email}\n\nVous pouvez maintenant vous connecter et commencer à utiliser nos services.`
    }
  }

  private async loginUser(params: any): Promise<ToolExecutionResult> {
    const { email, password, otp } = params
    
    // Simulation de connexion
    if (email === 'demo@nextmove.com' && password === 'demo123') {
      return {
        success: true,
        data: {
          user: {
            id: 'user_demo',
            name: 'Amadou Diallo',
            email: 'demo@nextmove.com',
            role: 'client'
          },
          token: 'demo_token_123'
        },
        message: `✅ Connexion réussie!\n\nBienvenue Amadou Diallo!\nVous êtes maintenant connecté à votre espace client.`
      }
    }

    return {
      success: false,
      message: '❌ Email ou mot de passe incorrect.\n\nVeuillez vérifier vos identifiants ou créer un compte si vous n\'en avez pas.'
    }
  }

  private async trackShipment(params: any): Promise<ToolExecutionResult> {
    const { shipment_id } = params
    
    // Utiliser le système de suivi avancé
    const { AdvancedTrackingSystem } = await import('./advanced-tracking-system')
    const trackingSystem = AdvancedTrackingSystem.getInstance()
    
    const trackingResponse = await trackingSystem.getDetailedTracking(shipment_id)
    
    if (!trackingResponse) {
      return {
        success: false,
        message: `❌ **Numéro de suivi '${shipment_id}' non trouvé**\n\n🔍 Vérifications possibles :\n• Format correct du numéro\n• Expédition récente (délai d'indexation)\n• Numéro fourni par l'expéditeur\n\n💬 **Besoin d'aide ?** Contactez notre support avec :\n• Référence de commande\n• Date d'expédition\n• Nom de l'expéditeur`
      }
    }

    const message = trackingSystem.generateTrackingMessage(trackingResponse)
    
    // Actions contextuelles basées sur le statut
    const actions = []
    
    // Documents disponibles
    const availableDocs = trackingResponse.shipment.documents.filter(doc => doc.status === 'available')
    if (availableDocs.length > 0) {
      actions.push({
        type: 'download_documents',
        label: '📄 Télécharger documents',
        data: { shipmentId: shipment_id, documents: availableDocs }
      })
    }
    
    // Contact agent si problème
    if (trackingResponse.alerts.some(alert => alert.type === 'warning' || alert.type === 'error')) {
      actions.push({
        type: 'contact_agent',
        label: '📞 Contacter l\'agent',
        data: { shipmentId: shipment_id, reason: 'tracking_issue' }
      })
    }
    
    // Preuves de livraison si livré
    if (trackingResponse.shipment.status === 'delivered') {
      actions.push({
        type: 'download_pod',
        label: '📋 Preuve de livraison',
        data: { shipmentId: shipment_id }
      })
    }

    return {
      success: true,
      data: {
        ...trackingResponse.shipment,
        alerts: trackingResponse.alerts,
        recommendations: trackingResponse.recommendations,
        nextSteps: trackingResponse.nextSteps,
        actions
      },
      message
    }
  }

  private async listInvoices(params: any): Promise<ToolExecutionResult> {
    const { status = 'all', page = 1 } = params
    
    // Simulation de factures
    const allInvoices = [
      {
        id: 'F-2024-1205',
        amount: 780,
        currency: 'EUR',
        status: 'pending',
        dueDate: '2024-08-22',
        shipmentId: 'DKR240815',
        description: 'Transport maritime Guangzhou→Dakar'
      },
      {
        id: 'F-2024-1198',
        amount: 1250,
        currency: 'EUR',
        status: 'paid',
        dueDate: '2024-08-10',
        shipmentId: 'ABJ240801',
        description: 'Transport aérien Shenzhen→Abidjan'
      }
    ]

    const filteredInvoices = status === 'all' 
      ? allInvoices 
      : allInvoices.filter(inv => inv.status === status)

    let message = `💰 **Vos Factures**\n\n`
    
    if (filteredInvoices.length === 0) {
      message += `Aucune facture trouvée avec le statut "${status}".`
    } else {
      filteredInvoices.forEach(invoice => {
        const statusEmoji = invoice.status === 'paid' ? '✅' : invoice.status === 'pending' ? '⏳' : '🔴'
        message += `${statusEmoji} **${invoice.id}** - ${invoice.amount}€\n`
        message += `   ${invoice.description}\n`
        message += `   Échéance: ${invoice.dueDate}\n\n`
      })
    }

    return {
      success: true,
      data: filteredInvoices,
      message
    }
  }

  private async downloadInvoicePdf(params: any): Promise<ToolExecutionResult> {
    const { invoice_no } = params
    
    // Simulation de génération PDF
    const invoiceExists = ['F-2024-1205', 'F-2024-1198'].includes(invoice_no)
    
    if (!invoiceExists) {
      return {
        success: false,
        message: `❌ Facture '${invoice_no}' non trouvée.`
      }
    }

    // Simulation d'URL de téléchargement
    const downloadUrl = `/api/invoices/${invoice_no}/download`
    
    return {
      success: true,
      data: { downloadUrl, invoice_no },
      message: `✅ **Facture ${invoice_no}** prête au téléchargement!\n\n📄 Le PDF sera téléchargé automatiquement.\nTaille: ~250 KB\nFormat: PDF/A`
    }
  }

  private async createQuote(params: any): Promise<ToolExecutionResult> {
    const { origin, destination, mode, incoterm, weight_kg, volume_m3, declared_value, ready_date, notes } = params
    
    // Calculs tarifaires simulés
    const routes: Record<string, { maritime: number; aerien: number }> = {
      'guangzhou-dakar': { maritime: 250, aerien: 950 },
      'shanghai-abidjan': { maritime: 280, aerien: 1100 },
      'shenzhen-douala': { maritime: 320, aerien: 1200 }
    }
    
    const routeKey = `${origin.toLowerCase()}-${destination.toLowerCase()}`
    const baseRates = routes[routeKey] || { maritime: 300, aerien: 1000 }
    
    const basePrice = mode === 'maritime' 
      ? volume_m3 * baseRates.maritime 
      : Math.max(weight_kg * 4, volume_m3 * baseRates.aerien)
    
    // Ajustements Incoterms
    const incotermMultipliers: Record<string, number> = {
      'EXW': 1.0,
      'FCA': 1.1, 
      'FOB': 1.15,
      'CIF': 1.25,
      'DDP': 1.4
    }
    
    const finalPrice = basePrice * (incotermMultipliers[incoterm] || 1.2)
    
    // Délais estimés
    const transitTimes: Record<string, { min: number; max: number }> = {
      maritime: { min: 20, max: 30 },
      aerien: { min: 3, max: 7 }
    }
    
    const transit = transitTimes[mode]
    const quoteId = `QUO-${Date.now()}`
    
    let message = `💰 **Devis ${quoteId}**\n\n`
    message += `📍 **Trajet**: ${origin} → ${destination}\n`
    message += `🚚 **Mode**: ${mode.charAt(0).toUpperCase() + mode.slice(1)}\n`
    message += `📋 **Incoterm**: ${incoterm}\n`
    message += `⚖️ **Poids**: ${weight_kg} kg\n`
    message += `📦 **Volume**: ${volume_m3} CBM\n`
    message += `💎 **Valeur**: ${declared_value}€\n\n`
    message += `💰 **Prix total**: ${Math.round(finalPrice)}€\n`
    message += `⏱️ **Délai**: ${transit.min}-${transit.max} jours\n`
    message += `📅 **Validité**: 15 jours\n\n`
    
    if (notes) {
      message += `📝 **Notes**: ${notes}\n\n`
    }
    
    message += `Ce devis inclut: transport, manutention portuaire`
    if (incoterm === 'CIF' || incoterm === 'DDP') {
      message += `, assurance cargo`
    }
    if (incoterm === 'DDP') {
      message += `, dédouanement et livraison finale`
    }

    return {
      success: true,
      data: {
        quoteId,
        price: Math.round(finalPrice),
        currency: 'EUR',
        transitTime: `${transit.min}-${transit.max} jours`,
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      message
    }
  }

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys())
  }

  getToolDescription(toolName: string): ChatbotTool | undefined {
    return this.tools.get(toolName)
  }
}
