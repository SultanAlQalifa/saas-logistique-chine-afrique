/**
 * NextMove AI - Outils et endpoints pour l'agent IA
 * Intégration avec les APIs existantes de la plateforme
 */

import { TrackingResult, PODResult, InvoiceItem, QuoteRecommendation } from './nextmove-ai-config'

export interface UserContext {
  name?: string
  email: string
  tenant: string
  locale: string
  prefs: {
    notifications: boolean
    theme: string
    currency: string
  }
  recent_shipments: string[]
  recent_invoices: string[]
}

export interface NotificationSetup {
  channels: string[]
  consent: boolean
}

export interface TicketCreation {
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attachments?: string[]
}

export class NextMoveAITools {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string = '', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Récupère le contexte utilisateur complet
   */
  async getUserContext(userId: string): Promise<UserContext> {
    try {
      // Simulation avec données mock pour démonstration
      return {
        name: "Mamadou Diallo",
        email: "mamadou.diallo@example.com",
        tenant: "logitrans",
        locale: "fr",
        prefs: {
          notifications: true,
          theme: "light",
          currency: "XOF"
        },
        recent_shipments: ["DKR240815", "ABJ240820", "DLA240825"],
        recent_invoices: ["INV240801", "INV240815", "INV240820"]
      }
    } catch (error) {
      console.error('Erreur getUserContext:', error)
      throw new Error('Impossible de récupérer le contexte utilisateur')
    }
  }

  /**
   * Suivi d'un colis par code de tracking
   */
  async trackShipment(trackingCode: string): Promise<TrackingResult> {
    try {
      // Simulation avec données réalistes
      const mockData: Record<string, TrackingResult> = {
        'DKR240815': {
          code: 'DKR240815',
          status: 'En transit - Arrivé au port de Dakar',
          from: 'Guangzhou, Chine',
          to: 'Dakar, Sénégal',
          eta: '25 août 2024',
          events: [
            { ts: '20/08 14:30', label: 'Arrivé au port de Dakar', location: 'Port de Dakar' },
            { ts: '18/08 09:15', label: 'En transit maritime', location: 'Océan Atlantique' },
            { ts: '15/08 16:45', label: 'Départ du port de Guangzhou', location: 'Port de Guangzhou' },
            { ts: '14/08 10:20', label: 'Chargement conteneur', location: 'Terminal Guangzhou' },
            { ts: '13/08 08:00', label: 'Collecte chez expéditeur', location: 'Guangzhou, Chine' }
          ]
        },
        'ABJ240820': {
          code: 'ABJ240820',
          status: 'Livré',
          from: 'Shanghai, Chine',
          to: 'Abidjan, Côte d\'Ivoire',
          eta: 'Livré le 22/08/2024',
          events: [
            { ts: '22/08 11:30', label: 'Livré au destinataire', location: 'Abidjan, Zone 4' },
            { ts: '22/08 08:15', label: 'En cours de livraison', location: 'Abidjan' },
            { ts: '21/08 16:20', label: 'Arrivé au centre de tri', location: 'Port d\'Abidjan' }
          ]
        }
      }

      const result = mockData[trackingCode]
      if (!result) {
        throw new Error(`Code de suivi ${trackingCode} non trouvé`)
      }

      return result
    } catch (error) {
      console.error('Erreur trackShipment:', error)
      throw error
    }
  }

  /**
   * Récupère la preuve de livraison (POD)
   */
  async getPOD(trackingCode: string): Promise<PODResult> {
    try {
      // Simulation POD
      return {
        pdf_url: `/api/pod/${trackingCode}/download`,
        photos: [
          `/uploads/pod/${trackingCode}_photo1.jpg`,
          `/uploads/pod/${trackingCode}_photo2.jpg`
        ],
        signed_by: 'M. Ibrahim Konaté',
        signed_at: '22/08/2024 11:30',
        geo: {
          lat: 5.3600,
          lng: -4.0083,
          address: 'Zone 4, Marcory, Abidjan, Côte d\'Ivoire'
        }
      }
    } catch (error) {
      console.error('Erreur getPOD:', error)
      throw new Error('Preuve de livraison non disponible')
    }
  }

