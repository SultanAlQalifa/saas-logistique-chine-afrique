import { ChatbotTools } from './chatbot-tools'

export interface TrackingEvent {
  id: string
  timestamp: Date
  status: string
  location: string
  description: string
  coordinates?: { lat: number; lng: number }
  estimatedDelay?: number
  nextUpdate?: Date
}

export interface ShipmentDetails {
  id: string
  trackingNumber: string
  status: 'preparation' | 'transit' | 'customs' | 'delivery' | 'delivered' | 'exception'
  origin: {
    city: string
    country: string
    port?: string
    coordinates: { lat: number; lng: number }
  }
  destination: {
    city: string
    country: string
    port?: string
    coordinates: { lat: number; lng: number }
  }
  mode: 'maritime' | 'aerien' | 'routier'
  vessel?: {
    name: string
    imo?: string
    flag: string
    eta: Date
    currentPosition?: { lat: number; lng: number }
  }
  flight?: {
    number: string
    aircraft: string
    departure: Date
    arrival: Date
  }
  cargo: {
    description: string
    weight: number
    volume: number
    pieces: number
    value: number
    currency: string
    dangerous?: boolean
  }
  documents: Array<{
    type: 'bill_of_lading' | 'commercial_invoice' | 'packing_list' | 'certificate' | 'insurance'
    name: string
    url: string
    status: 'pending' | 'available' | 'signed'
  }>
  events: TrackingEvent[]
  estimatedDelivery: Date
  actualDelivery?: Date
  delays: Array<{
    reason: string
    duration: number
    impact: 'low' | 'medium' | 'high'
  }>
  contacts: {
    shipper: { name: string; phone: string; email: string }
    consignee: { name: string; phone: string; email: string }
    agent?: { name: string; phone: string; email: string }
  }
}

export interface TrackingResponse {
  shipment: ShipmentDetails
  summary: string
  alerts: Array<{
    type: 'info' | 'warning' | 'error'
    message: string
    action?: string
  }>
  recommendations: string[]
  nextSteps: Array<{
    action: string
    description: string
    urgent: boolean
  }>
}

export class AdvancedTrackingSystem {
  private static instance: AdvancedTrackingSystem
  private shipments: Map<string, ShipmentDetails> = new Map()

  private constructor() {
    this.initializeSampleData()
  }

  static getInstance(): AdvancedTrackingSystem {
    if (!AdvancedTrackingSystem.instance) {
      AdvancedTrackingSystem.instance = new AdvancedTrackingSystem()
    }
    return AdvancedTrackingSystem.instance
  }

