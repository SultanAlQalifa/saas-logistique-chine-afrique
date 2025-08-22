'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Download, DollarSign, Package, Weight, Globe, Settings, Activity } from 'lucide-react'
import PerformanceController from '@/components/performance/PerformanceController'
import MetricCustomizer from '@/components/performance/MetricCustomizer'
import { PerformanceMetric, PerformanceAlert } from '@/types/performance'

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>([])
  const [showPerformanceController, setShowPerformanceController] = useState(false)
  const [customMetrics, setCustomMetrics] = useState<PerformanceMetric[]>([])

  // Mock data for various charts
  const monthlyRevenueData = [
    { month: 'Jan', revenus: 12500, volume: 45 },
    { month: 'Fév', revenus: 15200, volume: 52 },
    { month: 'Mar', revenus: 13800, volume: 48 },
    { month: 'Avr', revenus: 18900, volume: 61 },
    { month: 'Mai', revenus: 16700, volume: 55 },
    { month: 'Jun', revenus: 21300, volume: 67 },
  ]

  const transportModeData = [
    { name: 'Aérien', value: 45, color: '#3b82f6' },
    { name: 'Aérien Express', value: 25, color: '#1d4ed8' },
    { name: 'Maritime', value: 20, color: '#10b981' },
    { name: 'Maritime Express', value: 10, color: '#059669' },
  ]

  const regionData = [
    { region: 'UEMOA', colis: 85, revenus: 42500 },
    { region: 'CEMAC', colis: 71, revenus: 35500 },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const exportToPDF = () => {
    alert('Export PDF en cours de développement...')
  }

  // Gestion des métriques personnalisées
  const handleMetricUpdate = (metric: PerformanceMetric) => {
    setCustomMetrics(prev => prev.map(m => m.id === metric.id ? metric : m))
  }

  const handleMetricCreate = (metricData: Omit<PerformanceMetric, 'id' | 'lastUpdated'>) => {
    const newMetric: PerformanceMetric = {
      ...metricData,
      id: `custom-${Date.now()}`,
      lastUpdated: new Date()
    }
    setCustomMetrics(prev => [...prev, newMetric])
  }

  const handleMetricDelete = (metricId: string) => {
    setCustomMetrics(prev => prev.filter(m => m.id !== metricId))
  }

  // Gestion des callbacks du contrôleur de performance
  const handleMetricsChange = (metrics: PerformanceMetric[]) => {
    setPerformanceMetrics(metrics)
  }

  const handleAlertsChange = (alerts: PerformanceAlert[]) => {
    setPerformanceAlerts(alerts)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports et Analyses</h1>
          <p className="text-gray-600">Analysez vos performances et tendances</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPerformanceController(!showPerformanceController)}
            className={`font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200 ${
              showPerformanceController 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Activity className="h-4 w-4" />
            Contrôleur Performance
          </button>
          <MetricCustomizer
            metrics={[...performanceMetrics, ...customMetrics]}
            onMetricUpdate={handleMetricUpdate}
            onMetricCreate={handleMetricCreate}
            onMetricDelete={handleMetricDelete}
          />
          <button 
            onClick={exportToPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Contrôleur de Performance */}
      {showPerformanceController && (
        <div className="bg-white p-6 rounded-lg shadow">
          <PerformanceController
            onMetricsChange={handleMetricsChange}
            onAlertsChange={handleAlertsChange}
          />
        </div>
      )}

      {/* Alertes de Performance */}
      {performanceAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-900">
              Alertes de Performance ({performanceAlerts.length})
            </h3>
          </div>
          <div className="space-y-2">
            {performanceAlerts.slice(0, 3).map(alert => (
              <div key={alert.id} className="text-sm text-red-800">
                • {alert.message}
              </div>
            ))}
            {performanceAlerts.length > 3 && (
              <div className="text-sm text-red-600">
                ... et {performanceAlerts.length - 3} autre(s) alerte(s)
              </div>
            )}
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Total</p>
              <p className="text-2xl font-bold text-gray-900">€98,400</p>
              <p className="text-sm text-green-600">+12.5% ce mois</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Volume CBM</p>
              <p className="text-2xl font-bold text-gray-900">1,247 m³</p>
              <p className="text-sm text-blue-600">+8.3% ce mois</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Poids Total</p>
              <p className="text-2xl font-bold text-gray-900">15,680 kg</p>
              <p className="text-sm text-purple-600">+15.2% ce mois</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Weight className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Colis Traités</p>
              <p className="text-2xl font-bold text-gray-900">328</p>
              <p className="text-sm text-orange-600">+9.7% ce mois</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus Mensuels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, 'Revenus']} />
              <Line type="monotone" dataKey="revenus" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transport Mode Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Aérien/Maritime</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transportModeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {transportModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Statistics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Statistiques UEMOA/CEMAC
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="colis" fill="#3b82f6" name="Nombre de Colis" />
            </BarChart>
          </ResponsiveContainer>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value}`, 'Revenus']} />
              <Bar dataKey="revenus" fill="#10b981" name="Revenus (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Résumé par Région</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de Colis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenu Moyen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part de Marché
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionData.map((region) => (
                <tr key={region.region} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {region.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {region.colis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{region.revenus.toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{(region.revenus / region.colis).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {((region.colis / regionData.reduce((sum, r) => sum + r.colis, 0)) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