  /**
   * Liste les factures utilisateur
   */
  async listInvoices(status?: string, page: number = 1): Promise<{ items: InvoiceItem[]; next_page?: number }> {
    try {
      const mockInvoices: InvoiceItem[] = [
        {
          id: 'INV240820',
          total: 125000,
          currency: 'XOF',
          status: 'paid',
          due_at: '25/08/2024'
        },
        {
          id: 'INV240815',
          total: 89500,
          currency: 'XOF',
          status: 'pending',
          due_at: '30/08/2024'
        },
        {
          id: 'INV240801',
          total: 156000,
          currency: 'XOF',
          status: 'overdue',
          due_at: '15/08/2024'
        }
      ]

      let filteredInvoices = mockInvoices
      if (status) {
        filteredInvoices = mockInvoices.filter(inv => inv.status === status)
      }

      return {
        items: filteredInvoices.slice((page - 1) * 10, page * 10),
        next_page: filteredInvoices.length > page * 10 ? page + 1 : undefined
      }
    } catch (error) {
      console.error('Erreur listInvoices:', error)
      throw new Error('Impossible de récupérer les factures')
    }
  }

  /**
   * Télécharge le PDF d'une facture
   */
  async downloadInvoicePDF(invoiceNo: string): Promise<{ pdf_url: string }> {
    try {
      return {
        pdf_url: `/api/invoices/${invoiceNo}/download`
      }
    } catch (error) {
      console.error('Erreur downloadInvoicePDF:', error)
      throw new Error('Impossible de télécharger la facture')
    }
  }

  /**
   * Recommande un itinéraire et calcule les prix
   */
  async recommendRouteAndPrice(
    origin: string,
    destination: string,
    weightKg: number,
    volumeM3: number,
    readyDate?: string,
    speedVsCost?: 'speed' | 'cost'
  ): Promise<QuoteRecommendation> {
    try {
      // Calculs basés sur les règles de tarification
      const baseRates = {
        air: { pricePerKg: 2500, days: 3 },
        sea: { pricePerM3: 45000, days: 25 },
        road: { pricePerKg: 1200, days: 8 }
      }

      const airPrice = Math.round(weightKg * baseRates.air.pricePerKg)
      const seaPrice = Math.round(volumeM3 * baseRates.sea.pricePerM3)
      const roadPrice = Math.round(weightKg * baseRates.road.pricePerKg)

      // Détermination du meilleur mode
      let bestMode = 'sea'
      let bestReason = 'Meilleur rapport qualité-prix'

      if (speedVsCost === 'speed') {
        bestMode = 'air'
        bestReason = 'Plus rapide'
      } else if (airPrice < seaPrice && airPrice < roadPrice) {
        bestMode = 'air'
        bestReason = 'Plus économique'
      } else if (roadPrice < seaPrice) {
        bestMode = 'road'
        bestReason = 'Bon compromis prix-délai'
      }

      return {
        origin,
        destination,
        weight_kg: weightKg,
        volume_m3: volumeM3,
        air: { price: airPrice, days: baseRates.air.days },
        sea: { price: seaPrice, days: baseRates.sea.days },
        road: { price: roadPrice, days: baseRates.road.days },
        best: { mode: bestMode, reason: bestReason }
      }
    } catch (error) {
      console.error('Erreur recommendRouteAndPrice:', error)
      throw new Error('Impossible de calculer les tarifs')
    }
  }

