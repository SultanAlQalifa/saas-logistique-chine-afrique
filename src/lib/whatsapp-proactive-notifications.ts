import { WhatsAppIntegration } from './whatsapp-integration'

export interface ProactiveEvent {
  type: 'tracking_update' | 'invoice_due' | 'registration_welcome' | 'quote_ready' | 'quote_expiring'
  userId: string
  msisdn: string
  data: Record<string, any>
  timestamp: Date
}

export interface InteractiveTemplate {
  name: string
  language: string
  category: 'UTILITY' | 'TRANSACTIONAL'
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS'
    text?: string
    variables?: string[]
    buttons?: Array<{
      type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY'
      text: string
      url?: string
      phone_number?: string
      payload?: string
    }>
  }>
}

export class WhatsAppProactiveNotifications {
  private static instance: WhatsAppProactiveNotifications
  private whatsapp: WhatsAppIntegration
  private baseUrl: string
  private interactiveTemplates: Map<string, InteractiveTemplate> = new Map()

  private constructor() {
    this.whatsapp = WhatsAppIntegration.getInstance()
    this.baseUrl = process.env.NEXTAUTH_URL || 'https://agencenextmove.com'
    this.initializeInteractiveTemplates()
  }

  static getInstance(): WhatsAppProactiveNotifications {
    if (!WhatsAppProactiveNotifications.instance) {
      WhatsAppProactiveNotifications.instance = new WhatsAppProactiveNotifications()
    }
    return WhatsAppProactiveNotifications.instance
  }

