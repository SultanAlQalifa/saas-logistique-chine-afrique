'use client'

import React, { useState, useEffect } from 'react'
import { 
  PerformanceMetric, 
  PerformanceFilter, 
  PerformanceAlert,
  PerformanceForecast,
  PerformanceGoal 
} from '@/types/performance'
import { performanceEngine } from '@/utils/performanceEngine'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  AlertTriangle, 
  Settings,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react'

interface PerformanceControllerProps {
  onMetricsChange?: (metrics: PerformanceMetric[]) => void
  onAlertsChange?: (alerts: PerformanceAlert[]) => void
}

export default function PerformanceController({ 
  onMetricsChange, 
  onAlertsChange 
}: PerformanceControllerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([])
  const [filters, setFilters] = useState<PerformanceFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date(),
      preset: 'month'
    }
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'metrics' | 'alerts' | 'goals' | 'analysis'>('metrics')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  // Mock data pour la démonstration
  const mockData = [
    {
      id: '1',
      clientId: 'client-1',
      companyId: 'company-1',
      price: 1250,
      weight: 25.5,
      dimensions: { length: 50, width: 40, height: 30 },
      transportMode: 'AERIAL',
      status: 'DELIVERED',
      region: 'UEMOA',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      rating: 4.5,
      cost: 800
    },
    {
      id: '2',
      clientId: 'client-2',
      companyId: 'company-1',
      price: 2100,
      weight: 45.2,
      dimensions: { length: 80, width: 60, height: 50 },
      transportMode: 'MARITIME',
      status: 'IN_TRANSIT',
      region: 'CEMAC',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
      rating: 4.2,
      cost: 1200
    },
    {
      id: '3',
      clientId: 'client-1',
      companyId: 'company-2',
      price: 850,
      weight: 15.8,
      dimensions: { length: 40, width: 30, height: 25 },
      transportMode: 'AERIAL_EXPRESS',
      status: 'DELIVERED',
      region: 'UEMOA',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      processedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      rating: 4.8,
      cost: 500
    }
  ]

  // Calcul des métriques
  const calculateMetrics = async () => {
    setLoading(true)
    try {
      const calculatedMetrics = performanceEngine.calculateMetrics(mockData, filters)
      setMetrics(calculatedMetrics)
      
      // Détection des alertes
      const detectedAlerts = performanceEngine.detectAnomalies(calculatedMetrics)
      setAlerts(detectedAlerts)
      
      // Callbacks
      onMetricsChange?.(calculatedMetrics)
      onAlertsChange?.(detectedAlerts)
    } catch (error) {
      console.error('Erreur lors du calcul des métriques:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(calculateMetrics, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, filters])

  // Initial load
  useEffect(() => {
    calculateMetrics()
  }, [filters])

  // Gestion des filtres de date
  const handleDatePreset = (preset: string) => {
    const now = new Date()
    let start: Date

    switch (preset) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'quarter':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    setFilters(prev => ({
      ...prev,
      dateRange: { start, end: now, preset: preset as any }
    }))
  }

  // Rendu des métriques
  const renderMetric = (metric: PerformanceMetric) => {
    const isSelected = selectedMetrics.includes(metric.id)
    const trendIcon = metric.trend === 'up' ? TrendingUp : 
                     metric.trend === 'down' ? TrendingDown : Minus
    const trendColor = metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'

    return (
      <div
        key={metric.id}
        className={`bg-white p-6 rounded-lg shadow cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
        }`}
        onClick={() => {
          setSelectedMetrics(prev => 
            prev.includes(metric.id) 
              ? prev.filter(id => id !== metric.id)
              : [...prev, metric.id]
          )
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
          {metric.isKPI && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              KPI
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {performanceEngine.formatMetricValue(metric)}
            </p>
            {metric.target && (
              <p className="text-sm text-gray-500">
                Objectif: {metric.target}{metric.unit}
              </p>
            )}
          </div>
          
          <div className={`flex items-center gap-1 ${trendColor}`}>
            {React.createElement(trendIcon, { className: 'h-4 w-4' })}
            <span className="text-sm font-medium">
              {performanceEngine.formatTrend(metric)}
            </span>
          </div>
        </div>
        
        {metric.target && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progression</span>
              <span>{((metric.value / metric.target) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Rendu des alertes
  const renderAlert = (alert: PerformanceAlert) => {
    const severityColors = {
      low: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      medium: 'bg-orange-50 border-orange-200 text-orange-800',
      high: 'bg-red-50 border-red-200 text-red-800',
      critical: 'bg-red-100 border-red-300 text-red-900'
    }

    return (
      <div
        key={alert.id}
        className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium">{alert.message}</h4>
            <p className="text-sm mt-1">
              Valeur actuelle: {alert.currentValue}
              {alert.threshold && ` | Seuil: ${alert.threshold}`}
            </p>
            <p className="text-xs mt-2">
              {alert.triggered.toLocaleString('fr-FR')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Marquer comme acquitté
                setAlerts(prev => prev.map(a => 
                  a.id === alert.id ? { ...a, acknowledged: true } : a
                ))
              }}
              className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-50"
            >
              Acquitter
            </button>
            <button
              onClick={() => {
                // Marquer comme résolu
                setAlerts(prev => prev.map(a => 
                  a.id === alert.id ? { ...a, resolved: true } : a
                ))
              }}
              className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-50"
            >
              Résoudre
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contrôleur de Performance</h2>
          <p className="text-gray-600">Manipulez et analysez vos métriques en temps réel</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Auto-refresh */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="auto-refresh" className="text-sm text-gray-700">
              Auto-refresh
            </label>
            {autoRefresh && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={10}>10s</option>
                <option value={30}>30s</option>
                <option value={60}>1min</option>
                <option value={300}>5min</option>
              </select>
            )}
          </div>

          {/* Boutons d'action */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border ${showFilters ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
          >
            <Filter className="h-4 w-4" />
          </button>
          
          <button
            onClick={calculateMetrics}
            disabled={loading}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button className="p-2 rounded-lg border hover:bg-gray-50">
            <Download className="h-4 w-4" />
          </button>
          
          <button className="p-2 rounded-lg border hover:bg-gray-50">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Période */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <div className="flex flex-wrap gap-2">
                {['today', 'week', 'month', 'quarter', 'year'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => handleDatePreset(preset)}
                    className={`px-3 py-1 text-sm rounded ${
                      filters.dateRange.preset === preset
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset === 'today' ? 'Aujourd\'hui' :
                     preset === 'week' ? 'Semaine' :
                     preset === 'month' ? 'Mois' :
                     preset === 'quarter' ? 'Trimestre' : 'Année'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode de transport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de Transport
              </label>
              <select
                multiple
                value={filters.transportModes || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value)
                  setFilters(prev => ({ ...prev, transportModes: values }))
                }}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="AERIAL">Aérien</option>
                <option value="AERIAL_EXPRESS">Aérien Express</option>
                <option value="MARITIME">Maritime</option>
                <option value="MARITIME_EXPRESS">Maritime Express</option>
              </select>
            </div>

            {/* Région */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région
              </label>
              <select
                multiple
                value={filters.regions || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value)
                  setFilters(prev => ({ ...prev, regions: values }))
                }}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="UEMOA">UEMOA</option>
                <option value="CEMAC">CEMAC</option>
                <option value="MAGHREB">Maghreb</option>
                <option value="AUTRES">Autres</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'metrics', label: 'Métriques', icon: BarChart3 },
            { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
            { id: 'goals', label: 'Objectifs', icon: Target },
            { id: 'analysis', label: 'Analyses', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'alerts' && alerts.filter(a => !a.resolved).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {alerts.filter(a => !a.resolved).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'metrics' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Métriques de Performance
            </h3>
            {selectedMetrics.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedMetrics.length} sélectionnée(s)
                </span>
                <button
                  onClick={() => setSelectedMetrics([])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Tout désélectionner
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {metrics.map(renderMetric)}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Alertes de Performance
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {alerts.filter(a => !a.resolved).length} active(s)
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {alerts.filter(a => !a.resolved).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune alerte active
              </div>
            ) : (
              alerts.filter(a => !a.resolved).map(renderAlert)
            )}
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Objectifs de Performance
          </h3>
          <div className="text-center py-8 text-gray-500">
            Fonctionnalité en développement...
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Analyses Avancées
          </h3>
          <div className="text-center py-8 text-gray-500">
            Fonctionnalité en développement...
          </div>
        </div>
      )}
    </div>
  )
}
