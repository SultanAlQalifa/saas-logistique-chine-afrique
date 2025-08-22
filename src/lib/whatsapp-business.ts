// Types pour WhatsApp Business Cloud API
export interface WhatsAppCredentials {
  phone_number_id: string
  access_token: string
  app_id: string
  app_secret: string
  webhook_verify_token: string
  business_account_id: string
}

export interface WhatsAppMessage {
  id: string
  tenant_id: string
  from: string
  to: string
  message_type: 'text' | 'template' | 'interactive' | 'media'
  content: any
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  external_id?: string
}

export interface WhatsAppTemplate {
  id: string
  name: string
  language: string
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
  components: any[]
  status: 'APPROVED' | 'PENDING' | 'REJECTED'
}

// Service WhatsApp Business centralisé
export class WhatsAppBusinessService {
  private static readonly BASE_URL = 'https://graph.facebook.com/v18.0'
  
  /**
   * Récupère les credentials WhatsApp du Super Admin
   */
  static async getCredentials(): Promise<WhatsAppCredentials | null> {
    // TODO: Récupérer depuis la base de données
    // Pour l'instant, utiliser les variables d'environnement
    return {
      phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      access_token: process.env.WHATSAPP_ACCESS_TOKEN || '',
      app_id: process.env.WHATSAPP_APP_ID || '',
      app_secret: process.env.WHATSAPP_APP_SECRET || '',
      webhook_verify_token: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
      business_account_id: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || ''
    }
  }

