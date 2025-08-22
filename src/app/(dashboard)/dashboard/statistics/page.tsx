'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar, Download, Filter } from 'lucide-react'

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [selectedMetric, setSelectedMetric] = useState('all')

  // Mock data pour les statistiques
  const stats = {
    totalPackages: 1247,
    totalRevenue: 2850000,
    totalClients: 89,
    averageDeliveryTime: 12,
    growthRate: 15.3,
    topRoutes: [
      { route: 'Chine → Côte d\'Ivoire', packages: 456, revenue: 1200000 },
      { route: 'Chine → Sénégal', packages: 234, revenue: 650000 },
      { route: 'Chine → Mali', packages: 178, revenue: 480000 },
      { route: 'Chine → Burkina Faso', packages: 145, revenue: 390000 },
    ],
    monthlyData: [
      { month: 'Jan', packages: 98, revenue: 245000 },
      { month: 'Fév', packages: 112, revenue: 280000 },
      { month: 'Mar', packages: 134, revenue: 335000 },
      { month: 'Avr', packages: 156, revenue: 390000 },
      { month: 'Mai', packages: 178, revenue: 445000 },
      { month: 'Jun', packages: 203, revenue: 510000 },
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Statistiques</h1>
          <p className="text-secondary-600">Analyses détaillées et métriques de performance</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
            <option value="365">1 an</option>
          </select>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Colis</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalPackages.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{stats.growthRate}% ce mois</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Revenus Total</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalRevenue.toLocaleString()} XOF</p>
              <p className="text-sm text-green-600">+12.5% ce mois</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Clients Actifs</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalClients}</p>
              <p className="text-sm text-green-600">+8 nouveaux</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Délai Moyen</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.averageDeliveryTime} jours</p>
              <p className="text-sm text-red-600">-2 jours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-secondary-900">Évolution des Revenus</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-4">
            {stats.monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">{data.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(data.revenue / 510000) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-secondary-900 w-24 text-right">
                    {data.revenue.toLocaleString()} XOF
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-secondary-900">Routes les Plus Populaires</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {stats.topRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-secondary-900">{route.route}</p>
                  <p className="text-xs text-secondary-600">{route.packages} colis</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary-900">{route.revenue.toLocaleString()} XOF</p>
                  <p className="text-xs text-secondary-600">
                    {((route.packages / stats.totalPackages) * 100).toFixed(1)}% du total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
        <h3 className="text-lg font-medium text-secondary-900 mb-6">Métriques Détaillées</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">94.2%</p>
            <p className="text-sm text-secondary-600">Taux de Livraison</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">4.8/5</p>
            <p className="text-sm text-secondary-600">Satisfaction Client</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">2.3 jours</p>
            <p className="text-sm text-secondary-600">Temps de Traitement</p>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white p-6 rounded-lg shadow border border-secondary-200">
        <h3 className="text-lg font-medium text-secondary-900 mb-6">Indicateurs de Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Colis en Transit</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-secondary-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <span className="text-sm font-medium text-secondary-900">68%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Colis Livrés</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-secondary-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <span className="text-sm font-medium text-secondary-900">94%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-secondary-600">Retards</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-secondary-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '6%' }}></div>
              </div>
              <span className="text-sm font-medium text-secondary-900">6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
