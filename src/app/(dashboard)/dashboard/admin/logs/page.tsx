'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  Activity,
  Eye,
  Trash2
} from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  category: 'AUTH' | 'API' | 'DATABASE' | 'SYSTEM' | 'USER_ACTION' | 'SECURITY'
  message: string
  user?: string
  ip?: string
  userAgent?: string
  details?: any
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-20T14:30:25Z',
    level: 'INFO',
    category: 'AUTH',
    message: 'Utilisateur connecté avec succès',
    user: 'jean.dupont@example.com',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    timestamp: '2024-01-20T14:25:12Z',
    level: 'ERROR',
    category: 'API',
    message: 'Échec de l\'appel API vers le service de tracking',
    details: { endpoint: '/api/tracking/update', statusCode: 500, error: 'Internal Server Error' }
  },
  {
    id: '3',
    timestamp: '2024-01-20T14:20:45Z',
    level: 'WARNING',
    category: 'SECURITY',
    message: 'Tentative de connexion avec mot de passe incorrect',
    user: 'unknown@example.com',
    ip: '203.0.113.45',
    details: { attempts: 3, blocked: false }
  },
  {
    id: '4',
    timestamp: '2024-01-20T14:15:30Z',
    level: 'SUCCESS',
    category: 'USER_ACTION',
    message: 'Nouveau colis créé avec succès',
    user: 'marie.martin@logistique.com',
    ip: '192.168.1.101',
    details: { packageId: 'PKG-2024-001', weight: '2.5kg', destination: 'Abidjan' }
  },
  {
    id: '5',
    timestamp: '2024-01-20T14:10:15Z',
    level: 'ERROR',
    category: 'DATABASE',
    message: 'Erreur de connexion à la base de données',
    details: { database: 'main', error: 'Connection timeout', duration: '30s' }
  },
  {
    id: '6',
    timestamp: '2024-01-20T14:05:00Z',
    level: 'INFO',
    category: 'SYSTEM',
    message: 'Sauvegarde automatique effectuée',
    details: { size: '2.3GB', duration: '45s', status: 'completed' }
  },
  {
    id: '7',
    timestamp: '2024-01-20T14:00:30Z',
    level: 'WARNING',
    category: 'API',
    message: 'Limite de taux d\'API atteinte',
    ip: '198.51.100.25',
    details: { endpoint: '/api/packages/search', limit: 1000, current: 1000 }
  },
  {
    id: '8',
    timestamp: '2024-01-20T13:55:45Z',
    level: 'INFO',
    category: 'USER_ACTION',
    message: 'Profil utilisateur mis à jour',
    user: 'ahmed.kone@client.com',
    ip: '192.168.1.102',
    details: { fields: ['phone', 'address'], previousValues: { phone: '+225 01 23 45 67' } }
  }
]

export default function AdminLogsPage() {
  const { data: session } = useSession()
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Vérifier si l'utilisateur est SUPER_ADMIN
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN'

  // Si pas SUPER_ADMIN, afficher message d'accès refusé
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
            <br />
            Contactez votre administrateur système pour plus d'informations.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Votre rôle actuel : <span className="font-medium">{session?.user?.role || 'Non défini'}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'bg-blue-100 text-blue-800'
      case 'SUCCESS': return 'bg-green-100 text-green-800'
      case 'WARNING': return 'bg-yellow-100 text-yellow-800'
      case 'ERROR': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'INFO': return <Info className="h-4 w-4" />
      case 'SUCCESS': return <CheckCircle className="h-4 w-4" />
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />
      case 'ERROR': return <XCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AUTH': return 'bg-purple-100 text-purple-800'
      case 'API': return 'bg-indigo-100 text-indigo-800'
      case 'DATABASE': return 'bg-emerald-100 text-emerald-800'
      case 'SYSTEM': return 'bg-gray-100 text-gray-800'
      case 'USER_ACTION': return 'bg-blue-100 text-blue-800'
      case 'SECURITY': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.ip && log.ip.includes(searchTerm))
    
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter
    
    return matchesSearch && matchesLevel && matchesCategory
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulation du rechargement
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    alert('Logs actualisés! 🔄')
  }

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'Message', 'User', 'IP'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.category,
        log.message,
        log.user || '',
        log.ip || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const stats = {
    total: logs.length,
    info: logs.filter(l => l.level === 'INFO').length,
    success: logs.filter(l => l.level === 'SUCCESS').length,
    warning: logs.filter(l => l.level === 'WARNING').length,
    error: logs.filter(l => l.level === 'ERROR').length,
    auth: logs.filter(l => l.category === 'AUTH').length,
    api: logs.filter(l => l.category === 'API').length,
    database: logs.filter(l => l.category === 'DATABASE').length,
    system: logs.filter(l => l.category === 'SYSTEM').length
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FileText className="h-10 w-10" />
              📋 Journaux Système
            </h1>
            <p className="text-slate-100 text-lg">
              Surveillance et analyse des logs de la plateforme
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualisation...' : 'Actualiser'}
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
          <div className="text-sm text-blue-600">Info</div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.success}</div>
          <div className="text-sm text-green-600">Succès</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
          <div className="text-sm text-yellow-600">Avertissements</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.error}</div>
          <div className="text-sm text-red-600">Erreurs</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.auth}</div>
          <div className="text-sm text-purple-600">Auth</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-600">{stats.api}</div>
          <div className="text-sm text-indigo-600">API</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl shadow-sm border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-600">{stats.database}</div>
          <div className="text-sm text-emerald-600">Database</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="ALL">Tous les niveaux</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Succès</option>
            <option value="WARNING">Avertissement</option>
            <option value="ERROR">Erreur</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          >
            <option value="ALL">Toutes les catégories</option>
            <option value="AUTH">Authentification</option>
            <option value="API">API</option>
            <option value="DATABASE">Base de données</option>
            <option value="SYSTEM">Système</option>
            <option value="USER_ACTION">Action utilisateur</option>
            <option value="SECURITY">Sécurité</option>
          </select>
        </div>
      </div>

      {/* Liste des Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)}
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(log.category)}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate">
                      {log.message}
                    </div>
                    {log.ip && (
                      <div className="text-xs text-gray-500">IP: {log.ip}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.user ? (
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <User className="h-3 w-3 text-gray-400" />
                        {log.user}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-indigo-600 hover:text-indigo-800 p-1"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun log trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Détails du Log</h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">{new Date(selectedLog.timestamp).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Niveau</label>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(selectedLog.level)}`}>
                    {getLevelIcon(selectedLog.level)}
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedLog.category)}`}>
                    {selectedLog.category}
                  </span>
                </div>
                {selectedLog.user && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                    <p className="text-sm text-gray-900">{selectedLog.user}</p>
                  </div>
                )}
                {selectedLog.ip && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse IP</label>
                    <p className="text-sm text-gray-900">{selectedLog.ip}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLog.message}</p>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User Agent</label>
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg break-all">{selectedLog.userAgent}</p>
                </div>
              )}

              {selectedLog.details && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Détails</label>
                  <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
