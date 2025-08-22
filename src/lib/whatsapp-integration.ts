import crypto from 'crypto'

export interface WhatsAppConfig {
  token: string
  phoneNumberId: string
  wabaId: string
  verifyToken: string
  webhookUrl: string
}

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  type: 'text' | 'template' | 'image' | 'document' | 'audio'
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'failed'
  templateName?: string
  templateVariables?: Record<string, string>
}

export interface WhatsAppUser {
  userId: string
  phoneNumber: string
  isLinked: boolean
  optIn: boolean
  consentTimestamp?: Date
  lastChannel: 'web' | 'whatsapp'
  conversationId: string
}

export interface WhatsAppTemplate {
  name: string
  language: string
  category: 'TRANSACTIONAL' | 'MARKETING' | 'OTP'
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS'
    text?: string
    variables?: string[]
  }>
}

export class WhatsAppIntegration {
  private static instance: WhatsAppIntegration
  private config: WhatsAppConfig
  private users: Map<string, WhatsAppUser> = new Map()
  private otpStore: Map<string, { otp: string; expires: Date; attempts: number }> = new Map()

  private constructor() {
    this.config = {
      token: process.env.WHATSAPP_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      wabaId: process.env.WHATSAPP_WABA_ID || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'nextmove_verify_token_2024',
      webhookUrl: process.env.WHATSAPP_WEBHOOK_URL || 'https://agencenextmove.com/api/webhooks/whatsapp'
    }
    
    this.initializeTemplates()
  }

  static getInstance(): WhatsAppIntegration {
    if (!WhatsAppIntegration.instance) {
      WhatsAppIntegration.instance = new WhatsAppIntegration()
    }
    return WhatsAppIntegration.instance
  }

  private async initializeTemplates() {
    // Templates WhatsApp pré-approuvés
    const templates: WhatsAppTemplate[] = [
      {
        name: 'nm_tracking_update',
        language: 'fr',
        category: 'TRANSACTIONAL',
        components: [
          {
            type: 'BODY',
            text: '📦 Suivi NextMove – Statut de {{1}} : {{2}}. ETA : {{3}}. Répondez ici pour de l\'aide.',
            variables: ['shipment_id', 'status', 'eta']
          }
        ]
      },
      {
        name: 'nm_invoice_due',
        language: 'fr',
        category: 'TRANSACTIONAL',
        components: [
          {
            type: 'BODY',
            text: '💰 Facture – {{1}} d\'un montant de {{2}} arrive à échéance le {{3}}. Besoin du PDF ? Répondez PDF.',
            variables: ['invoice_no', 'amount', 'due_date']
          }
        ]
      },
      {
        name: 'nm_registration_welcome',
        language: 'fr',
        category: 'TRANSACTIONAL',
        components: [
          {
            type: 'BODY',
            text: '🎉 Bienvenue chez NextMove, {{1}} ! Vous pouvez suivre vos colis et factures depuis WhatsApp, ici même.',
            variables: ['name']
          }
        ]
      },
      {
        name: 'nm_otp_verification',
        language: 'fr',
        category: 'OTP',
        components: [
          {
            type: 'BODY',
            text: 'Votre code de vérification NextMove : {{1}}. Valide 5 minutes.',
            variables: ['otp']
          }
        ]
      }
    ]

    console.log(`${templates.length} templates WhatsApp initialisés`)
  }

  async verifyWebhook(mode: string, token: string, challenge: string): Promise<string | null> {
    if (mode === 'subscribe' && token === this.config.verifyToken) {
      console.log('Webhook WhatsApp vérifié avec succès')
      return challenge
    }
    return null
  }