  private initializeSampleData() {
    // Expédition maritime en transit
    const maritimeShipment: ShipmentDetails = {
      id: 'ship_001',
      trackingNumber: 'DKR240815',
      status: 'transit',
      origin: {
        city: 'Guangzhou',
        country: 'Chine',
        port: 'Port de Guangzhou',
        coordinates: { lat: 23.1291, lng: 113.2644 }
      },
      destination: {
        city: 'Dakar',
        country: 'Sénégal',
        port: 'Port Autonome de Dakar',
        coordinates: { lat: 14.6928, lng: -17.4467 }
      },
      mode: 'maritime',
      vessel: {
        name: 'CMA CGM BOUGAINVILLE',
        imo: '9454436',
        flag: 'France',
        eta: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        currentPosition: { lat: 10.5, lng: -15.2 }
      },
      cargo: {
        description: 'Textile et accessoires de mode',
        weight: 500,
        volume: 3.2,
        pieces: 25,
        value: 2500,
        currency: 'EUR',
        dangerous: false
      },
      documents: [
        {
          type: 'bill_of_lading',
          name: 'Connaissement CMACGM-DKR240815.pdf',
          url: '/documents/bl/DKR240815.pdf',
          status: 'available'
        },
        {
          type: 'commercial_invoice',
          name: 'Facture commerciale.pdf',
          url: '/documents/invoice/DKR240815.pdf',
          status: 'available'
        },
        {
          type: 'packing_list',
          name: 'Liste de colisage.pdf',
          url: '/documents/packing/DKR240815.pdf',
          status: 'available'
        },
        {
          type: 'certificate',
          name: 'Certificat origine Chine.pdf',
          url: '/documents/cert/DKR240815.pdf',
          status: 'available'
        }
      ],
      events: [
        {
          id: 'evt_001',
          timestamp: new Date('2024-08-15T08:00:00Z'),
          status: 'Départ confirmé',
          location: 'Port de Guangzhou, Chine',
          description: 'Conteneur chargé à bord du CMA CGM BOUGAINVILLE',
          coordinates: { lat: 23.1291, lng: 113.2644 }
        },
        {
          id: 'evt_002',
          timestamp: new Date('2024-08-18T14:30:00Z'),
          status: 'Transit',
          location: 'Détroit de Malacca',
          description: 'Navire en transit, navigation normale',
          coordinates: { lat: 1.4419, lng: 103.7041 }
        },
        {
          id: 'evt_003',
          timestamp: new Date('2024-08-20T09:15:00Z'),
          status: 'Transit',
          location: 'Océan Indien',
          description: 'Passage Canal de Suez prévu dans 48h',
          coordinates: { lat: -10.5, lng: 65.2 }
        }
      ],
      estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      delays: [],
      contacts: {
        shipper: {
          name: 'Guangzhou Export Co.',
          phone: '+86 20 8888 9999',
          email: 'export@gzcompany.com'
        },
        consignee: {
          name: 'Amadou Diallo',
          phone: '+221 77 123 4567',
          email: 'amadou.diallo@example.com'
        },
        agent: {
          name: 'NextMove Cargo Dakar',
          phone: '+221 33 123 4567',
          email: 'dakar@nextmove.com'
        }
      }
    }

    // Expédition aérienne en préparation
    const airShipment: ShipmentDetails = {
      id: 'ship_002',
      trackingNumber: 'ABJ240820',
      status: 'preparation',
      origin: {
        city: 'Shenzhen',
        country: 'Chine',
        coordinates: { lat: 22.5431, lng: 114.0579 }
      },
      destination: {
        city: 'Abidjan',
        country: 'Côte d\'Ivoire',
        coordinates: { lat: 5.3600, lng: -4.0083 }
      },
      mode: 'aerien',
      flight: {
        number: 'EK384',
        aircraft: 'Boeing 777F',
        departure: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        arrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      cargo: {
        description: 'Produits cosmétiques et parfums',
        weight: 200,
        volume: 1.5,
        pieces: 12,
        value: 1200,
        currency: 'EUR',
        dangerous: false
      },
      documents: [
        {
          type: 'commercial_invoice',
          name: 'Facture commerciale ABJ240820.pdf',
          url: '/documents/invoice/ABJ240820.pdf',
          status: 'available'
        },
        {
          type: 'packing_list',
          name: 'Liste colisage ABJ240820.pdf',
          url: '/documents/packing/ABJ240820.pdf',
          status: 'pending'
        }
      ],
      events: [
        {
          id: 'evt_004',
          timestamp: new Date('2024-08-20T10:00:00Z'),
          status: 'Réception marchandise',
          location: 'Entrepôt NextMove Shenzhen',
          description: 'Marchandise réceptionnée et vérifiée',
          coordinates: { lat: 22.5431, lng: 114.0579 }
        },
        {
          id: 'evt_005',
          timestamp: new Date('2024-08-21T15:30:00Z'),
          status: 'Préparation export',
          location: 'Aéroport Shenzhen Bao\'an',
          description: 'Préparation documents douaniers en cours',
          coordinates: { lat: 22.6393, lng: 113.8108 },
          nextUpdate: new Date(Date.now() + 6 * 60 * 60 * 1000)
        }
      ],
      estimatedDelivery: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      delays: [],
      contacts: {
        shipper: {
          name: 'Shenzhen Beauty Ltd',
          phone: '+86 755 1234 5678',
          email: 'export@szbeauty.com'
        },
        consignee: {
          name: 'Amadou Diallo',
          phone: '+225 07 12 34 56 78',
          email: 'amadou.diallo@example.com'
        }
      }
    }

    this.shipments.set('DKR240815', maritimeShipment)
    this.shipments.set('ABJ240820', airShipment)
  }

  async getDetailedTracking(trackingNumber: string): Promise<TrackingResponse | null> {
    const shipment = this.shipments.get(trackingNumber.toUpperCase())
    
    if (!shipment) {
      return null
    }

    // Générer un résumé intelligent
    const summary = this.generateIntelligentSummary(shipment)
    
    // Détecter les alertes
    const alerts = this.detectAlerts(shipment)
    
    // Générer des recommandations
    const recommendations = this.generateRecommendations(shipment)
    
    // Définir les prochaines étapes
    const nextSteps = this.getNextSteps(shipment)

    return {
      shipment,
      summary,
      alerts,
      recommendations,
      nextSteps
    }
  }

  private generateIntelligentSummary(shipment: ShipmentDetails): string {
    const { trackingNumber, status, mode, origin, destination, estimatedDelivery } = shipment
    
    const daysToDelivery = Math.ceil((estimatedDelivery.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    const progressPercentage = this.calculateProgress(shipment)
    
    let summary = `🚢 **${trackingNumber}** - ${mode.charAt(0).toUpperCase() + mode.slice(1)}\n\n`
    summary += `📍 **${origin.city}, ${origin.country}** → **${destination.city}, ${destination.country}**\n\n`
    
    // Statut actuel avec contexte
    switch (status) {
      case 'preparation':
        summary += `📋 **En préparation** - Documents et formalités en cours\n`
        break
      case 'transit':
        summary += `🌊 **En transit** - Navigation en cours (${progressPercentage}% du trajet)\n`
        if (shipment.vessel) {
          summary += `🚢 À bord du **${shipment.vessel.name}**\n`
        }
        break
      case 'customs':
        summary += `🛃 **Dédouanement** - Formalités douanières en cours\n`
        break
      case 'delivery':
        summary += `🚚 **En livraison** - Acheminement vers destination finale\n`
        break
      case 'delivered':
        summary += `✅ **Livré** - Marchandise remise au destinataire\n`
        break
    }
    
    // Timing
    if (daysToDelivery > 0) {
      summary += `⏰ **Livraison prévue** : ${estimatedDelivery.toLocaleDateString('fr-FR')} (${daysToDelivery} jour${daysToDelivery > 1 ? 's' : ''})\n\n`
    }
    
    // Informations cargo
    summary += `📦 **Cargo** : ${shipment.cargo.description}\n`
    summary += `⚖️ ${shipment.cargo.weight}kg • 📐 ${shipment.cargo.volume}m³ • 📊 ${shipment.cargo.pieces} colis\n`
    summary += `💰 Valeur déclarée : ${shipment.cargo.value}${shipment.cargo.currency}\n`

    return summary
  }

  private calculateProgress(shipment: ShipmentDetails): number {
    const totalEvents = shipment.mode === 'maritime' ? 8 : 5 // Estimation basée sur le mode
    const currentEvents = shipment.events.length
    return Math.min(Math.round((currentEvents / totalEvents) * 100), 95)
  }

  private detectAlerts(shipment: ShipmentDetails): Array<{ type: 'info' | 'warning' | 'error'; message: string; action?: string }> {
    const alerts: Array<{ type: 'info' | 'warning' | 'error'; message: string; action?: string }> = []
    
    // Vérifier les retards
    if (shipment.delays.length > 0) {
      const totalDelay = shipment.delays.reduce((sum, delay) => sum + delay.duration, 0)
      if (totalDelay > 24) {
        alerts.push({
          type: 'warning',
          message: `Retard de ${Math.round(totalDelay / 24)} jour(s) détecté`,
          action: 'Contacter l\'agent pour plus d\'informations'
        })
      }
    }
    
    // Vérifier les documents manquants
    const pendingDocs = shipment.documents.filter(doc => doc.status === 'pending')
    if (pendingDocs.length > 0) {
      alerts.push({
        type: 'info',
        message: `${pendingDocs.length} document(s) en attente`,
        action: 'Vérifier avec l\'expéditeur'
      })
    }
    
    // Vérifier la proximité de livraison
    const daysToDelivery = Math.ceil((shipment.estimatedDelivery.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    if (daysToDelivery <= 2 && shipment.status !== 'delivered') {
      alerts.push({
        type: 'info',
        message: 'Livraison imminente - Préparez la réception',
        action: 'Vérifier disponibilité destinataire'
      })
    }
    
    return alerts
  }

  private generateRecommendations(shipment: ShipmentDetails): string[] {
    const recommendations = []
    
    // Recommandations basées sur le statut
    switch (shipment.status) {
      case 'preparation':
        recommendations.push('Vérifiez que tous les documents sont complets')
        recommendations.push('Confirmez les coordonnées du destinataire')
        break
      case 'transit':
        recommendations.push('Surveillez les mises à jour de position')
        recommendations.push('Préparez les formalités de réception')
        break
      case 'customs':
        recommendations.push('Tenez-vous prêt pour d\'éventuels documents additionnels')
        recommendations.push('Vérifiez les frais de dédouanement')
        break
      case 'delivery':
        recommendations.push('Assurez-vous de la disponibilité du destinataire')
        recommendations.push('Préparez un espace de stockage si nécessaire')
        break
    }
    
    // Recommandations spécifiques au mode de transport
    if (shipment.mode === 'maritime' && shipment.cargo.dangerous) {
      recommendations.push('Marchandise dangereuse - Respectez les procédures spéciales')
    }
    
    if (shipment.cargo.value > 5000) {
      recommendations.push('Valeur élevée - Considérez une assurance complémentaire')
    }
    
    return recommendations
  }

  private getNextSteps(shipment: ShipmentDetails): Array<{ action: string; description: string; urgent: boolean }> {
    const nextSteps = []
    
    switch (shipment.status) {
      case 'preparation':
        nextSteps.push({
          action: 'Finaliser documents',
          description: 'Compléter les documents manquants pour accélérer le départ',
          urgent: true
        })
        break
      case 'transit':
        nextSteps.push({
          action: 'Préparer réception',
          description: 'Organiser la logistique de réception à destination',
          urgent: false
        })
        if (shipment.mode === 'maritime') {
          nextSteps.push({
            action: 'Surveiller ETA',
            description: 'Suivre l\'heure d\'arrivée estimée du navire',
            urgent: false
          })
        }
        break
      case 'customs':
        nextSteps.push({
          action: 'Assistance douanière',
          description: 'Contacter l\'agent pour le statut du dédouanement',
          urgent: true
        })
        break
      case 'delivery':
        nextSteps.push({
          action: 'Confirmer livraison',
          description: 'Être disponible pour réceptionner la marchandise',
          urgent: true
        })
        break
    }
    
    return nextSteps
  }

  async searchShipments(userId: string, query?: string): Promise<ShipmentDetails[]> {
    // Simulation de recherche par utilisateur
    const userShipments = Array.from(this.shipments.values()).filter(shipment => 
      shipment.contacts.consignee.email === 'amadou.diallo@example.com'
    )
    
    if (query) {
      const queryLower = query.toLowerCase()
      return userShipments.filter(shipment =>
        shipment.trackingNumber.toLowerCase().includes(queryLower) ||
        shipment.cargo.description.toLowerCase().includes(queryLower) ||
        shipment.origin.city.toLowerCase().includes(queryLower) ||
        shipment.destination.city.toLowerCase().includes(queryLower)
      )
    }
    
    return userShipments
  }

  generateTrackingMessage(trackingResponse: TrackingResponse): string {
    const { shipment, summary, alerts, recommendations, nextSteps } = trackingResponse
    
    let message = summary + '\n\n'
    
    // Événements récents
    if (shipment.events.length > 0) {
      message += '📋 **Derniers événements** :\n'
      shipment.events.slice(-3).forEach(event => {
        message += `• ${event.timestamp.toLocaleDateString('fr-FR')} : ${event.description}\n`
      })
      message += '\n'
    }
    
    // Alertes
    if (alerts.length > 0) {
      message += '⚠️ **Alertes** :\n'
      alerts.forEach(alert => {
        const emoji = alert.type === 'error' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵'
        message += `${emoji} ${alert.message}\n`
      })
      message += '\n'
    }
    
    // Prochaines étapes urgentes
    const urgentSteps = nextSteps.filter(step => step.urgent)
    if (urgentSteps.length > 0) {
      message += '🚨 **Actions requises** :\n'
      urgentSteps.forEach(step => {
        message += `• **${step.action}** : ${step.description}\n`
      })
      message += '\n'
    }
    
    // Documents disponibles
    const availableDocs = shipment.documents.filter(doc => doc.status === 'available')
    if (availableDocs.length > 0) {
      message += '📄 **Documents disponibles** :\n'
      availableDocs.forEach(doc => {
        message += `• ${doc.name}\n`
      })
    }
    
    return message
  }
}
