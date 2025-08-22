import { 
  PerformanceMetric, 
  PerformanceFilter, 
  PerformanceComparison, 
  PerformanceForecast, 
  PerformanceAlert,
  PerformanceAnalysis,
  PerformanceGoal
} from '@/types/performance'

export class PerformanceEngine {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private alerts: PerformanceAlert[] = []
  private goals: PerformanceGoal[] = []

  // Calcul des métriques de base
  calculateMetrics(data: any[], filters: PerformanceFilter): PerformanceMetric[] {
    const filteredData = this.applyFilters(data, filters)
    
    const metrics: PerformanceMetric[] = [
      this.calculateRevenueMetrics(filteredData),
      this.calculateVolumeMetrics(filteredData),
      this.calculateWeightMetrics(filteredData),
      this.calculatePackageMetrics(filteredData),
      this.calculateEfficiencyMetrics(filteredData),
      this.calculateCustomerMetrics(filteredData),
      this.calculateDeliveryMetrics(filteredData),
      this.calculateProfitabilityMetrics(filteredData)
    ].flat()

    // Mise à jour du cache
    metrics.forEach(metric => this.metrics.set(metric.id, metric))
    
    return metrics
  }

  // Calcul des métriques de revenus
  private calculateRevenueMetrics(data: any[]): PerformanceMetric[] {
    const totalRevenue = data.reduce((sum, item) => sum + (item.price || 0), 0)
    const avgOrderValue = data.length > 0 ? totalRevenue / data.length : 0
    const revenueGrowth = this.calculateGrowthRate(data, 'price')

    return [
      {
        id: 'total-revenue',
        name: 'Chiffre d\'Affaires Total',
        value: totalRevenue,
        unit: '€',
        type: 'revenue',
        trend: revenueGrowth > 0 ? 'up' : revenueGrowth < 0 ? 'down' : 'stable',
        trendPercentage: Math.abs(revenueGrowth),
        category: 'financial',
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'avg-order-value',
        name: 'Valeur Moyenne Commande',
        value: avgOrderValue,
        unit: '€',
        type: 'revenue',
        trend: 'stable',
        trendPercentage: 0,
        category: 'financial',
        isKPI: true,
        lastUpdated: new Date()
      }
    ]
  }

  // Calcul des métriques de volume
  private calculateVolumeMetrics(data: any[]): PerformanceMetric[] {
    const totalVolume = data.reduce((sum, item) => {
      const volume = (item.dimensions?.length || 0) * 
                    (item.dimensions?.width || 0) * 
                    (item.dimensions?.height || 0) / 1000000 // cm³ to m³
      return sum + volume
    }, 0)

    const avgVolume = data.length > 0 ? totalVolume / data.length : 0
    const volumeGrowth = this.calculateGrowthRate(data, 'volume')

    return [
      {
        id: 'total-volume',
        name: 'Volume Total CBM',
        value: totalVolume,
        unit: 'm³',
        type: 'volume',
        trend: volumeGrowth > 0 ? 'up' : volumeGrowth < 0 ? 'down' : 'stable',
        trendPercentage: Math.abs(volumeGrowth),
        category: 'operational',
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'avg-volume',
        name: 'Volume Moyen par Colis',
        value: avgVolume,
        unit: 'm³',
        type: 'volume',
        trend: 'stable',
        trendPercentage: 0,
        category: 'operational',
        isKPI: false,
        lastUpdated: new Date()
      }
    ]
  }

