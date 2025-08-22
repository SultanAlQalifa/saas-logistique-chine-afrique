'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Globe,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Clock,
  MapPin,
  Truck
} from 'lucide-react'

interface AnalyticsData {
  period: string
  shipments: number
  revenue: number
  customers: number
  avgDeliveryTime: number
  conversionRate: number
  growth: number
}

interface RegionData {
  region: string
  country: string
  shipments: number
  revenue: number
  growth: number
  flag: string
  marketShare: number
}

interface ServiceData {
  service: string
  volume: number
  revenue: number
  avgPrice: number
  growth: number
  color: string
}

// Mock data
const mockAnalytics: AnalyticsData[] = [
  { period: 'Jan 2024', shipments: 1247, revenue: 2450000, customers: 456, avgDeliveryTime: 12, conversionRate: 3.2, growth: 15.2 },
  { period: 'Déc 2023', shipments: 1089, revenue: 2180000, customers: 398, avgDeliveryTime: 14, conversionRate: 2.8, growth: 8.7 },
  { period: 'Nov 2023', shipments: 987, revenue: 1950000, customers: 367, avgDeliveryTime: 13, conversionRate: 2.5, growth: 5.3 },
  { period: 'Oct 2023', shipments: 923, revenue: 1820000, customers: 345, avgDeliveryTime: 15, conversionRate: 2.3, growth: 3.1 },
  { period: 'Sep 2023', shipments: 856, revenue: 1680000, customers: 321, avgDeliveryTime: 16, conversionRate: 2.1, growth: 1.8 },
  { period: 'Aoû 2023', shipments: 798, revenue: 1540000, customers: 298, avgDeliveryTime: 17, conversionRate: 1.9, growth: -0.5 }
]

const mockRegions: RegionData[] = [
  { region: 'Afrique de l\'Ouest', country: 'Sénégal', shipments: 523, revenue: 985000, growth: 18.5, flag: '🇸🇳', marketShare: 42 },
  { region: 'Afrique de l\'Ouest', country: 'Côte d\'Ivoire', shipments: 398, revenue: 756000, growth: 12.3, flag: '🇨🇮', marketShare: 32 },
  { region: 'Afrique de l\'Ouest', country: 'Mali', shipments: 234, revenue: 432000, growth: 8.7, flag: '🇲🇱', marketShare: 19 },
  { region: 'Afrique de l\'Ouest', country: 'Burkina Faso', shipments: 92, revenue: 277000, growth: 5.1, flag: '🇧🇫', marketShare: 7 }
]

