// Intelligence Artificielle Marketing - Système de recommandations et optimisation

export interface MarketingData {
  campaigns: Array<{
    id: string
    name: string
    type: 'email' | 'sms' | 'social' | 'display'
    budget: number
    spent: number
    impressions: number
    clicks: number
    conversions: number
    startDate: string
    endDate: string
    targetAudience: string
    geography: string[]
  }>
  promotions: Array<{
    id: string
    name: string
    discount: number
    usage: number
    revenue: number
    startDate: string
    endDate: string
  }>
  businessMetrics: {
    totalRevenue: number
    averageOrderValue: number
    customerAcquisitionCost: number
    lifetimeValue: number
    seasonalTrends: Record<string, number>
  }
}

export interface AIRecommendation {
  id: string
  type: 'campaign' | 'budget' | 'audience' | 'timing' | 'promotion'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  expectedImpact: string
  confidence: number // 0-100
  estimatedROI: number
  implementation: {
    action: string
    budget: number
    duration: number
    steps: string[]
  }
  reasoning: string[]
}

export interface PredictiveAnalytics {
  nextMonthRevenue: number
  bestPerformingChannels: string[]
  optimalBudgetDistribution: Record<string, number>
  seasonalRecommendations: Array<{
    period: string
    action: string
    expectedLift: number
  }>
}

export class AIMarketingEngine {
  private data: MarketingData

  constructor(data: MarketingData) {
    this.data = data
  }

  // Génère des recommandations basées sur les performances historiques
  generateRecommendations(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []

    // Analyse des performances de campagnes
    const campaignPerformance = this.analyzeCampaignPerformance()
    recommendations.push(...campaignPerformance)

    // Optimisation budgétaire
    const budgetOptimization = this.optimizeBudgetAllocation()
    recommendations.push(...budgetOptimization)

    // Recommandations d'audience
    const audienceInsights = this.analyzeAudiencePerformance()
    recommendations.push(...audienceInsights)

    // Timing optimal
    const timingRecommendations = this.optimizeTiming()
    recommendations.push(...timingRecommendations)

    return recommendations.sort((a, b) => b.confidence - a.confidence)
  }

  private analyzeCampaignPerformance(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    
    // Analyse ROI par type de campagne
    const campaignROI = this.data.campaigns.map(campaign => ({
      ...campaign,
      roi: campaign.spent > 0 ? (campaign.conversions * this.data.businessMetrics.averageOrderValue - campaign.spent) / campaign.spent : 0,
      ctr: campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0,
      conversionRate: campaign.clicks > 0 ? campaign.conversions / campaign.clicks : 0
    }))

    // Recommandation pour les campagnes les plus performantes
    const bestPerforming = campaignROI.filter(c => c.roi > 2).sort((a, b) => b.roi - a.roi)[0]
    if (bestPerforming) {
      recommendations.push({
        id: 'scale-best-campaign',
        type: 'campaign',
        priority: 'high',
        title: 'Augmenter le budget des campagnes performantes',
        description: `La campagne "${bestPerforming.name}" génère un ROI de ${(bestPerforming.roi * 100).toFixed(0)}%. Augmentez son budget pour maximiser les profits.`,
        expectedImpact: '+35% de revenus',
        confidence: 92,
        estimatedROI: bestPerforming.roi * 1.3,
        implementation: {
          action: 'Augmenter le budget de 50%',
          budget: bestPerforming.budget * 1.5,
          duration: 30,
          steps: [
            'Analyser la capacité d\'inventaire',
            'Augmenter progressivement le budget',
            'Monitorer les performances quotidiennement',
            'Ajuster selon les résultats'
          ]
        },
        reasoning: [
          `ROI actuel de ${(bestPerforming.roi * 100).toFixed(0)}% supérieur à la moyenne`,
          `Taux de conversion de ${(bestPerforming.conversionRate * 100).toFixed(1)}%`,
          'Audience engagée et réceptive',
          'Potentiel de scaling identifié'
        ]
      })
    }

    // Recommandation pour les campagnes sous-performantes
    const underPerforming = campaignROI.filter(c => c.roi < 0.5 && c.spent > 10000)
    if (underPerforming.length > 0) {
      recommendations.push({
        id: 'optimize-underperforming',
        type: 'campaign',
        priority: 'high',
        title: 'Optimiser les campagnes sous-performantes',
        description: `${underPerforming.length} campagne(s) génèrent un ROI négatif. Optimisation urgente recommandée.`,
        expectedImpact: 'Économies de 40%',
        confidence: 88,
        estimatedROI: 1.2,
        implementation: {
          action: 'Réviser ciblage et créatifs',
          budget: 0,
          duration: 14,
          steps: [
            'Analyser les audiences non-converteuses',
            'Tester de nouveaux créatifs',
            'Affiner le ciblage géographique',
            'Réduire ou arrêter si pas d\'amélioration'
          ]
        },
        reasoning: [
          'ROI négatif détecté',
          'Budget gaspillé identifié',
          'Opportunité d\'optimisation majeure'
        ]
      })
    }

    return recommendations
  }

