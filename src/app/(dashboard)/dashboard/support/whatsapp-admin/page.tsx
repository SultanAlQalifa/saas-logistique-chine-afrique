'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MessageCircle, CheckCircle, AlertCircle, Clock, Shield, Users, Eye, X, Check, Ban, RefreshCw, Search, Filter } from 'lucide-react'
import { SuperAdminWhatsAppService, CompanyWhatsAppConfig } from '@/lib/whatsapp-company-service'

export default function WhatsAppAdminPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all' | 'stats'>('pending')
  const [configs, setConfigs] = useState<CompanyWhatsAppConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<CompanyWhatsAppConfig | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Statistiques globales
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0,
    activeConfigs: 0,
    pendingRequests: 0,
    totalMessages: 0,
    successRate: 0
  })

  useEffect(() => {
    loadData()
    loadGlobalStats()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      let data: CompanyWhatsAppConfig[] = []
      
      if (activeTab === 'pending') {
        data = await SuperAdminWhatsAppService.getPendingRequests()
      } else {
        data = await SuperAdminWhatsAppService.getAllConfigs()
        
        if (activeTab === 'approved') {
          data = data.filter(config => config.status === 'approved')
        }
      }
      
      setConfigs(data)
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGlobalStats = async () => {
    try {
      const stats = await SuperAdminWhatsAppService.getGlobalStats()
      if (stats) {
        setGlobalStats(stats)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error)
    }
  }

  const handleApprove = async (configId: string) => {
    if (!session?.user?.id) return
    
    setActionLoading(configId)
    try {
      const result = await SuperAdminWhatsAppService.approveConfig(configId, session.user.id)
      if (result.success) {
        await loadData()
        await loadGlobalStats()
        setSelectedConfig(null)
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (configId: string, reason: string) => {
    if (!session?.user?.id) return
    
    setActionLoading(configId)
    try {
      const result = await SuperAdminWhatsAppService.rejectConfig(configId, session.user.id, reason)
      if (result.success) {
        await loadData()
        await loadGlobalStats()
        setSelectedConfig(null)
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (configId: string, reason: string) => {
    if (!session?.user?.id) return
    
    setActionLoading(configId)
    try {
      const result = await SuperAdminWhatsAppService.suspendConfig(configId, session.user.id, reason)
      if (result.success) {
        await loadData()
        await loadGlobalStats()
        setSelectedConfig(null)
      }
    } catch (error) {
      console.error('Erreur lors de la suspension:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const filteredConfigs = configs.filter(config => {
    const matchesSearch = config.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.phone_number.includes(searchTerm) ||
                         config.companyId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || config.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approuvé</span>
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">En attente</span>
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejeté</span>
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Suspendu</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inconnu</span>
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  // Vérifier si l'utilisateur est SUPER_ADMIN
  if (session.user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Restreint</h2>
          <p className="text-gray-600">Seuls les Super Administrateurs peuvent accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🛡️ Administration WhatsApp Business</h1>
            <p className="text-purple-100">Gestion et supervision des configurations d'entreprises</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{globalStats.pendingRequests}</div>
              <div className="text-sm text-purple-100">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{globalStats.activeConfigs}</div>
              <div className="text-sm text-purple-100">Actives</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Entreprises</p>
              <p className="text-xl font-bold text-gray-900">{globalStats.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Configs Actives</p>
              <p className="text-xl font-bold text-gray-900">{globalStats.activeConfigs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En Attente</p>
              <p className="text-xl font-bold text-gray-900">{globalStats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Messages Total</p>
              <p className="text-xl font-bold text-gray-900">{globalStats.totalMessages.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux Succès</p>
              <p className="text-xl font-bold text-gray-900">{globalStats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'pending', label: 'En Attente', icon: Clock, count: globalStats.pendingRequests },
              { id: 'approved', label: 'Approuvées', icon: CheckCircle, count: globalStats.activeConfigs },
              { id: 'all', label: 'Toutes', icon: Users, count: globalStats.totalCompanies },
              { id: 'stats', label: 'Statistiques', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab !== 'stats' && (
            <>
              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, téléphone ou ID entreprise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="rejected">Rejeté</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>

                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>

              {/* Liste des configurations */}
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                  </div>
                ) : filteredConfigs.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune configuration trouvée</p>
                  </div>
                ) : (
                  filteredConfigs.map((config) => (
                    <div key={config.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{config.display_name}</h3>
                            {getStatusBadge(config.status)}
                            {config.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Téléphone:</span> {config.phone_number}
                            </div>
                            <div>
                              <span className="font-medium">Entreprise:</span> {config.companyId}
                            </div>
                            <div>
                              <span className="font-medium">Créé le:</span> {new Date(config.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {config.approved_at && (
                            <div className="mt-2 text-sm text-green-600">
                              Approuvé le {new Date(config.approved_at).toLocaleDateString()} par {config.approved_by}
                            </div>
                          )}

                          {config.rejection_reason && (
                            <div className="mt-2 text-sm text-red-600">
                              Rejeté: {config.rejection_reason}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedConfig(config)}
                            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {config.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(config.id)}
                                disabled={actionLoading === config.id}
                                className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReject(config.id, 'Configuration non conforme')}
                                disabled={actionLoading === config.id}
                                className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {config.status === 'approved' && (
                            <button
                              onClick={() => handleSuspend(config.id, 'Suspension administrative')}
                              disabled={actionLoading === config.id}
                              className="p-2 text-orange-600 hover:text-orange-700 disabled:opacity-50 transition-colors"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Onglet Statistiques */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">📊 Statistiques Détaillées</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-4">Répartition par Statut</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Approuvées</span>
                      <span className="font-bold text-blue-900">{globalStats.activeConfigs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">En attente</span>
                      <span className="font-bold text-blue-900">{globalStats.pendingRequests}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Total</span>
                      <span className="font-bold text-blue-900">{globalStats.totalCompanies}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">Performance Globale</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Messages envoyés</span>
                      <span className="font-bold text-green-900">{globalStats.totalMessages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Taux de succès</span>
                      <span className="font-bold text-green-900">{globalStats.successRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Configs actives</span>
                      <span className="font-bold text-green-900">{globalStats.activeConfigs}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {selectedConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Détails de la Configuration</h3>
                <button
                  onClick={() => setSelectedConfig(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'affichage</label>
                    <p className="text-gray-900">{selectedConfig.display_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                    <p className="text-gray-900">{selectedConfig.phone_number}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Entreprise</label>
                    <p className="text-gray-900">{selectedConfig.companyId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    {getStatusBadge(selectedConfig.status)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedConfig.phone_number_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Account ID</label>
                    <p className="text-gray-900 font-mono text-sm">{selectedConfig.business_account_id}</p>
                  </div>
                </div>

                {selectedConfig.status === 'pending' && (
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(selectedConfig.id)}
                      disabled={actionLoading === selectedConfig.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleReject(selectedConfig.id, 'Configuration non conforme')}
                      disabled={actionLoading === selectedConfig.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
