// Service pour le routage automatique et manuel des conversations WhatsApp
export interface RoutingRule {
  id: string
  name: string
  priority: number
  conditions: RoutingCondition[]
  targetProvider: string
  targetType: 'company' | 'super_admin'
  active: boolean
  description: string
}

export interface RoutingCondition {
  type: 'keyword' | 'time' | 'language' | 'location' | 'client_type' | 'urgency'
  operator: 'contains' | 'equals' | 'in_range' | 'matches'
  value: string | string[]
  weight: number
}

export interface ConversationRouting {
  conversationId: string
  clientId: string
  currentProvider: string
  currentProviderType: 'company' | 'super_admin'
  routingMethod: 'automatic' | 'manual'
  routingReason: string
  routingScore?: number
  routingHistory: RoutingHistoryEntry[]
  canTransfer: boolean
  transferRequested?: boolean
  transferReason?: string
}

export interface RoutingHistoryEntry {
  timestamp: string
  fromProvider: string
  toProvider: string
  method: 'automatic' | 'manual' | 'transfer'
  reason: string
  score?: number
}

export interface ProviderAvailability {
  providerId: string
  providerType: 'company' | 'super_admin'
  available: boolean
  currentLoad: number
  maxCapacity: number
  responseTime: number
  specialties: string[]
  workingHours: {
    start: string
    end: string
    timezone: string
    days: string[]
  }
}

export class WhatsAppRoutingService {
  private static readonly API_BASE = '/api/whatsapp/routing'

  /**
   * Règles de routage prédéfinies
   */
  static getDefaultRoutingRules(): RoutingRule[] {
    return [
      {
        id: 'urgent_support',
        name: 'Support Urgent',
        priority: 1,
        conditions: [
          {
            type: 'keyword',
            operator: 'contains',
            value: ['urgent', 'problème', 'bloqué', 'erreur', 'panne'],
            weight: 0.8
          },
          {
            type: 'urgency',
            operator: 'equals',
            value: 'high',
            weight: 0.9
          }
        ],
        targetProvider: 'super_admin',
        targetType: 'super_admin',
        active: true,
        description: 'Rediriger les demandes urgentes vers le support officiel'
      },
      {
        id: 'senegal_shipping',
        name: 'Expédition Sénégal',
        priority: 2,
        conditions: [
          {
            type: 'keyword',
            operator: 'contains',
            value: ['sénégal', 'dakar', 'maritime', 'dédouanement'],
            weight: 0.7
          },
          {
            type: 'location',
            operator: 'equals',
            value: 'SN',
            weight: 0.6
          }
        ],
        targetProvider: 'logitrans_senegal',
        targetType: 'company',
        active: true,
        description: 'Rediriger les expéditions Sénégal vers LogiTrans'
      },
      {
        id: 'mali_express',
        name: 'Express Mali',
        priority: 3,
        conditions: [
          {
            type: 'keyword',
            operator: 'contains',
            value: ['mali', 'bamako', 'express', 'aérien'],
            weight: 0.7
          },
          {
            type: 'location',
            operator: 'equals',
            value: 'ML',
            weight: 0.6
          }
        ],
        targetProvider: 'cargo_express_mali',
        targetType: 'company',
        active: true,
        description: 'Rediriger les expéditions Mali vers Cargo Express'
      },
      {
        id: 'west_africa_network',
        name: 'Réseau Afrique Ouest',
        priority: 4,
        conditions: [
          {
            type: 'keyword',
            operator: 'contains',
            value: ['côte d\'ivoire', 'ghana', 'burkina', 'multi-pays'],
            weight: 0.6
          },
          {
            type: 'location',
            operator: 'in_range',
            value: ['CI', 'GH', 'BF'],
            weight: 0.7
          }
        ],
        targetProvider: 'west_africa_logistics',
        targetType: 'company',
        active: true,
        description: 'Rediriger vers West Africa Logistics pour le réseau régional'
      },
      {
        id: 'business_hours_fallback',
        name: 'Heures Ouvrables - Fallback',
        priority: 5,
        conditions: [
          {
            type: 'time',
            operator: 'in_range',
            value: ['22:00', '08:00'],
            weight: 0.5
          }
        ],
        targetProvider: 'super_admin',
        targetType: 'super_admin',
        active: true,
        description: 'Support 24/7 en dehors des heures ouvrables'
      }
    ]
  }