const mockServices: ServiceData[] = [
  { service: 'Maritime Standard', volume: 45, revenue: 890000, avgPrice: 19778, growth: 12.5, color: 'bg-blue-500' },
  { service: 'Maritime Express', volume: 28, revenue: 654000, avgPrice: 23357, growth: 8.3, color: 'bg-green-500' },
  { service: 'Aérien Standard', volume: 18, revenue: 523000, avgPrice: 29056, growth: 15.7, color: 'bg-purple-500' },
  { service: 'Aérien Express', volume: 9, revenue: 383000, avgPrice: 42556, growth: 22.1, color: 'bg-orange-500' }
]

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const currentData = mockAnalytics[0]
  const previousData = mockAnalytics[1]
  
  const revenueGrowth = ((currentData.revenue - previousData.revenue) / previousData.revenue) * 100
  const shipmentsGrowth = ((currentData.shipments - previousData.shipments) / previousData.shipments) * 100
  const customersGrowth = ((currentData.customers - previousData.customers) / previousData.customers) * 100
  const deliveryImprovement = ((previousData.avgDeliveryTime - currentData.avgDeliveryTime) / previousData.avgDeliveryTime) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">{t('dashboard.view_analytics')}</h1>
          <p className="text-secondary-600 mt-1">
            Analysez vos performances et tendances business
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="month">Ce mois</option>
            <option value="3months">3 derniers mois</option>
            <option value="6months">6 derniers mois</option>
            <option value="year">Cette année</option>
            <option value="custom">Période personnalisée</option>
          </select>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">{t('dashboard.revenue')}</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(currentData.revenue)}
              </p>
              <p className={`text-xs flex items-center mt-1 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(revenueGrowth).toFixed(1)}% vs mois précédent
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Expéditions</p>
              <p className="text-2xl font-bold text-secondary-900">{currentData.shipments.toLocaleString('fr-FR')}</p>
              <p className={`text-xs flex items-center mt-1 ${shipmentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {shipmentsGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(shipmentsGrowth).toFixed(1)}% vs mois précédent
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Nouveaux clients</p>
              <p className="text-2xl font-bold text-secondary-900">{currentData.customers}</p>
              <p className={`text-xs flex items-center mt-1 ${customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {customersGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(customersGrowth).toFixed(1)}% vs mois précédent
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Délai moyen</p>
              <p className="text-2xl font-bold text-secondary-900">{currentData.avgDeliveryTime}j</p>
              <p className={`text-xs flex items-center mt-1 ${deliveryImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {deliveryImprovement >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(deliveryImprovement).toFixed(1)}% d'amélioration
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Évolution des revenus</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-secondary-300 rounded text-sm"
            >
              <option value="revenue">Revenus</option>
              <option value="shipments">Expéditions</option>
              <option value="customers">Clients</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {mockAnalytics.slice(0, 6).map((data, index) => {
              const value = selectedMetric === 'revenue' ? data.revenue : 
                           selectedMetric === 'shipments' ? data.shipments : data.customers
              const maxValue = Math.max(...mockAnalytics.map(d => 
                selectedMetric === 'revenue' ? d.revenue : 
                selectedMetric === 'shipments' ? d.shipments : d.customers
              ))
              const percentage = (value / maxValue) * 100
              
              return (
                <div key={data.period} className="flex items-center justify-between">
                  <div className="flex items-center w-32">
                    <span className="text-sm text-secondary-900">{data.period}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${index === 0 ? 'bg-primary-500' : 'bg-secondary-400'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-24">
                    <div className="text-sm font-medium text-secondary-900">
                      {selectedMetric === 'revenue' ? formatCurrency(value) : value.toLocaleString('fr-FR')}
                    </div>
                    <div className={`text-xs ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.growth >= 0 ? '+' : ''}{data.growth}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance par service */}
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Performance par service</h3>
            <button className="text-secondary-400 hover:text-secondary-600">
              <Eye className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {mockServices.map((service) => (
              <div key={service.service} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-900">{service.service}</span>
                  <span className="text-sm text-secondary-600">{service.volume}% du volume</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${service.color}`}
                    style={{ width: `${service.volume}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-secondary-500">
                  <span>{formatCurrency(service.revenue)}</span>
                  <span className={service.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {service.growth >= 0 ? '+' : ''}{service.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance régionale */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Performance par région</h3>
          <div className="flex items-center space-x-2">
            <button className="text-secondary-400 hover:text-secondary-600">
              <Filter className="h-5 w-5" />
            </button>
            <button className="text-secondary-400 hover:text-secondary-600">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 text-sm font-medium text-secondary-500">Pays</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Expéditions</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Revenus</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Part de marché</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Croissance</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {mockRegions.map((region) => (
                <tr key={region.country} className="hover:bg-secondary-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{region.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-secondary-900">{region.country}</div>
                        <div className="text-xs text-secondary-500">{region.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="text-sm font-medium text-secondary-900">{region.shipments}</div>
                    <div className="text-xs text-secondary-500">expéditions</div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="text-sm font-medium text-secondary-900">{formatCurrency(region.revenue)}</div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end">
                      <div className="w-16 bg-secondary-200 rounded-full h-2 mr-2">
                        <div 
                          className="h-2 bg-primary-500 rounded-full"
                          style={{ width: `${region.marketShare}%` }}
                        />
                      </div>
                      <span className="text-sm text-secondary-900">{region.marketShare}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className={`flex items-center justify-end text-sm font-medium ${
                      region.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {region.growth >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {region.growth >= 0 ? '+' : ''}{region.growth}%
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Insights clés</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">Croissance forte au Sénégal</p>
                <p className="text-xs text-secondary-500">+18.5% de croissance, opportunité d'expansion</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">Amélioration des délais</p>
                <p className="text-xs text-secondary-500">-14% sur les délais de livraison moyens</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-900">Service aérien en hausse</p>
                <p className="text-xs text-secondary-500">+22% de croissance sur l'aérien express</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recommandations</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Investir au Mali</p>
              <p className="text-xs text-blue-700">Potentiel de croissance élevé avec 8.7% d'augmentation</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Promouvoir l'aérien express</p>
              <p className="text-xs text-green-700">Service le plus rentable avec une forte demande</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-900">Optimiser le maritime</p>
              <p className="text-xs text-orange-700">45% du volume, opportunité d'améliorer les marges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