  // Calcul des métriques de poids
  private calculateWeightMetrics(data: any[]): PerformanceMetric[] {
    const totalWeight = data.reduce((sum, item) => sum + (item.weight || 0), 0)
    const avgWeight = data.length > 0 ? totalWeight / data.length : 0
    const weightGrowth = this.calculateGrowthRate(data, 'weight')

    return [
      {
        id: 'total-weight',
        name: 'Poids Total',
        value: totalWeight,
        unit: 'kg',
        type: 'weight',
        trend: weightGrowth > 0 ? 'up' : weightGrowth < 0 ? 'down' : 'stable',
        trendPercentage: Math.abs(weightGrowth),
        category: 'operational',
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'avg-weight',
        name: 'Poids Moyen par Colis',
        value: avgWeight,
        unit: 'kg',
        type: 'weight',
        trend: 'stable',
        trendPercentage: 0,
        category: 'operational',
        isKPI: false,
        lastUpdated: new Date()
      }
    ]
  }

  // Calcul des métriques de colis
  private calculatePackageMetrics(data: any[]): PerformanceMetric[] {
    const totalPackages = data.length
    const completedPackages = data.filter(item => item.status === 'DELIVERED').length
    const deliveryRate = totalPackages > 0 ? (completedPackages / totalPackages) * 100 : 0

    return [
      {
        id: 'total-packages',
        name: 'Nombre Total de Colis',
        value: totalPackages,
        unit: 'colis',
        type: 'count',
        trend: 'up',
        trendPercentage: 5.2,
        category: 'operational',
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'delivery-rate',
        name: 'Taux de Livraison',
        value: deliveryRate,
        unit: '%',
        type: 'percentage',
        trend: deliveryRate > 90 ? 'up' : 'down',
        trendPercentage: 2.1,
        category: 'operational',
        target: 95,
        isKPI: true,
        lastUpdated: new Date()
      }
    ]
  }

  // Calcul des métriques d'efficacité
  private calculateEfficiencyMetrics(data: any[]): PerformanceMetric[] {
    const avgProcessingTime = this.calculateAvgProcessingTime(data)
    const onTimeDelivery = this.calculateOnTimeDeliveryRate(data)

    return [
      {
        id: 'avg-processing-time',
        name: 'Temps Moyen de Traitement',
        value: avgProcessingTime,
        unit: 'heures',
        type: 'time',
        trend: avgProcessingTime < 24 ? 'up' : 'down',
        trendPercentage: 8.5,
        category: 'efficiency',
        target: 24,
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'on-time-delivery',
        name: 'Livraisons à Temps',
        value: onTimeDelivery,
        unit: '%',
        type: 'percentage',
        trend: onTimeDelivery > 85 ? 'up' : 'down',
        trendPercentage: 3.2,
        category: 'efficiency',
        target: 90,
        isKPI: true,
        lastUpdated: new Date()
      }
    ]
  }

  // Calcul des métriques clients
  private calculateCustomerMetrics(data: any[]): PerformanceMetric[] {
    const uniqueCustomers = new Set(data.map(item => item.clientId)).size
    const repeatCustomers = this.calculateRepeatCustomers(data)
    const customerSatisfaction = this.calculateCustomerSatisfaction(data)

    return [
      {
        id: 'unique-customers',
        name: 'Clients Uniques',
        value: uniqueCustomers,
        unit: 'clients',
        type: 'count',
        trend: 'up',
        trendPercentage: 12.3,
        category: 'customer',
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'repeat-customers',
        name: 'Clients Récurrents',
        value: repeatCustomers,
        unit: '%',
        type: 'percentage',
        trend: 'up',
        trendPercentage: 7.8,
        category: 'customer',
        target: 40,
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'customer-satisfaction',
        name: 'Satisfaction Client',
        value: customerSatisfaction,
        unit: '/5',
        type: 'percentage',
        trend: customerSatisfaction > 4 ? 'up' : 'down',
        trendPercentage: 2.5,
        category: 'customer',
        target: 4.5,
        isKPI: true,
        lastUpdated: new Date()
      }
    ]
  }

