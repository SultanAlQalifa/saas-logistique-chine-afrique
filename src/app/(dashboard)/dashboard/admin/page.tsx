'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Settings, 
  Shield, 
  Database, 
  FileText, 
  Users, 
  Building2, 
  Globe, 
  Lock, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  HardDrive, 
  Wifi, 
  Server,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react'

interface SystemLog {
  id: string
  timestamp: string
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
  module: string
  message: string
  user?: string
}

interface SystemConfig {
  id: string
  category: string
  key: string
  value: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
}

// Mock data
const mockLogs: SystemLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30:25',
    level: 'SUCCESS',
    module: 'AUTH',
    message: 'Connexion utilisateur réussie',
    user: 'marie.diallo@company.com'
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:28:12',
    level: 'WARNING',
    module: 'STORAGE',
    message: 'Espace disque faible (85% utilisé)',
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:25:45',
    level: 'ERROR',
    module: 'API',
    message: 'Échec de connexion à l\'API externe de tracking',
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:20:33',
    level: 'INFO',
    module: 'BACKUP',
    message: 'Sauvegarde automatique terminée avec succès',
  }
]

const mockConfigs: SystemConfig[] = [
  {
    id: '1',
    category: 'Général',
    key: 'company_name',
    value: 'LogiTrans SARL',
    description: 'Nom de l\'entreprise affiché dans l\'application',
    type: 'string'
  },
  {
    id: '2',
    category: 'Sécurité',
    key: 'session_timeout',
    value: '3600',
    description: 'Durée de session en secondes',
    type: 'number'
  },
  {
    id: '3',
    category: 'Email',
    key: 'smtp_enabled',
    value: 'true',
    description: 'Activer l\'envoi d\'emails SMTP',
    type: 'boolean'
  }
]

export default function AdminPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'config' | 'users' | 'backup'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'>('ALL')

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

  const systemStats = {
    uptime: '15 jours 8h 32m',
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 85,
    activeUsers: 24,
    totalUsers: 156,
    lastBackup: '2024-01-15 02:00:00'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SUCCESS': return 'text-green-600 bg-green-100'
      case 'INFO': return 'text-blue-600 bg-blue-100'
      case 'WARNING': return 'text-yellow-600 bg-yellow-100'
      case 'ERROR': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'SUCCESS': return CheckCircle
      case 'INFO': return Activity
      case 'WARNING': return AlertTriangle
      case 'ERROR': return AlertTriangle
      default: return Activity
    }
  }

  const filteredLogs = mockLogs.filter(log => 
    (logFilter === 'ALL' || log.level === logFilter) &&
    (log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.module.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Settings className="h-10 w-10" />
                ⚙️ Administration Générale
              </h1>
              <p className="text-gray-300 text-lg">
                Gestion système, configuration et surveillance
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 border border-white/20">
                <Download className="h-5 w-5" />
                Exporter Logs
              </button>
              <button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg">
                <Shield className="h-5 w-5" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">🟢 Système</p>
              <p className="text-2xl font-bold text-green-900">En ligne</p>
              <p className="text-green-700 text-xs mt-1">Uptime: {systemStats.uptime}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">👥 Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-blue-900">{systemStats.activeUsers}/{systemStats.totalUsers}</p>
              <p className="text-blue-700 text-xs mt-1">Sessions en cours</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">💾 Stockage</p>
              <p className="text-2xl font-bold text-yellow-900">{systemStats.diskUsage}%</p>
              <p className="text-yellow-700 text-xs mt-1">Espace utilisé</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-xl">
              <HardDrive className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">🔄 Dernière Sauvegarde</p>
              <p className="text-2xl font-bold text-purple-900">02:00</p>
              <p className="text-purple-700 text-xs mt-1">Aujourd'hui</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Database className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-2" />
          Vue d'ensemble
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'logs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Journaux
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'config' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-2" />
          Configuration
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Sécurité
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            activeTab === 'backup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Database className="h-4 w-4 inline mr-2" />
          Sauvegarde
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              Performance Système
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">CPU</span>
                  <span className="text-sm font-medium text-gray-900">{systemStats.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: `${systemStats.cpuUsage}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Mémoire</span>
                  <span className="text-sm font-medium text-gray-900">{systemStats.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: `${systemStats.memoryUsage}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Disque</span>
                  <span className="text-sm font-medium text-gray-900">{systemStats.diskUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{width: `${systemStats.diskUsage}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Activité Récente
            </h3>
            <div className="space-y-3">
              {mockLogs.slice(0, 4).map((log) => {
                const IconComponent = getLevelIcon(log.level)
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className="h-4 w-4 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{log.message}</p>
                      <p className="text-xs text-gray-500">{log.module} • {log.timestamp}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Journaux Système</h3>
              <div className="flex gap-3">
                <select 
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">Tous les niveaux</option>
                  <option value="SUCCESS">Succès</option>
                  <option value="INFO">Information</option>
                  <option value="WARNING">Avertissement</option>
                  <option value="ERROR">Erreur</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => {
                  const IconComponent = getLevelIcon(log.level)
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {log.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.module}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.user || '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Configuration Système</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 inline mr-2" />
                Nouveau Paramètre
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {mockConfigs.map((config) => (
                <div key={config.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {config.category}
                      </span>
                      <h4 className="font-medium text-gray-900">{config.key}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                    <div className="mt-2">
                      <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                        {config.value}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">({config.type})</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
