'use client'

interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
  appId: string
  appSecret: string
  webhookVerifyToken: string
  businessAccountId: string
}

interface WhatsAppMessage {
  to: string
  type: 'text' | 'template' | 'interactive'
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: any[]
  }
}

export class WhatsAppAPI {
  private config: WhatsAppConfig
  private baseUrl = 'https://graph.facebook.com/v18.0'

  constructor() {
    this.config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ''
    }
  }

  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/${this.config.phoneNumberId}/messages`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('WhatsApp API Error:', error)
        return false
      }

      const result = await response.json()
      console.log('WhatsApp message sent:', result)
      return true
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      return false
    }
  }

  async sendTextMessage(to: string, text: string): Promise<boolean> {
    return this.sendMessage({
      to,
      type: 'text',
      text: { body: text }
    })
  }

  async sendTrackingUpdate(to: string, trackingNumber: string, status: string): Promise<boolean> {
    const message = `🚚 *Mise à jour de votre colis*\n\nNuméro de suivi: ${trackingNumber}\nStatut: ${status}\n\nSuivez votre colis sur: https://nextmove-cargo.com/track/${trackingNumber}`
    
    return this.sendTextMessage(to, message)
  }

  async sendPaymentConfirmation(to: string, amount: number, currency: string): Promise<boolean> {
    const message = `✅ *Paiement confirmé*\n\nMontant: ${amount} ${currency}\nStatut: Paiement reçu\n\nMerci pour votre confiance !`
    
    return this.sendTextMessage(to, message)
  }

  async sendWelcomeMessage(to: string, clientName: string): Promise<boolean> {
    const message = `🎉 Bienvenue ${clientName} !\n\nVotre compte NextMove Cargo est maintenant actif.\n\nVous pouvez maintenant:\n• Suivre vos colis\n• Effectuer des paiements\n• Contacter notre support\n\nBesoin d'aide ? Répondez à ce message.`
    
    return this.sendTextMessage(to, message)
  }

  verifyWebhook(token: string): boolean {
    return token === this.config.webhookVerifyToken
  }

  isConfigured(): boolean {
    return !!(
      this.config.phoneNumberId &&
      this.config.accessToken &&
      this.config.appId &&
      this.config.appSecret
    )
  }
}

export default WhatsAppAPI