  private initializeInteractiveTemplates() {
    // Template de suivi avec boutons interactifs
    const trackingTemplate: InteractiveTemplate = {
      name: 'nm_tracking_update',
      language: 'fr',
      category: 'UTILITY',
      components: [
        {
          type: 'BODY',
          text: '📦 Suivi NextMove — {{1}} : {{2}}. ETA : {{3}}. Besoin d\'aide ?',
          variables: ['shipment_id', 'status_label', 'eta']
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'URL',
              text: 'Chat ici',
              url: `${this.baseUrl}/?chat=open&chan=wa&ref={{1}}&topic=tracking`
            },
            {
              type: 'URL',
              text: 'Voir tracking',
              url: `${this.baseUrl}/track/{{1}}`
            }
          ]
        }
      ]
    }

    // Template de facture avec boutons interactifs
    const invoiceTemplate: InteractiveTemplate = {
      name: 'nm_invoice_due',
      language: 'fr',
      category: 'UTILITY',
      components: [
        {
          type: 'BODY',
          text: '💰 Facture — {{1}} d\'un montant de {{2}} arrive à échéance le {{3}}.',
          variables: ['invoice_no', 'amount', 'due_date']
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'URL',
              text: 'Chat ici',
              url: `${this.baseUrl}/?chat=open&chan=wa&ref={{1}}&topic=invoice`
            },
            {
              type: 'URL',
              text: 'Télécharger PDF',
              url: `${this.baseUrl}/invoices/{{1}}/pdf`
            }
          ]
        }
      ]
    }

    // Template de bienvenue avec boutons interactifs
    const welcomeTemplate: InteractiveTemplate = {
      name: 'nm_registration_welcome',
      language: 'fr',
      category: 'UTILITY',
      components: [
        {
          type: 'BODY',
          text: '🎉 Bienvenue chez NextMove, {{1}} ! Vous pouvez gérer vos expéditions et factures ici.',
          variables: ['name']
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'URL',
              text: 'Chat ici',
              url: `${this.baseUrl}/?chat=open&chan=wa&topic=welcome`
            },
            {
              type: 'URL',
              text: 'Mon espace',
              url: `${this.baseUrl}/app`
            }
          ]
        }
      ]
    }

    // Template de devis avec boutons interactifs
    const quoteTemplate: InteractiveTemplate = {
      name: 'nm_quote_ready',
      language: 'fr',
      category: 'UTILITY',
      components: [
        {
          type: 'BODY',
          text: '📋 Votre devis {{1}} est prêt ! Montant : {{2}}. Valide jusqu\'au {{3}}.',
          variables: ['quote_id', 'amount', 'valid_until']
        },
        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'URL',
              text: 'Chat ici',
              url: `${this.baseUrl}/?chat=open&chan=wa&ref={{1}}&topic=quote`
            },
            {
              type: 'URL',
              text: 'Voir devis',
              url: `${this.baseUrl}/quotes/{{1}}`
            }
          ]
        }
      ]
    }

    this.interactiveTemplates.set('nm_tracking_update', trackingTemplate)
    this.interactiveTemplates.set('nm_invoice_due', invoiceTemplate)
    this.interactiveTemplates.set('nm_registration_welcome', welcomeTemplate)
    this.interactiveTemplates.set('nm_quote_ready', quoteTemplate)

    console.log(`${this.interactiveTemplates.size} templates interactifs WhatsApp initialisés`)
  }

  async processEvent(event: ProactiveEvent): Promise<boolean> {
    try {
      console.log('Traitement événement proactif:', event.type, event.userId)

      // Vérifier que l'utilisateur a opt-in WhatsApp
      const userStatus = this.whatsapp.getUserStatus(event.userId)
      if (!userStatus.isLinked || !userStatus.optIn) {
        console.log('Utilisateur non lié ou opt-out WhatsApp:', event.userId)
        return false
      }

      switch (event.type) {
        case 'tracking_update':
          return await this.sendTrackingUpdate(event)
        
        case 'invoice_due':
          return await this.sendInvoiceDue(event)
        
        case 'registration_welcome':
          return await this.sendRegistrationWelcome(event)
        
        case 'quote_ready':
          return await this.sendQuoteReady(event)
        
        case 'quote_expiring':
          return await this.sendQuoteExpiring(event)
        
        default:
          console.warn('Type d\'événement non supporté:', event.type)
          return false
      }
    } catch (error) {
      console.error('Erreur traitement événement proactif:', error)
      return false
    }
  }

  private async sendTrackingUpdate(event: ProactiveEvent): Promise<boolean> {
    const { shipmentId, status, eta } = event.data
    
    // Mapper les statuts techniques vers des libellés lisibles
    const statusLabels: Record<string, string> = {
      'preparation': 'En préparation',
      'in_transit': 'En transit',
      'arrived_at_port': 'Arrivé au port',
      'customs_clearance': 'Dédouanement',
      'out_for_delivery': 'En cours de livraison',
      'delivered': 'Livré',
      'exception': 'Incident'
    }

    const statusLabel = statusLabels[status] || status
    const etaFormatted = eta ? new Date(eta).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }) : 'Non défini'

    return await this.sendInteractiveTemplate(
      event.msisdn,
      'nm_tracking_update',
      [shipmentId, statusLabel, etaFormatted]
    )
  }

  private async sendInvoiceDue(event: ProactiveEvent): Promise<boolean> {
    const { invoiceNo, amount, currency, dueDate } = event.data
    
    const amountFormatted = `${amount}${currency || '€'}`
    const dueDateFormatted = new Date(dueDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    return await this.sendInteractiveTemplate(
      event.msisdn,
      'nm_invoice_due',
      [invoiceNo, amountFormatted, dueDateFormatted]
    )
  }

  private async sendRegistrationWelcome(event: ProactiveEvent): Promise<boolean> {
    const { name } = event.data

    return await this.sendInteractiveTemplate(
      event.msisdn,
      'nm_registration_welcome',
      [name || 'Utilisateur']
    )
  }

  private async sendQuoteReady(event: ProactiveEvent): Promise<boolean> {
    const { quoteId, amount, currency, validUntil } = event.data
    
    const amountFormatted = `${amount}${currency || '€'}`
    const validUntilFormatted = new Date(validUntil).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    return await this.sendInteractiveTemplate(
      event.msisdn,
      'nm_quote_ready',
      [quoteId, amountFormatted, validUntilFormatted]
    )
  }

  private async sendQuoteExpiring(event: ProactiveEvent): Promise<boolean> {
    const { quoteId, validUntil } = event.data
    
    const validUntilFormatted = new Date(validUntil).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    })

    // Utiliser un message simple pour l'expiration
    return await this.whatsapp.sendMessage(event.msisdn, {
      type: 'text',
      content: `⏰ Rappel : Votre devis ${quoteId} expire le ${validUntilFormatted}. Souhaitez-vous le confirmer ?\n\n💬 Répondez ici ou cliquez : ${this.baseUrl}/?chat=open&chan=wa&ref=${quoteId}&topic=quote`
    })
  }

  private async sendInteractiveTemplate(
    to: string, 
    templateName: string, 
    variables: string[]
  ): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
      
      // Remplacer les variables dans les URLs des boutons
      const template = this.interactiveTemplates.get(templateName)
      if (!template) {
        console.error('Template non trouvé:', templateName)
        return false
      }

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
              parameters: variables.map(value => ({
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
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log(`Template interactif ${templateName} envoyé à ${to}`)
        
        // Logger l'événement
        this.logEvent('wa_template_sent', {
          to,
          template: templateName,
          variables,
          timestamp: new Date()
        })
        
        return true
      } else {
        const error = await response.text()
        console.error('Erreur envoi template interactif:', error)
        return false
      }
    } catch (error) {
      console.error('Erreur API WhatsApp template interactif:', error)
      return false
    }
  }

  // Jobs de notification spécifiques
  async notifyTrackingUpdate(userId: string, shipmentId: string, status: string, eta?: string): Promise<boolean> {
    const userStatus = this.whatsapp.getUserStatus(userId)
    if (!userStatus.phoneNumber) return false

    const event: ProactiveEvent = {
      type: 'tracking_update',
      userId,
      msisdn: userStatus.phoneNumber,
      data: { shipmentId, status, eta },
      timestamp: new Date()
    }

    return await this.processEvent(event)
  }

  async notifyInvoiceDue(userId: string, invoiceNo: string, amount: number, currency: string, dueDate: string): Promise<boolean> {
    const userStatus = this.whatsapp.getUserStatus(userId)
    if (!userStatus.phoneNumber) return false

    const event: ProactiveEvent = {
      type: 'invoice_due',
      userId,
      msisdn: userStatus.phoneNumber,
      data: { invoiceNo, amount, currency, dueDate },
      timestamp: new Date()
    }

    return await this.processEvent(event)
  }

  async notifyRegistrationWelcome(userId: string, name: string): Promise<boolean> {
    const userStatus = this.whatsapp.getUserStatus(userId)
    if (!userStatus.phoneNumber) return false

    const event: ProactiveEvent = {
      type: 'registration_welcome',
      userId,
      msisdn: userStatus.phoneNumber,
      data: { name },
      timestamp: new Date()
    }

    return await this.processEvent(event)
  }

  async notifyQuoteReady(userId: string, quoteId: string, amount: number, currency: string, validUntil: string): Promise<boolean> {
    const userStatus = this.whatsapp.getUserStatus(userId)
    if (!userStatus.phoneNumber) return false

    const event: ProactiveEvent = {
      type: 'quote_ready',
      userId,
      msisdn: userStatus.phoneNumber,
      data: { quoteId, amount, currency, validUntil },
      timestamp: new Date()
    }

    return await this.processEvent(event)
  }

  // Vérification fenêtre 24h WhatsApp
  private isWithin24HourWindow(lastMessageTime: Date): boolean {
    const now = new Date()
    const diffHours = (now.getTime() - lastMessageTime.getTime()) / (1000 * 60 * 60)
    return diffHours <= 24
  }

  // Gestion des horaires ouvrés
  private isBusinessHours(): boolean {
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay() // 0 = dimanche, 6 = samedi
    
    // Lundi à vendredi, 8h à 18h
    return day >= 1 && day <= 5 && hour >= 8 && hour < 18
  }

  // Logging des événements
  private logEvent(eventType: string, data: any): void {
    console.log(`[WhatsApp Event] ${eventType}:`, data)
    
    // Ici on pourrait envoyer vers un système de logging externe
    // ou sauvegarder en base de données pour analytics
  }

  // Méthodes utilitaires
  getAvailableTemplates(): string[] {
    return Array.from(this.interactiveTemplates.keys())
  }

  getTemplate(name: string): InteractiveTemplate | undefined {
    return this.interactiveTemplates.get(name)
  }
}
