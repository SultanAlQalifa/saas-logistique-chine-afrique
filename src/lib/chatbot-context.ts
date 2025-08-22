import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export interface UserContext {
  id: string
  name: string
  email: string
  company?: string
  role: string
  preferences: UserPreferences
}

export interface UserPreferences {
  habitualRoutes: string[]
  preferredTransportMode: 'maritime' | 'aerien' | 'mixed'
  defaultCurrency: 'EUR' | 'USD' | 'XOF'
  notificationSettings: {
    email: boolean
    sms: boolean
    whatsapp: boolean
  }
}

export interface ShipmentContext {
  id: string
  trackingNumber: string
  status: 'preparation' | 'expedie' | 'transit' | 'douane' | 'livraison' | 'livre'
  origin: string
  destination: string
  weight: number
  volume: number
  cbm: number
  transportMode: 'maritime' | 'aerien'
  estimatedDelivery: Date
  actualDelivery?: Date
  value: number
  currency: string
  description: string
  documents: string[]
}

export interface InvoiceContext {
  id: string
  reference: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  dueDate: Date
  shipmentId?: string
  description: string
}

export interface SupportHistoryContext {
  recentTickets: Array<{
    id: string
    subject: string
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
    createdAt: Date
    category: string
  }>
  commonIssues: string[]
  satisfactionScore: number
}

export interface ChatContext {
  user: UserContext
  activeShipments: ShipmentContext[]
  pendingInvoices: InvoiceContext[]
  supportHistory: SupportHistoryContext
  platformData: {
    routes: Array<{
      origin: string
      destination: string
      maritimePrice: number
      aerienPrice: number
      transitTime: { maritime: number; aerien: number }
    }>
    currentPromotions: Array<{
      id: string
      description: string
      discount: number
      validUntil: Date
    }>
  }
}

export class ChatContextService {
  static async getUserContext(userId: string): Promise<UserContext | null> {
    try {
      // Récupérer les données utilisateur depuis la base de données
      // Pour l'instant, on simule avec des données de démonstration
      return {
        id: userId,
        name: 'Amadou Diallo',
        email: 'amadou.diallo@example.com',
        company: 'Import Export Diallo',
        role: 'client',
        preferences: {
          habitualRoutes: ['Dakar-Paris', 'Abidjan-Marseille'],
          preferredTransportMode: 'maritime',
          defaultCurrency: 'EUR',
          notificationSettings: {
            email: true,
            sms: true,
            whatsapp: false
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du contexte utilisateur:', error)
      return null
    }
  }

  static async getActiveShipments(userId: string): Promise<ShipmentContext[]> {
    try {
      // Simulation de données d'expéditions actives
      return [
        {
          id: 'ship_001',
          trackingNumber: 'DKR240815',
          status: 'transit',
          origin: 'Dakar, Sénégal',
          destination: 'Le Havre, France',
          weight: 500,
          volume: 3.2,
          cbm: 3.2,
          transportMode: 'maritime',
          estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 jours à partir d'aujourd'hui
          value: 2500,
          currency: 'EUR',
          description: 'Textile et accessoires',
          documents: ['facture_commerciale.pdf', 'liste_colisage.pdf']
        },
        {
          id: 'ship_002',
          trackingNumber: 'ABJ240820',
          status: 'preparation',
          origin: 'Abidjan, Côte d\'Ivoire',
          destination: 'Marseille, France',
          weight: 200,
          volume: 1.5,
          cbm: 1.5,
          transportMode: 'aerien',
          estimatedDelivery: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 jours à partir d'aujourd'hui
          value: 1200,
          currency: 'EUR',
          description: 'Produits cosmétiques',
          documents: ['facture_commerciale.pdf']
        }
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération des expéditions:', error)
      return []
    }
  }

  static async getPendingInvoices(userId: string): Promise<InvoiceContext[]> {
    try {
      // Simulation de factures en attente
      return [
        {
          id: 'inv_001',
          reference: 'F-2024-1205',
          amount: 780,
          currency: 'EUR',
          status: 'pending',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 jours à partir d'aujourd'hui
          shipmentId: 'ship_001',
          description: 'Transport maritime DKR240815'
        }
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error)
      return []
    }
  }

  static async getSupportHistory(userId: string): Promise<SupportHistoryContext> {
    try {
      return {
        recentTickets: [
          {
            id: 'ticket_001',
            subject: 'Retard de livraison',
            status: 'resolved',
            createdAt: new Date('2024-08-10'),
            category: 'livraison'
          }
        ],
        commonIssues: ['retard_livraison', 'facturation', 'documentation'],
        satisfactionScore: 4.2
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique support:', error)
      return {
        recentTickets: [],
        commonIssues: [],
        satisfactionScore: 0
      }
    }
  }

  static async getPlatformData(): Promise<ChatContext['platformData']> {
    try {
      return {
        routes: [
          {
            origin: 'Dakar',
            destination: 'Paris',
            maritimePrice: 250, // €/CBM
            aerienPrice: 950, // €/CBM
            transitTime: { maritime: 22, aerien: 5 }
          },
          {
            origin: 'Abidjan',
            destination: 'Marseille',
            maritimePrice: 280,
            aerienPrice: 1100,
            transitTime: { maritime: 25, aerien: 6 }
          }
        ],
        currentPromotions: [
          {
            id: 'promo_001',
            description: 'Remise fidélité 5% sur transport maritime',
            discount: 5,
            validUntil: new Date('2024-09-30')
          }
        ]
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données plateforme:', error)
      return { routes: [], currentPromotions: [] }
    }
  }

  static async getFullContext(userId: string): Promise<ChatContext | null> {
    try {
      const [user, shipments, invoices, supportHistory, platformData] = await Promise.all([
        this.getUserContext(userId),
        this.getActiveShipments(userId),
        this.getPendingInvoices(userId),
        this.getSupportHistory(userId),
        this.getPlatformData()
      ])

      if (!user) return null

      return {
        user,
        activeShipments: shipments,
        pendingInvoices: invoices,
        supportHistory,
        platformData
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du contexte complet:', error)
      return null
    }
  }

  static generateContextualGreeting(context: ChatContext): string {
    const { user } = context
    
    // Message d'accueil simple et personnalisé
    const casualGreetings = [
      `Salut ${user.name} ! 👋 Comment ça va aujourd'hui ?`,
      `Hey ${user.name} ! 😊 Que puis-je faire pour vous ?`,
      `Bonjour ${user.name} ! 🌟 Comment puis-je vous aider ?`,
      `Coucou ${user.name} ! 👋 Tout va bien de votre côté ?`
    ]
    
    return casualGreetings[Math.floor(Math.random() * casualGreetings.length)]
  }

  private static getStatusText(status: ShipmentContext['status']): string {
    const statusMap = {
      'preparation': 'En préparation',
      'expedie': 'Expédié',
      'transit': 'En transit',
      'douane': 'Dédouanement',
      'livraison': 'En livraison',
      'livre': 'Livré'
    }
    return statusMap[status] || status
  }
}