  private optimizeBudgetAllocation(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    
    // Calcul de la distribution optimale basée sur les performances
    const totalBudget = this.data.campaigns.reduce((sum, c) => sum + c.budget, 0)
    const totalRevenue = this.data.campaigns.reduce((sum, c) => sum + (c.conversions * this.data.businessMetrics.averageOrderValue), 0)
    
    if (totalRevenue > 0) {
      recommendations.push({
        id: 'budget-reallocation',
        type: 'budget',
        priority: 'medium',
        title: 'Réallocation budgétaire intelligente',
        description: 'Redistribuez votre budget vers les canaux les plus rentables pour maximiser le ROI global.',
        expectedImpact: '+25% ROI global',
        confidence: 85,
        estimatedROI: 2.1,
        implementation: {
          action: 'Redistribuer le budget selon les performances',
          budget: totalBudget,
          duration: 7,
          steps: [
            'Identifier les canaux les plus rentables',
            'Calculer la nouvelle répartition',
            'Implémenter progressivement',
            'Mesurer l\'impact'
          ]
        },
        reasoning: [
          'Analyse des performances par canal',
          'Optimisation mathématique du ROI',
          'Données historiques probantes'
        ]
      })
    }

    return recommendations
  }

  private analyzeAudiencePerformance(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    
    // Analyse des géographies les plus performantes
    const geoPerformance = new Map<string, { conversions: number, spend: number }>()
    
    this.data.campaigns.forEach(campaign => {
      campaign.geography.forEach(geo => {
        const current = geoPerformance.get(geo) || { conversions: 0, spend: 0 }
        geoPerformance.set(geo, {
          conversions: current.conversions + campaign.conversions,
          spend: current.spend + campaign.spent
        })
      })
    })

    const bestGeo = Array.from(geoPerformance.entries())
      .map(([geo, data]) => ({ geo, roi: data.spend > 0 ? (data.conversions * this.data.businessMetrics.averageOrderValue) / data.spend : 0 }))
      .sort((a, b) => b.roi - a.roi)[0]

    if (bestGeo && bestGeo.roi > 1.5) {
      recommendations.push({
        id: 'expand-best-geography',
        type: 'audience',
        priority: 'medium',
        title: `Expansion géographique vers ${bestGeo.geo}`,
        description: `${bestGeo.geo} montre un ROI exceptionnel de ${(bestGeo.roi * 100).toFixed(0)}%. Augmentez votre présence dans cette région.`,
        expectedImpact: '+30% de conversions',
        confidence: 78,
        estimatedROI: bestGeo.roi,
        implementation: {
          action: 'Augmenter le ciblage géographique',
          budget: 50000,
          duration: 21,
          steps: [
            'Analyser la concurrence locale',
            'Adapter les créatifs à la culture locale',
            'Augmenter le budget géographique',
            'Monitorer les performances'
          ]
        },
        reasoning: [
          `ROI de ${(bestGeo.roi * 100).toFixed(0)}% dans cette région`,
          'Audience réceptive identifiée',
          'Potentiel de croissance élevé'
        ]
      })
    }

    return recommendations
  }

  private optimizeTiming(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []
    
    // Analyse des tendances saisonnières
    const seasonalData = this.data.businessMetrics.seasonalTrends
    const bestSeason = Object.entries(seasonalData).sort(([,a], [,b]) => b - a)[0]
    
    if (bestSeason && bestSeason[1] > 1.2) {
      recommendations.push({
        id: 'seasonal-optimization',
        type: 'timing',
        priority: 'medium',
        title: `Optimisation saisonnière - ${bestSeason[0]}`,
        description: `${bestSeason[0]} génère ${((bestSeason[1] - 1) * 100).toFixed(0)}% de revenus supplémentaires. Préparez vos campagnes en avance.`,
        expectedImpact: `+${((bestSeason[1] - 1) * 100).toFixed(0)}% revenus`,
        confidence: 82,
        estimatedROI: bestSeason[1],
        implementation: {
          action: 'Préparer campagnes saisonnières',
          budget: 100000,
          duration: 60,
          steps: [
            'Planifier les campagnes 2 mois en avance',
            'Créer des créatifs saisonniers',
            'Augmenter les budgets progressivement',
            'Optimiser en temps réel'
          ]
        },
        reasoning: [
          'Tendance saisonnière confirmée',
          'Historique de performance élevée',
          'Opportunité de maximisation'
        ]
      })
    }

    return recommendations
  }