  // Calcul des métriques de livraison
  private calculateDeliveryMetrics(data: any[]): PerformanceMetric[] {
    const avgDeliveryTime = this.calculateAvgDeliveryTime(data)
    const deliveryAccuracy = this.calculateDeliveryAccuracy(data)

    return [
      {
        id: 'avg-delivery-time',
        name: 'Délai Moyen de Livraison',
        value: avgDeliveryTime,
        unit: 'jours',
        type: 'time',
        trend: avgDeliveryTime < 30 ? 'up' : 'down',
        trendPercentage: 5.1,
        category: 'operational',
        isKPI: true,
        lastUpdated: new Date()
      },
      {
        id: 'delivery-accuracy',
        name: 'Précision des Livraisons',
        value: deliveryAccuracy,
        unit: '%',
        type: 'percentage',
        trend: 'up',
        trendPercentage: 1.8,
        category: 'operational',
        target: 98,
        isKPI: true,
        lastUpdated: new Date()
      }
    ]
  }

  // Calcul des métriques de rentabilité
  private calculateProfitabilityMetrics(data: any[]): PerformanceMetric[] {
    const totalCosts = data.reduce((sum, item) => sum + (item.cost || 0), 0)
    const totalRevenue = data.reduce((sum, item) => sum + (item.price || 0), 0)
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0

    return [
      {
        id: 'profit-margin',
        name: 'Marge Bénéficiaire',
        value: profitMargin,
        unit: '%',
        type: 'percentage',
        trend: profitMargin > 20 ? 'up' : 'down',
        trendPercentage: 4.2,
        category: 'financial',
        target: 25,
        isKPI: true,
        lastUpdated: new Date()
      }
    ]
  }

