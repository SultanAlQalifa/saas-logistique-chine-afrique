'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Receipt,
  CreditCard,
  Users,
  Building2,
  Globe,
  FileText,
  Eye,
  RefreshCw
} from 'lucide-react'

// Types pour les rapports
interface ReportData {
  period: string
  revenue: number
  expenses: number
  profit: number
  transactions: number
  growth: number
}

interface PaymentMethodStats {
  method: string
  volume: number
  transactions: number
  percentage: number
  color: string
}

interface RegionStats {
  region: string
  revenue: number
  transactions: number
  growth: number
  flag: string
}

// Mock data
const mockReportData: ReportData[] = [
  { period: 'Jan 2024', revenue: 2450000, expenses: 1850000, profit: 600000, transactions: 1247, growth: 12.5 },
  { period: 'Déc 2023', revenue: 2180000, expenses: 1720000, profit: 460000, transactions: 1156, growth: 8.2 },
  { period: 'Nov 2023', revenue: 2015000, expenses: 1650000, profit: 365000, transactions: 1089, growth: 5.7 },
  { period: 'Oct 2023', revenue: 1905000, expenses: 1580000, profit: 325000, transactions: 1023, growth: 3.1 },
  { period: 'Sep 2023', revenue: 1847000, expenses: 1520000, profit: 327000, transactions: 987, growth: 4.2 },
  { period: 'Aoû 2023', revenue: 1772000, expenses: 1465000, profit: 307000, transactions: 945, growth: 2.8 }
]

const mockPaymentMethods: PaymentMethodStats[] = [
  { method: 'Wave', volume: 890000, transactions: 456, percentage: 36.3, color: 'bg-blue-500' },
  { method: 'Orange Money', volume: 654000, transactions: 321, percentage: 26.7, color: 'bg-orange-500' },
  { method: 'CinetPay', volume: 523000, transactions: 287, percentage: 21.3, color: 'bg-green-500' },
  { method: 'Stripe', volume: 383000, transactions: 183, percentage: 15.7, color: 'bg-purple-500' }
]

const mockRegionStats: RegionStats[] = [
  { region: 'Sénégal', revenue: 985000, transactions: 523, growth: 15.2, flag: '🇸🇳' },
  { region: 'Côte d\'Ivoire', revenue: 756000, transactions: 398, growth: 12.8, flag: '🇨🇮' },
  { region: 'Mali', revenue: 432000, transactions: 234, growth: 8.5, flag: '🇲🇱' },
  { region: 'Burkina Faso', revenue: 277000, transactions: 92, growth: 5.1, flag: '🇧🇫' }
]

const reportTemplates = [
  {
    id: 'revenue',
    name: 'Rapport de revenus',
    description: 'Analyse détaillée des revenus par période',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    id: 'transactions',
    name: 'Rapport de transactions',
    description: 'Détail de toutes les transactions',
    icon: CreditCard,
    color: 'bg-blue-500'
  },
  {
    id: 'commissions',
    name: 'Rapport de commissions',
    description: 'Commissions versées aux agents',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    id: 'regional',
    name: 'Rapport régional',
    description: 'Performance par région',
    icon: Globe,
    color: 'bg-orange-500'
  },
  {
    id: 'methods',
    name: 'Méthodes de paiement',
    description: 'Analyse des moyens de paiement',
    icon: Receipt,
    color: 'bg-indigo-500'
  },
  {
    id: 'custom',
    name: 'Rapport personnalisé',
    description: 'Créez votre propre rapport',
    icon: FileText,
    color: 'bg-gray-500'
  }
]

export default function FinancialReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [isGenerating, setIsGenerating] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleGenerateReport = (reportId: string) => {
    setIsGenerating(true)
    // Simulation de génération de rapport
    setTimeout(() => {
      setIsGenerating(false)
      // Ici on pourrait déclencher le téléchargement
    }, 2000)
  }

  const currentData = mockReportData[0]
  const previousData = mockReportData[1]
  const revenueGrowth = ((currentData.revenue - previousData.revenue) / previousData.revenue) * 100
  const profitGrowth = ((currentData.profit - previousData.profit) / previousData.profit) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Rapports Financiers</h1>
          <p className="text-secondary-600 mt-1">
            Analytics et rapports détaillés de vos performances financières
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
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Revenus actuels</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(currentData.revenue)}
              </p>
              <p className={`text-xs flex items-center mt-1 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
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
              <p className="text-sm font-medium text-secondary-600">Bénéfice net</p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(currentData.profit)}
              </p>
              <p className={`text-xs flex items-center mt-1 ${profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(profitGrowth).toFixed(1)}% vs mois précédent
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Transactions</p>
              <p className="text-2xl font-bold text-secondary-900">{currentData.transactions}</p>
              <p className="text-xs text-secondary-500 mt-1">
                +{currentData.transactions - previousData.transactions} ce mois
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Marge bénéficiaire</p>
              <p className="text-2xl font-bold text-secondary-900">
                {((currentData.profit / currentData.revenue) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                Ratio profit/revenus
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Évolution des revenus</h3>
            <button className="text-secondary-400 hover:text-secondary-600">
              <Eye className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {mockReportData.slice(0, 4).map((data, index) => (
              <div key={data.period} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-primary-500' : 'bg-secondary-300'
                  }`} />
                  <span className="text-sm text-secondary-900">{data.period}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-secondary-900">
                    {formatCurrency(data.revenue)}
                  </div>
                  <div className={`text-xs ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.growth >= 0 ? '+' : ''}{data.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par méthode de paiement */}
        <div className="bg-white rounded-lg border border-secondary-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Méthodes de paiement</h3>
            <button className="text-secondary-400 hover:text-secondary-600">
              <Eye className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {mockPaymentMethods.map((method) => (
              <div key={method.method} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-900">{method.method}</span>
                  <span className="text-sm font-medium text-secondary-900">
                    {method.percentage}%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${method.color}`}
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-secondary-500">
                  <span>{formatCurrency(method.volume)}</span>
                  <span>{method.transactions} transactions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance par région */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Performance par région</h3>
          <button className="text-secondary-400 hover:text-secondary-600">
            <Download className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 text-sm font-medium text-secondary-500">Région</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Revenus</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Transactions</th>
                <th className="text-right py-3 text-sm font-medium text-secondary-500">Croissance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200">
              {mockRegionStats.map((region) => (
                <tr key={region.region} className="hover:bg-secondary-50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{region.flag}</span>
                      <span className="text-sm font-medium text-secondary-900">{region.region}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right text-sm font-medium text-secondary-900">
                    {formatCurrency(region.revenue)}
                  </td>
                  <td className="py-4 text-right text-sm text-secondary-600">
                    {region.transactions}
                  </td>
                  <td className="py-4 text-right">
                    <span className={`text-sm font-medium ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {region.growth >= 0 ? '+' : ''}{region.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modèles de rapports */}
      <div className="bg-white rounded-lg border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-secondary-900">Générer des rapports</h3>
          <p className="text-sm text-secondary-500">Choisissez un modèle de rapport à générer</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => {
            const Icon = template.icon
            
            return (
              <div key={template.id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${template.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="ml-3 text-sm font-medium text-secondary-900">{template.name}</h4>
                </div>
                
                <p className="text-xs text-secondary-500 mb-4">{template.description}</p>
                
                <button
                  onClick={() => handleGenerateReport(template.id)}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isGenerating ? 'Génération...' : 'Générer'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
