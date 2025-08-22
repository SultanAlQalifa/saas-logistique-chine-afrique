'use client'

import { useState, useEffect } from 'react'
import { 
  Network, 
  Database, 
  RefreshCw, 
  Eye, 
  Download, 
  Upload,
  Server,
  Activity,
  BarChart3,
  Settings,
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Package,
  Building,
  CreditCard,
  Truck
} from 'lucide-react'

interface ApiEndpoint {
  method: string
  path: string
  description: string
  status: 'active' | 'inactive' | 'maintenance'
  requests: number
  lastUsed: string
}

interface ApiStats {
  totalRequests: number
  activeEndpoints: number
  totalData: number
  uptime: string
}

export default function ApiAdminPage() {
  const [stats, setStats] = useState<ApiStats>({
    totalRequests: 0,
    activeEndpoints: 0,
    totalData: 0,
    uptime: '99.9%'
  })
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<any>(null)

  const mockEndpoints: ApiEndpoint[] = [
    { method: 'GET', path: '/api/packages', description: 'Récupérer tous les colis', status: 'active', requests: 1247, lastUsed: '2 min' },
    { method: 'POST', path: '/api/packages', description: 'Créer un nouveau colis', status: 'active', requests: 342, lastUsed: '5 min' },
    { method: 'GET', path: '/api/clients', description: 'Récupérer tous les clients', status: 'active', requests: 856, lastUsed: '1 min' },
    { method: 'POST', path: '/api/clients', description: 'Créer un nouveau client', status: 'active', requests: 234, lastUsed: '3 min' },
    { method: 'GET', path: '/api/companies', description: 'Récupérer toutes les entreprises', status: 'active', requests: 445, lastUsed: '4 min' },
    { method: 'GET', path: '/api/transactions', description: 'Récupérer toutes les transactions', status: 'active', requests: 678, lastUsed: '2 min' },
    { method: 'GET', path: '/api/agents', description: 'Récupérer tous les agents', status: 'active', requests: 321, lastUsed: '6 min' },
    { method: 'GET', path: '/api/commissions', description: 'Récupérer toutes les commissions', status: 'active', requests: 189, lastUsed: '8 min' },
    { method: 'GET', path: '/api/cargos', description: 'Récupérer tous les cargos', status: 'active', requests: 267, lastUsed: '7 min' },
    { method: 'GET', path: '/api/dashboard/stats', description: 'Statistiques du dashboard', status: 'active', requests: 892, lastUsed: '1 min' },
    { method: 'GET', path: '/api/support/tickets', description: 'Tickets de support', status: 'active', requests: 156, lastUsed: '12 min' },
    { method: 'GET', path: '/api/test-api', description: 'Test de tous les endpoints', status: 'active', requests: 45, lastUsed: '15 min' },
  ]

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setEndpoints(mockEndpoints)
      setStats({
        totalRequests: mockEndpoints.reduce((sum, ep) => sum + ep.requests, 0),
        activeEndpoints: mockEndpoints.filter(ep => ep.status === 'active').length,
        totalData: 1247, // Nombre total d'entités dans la base
        uptime: '99.9%'
      })
      setLoading(false)
    }, 1000)
  }, [])

  const testAllApis = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-api')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      console.error('Erreur lors du test des APIs:', error)
    }
    setLoading(false)
  }

  const initializeData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/init-data', { method: 'POST' })
      const data = await response.json()
      console.log('Données initialisées:', data)
      alert('Données initialisées avec succès!')
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error)
      alert('Erreur lors de l\'initialisation des données')
    }
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />
      case 'maintenance': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-blue-100 text-blue-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Network className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">🔧 API Administration</h1>
            <p className="text-white/80">Interface d'administration des API et gestion des données</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6" />
              <div>
                <p className="text-sm opacity-80">Requêtes Totales</p>
                <p className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Server className="h-6 w-6" />
              <div>
                <p className="text-sm opacity-80">Endpoints Actifs</p>
                <p className="text-2xl font-bold">{stats.activeEndpoints}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6" />
              <div>
                <p className="text-sm opacity-80">Entités Données</p>
                <p className="text-2xl font-bold">{stats.totalData}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6" />
              <div>
                <p className="text-sm opacity-80">Uptime</p>
                <p className="text-2xl font-bold">{stats.uptime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={testAllApis}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          <div className="flex items-center gap-3 mb-2">
            <Play className="h-6 w-6" />
            <h3 className="font-bold text-lg">Tester toutes les APIs</h3>
          </div>
          <p className="text-sm opacity-90">Exécuter les tests sur tous les endpoints</p>
        </button>

        <button
          onClick={initializeData}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          <div className="flex items-center gap-3 mb-2">
            <Upload className="h-6 w-6" />
            <h3 className="font-bold text-lg">Initialiser les données</h3>
          </div>
          <p className="text-sm opacity-90">Générer de nouvelles données mock</p>
        </button>

        <button
          onClick={() => window.open('/api/test-api', '_blank')}
          className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <Eye className="h-6 w-6" />
            <h3 className="font-bold text-lg">Voir les données</h3>
          </div>
          <p className="text-sm opacity-90">Aperçu complet des données API</p>
        </button>
      </div>

      {/* Liste des endpoints */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">📡 Endpoints API</h2>
            <button
              onClick={() => setEndpoints([...mockEndpoints])}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requêtes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière utilisation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {endpoints.map((endpoint, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusIcon(endpoint.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{endpoint.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {endpoint.requests.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {endpoint.lastUsed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résultats des tests */}
      {testResults && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">🧪 Résultats des Tests API</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Colis</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{testResults.data?.packages?.total || 0}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Clients</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{testResults.data?.clients?.total || 0}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Entreprises</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{testResults.data?.companies?.total || 0}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Transactions</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{testResults.data?.transactions?.total || 0}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Message du système</h3>
              <p className="text-sm text-gray-600">{testResults.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                Statut: <span className="font-medium">{testResults.summary?.status}</span> | 
                Entités totales: <span className="font-medium">{testResults.summary?.totalEntities}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-900">Chargement...</span>
          </div>
        </div>
      )}
    </div>
  )
}