  // Application des filtres
  private applyFilters(data: any[], filters: PerformanceFilter): any[] {
    let filtered = [...data]

    // Filtre par date
    if (filters.dateRange) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt || item.date)
        return itemDate >= filters.dateRange.start && itemDate <= filters.dateRange.end
      })
    }

    // Filtre par mode de transport
    if (filters.transportModes?.length) {
      filtered = filtered.filter(item => 
        filters.transportModes!.includes(item.transportMode)
      )
    }

    // Filtre par région
    if (filters.regions?.length) {
      filtered = filtered.filter(item => 
        filters.regions!.includes(item.region || item.destination)
      )
    }

    // Filtre par entreprise
    if (filters.companies?.length) {
      filtered = filtered.filter(item => 
        filters.companies!.includes(item.companyId)
      )
    }

    // Filtre par statut
    if (filters.status?.length) {
      filtered = filtered.filter(item => 
        filters.status!.includes(item.status)
      )
    }

    // Filtre par valeur min/max
    if (filters.minValue !== undefined) {
      filtered = filtered.filter(item => (item.price || 0) >= filters.minValue!)
    }
    if (filters.maxValue !== undefined) {
      filtered = filtered.filter(item => (item.price || 0) <= filters.maxValue!)
    }

    return filtered
  }

  // Calcul du taux de croissance
  private calculateGrowthRate(data: any[], field: string): number {
    if (data.length < 2) return 0
    
    const sortedData = data.sort((a, b) => 
      new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime()
    )
    
    const firstHalf = sortedData.slice(0, Math.floor(sortedData.length / 2))
    const secondHalf = sortedData.slice(Math.floor(sortedData.length / 2))
    
    const firstValue = firstHalf.reduce((sum, item) => sum + (item[field] || 0), 0)
    const secondValue = secondHalf.reduce((sum, item) => sum + (item[field] || 0), 0)
    
    return firstValue > 0 ? ((secondValue - firstValue) / firstValue) * 100 : 0
  }

  // Calculs spécialisés
  private calculateAvgProcessingTime(data: any[]): number {
    const processedItems = data.filter(item => item.processedAt && item.createdAt)
    if (processedItems.length === 0) return 0
    
    const totalTime = processedItems.reduce((sum, item) => {
      const created = new Date(item.createdAt).getTime()
      const processed = new Date(item.processedAt).getTime()
      return sum + (processed - created)
    }, 0)
    
    return totalTime / processedItems.length / (1000 * 60 * 60) // Convert to hours
  }

  private calculateOnTimeDeliveryRate(data: any[]): number {
    const deliveredItems = data.filter(item => item.deliveredAt && item.estimatedDelivery)
    if (deliveredItems.length === 0) return 0
    
    const onTimeDeliveries = deliveredItems.filter(item => {
      const delivered = new Date(item.deliveredAt).getTime()
      const estimated = new Date(item.estimatedDelivery).getTime()
      return delivered <= estimated
    }).length
    
    return (onTimeDeliveries / deliveredItems.length) * 100
  }

  private calculateRepeatCustomers(data: any[]): number {
    const customerOrders = new Map<string, number>()
    
    data.forEach(item => {
      const count = customerOrders.get(item.clientId) || 0
      customerOrders.set(item.clientId, count + 1)
    })
    
    const repeatCustomers = Array.from(customerOrders.values()).filter(count => count > 1).length
    const totalCustomers = customerOrders.size
    
    return totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0
  }

  private calculateCustomerSatisfaction(data: any[]): number {
    const ratingsData = data.filter(item => item.rating)
    if (ratingsData.length === 0) return 4.2 // Default mock value
    
    const totalRating = ratingsData.reduce((sum, item) => sum + item.rating, 0)
    return totalRating / ratingsData.length
  }

  private calculateAvgDeliveryTime(data: any[]): number {
    const deliveredItems = data.filter(item => item.deliveredAt && item.createdAt)
    if (deliveredItems.length === 0) return 25 // Default mock value
    
    const totalTime = deliveredItems.reduce((sum, item) => {
      const created = new Date(item.createdAt).getTime()
      const delivered = new Date(item.deliveredAt).getTime()
      return sum + (delivered - created)
    }, 0)
    
    return totalTime / deliveredItems.length / (1000 * 60 * 60 * 24) // Convert to days
  }

  private calculateDeliveryAccuracy(data: any[]): number {
    // Mock calculation - in real implementation, this would check address accuracy, etc.
    return 96.5
  }

  // Comparaison de performances
  comparePerformance(current: PerformanceMetric[], previous: PerformanceMetric[]): PerformanceComparison {
    const comparison = current.map(currentMetric => {
      const previousMetric = previous.find(p => p.id === currentMetric.id)
      if (!previousMetric) {
        return {
          metricId: currentMetric.id,
          change: currentMetric.value,
          changePercentage: 100,
          significance: 'high' as const
        }
      }

      const change = currentMetric.value - previousMetric.value
      const changePercentage = previousMetric.value !== 0 
        ? (change / previousMetric.value) * 100 
        : 0

      const significance: 'high' | 'medium' | 'low' = Math.abs(changePercentage) > 20 ? 'high' 
        : Math.abs(changePercentage) > 10 ? 'medium' 
        : 'low'

      return {
        metricId: currentMetric.id,
        change,
        changePercentage,
        significance
      }
    })

    return { current, previous, comparison }
  }

  // Prédictions et forecasting
  generateForecast(metricId: string, historicalData: number[], periods: number = 6): PerformanceForecast {
    // Simple linear regression for forecasting
    const n = historicalData.length
    const x = Array.from({ length: n }, (_, i) => i + 1)
    const y = historicalData

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    const predictions = Array.from({ length: periods }, (_, i) => {
      const futureX = n + i + 1
      const predictedValue = slope * futureX + intercept
      const confidence = Math.max(0.6, 1 - (i * 0.1)) // Decreasing confidence over time

      return {
        date: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000), // Monthly predictions
        value: Math.max(0, predictedValue),
        confidence
      }
    })

    // Calculate accuracy based on variance
    const variance = y.reduce((sum, yi, i) => {
      const predicted = slope * (i + 1) + intercept
      return sum + Math.pow(yi - predicted, 2)
    }, 0) / n

    const accuracy = Math.max(0.5, 1 - (variance / (sumY / n)))

    return {
      metricId,
      predictions,
      accuracy,
      model: 'linear'
    }
  }

  // Détection d'anomalies
  detectAnomalies(metrics: PerformanceMetric[]): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = []

    metrics.forEach(metric => {
      // Vérification des seuils
      if (metric.target && Math.abs(metric.value - metric.target) / metric.target > 0.2) {
        alerts.push({
          id: `alert-${metric.id}-${Date.now()}`,
          metricId: metric.id,
          type: 'threshold',
          severity: Math.abs(metric.value - metric.target) / metric.target > 0.5 ? 'high' : 'medium',
          message: `${metric.name} s'écarte significativement de l'objectif (${metric.target}${metric.unit})`,
          threshold: metric.target,
          currentValue: metric.value,
          triggered: new Date(),
          acknowledged: false,
          resolved: false
        })
      }

      // Vérification des tendances négatives
      if (metric.trend === 'down' && metric.trendPercentage > 15) {
        alerts.push({
          id: `alert-trend-${metric.id}-${Date.now()}`,
          metricId: metric.id,
          type: 'trend',
          severity: metric.trendPercentage > 30 ? 'critical' : 'medium',
          message: `${metric.name} montre une tendance négative de ${metric.trendPercentage.toFixed(1)}%`,
          currentValue: metric.value,
          triggered: new Date(),
          acknowledged: false,
          resolved: false
        })
      }
    })

    this.alerts.push(...alerts)
    return alerts
  }

  // Analyse de corrélation
  analyzeCorrelations(metrics: PerformanceMetric[]): PerformanceAnalysis {
    const correlations: { metric1: string; metric2: string; correlation: number }[] = []
    
    for (let i = 0; i < metrics.length; i++) {
      for (let j = i + 1; j < metrics.length; j++) {
        const metric1 = metrics[i]
        const metric2 = metrics[j]
        
        // Simple correlation calculation (mock)
        const correlation = Math.random() * 2 - 1 // -1 to 1
        
        if (Math.abs(correlation) > 0.5) {
          correlations.push({
            metric1: metric1.name,
            metric2: metric2.name,
            correlation
          })
        }
      }
    }

    const insights = correlations.map(corr => 
      `${corr.correlation > 0 ? 'Corrélation positive' : 'Corrélation négative'} entre ${corr.metric1} et ${corr.metric2} (${(corr.correlation * 100).toFixed(1)}%)`
    )

    const recommendations = [
      'Optimiser les processus avec les plus fortes corrélations positives',
      'Investiguer les corrélations négatives inattendues',
      'Surveiller les métriques fortement corrélées ensemble'
    ]

    return {
      id: `analysis-${Date.now()}`,
      type: 'correlation',
      metricIds: metrics.map(m => m.id),
      results: {
        insights,
        recommendations,
        confidence: 0.75,
        data: correlations
      },
      parameters: { threshold: 0.5 },
      createdAt: new Date()
    }
  }

  // Getters pour accéder aux données
  getMetric(id: string): PerformanceMetric | undefined {
    return this.metrics.get(id)
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
  }

  getAlerts(): PerformanceAlert[] {
    return this.alerts
  }

  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved)
  }

  // Utilitaires de formatage
  formatMetricValue(metric: PerformanceMetric): string {
    const value = metric.value.toLocaleString('fr-FR', {
      minimumFractionDigits: metric.type === 'percentage' ? 1 : 0,
      maximumFractionDigits: metric.type === 'percentage' ? 1 : 2
    })
    
    return `${value}${metric.unit}`
  }

  formatTrend(metric: PerformanceMetric): string {
    const sign = metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''
    return `${sign}${metric.trendPercentage.toFixed(1)}%`
  }
}

// Instance singleton
export const performanceEngine = new PerformanceEngine()