  async processIncomingMessage(body: any): Promise<void> {
    try {
      if (body.object !== 'whatsapp_business_account') {
        return
      }

      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const { messages, contacts } = change.value
            
            if (messages) {
              for (const message of messages) {
                await this.handleIncomingMessage(message, contacts?.[0])
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur traitement message WhatsApp:', error)
    }
  }

  private async handleIncomingMessage(message: any, contact?: any): Promise<void> {
    const phoneNumber = message.from
    const messageText = message.text?.body || ''
    const messageType = message.type
    
    console.log(`Message WhatsApp reçu de ${phoneNumber}: ${messageText}`)
    
    // Vérifier si l'utilisateur est lié
    const user = this.getUserByPhone(phoneNumber)
    
    if (!user) {
      // Utilisateur non lié - proposer la liaison
      await this.sendMessage(phoneNumber, {
        type: 'text',
        content: '👋 Bonjour ! Pour utiliser NextMove via WhatsApp, veuillez d\'abord lier votre compte sur notre site web. Visitez agencenextmove.com'
      })
      return
    }

    // Gérer les commandes spéciales
    if (messageText.toLowerCase() === 'stop') {
      await this.handleOptOut(user)
      return
    }

    if (messageText.toLowerCase() === 'start') {
      await this.handleOptIn(user)
      return
    }

    if (messageText.toLowerCase() === 'pdf') {
      await this.handlePdfRequest(user)
      return
    }

    // Traiter le message via le chatbot universel
    await this.forwardToUniversalChatbot(user, messageText, messageType)
  }

  private getUserByPhone(phoneNumber: string): WhatsAppUser | null {
    for (const user of Array.from(this.users.values())) {
      if (user.phoneNumber === phoneNumber && user.isLinked) {
        return user
      }
    }
    return null
  }

  async linkUserAccount(userId: string, phoneNumber: string): Promise<{ success: boolean; message: string; otpSent?: boolean }> {
    try {
      // Normaliser le numéro de téléphone
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber)
      
      if (!this.isValidPhoneNumber(normalizedPhone)) {
        return {
          success: false,
          message: 'Format de numéro de téléphone invalide. Utilisez le format international (+221XXXXXXXXX)'
        }
      }

      // Générer et envoyer OTP
      const otp = this.generateOTP()
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      
      this.otpStore.set(normalizedPhone, {
        otp,
        expires: otpExpiry,
        attempts: 0
      })

      // Envoyer OTP via WhatsApp
      const otpSent = await this.sendOTP(normalizedPhone, otp)
      
      if (otpSent) {
        return {
          success: true,
          message: `Code de vérification envoyé au ${normalizedPhone}. Valide 5 minutes.`,
          otpSent: true
        }
      } else {
        return {
          success: false,
          message: 'Impossible d\'envoyer le code de vérification. Vérifiez le numéro.'
        }
      }
    } catch (error) {
      console.error('Erreur liaison compte WhatsApp:', error)
      return {
        success: false,
        message: 'Erreur technique lors de la liaison. Réessayez plus tard.'
      }
    }
  }

  async verifyOTP(phoneNumber: string, otp: string, userId: string): Promise<{ success: boolean; message: string }> {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber)
    const storedOTP = this.otpStore.get(normalizedPhone)
    
    if (!storedOTP) {
      return {
        success: false,
        message: 'Code de vérification expiré ou invalide. Demandez un nouveau code.'
      }
    }

    if (storedOTP.expires < new Date()) {
      this.otpStore.delete(normalizedPhone)
      return {
        success: false,
        message: 'Code de vérification expiré. Demandez un nouveau code.'
      }
    }

    if (storedOTP.attempts >= 3) {
      this.otpStore.delete(normalizedPhone)
      return {
        success: false,
        message: 'Trop de tentatives. Demandez un nouveau code.'
      }
    }

    if (storedOTP.otp !== otp) {
      storedOTP.attempts++
      return {
        success: false,
        message: `Code incorrect. ${3 - storedOTP.attempts} tentative(s) restante(s).`
      }
    }

    // OTP valide - lier le compte
    const user: WhatsAppUser = {
      userId,
      phoneNumber: normalizedPhone,
      isLinked: true,
      optIn: true,
      consentTimestamp: new Date(),
      lastChannel: 'whatsapp',
      conversationId: `wa_${userId}_${Date.now()}`
    }

    this.users.set(userId, user)
    this.otpStore.delete(normalizedPhone)

    // Envoyer message de bienvenue
    await this.sendTemplate(normalizedPhone, 'nm_registration_welcome', {
      name: 'Utilisateur' // À récupérer depuis la base de données
    })

    return {
      success: true,
      message: '✅ Liaison réussie ! Vous pouvez maintenant utiliser WhatsApp pour vos échanges NextMove.'
    }
  }

  private normalizePhoneNumber(phone: string): string {
    // Supprimer tous les caractères non numériques sauf le +
    let normalized = phone.replace(/[^\d+]/g, '')
    
    // Ajouter + si manquant
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized
    }
    