  /**
   * Envoie un message texte via WhatsApp Business
   */
  static async sendTextMessage(
    tenantId: string,
    to: string,
    message: string
  ): Promise<WhatsAppMessage> {
    const credentials = await WhatsAppBusinessService.getCredentials()
    if (!credentials || !credentials.access_token) {
      throw new Error('WhatsApp credentials not configured')
    }

    try {
      const response = await fetch(
        `${WhatsAppBusinessService.BASE_URL}/${credentials.phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
              body: message
            }
          })
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${data.error?.message || 'Unknown error'}`)
      }

      const whatsappMessage: WhatsAppMessage = {
        id: `wa_${Date.now()}`,
        tenant_id: tenantId,
        from: credentials.phone_number_id,
        to: to,
        message_type: 'text',
        content: { text: message },
        status: 'sent',
        timestamp: new Date().toISOString(),
        external_id: data.messages?.[0]?.id
      }

      // TODO: Sauvegarder en base de données
      console.log('WhatsApp message sent:', whatsappMessage)
      
      return whatsappMessage

    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      throw error
    }
  }

  /**
   * Envoie un message template via WhatsApp Business
   */
  static async sendTemplateMessage(
    tenantId: string,
    to: string,
    templateName: string,
    language: string = 'fr',
    parameters: any[] = []
  ): Promise<WhatsAppMessage> {
    const credentials = await WhatsAppBusinessService.getCredentials()
    if (!credentials || !credentials.access_token) {
      throw new Error('WhatsApp credentials not configured')
    }

    try {
      const response = await fetch(
        `${WhatsAppBusinessService.BASE_URL}/${credentials.phone_number_id}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${credentials.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
              name: templateName,
              language: {
                code: language
              },
              components: parameters.length > 0 ? [
                {
                  type: 'body',
                  parameters: parameters
                }
              ] : []
            }
          })
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${data.error?.message || 'Unknown error'}`)
      }

      const whatsappMessage: WhatsAppMessage = {
        id: `wa_${Date.now()}`,
        tenant_id: tenantId,
        from: credentials.phone_number_id,
        to: to,
        message_type: 'template',
        content: { 
          template_name: templateName,
          language: language,
          parameters: parameters
        },
        status: 'sent',
        timestamp: new Date().toISOString(),
        external_id: data.messages?.[0]?.id
      }

      console.log('WhatsApp template message sent:', whatsappMessage)
      return whatsappMessage

    } catch (error) {
      console.error('Error sending WhatsApp template message:', error)
      throw error
    }
  }

  /**
   * Récupère les templates disponibles
   */
  static async getMessageTemplates(): Promise<WhatsAppTemplate[]> {
    const credentials = await WhatsAppBusinessService.getCredentials()
    if (!credentials || !credentials.access_token) {
      throw new Error('WhatsApp credentials not configured')
    }

    try {
      const response = await fetch(
        `${WhatsAppBusinessService.BASE_URL}/${credentials.business_account_id}/message_templates`,
        {
          headers: {
            'Authorization': `Bearer ${credentials.access_token}`
          }
        }
      )

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${data.error?.message || 'Unknown error'}`)
      }

      return data.data || []

    } catch (error) {
      console.error('Error fetching WhatsApp templates:', error)
      // Retourner des templates mock en cas d'erreur
      return mockWhatsAppTemplates
    }
  }

  /**
   * Gère les webhooks WhatsApp (statuts de messages, messages entrants)
   */
  static async handleWebhook(payload: any): Promise<void> {
    try {
      if (payload.object === 'whatsapp_business_account') {
        for (const entry of payload.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              const value = change.value
              
              // Traiter les statuts de messages
              if (value.statuses) {
                for (const status of value.statuses) {
                  await WhatsAppBusinessService.updateMessageStatus(
                    status.id,
                    status.status,
                    status.timestamp
                  )
                }
              }
              
              // Traiter les messages entrants
              if (value.messages) {
                for (const message of value.messages) {
                  await WhatsAppBusinessService.handleIncomingMessage(message)
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error handling WhatsApp webhook:', error)
    }
  }

  /**
   * Met à jour le statut d'un message
   */
  private static async updateMessageStatus(
    externalId: string,
    status: string,
    timestamp: string
  ): Promise<void> {
    // TODO: Mettre à jour en base de données
    console.log(`Message ${externalId} status updated to ${status} at ${timestamp}`)
  }

  /**
   * Traite un message entrant
   */
  private static async handleIncomingMessage(message: any): Promise<void> {
    // TODO: Traiter le message entrant (support client, bot, etc.)
    console.log('Incoming WhatsApp message:', message)
    
    // Exemple de réponse automatique
    if (message.text?.body?.toLowerCase().includes('help')) {
      await WhatsAppBusinessService.sendTextMessage(
        'system',
        message.from,
        'Bonjour ! Comment puis-je vous aider ? Tapez "info" pour plus d\'informations sur nos services.'
      )
    }
  }

  /**
   * Récupère l'historique des messages pour un tenant
   */
  static async getMessageHistory(
    tenantId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<WhatsAppMessage[]> {
    // TODO: Récupérer depuis la base de données
    // Pour l'instant, retourner des données mock
    return mockWhatsAppMessages.filter(m => m.tenant_id === tenantId)
      .slice(offset, offset + limit)
  }

  /**
   * Valide un numéro WhatsApp
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Format international requis (sans le +)
    const phoneRegex = /^[1-9]\d{1,14}$/
    return phoneRegex.test(phoneNumber.replace(/\D/g, ''))
  }
}

// Templates WhatsApp mock
export const mockWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 'template_1',
    name: 'shipping_notification',
    language: 'fr',
    category: 'UTILITY',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Notification d\'expédition'
      },
      {
        type: 'BODY',
        text: 'Bonjour {{1}}, votre colis {{2}} a été expédié et arrivera le {{3}}. Numéro de suivi: {{4}}'
      }
    ],
    status: 'APPROVED'
  },
  {
    id: 'template_2',
    name: 'delivery_confirmation',
    language: 'fr',
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text: 'Votre colis {{1}} a été livré avec succès. Merci de faire affaire avec nous !'
      }
    ],
    status: 'APPROVED'
  },
  {
    id: 'template_3',
    name: 'quote_ready',
    language: 'fr',
    category: 'UTILITY',
    components: [
      {
        type: 'BODY',
        text: 'Votre devis {{1}} est prêt ! Montant: {{2}} FCFA. Validité: {{3}} jours. Confirmez rapidement.'
      }
    ],
    status: 'APPROVED'
  }
]

// Messages WhatsApp mock
export const mockWhatsAppMessages: WhatsAppMessage[] = [
  {
    id: 'wa_1',
    tenant_id: 'tenant_1',
    from: '221776581741',
    to: '221777123456',
    message_type: 'template',
    content: {
      template_name: 'shipping_notification',
      parameters: ['Jean Dupont', 'PKG001', '25/01/2024', 'TRK123456789']
    },
    status: 'delivered',
    timestamp: '2024-01-20T10:30:00Z',
    external_id: 'wamid.123456789'
  },
  {
    id: 'wa_2',
    tenant_id: 'tenant_1',
    from: '221777123456',
    to: '221776581741',
    message_type: 'text',
    content: {
      text: 'Merci pour la notification ! Quand puis-je récupérer mon colis ?'
    },
    status: 'read',
    timestamp: '2024-01-20T10:35:00Z',
    external_id: 'wamid.987654321'
  },
  {
    id: 'wa_3',
    tenant_id: 'tenant_1',
    from: '221776581741',
    to: '221777123456',
    message_type: 'text',
    content: {
      text: 'Vous pouvez récupérer votre colis dès maintenant à notre entrepôt de Dakar. Horaires: 8h-18h du lundi au vendredi.'
    },
    status: 'sent',
    timestamp: '2024-01-20T10:37:00Z',
    external_id: 'wamid.456789123'
  }
]