  /**
   * Évalue le routage automatique pour une conversation
   */
  static async evaluateRouting(
    message: string,
    clientContext: {
      location?: string
      language?: string
      clientType?: string
      urgency?: 'low' | 'medium' | 'high'
    }
  ): Promise<{
    recommendedProvider: string
    providerType: 'company' | 'super_admin'
    score: number
    reason: string
    alternatives: Array<{
      provider: string
      type: 'company' | 'super_admin'
      score: number
    }>
  }> {
    const rules = this.getDefaultRoutingRules()
    const scores: Array<{
      provider: string
      type: 'company' | 'super_admin'
      score: number
      reason: string
    }> = []

    // Évaluer chaque règle
    for (const rule of rules.filter(r => r.active)) {
      let ruleScore = 0
      let matchedConditions: string[] = []

      for (const condition of rule.conditions) {
        const conditionScore = this.evaluateCondition(condition, message, clientContext)
        if (conditionScore > 0) {
          ruleScore += conditionScore * condition.weight
          matchedConditions.push(`${condition.type}: ${condition.value}`)
        }
      }

      if (ruleScore > 0) {
        scores.push({
          provider: rule.targetProvider,
          type: rule.targetType,
          score: ruleScore * (rule.priority / 10), // Pondération par priorité
          reason: `${rule.name} (${matchedConditions.join(', ')})`
        })
      }
    }

    // Trier par score décroissant
    scores.sort((a, b) => b.score - a.score)

    if (scores.length === 0) {
      // Fallback vers support officiel
      return {
        recommendedProvider: 'super_admin',
        providerType: 'super_admin',
        score: 0.5,
        reason: 'Aucune règle correspondante - Support par défaut',
        alternatives: []
      }
    }

    const best = scores[0]
    const alternatives = scores.slice(1, 4) // Top 3 alternatives

    return {
      recommendedProvider: best.provider,
      providerType: best.type,
      score: best.score,
      reason: best.reason,
      alternatives
    }
  }

  /**
   * Évalue une condition de routage
   */
  private static evaluateCondition(
    condition: RoutingCondition,
    message: string,
    context: any
  ): number {
    const messageLower = message.toLowerCase()

    switch (condition.type) {
      case 'keyword':
        const keywords = Array.isArray(condition.value) ? condition.value : [condition.value]
        const matchedKeywords = keywords.filter(keyword => 
          messageLower.includes(keyword.toLowerCase())
        )
        return matchedKeywords.length > 0 ? matchedKeywords.length / keywords.length : 0

      case 'location':
        if (!context.location) return 0
        if (condition.operator === 'equals') {
          return context.location === condition.value ? 1 : 0
        }
        if (condition.operator === 'in_range') {
          const locations = Array.isArray(condition.value) ? condition.value : [condition.value]
          return locations.includes(context.location) ? 1 : 0
        }
        return 0

      case 'urgency':
        if (!context.urgency) return 0
        return context.urgency === condition.value ? 1 : 0

      case 'time':
        const now = new Date()
        const currentHour = now.getHours()
        if (condition.operator === 'in_range' && Array.isArray(condition.value)) {
          const [start, end] = condition.value.map(t => parseInt(t.split(':')[0]))
          if (start > end) {
            // Plage nocturne (ex: 22:00 - 08:00)
            return (currentHour >= start || currentHour <= end) ? 1 : 0
          } else {
            // Plage normale
            return (currentHour >= start && currentHour <= end) ? 1 : 0
          }
        }
        return 0

      case 'language':
        if (!context.language) return 0
        return context.language === condition.value ? 1 : 0

      case 'client_type':
        if (!context.clientType) return 0
        return context.clientType === condition.value ? 1 : 0

      default:
        return 0
    }
  }