  /**
   * Crée un devis officiel
   */
  async createQuote(
    origin: string,
    destination: string,
    mode: string,
    incoterm: string,
    weightKg: number,
    volumeM3: number,
    declaredValue?: number,
    readyDate?: string,
    notes?: string
  ): Promise<{ quote_id: string; pdf_url: string }> {
    try {
      const quoteId = `QUO${Date.now()}`
      
      return {
        quote_id: quoteId,
        pdf_url: `/api/quotes/${quoteId}/download`
      }
    } catch (error) {
      console.error('Erreur createQuote:', error)
      throw new Error('Impossible de créer le devis')
    }
  }

  /**
   * Configure les notifications utilisateur
   */
  async setupNotifications(channels: string[], consent: boolean): Promise<{ ok: boolean }> {
    try {
      // Sauvegarde des préférences de notification
      console.log('Configuration notifications:', { channels, consent })
      
      return { ok: true }
    } catch (error) {
      console.error('Erreur setupNotifications:', error)
      throw new Error('Impossible de configurer les notifications')
    }
  }

  /**
   * Aperçu du ROI marketing
   */
  async marketingROIOverview(provider?: string, range?: string): Promise<any> {
    try {
      return {
        summary: {
          total_spent: 450000,
          total_revenue: 1250000,
          roi_percentage: 177.8,
          conversions: 23,
          cost_per_conversion: 19565
        }
      }
    } catch (error) {
      console.error('Erreur marketingROIOverview:', error)
      throw new Error('Données ROI non disponibles')
    }
  }

  /**
   * Ouvre un ticket de support
   */
  async openTicket(
    subject: string,
    description: string,
    priority: string,
    attachments?: string[]
  ): Promise<{ ticket_id: string; url: string }> {
    try {
      const ticketId = `TKT${Date.now()}`
      
      return {
        ticket_id: ticketId,
        url: `/dashboard/support/tickets/${ticketId}`
      }
    } catch (error) {
      console.error('Erreur openTicket:', error)
      throw new Error('Impossible de créer le ticket')
    }
  }

  /**
   * Escalade vers un agent humain
   */
  async escalateToHuman(context: any): Promise<{ queued: boolean; eta_minutes: number }> {
    try {
      // Logique d'escalade vers support humain
      return {
        queued: true,
        eta_minutes: Math.floor(Math.random() * 10) + 5 // 5-15 minutes
      }
    } catch (error) {
      console.error('Erreur escalateToHuman:', error)
      throw new Error('Service support temporairement indisponible')
    }
  }

  /**
   * Conversion de devises
   */
  async fxConvert(fromCcy: string, toCcy: string, amount: number): Promise<{ result: number; rate: number; at: string }> {
    try {
      // Taux de change simulés (XOF comme pivot)
      const rates: Record<string, number> = {
        'XOF': 1,
        'EUR': 0.00152,
        'USD': 0.00165,
        'CNY': 0.0118
      }

      const fromRate = rates[fromCcy] || 1
      const toRate = rates[toCcy] || 1
      const rate = toRate / fromRate
      const result = amount * rate

      return {
        result: Math.round(result * 100) / 100,
        rate: Math.round(rate * 10000) / 10000,
        at: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }
    } catch (error) {
      console.error('Erreur fxConvert:', error)
      throw new Error('Conversion de devise impossible')
    }
  }

  /**
   * Vérification santé des routes
   */
  async healthCheckRoutes(): Promise<{ broken_links: string[] }> {
    try {
      // Simulation de vérification des liens
      return {
        broken_links: []
      }
    } catch (error) {
      console.error('Erreur healthCheckRoutes:', error)
      return { broken_links: ['Erreur de vérification'] }
    }
  }

  /**
   * Log des problèmes UI
   */
  async logUIIssue(kind: string, path: string, meta?: any): Promise<{ logged: boolean }> {
    try {
      console.log('UI Issue logged:', { kind, path, meta, timestamp: new Date().toISOString() })
      return { logged: true }
    } catch (error) {
      console.error('Erreur logUIIssue:', error)
      return { logged: false }
    }
  }
}
