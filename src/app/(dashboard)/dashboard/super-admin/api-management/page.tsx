'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Code, 
  Key, 
  Play, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Database,
  Settings,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED'
  createdAt: string
  lastUsed?: string
  usageCount: number
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  status: 'ACTIVE' | 'MAINTENANCE'
  responseTime: number
  lastCalled?: string
}

export default function ApiManagementPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([])
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false)
  const [showKeyValue, setShowKeyValue] = useState<{ [key: string]: boolean }>({})
  const [testResults, setTestResults] = useState<any>(null)
  const [isTestingApi, setIsTestingApi] = useState(false)

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  // Mock data
  useEffect(() => {
    setApiKeys([
      {
        id: 'ak_001',
        name: 'Production API Key',
        key: 'sk_live_nextmove_cargo_prod_2024_abc123def456',
        permissions: ['packages:read', 'packages:write', 'tracking:read', 'clients:read'],
        status: 'ACTIVE',
        createdAt: '2024-01-01T10:00:00Z',
        lastUsed: '2024-01-20T14:30:00Z',
        usageCount: 1247
      },
      {
        id: 'ak_002',
        name: 'Test API Key',
        key: 'sk_live_nextmove_cargo_2024',
        permissions: ['packages:read', 'packages:write', 'tracking:read', 'clients:read', 'companies:read', 'stats:read'],
        status: 'ACTIVE',
        createdAt: '2024-01-15T09:00:00Z',
        lastUsed: '2024-01-20T16:45:00Z',
        usageCount: 456
      }
    ])

    setEndpoints([
      { method: 'GET', path: '/api/v1/packages', description: 'Récupérer tous les colis', status: 'ACTIVE', responseTime: 120 },
      { method: 'POST', path: '/api/v1/packages', description: 'Créer un nouveau colis', status: 'ACTIVE', responseTime: 85 },
      { method: 'GET', path: '/api/v1/tracking/{id}', description: 'Suivre un colis', status: 'ACTIVE', responseTime: 95 },
      { method: 'GET', path: '/api/v1/clients', description: 'Récupérer tous les clients', status: 'ACTIVE', responseTime: 110 },
      { method: 'POST', path: '/api/v1/clients', description: 'Créer un nouveau client', status: 'ACTIVE', responseTime: 75 },
      { method: 'GET', path: '/api/v1/companies', description: 'Récupérer toutes les entreprises', status: 'ACTIVE', responseTime: 130 },
      { method: 'GET', path: '/api/v1/stats', description: 'Statistiques du dashboard', status: 'ACTIVE', responseTime: 65 },
      { method: 'GET', path: '/api/v1/webhooks', description: 'Gestion des webhooks', status: 'ACTIVE', responseTime: 90 }
    ])
  }, [])

  if (session && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            Cette page est réservée aux Super Administrateurs uniquement.
          </p>
        </div>
      </div>
    )
  }

  const handleTestApi = async () => {
    setIsTestingApi(true)
    try {
      const response = await fetch('/api/test-api')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: 'Erreur lors du test de l\'API' })
    } finally {
      setIsTestingApi(false)
    }
  }

  const handleCreateApiKey = () => {
    // Simulate API key creation
    const newKey = {
      id: `ak_${Date.now()}`,
      name: 'Nouvelle Clé API',
      key: `sk_live_nextmove_cargo_${Date.now()}`,
      permissions: ['packages:read', 'tracking:read'],
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
      usageCount: 0
    }
    setApiKeys(prev => [...prev, newKey])
    setShowCreateKeyModal(false)
    alert('✅ Nouvelle clé API créée avec succès!')
  }

  const handleDeleteApiKey = (keyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette clé API ?')) {
      setApiKeys(prev => prev.filter(key => key.id !== keyId))
      alert('🗑️ Clé API supprimée avec succès!')
    }
  }

  const handleExportData = () => {
    const data = {
      apiKeys: apiKeys,
      endpoints: endpoints,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-management-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert('📊 Données exportées avec succès!')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copié dans le presse-papiers! 📋')
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyValue(prev => ({ ...prev, [keyId]: !prev[keyId] }))
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

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Activity },
    { id: 'endpoints', name: 'Endpoints', icon: Globe },
    { id: 'keys', name: 'Clés API', icon: Key },
    { id: 'testing', name: 'Tests', icon: Play },
    { id: 'documentation', name: 'Documentation', icon: FileText }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Code className="h-10 w-10" />
              🔌 Administration API
            </h1>
            <p className="text-indigo-100 text-lg">
              Gestion complète de l'API NextMove Cargo
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleTestApi}
              disabled={isTestingApi}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Play className={`h-5 w-5 ${isTestingApi ? 'animate-spin' : ''}`} />
              {isTestingApi ? 'Test en cours...' : 'Tester l\'API'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <nav className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble de l'API</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Endpoints Actifs</p>
                    <p className="text-2xl font-bold text-green-700">{endpoints.filter(e => e.status === 'ACTIVE').length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Clés API</p>
                    <p className="text-2xl font-bold text-blue-700">{apiKeys.filter(k => k.status === 'ACTIVE').length}</p>
                  </div>
                  <Key className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Requêtes Totales</p>
                    <p className="text-2xl font-bold text-purple-700">1,703</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Temps Réponse Moyen</p>
                    <p className="text-2xl font-bold text-orange-700">98ms</p>
                  </div>
                  <Database className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">🔑 Créer une Clé API</h3>
                <p className="text-indigo-100 mb-4">Générer une nouvelle clé pour intégrations</p>
                <button
                  onClick={handleCreateApiKey}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  Créer une clé
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">📊 Tester l'API</h3>
                <p className="text-green-100 mb-4">Vérifier le bon fonctionnement</p>
                <button
                  onClick={handleTestApi}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  Lancer les tests
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">📚 Documentation</h3>
                <p className="text-blue-100 mb-4">Guide complet pour développeurs</p>
                <button
                  onClick={() => window.open('/docs/API_DOCUMENTATION.md', '_blank')}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  Voir la doc
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Endpoints API</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temps Réponse</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {endpoints.map((endpoint, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{endpoint.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          endpoint.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {endpoint.status === 'ACTIVE' ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          {endpoint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {endpoint.responseTime}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Clés API</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateApiKey}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle clé
                </button>
                <button
                  onClick={handleExportData}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exporter
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          apiKey.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <code className="bg-white px-3 py-2 rounded border text-sm font-mono">
                          {showKeyValue[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 12) + '...'}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          {showKeyValue[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Créée le:</span>
                          <div className="font-medium">{new Date(apiKey.createdAt).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Dernière utilisation:</span>
                          <div className="font-medium">
                            {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString('fr-FR') : 'Jamais'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Utilisations:</span>
                          <div className="font-medium">{apiKey.usageCount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Permissions:</span>
                          <div className="font-medium">{apiKey.permissions.length} autorisations</div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Supprimer cette clé API"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tests API</h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Test Complet de l'API</h3>
                <button
                  onClick={handleTestApi}
                  disabled={isTestingApi}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  {isTestingApi ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {isTestingApi ? 'Test en cours...' : 'Lancer le test'}
                </button>
              </div>

              {testResults && (
                <div className="mt-6">
                  <div className={`p-4 rounded-lg mb-4 ${
                    testResults.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {testResults.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${testResults.success ? 'text-green-800' : 'text-red-800'}`}>
                        {testResults.success ? 'Tests réussis ✅' : 'Tests échoués ❌'}
                      </span>
                    </div>
                  </div>

                  {testResults.success && (
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold mb-3">Résultats des tests:</h4>
                      <pre className="text-sm bg-gray-50 p-4 rounded overflow-x-auto">
                        {JSON.stringify(testResults, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documentation' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation API</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 Guide Complet</h3>
                <p className="text-blue-700 mb-4">Documentation complète avec exemples de code</p>
                <button
                  onClick={() => window.open('/docs/API_DOCUMENTATION.md', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Voir la documentation
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">🔗 URL de Base</h3>
                <p className="text-green-700 mb-4">Endpoint principal de l'API</p>
                <div className="bg-white p-3 rounded border">
                  <code className="text-sm">https://api.nextmovecargo.com/v1</code>
                  <button
                    onClick={() => copyToClipboard('https://api.nextmovecargo.com/v1')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <Copy className="h-4 w-4 inline" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Exemples d'utilisation rapide</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Récupérer tous les colis:</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    curl -H "X-API-Key: sk_test_nextmove_cargo_2024" \<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;https://api.nextmovecargo.com/v1/packages
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Suivre un colis:</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    curl -H "X-API-Key: sk_test_nextmove_cargo_2024" \<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;https://api.nextmovecargo.com/v1/tracking/TRK-2024-001
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