  /**
   * Crée une conversation avec routage
   */
  static async createRoutedConversation(
    clientId: string,
    initialMessage: string,
    clientContext: any,
    routingMethod: 'automatic' | 'manual' = 'automatic',
    manualProvider?: string
  ): Promise<ConversationRouting> {
    let selectedProvider: string
    let providerType: 'company' | 'super_admin'
    let routingReason: string
    let routingScore: number | undefined

    if (routingMethod === 'manual' && manualProvider) {
      // Routage manuel
      const providers = [
        { id: 'super_admin', type: 'super_admin' as const },
        { id: 'logitrans_senegal', type: 'company' as const },
        { id: 'cargo_express_mali', type: 'company' as const },
        { id: 'west_africa_logistics', type: 'company' as const }
      ]
      
      const provider = providers.find(p => p.id === manualProvider)
      selectedProvider = provider?.id || 'super_admin'
      providerType = provider?.type || 'super_admin'
      routingReason = 'Sélection manuelle par le client'
    } else {
      // Routage automatique
      const routing = await this.evaluateRouting(initialMessage, clientContext)
      selectedProvider = routing.recommendedProvider
      providerType = routing.providerType
      routingReason = routing.reason
      routingScore = routing.score
    }

    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      conversationId,
      clientId,
      currentProvider: selectedProvider,
      currentProviderType: providerType,
      routingMethod,
      routingReason,
      routingScore,
      routingHistory: [{
        timestamp: new Date().toISOString(),
        fromProvider: 'none',
        toProvider: selectedProvider,
        method: routingMethod,
        reason: routingReason,
        score: routingScore
      }],
      canTransfer: true
    }
  }

  /**
   * Transfère une conversation vers un autre provider
   */
  static async transferConversation(
    conversationId: string,
    newProvider: string,
    newProviderType: 'company' | 'super_admin',
    reason: string,
    method: 'automatic' | 'manual' = 'manual'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          newProvider,
          newProviderType,
          reason,
          method
        })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors du transfert:', error)
      return { success: false, message: 'Erreur de transfert' }
    }
  }

  /**
   * Récupère les providers disponibles avec leur charge actuelle
   */
  static async getProviderAvailability(): Promise<ProviderAvailability[]> {
    // Mock data pour la démonstration
    return [
      {
        providerId: 'super_admin',
        providerType: 'super_admin',
        available: true,
        currentLoad: 15,
        maxCapacity: 100,
        responseTime: 3,
        specialties: ['Support technique', 'Questions générales', 'Aide urgente'],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'Africa/Dakar',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }
      },
      {
        providerId: 'logitrans_senegal',
        providerType: 'company',
        available: true,
        currentLoad: 8,
        maxCapacity: 25,
        responseTime: 8,
        specialties: ['Transport maritime', 'Dédouanement Sénégal', 'Livraison Dakar'],
        workingHours: {
          start: '08:00',
          end: '18:00',
          timezone: 'Africa/Dakar',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      },
      {
        providerId: 'cargo_express_mali',
        providerType: 'company',
        available: true,
        currentLoad: 5,
        maxCapacity: 20,
        responseTime: 12,
        specialties: ['Transport aérien', 'Transport routier', 'Livraison Mali'],
        workingHours: {
          start: '07:00',
          end: '19:00',
          timezone: 'Africa/Bamako',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        }
      },
      {
        providerId: 'west_africa_logistics',
        providerType: 'company',
        available: false, // Hors ligne
        currentLoad: 0,
        maxCapacity: 30,
        responseTime: 15,
        specialties: ['Réseau Afrique Ouest', 'Multi-pays', 'Logistique intégrée'],
        workingHours: {
          start: '08:00',
          end: '17:00',
          timezone: 'Africa/Abidjan',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        }
      }
    ]
  }

  /**
   * Suggère un changement de provider basé sur le contexte
   */
  static async suggestProviderChange(
    conversationId: string,
    newMessage: string
  ): Promise<{
    shouldSuggest: boolean
    suggestedProvider?: string
    suggestedType?: 'company' | 'super_admin'
    reason?: string
    confidence: number
  }> {
    // Analyser le nouveau message pour détecter un changement de besoin
    const routing = await this.evaluateRouting(newMessage, {})
    
    // Si le score est élevé et différent du provider actuel
    if (routing.score > 0.7) {
      return {
        shouldSuggest: true,
        suggestedProvider: routing.recommendedProvider,
        suggestedType: routing.providerType,
        reason: routing.reason,
        confidence: routing.score
      }
    }

    return {
      shouldSuggest: false,
      confidence: routing.score
    }
  }
}