    return normalized
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Validation basique : + suivi de 8 à 15 chiffres
    return /^\+[1-9]\d{7,14}$/.test(phone)
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      return await this.sendTemplate(phoneNumber, 'nm_otp_verification', { otp })
    } catch (error) {
      console.error('Erreur envoi OTP WhatsApp:', error)
      return false
    }
  }

  async sendMessage(to: string, message: Partial<WhatsAppMessage>): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`
      
      let payload: any = {
        messaging_product: 'whatsapp',
        to: to.replace('+', ''),
        type: message.type || 'text'
      }

      if (message.type === 'text') {
        payload.text = { body: message.content }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log(`Message WhatsApp envoyé à ${to}`)
        return true
      } else {
        const error = await response.text()
        console.error('Erreur envoi WhatsApp:', error)
        return false
      }
    } catch (error) {
      console.error('Erreur API WhatsApp:', error)
      return false
    }
  }

  async sendTemplate(to: string, templateName: string, variables: Record<string, string>): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v18.0/${this.config.phoneNumberId}/messages`
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to.replace('+', ''),
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'fr' },
          components: [
            {
              type: 'body',
              parameters: Object.values(variables).map(value => ({
                type: 'text',
                text: value
              }))
            }
          ]
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log(`Template WhatsApp ${templateName} envoyé à ${to}`)
        return true
      } else {
        const error = await response.text()
        console.error('Erreur envoi template WhatsApp:', error)
        return false
      }
    } catch (error) {
      console.error('Erreur API WhatsApp template:', error)
      return false
    }
  }

  private async handleOptOut(user: WhatsAppUser): Promise<void> {
    user.optIn = false
    await this.sendMessage(user.phoneNumber, {
      type: 'text',
      content: '✅ Vous êtes désabonné des notifications WhatsApp NextMove. Envoyez START pour réactiver.'
    })
  }

  private async handleOptIn(user: WhatsAppUser): Promise<void> {
    user.optIn = true
    user.consentTimestamp = new Date()
    await this.sendMessage(user.phoneNumber, {
      type: 'text',
      content: '✅ Notifications WhatsApp réactivées ! Vous recevrez les mises à jour de vos expéditions et factures.'
    })
  }

  private async handlePdfRequest(user: WhatsAppUser): Promise<void> {
    // Récupérer la dernière facture de l'utilisateur
    // Pour l'instant, simulation
    await this.sendMessage(user.phoneNumber, {
      type: 'text',
      content: '📄 Voici le lien pour télécharger votre dernière facture :\nhttps://agencenextmove.com/api/invoices/F-2024-1205/download\n\nValide 24h.'
    })
  }

  private async forwardToUniversalChatbot(user: WhatsAppUser, message: string, messageType: string): Promise<void> {
    try {
      // Importer le chatbot universel
      const { UniversalChatbot } = await import('./universal-chatbot')
      const chatbot = UniversalChatbot.getInstance()
      
      // Traiter le message
      const response = await chatbot.processMessage(message, user.userId, [])
      
      // Envoyer la réponse via WhatsApp
      await this.sendMessage(user.phoneNumber, {
        type: 'text',
        content: response.message
      })
      
      // Marquer le dernier canal utilisé
      user.lastChannel = 'whatsapp'
      
    } catch (error) {
      console.error('Erreur forward vers chatbot:', error)
      await this.sendMessage(user.phoneNumber, {
        type: 'text',
        content: 'Désolé, je rencontre un problème technique. Un agent va vous contacter sous peu.'
      })
    }
  }

  async sendTrackingUpdate(userId: string, shipmentId: string, status: string, eta: string): Promise<boolean> {
    const user = this.users.get(userId)
    
    if (!user || !user.isLinked || !user.optIn) {
      return false
    }

    return await this.sendTemplate(user.phoneNumber, 'nm_tracking_update', {
      shipment_id: shipmentId,
      status: status,
      eta: eta
    })
  }

  async sendInvoiceDue(userId: string, invoiceNo: string, amount: string, dueDate: string): Promise<boolean> {
    const user = this.users.get(userId)
    
    if (!user || !user.isLinked || !user.optIn) {
      return false
    }

    return await this.sendTemplate(user.phoneNumber, 'nm_invoice_due', {
      invoice_no: invoiceNo,
      amount: amount,
      due_date: dueDate
    })
  }

  getUserStatus(userId: string): { isLinked: boolean; optIn: boolean; phoneNumber?: string } {
    const user = this.users.get(userId)
    
    if (!user) {
      return { isLinked: false, optIn: false }
    }

    return {
      isLinked: user.isLinked,
      optIn: user.optIn,
      phoneNumber: user.phoneNumber
    }
  }

  getConfig(): Partial<WhatsAppConfig> {
    return {
      phoneNumberId: this.config.phoneNumberId,
      webhookUrl: this.config.webhookUrl
    }
  }
}