  // Prédictions pour le mois suivant
  generatePredictions(): PredictiveAnalytics {
    const avgMonthlyRevenue = this.data.businessMetrics.totalRevenue / 12
    const growthTrend = 1.05 // 5% de croissance estimée
    
    // Calcul des canaux les plus performants
    const channelPerformance = this.data.campaigns.reduce((acc, campaign) => {
      const revenue = campaign.conversions * this.data.businessMetrics.averageOrderValue
      const roi = campaign.spent > 0 ? revenue / campaign.spent : 0
      
      if (!acc[campaign.type]) {
        acc[campaign.type] = { revenue: 0, roi: 0, count: 0 }
      }
      
      acc[campaign.type].revenue += revenue
      acc[campaign.type].roi += roi
      acc[campaign.type].count += 1
      
      return acc
    }, {} as Record<string, { revenue: number, roi: number, count: number }>)

    const bestChannels = Object.entries(channelPerformance)
      .map(([channel, data]) => ({ 
        channel, 
        avgROI: data.roi / data.count,
        totalRevenue: data.revenue 
      }))
      .sort((a, b) => b.avgROI - a.avgROI)
      .slice(0, 3)
      .map(item => item.channel)

    return {
      nextMonthRevenue: avgMonthlyRevenue * growthTrend,
      bestPerformingChannels: bestChannels,
      optimalBudgetDistribution: {
        email: 0.4,
        social: 0.3,
        display: 0.2,
        sms: 0.1
      },
      seasonalRecommendations: [
        {
          period: 'Q4 2024',
          action: 'Augmenter budget de 50% pour les fêtes',
          expectedLift: 35
        },
        {
          period: 'Janvier 2025',
          action: 'Campagnes de fidélisation post-fêtes',
          expectedLift: 15
        }
      ]
    }
  }

  // Optimisation automatique des campagnes en cours
  autoOptimizeCampaigns(): Array<{
    campaignId: string
    action: 'increase_budget' | 'decrease_budget' | 'pause' | 'modify_targeting'
    reason: string
    newBudget?: number
  }> {
    const optimizations: Array<{
      campaignId: string
      action: 'increase_budget' | 'decrease_budget' | 'pause' | 'modify_targeting'
      reason: string
      newBudget?: number
    }> = []

    this.data.campaigns.forEach(campaign => {
      const roi = campaign.spent > 0 ? (campaign.conversions * this.data.businessMetrics.averageOrderValue - campaign.spent) / campaign.spent : 0
      const ctr = campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0
      
      if (roi > 3 && ctr > 0.02) {
        // Campagne très performante - augmenter le budget
        optimizations.push({
          campaignId: campaign.id,
          action: 'increase_budget',
          reason: `ROI exceptionnel de ${(roi * 100).toFixed(0)}% et CTR de ${(ctr * 100).toFixed(1)}%`,
          newBudget: campaign.budget * 1.3
        })
      } else if (roi < 0.5 && campaign.spent > 20000) {
        // Campagne sous-performante - réduire ou arrêter
        optimizations.push({
          campaignId: campaign.id,
          action: 'pause',
          reason: `ROI négatif de ${(roi * 100).toFixed(0)}% avec ${campaign.spent.toLocaleString()} FCFA dépensés`
        })
      } else if (ctr < 0.005) {
        // CTR faible - modifier le ciblage
        optimizations.push({
          campaignId: campaign.id,
          action: 'modify_targeting',
          reason: `CTR faible de ${(ctr * 100).toFixed(2)}% - audience inadaptée`
        })
      }
    })

    return optimizations
  }
}

// Données mock pour démonstration
export const mockMarketingData: MarketingData = {
  campaigns: [
    {
      id: '1',
      name: 'Campagne Nouvel An Chinois',
      type: 'email',
      budget: 150000,
      spent: 120000,
      impressions: 45000,
      clicks: 1350,
      conversions: 89,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      targetAudience: 'Importateurs Sénégal',
      geography: ['Sénégal', 'Côte d\'Ivoire']
    },
    {
      id: '2',
      name: 'Promotion Express Shipping',
      type: 'social',
      budget: 80000,
      spent: 75000,
      impressions: 120000,
      clicks: 2400,
      conversions: 156,
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      targetAudience: 'PME Afrique',
      geography: ['Ghana', 'Nigeria', 'Cameroun']
    }
  ],
  promotions: [
    {
      id: '1',
      name: 'Réduction 25% Nouvel An',
      discount: 25,
      usage: 245,
      revenue: 890000,
      startDate: '2024-01-15',
      endDate: '2024-02-15'
    }
  ],
  businessMetrics: {
    totalRevenue: 12500000,
    averageOrderValue: 45000,
    customerAcquisitionCost: 8500,
    lifetimeValue: 180000,
    seasonalTrends: {
      'Q1': 1.1,
      'Q2': 0.9,
      'Q3': 0.8,
      'Q4': 1.4
    }
  }
}
