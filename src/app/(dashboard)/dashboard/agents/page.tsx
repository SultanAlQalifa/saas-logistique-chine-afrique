'use client'

import { useState, useEffect } from 'react'
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  Calendar,
  Building2,
  Mail,
  Phone,
  MapPin,
  Award,
  Activity
} from 'lucide-react'
import { User, UserRole } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

export default function AgentsPage() {
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | 'ALL'>('ALL')
  const [performanceFilter, setPerformanceFilter] = useState<'HIGH' | 'MEDIUM' | 'LOW' | 'ALL'>('ALL')

  // Mock data pour les agents avec statistiques de performance
  const mockAgents = [
    {
      id: '1',
      email: 'jean.traore@logitrans.com',
      name: 'Jean Baptiste Traoré',
      role: UserRole.AGENT,
      companyId: '1',
      isActive: true,
      company: {
        id: '1',
        name: 'LogiTrans SARL',
        email: 'contact@logitrans.com',
        planType: 'PROFESSIONAL' as any,
        subscriptionStatus: 'ACTIVE' as any,
        maxUsers: 50,
        maxPackagesPerMonth: 1000
      },
      performance: {
        packagesProcessed: 245,
        averageProcessingTime: '2.5h',
        customerSatisfaction: 4.8,
        efficiency: 95,
        lastActivity: new Date('2024-08-11T10:30:00'),
        monthlyTarget: 200,
        completedTasks: 189
      }
    },
    {
      id: '2',
      email: 'fatou.diallo@logitrans.com',
      name: 'Fatou Diallo',
      role: UserRole.AGENT,
      companyId: '1',
      isActive: true,
      company: {
        id: '1',
        name: 'LogiTrans SARL',
        email: 'contact@logitrans.com',
        planType: 'PROFESSIONAL' as any,
        subscriptionStatus: 'ACTIVE' as any,
        maxUsers: 50,
        maxPackagesPerMonth: 1000
      },
      performance: {
        packagesProcessed: 198,
        averageProcessingTime: '3.2h',
        customerSatisfaction: 4.6,
        efficiency: 87,
        lastActivity: new Date('2024-08-11T11:45:00'),
        monthlyTarget: 180,
        completedTasks: 156
      }
    },
    {
      id: '3',
      email: 'moussa.kone@expresscargo.ml',
      name: 'Moussa Koné',
      role: UserRole.AGENT,
      companyId: '2',
      isActive: true,
      company: {
        id: '2',
        name: 'Express Cargo Mali',
        email: 'info@expresscargo.ml',
        planType: 'STARTER' as any,
        subscriptionStatus: 'ACTIVE' as any,
        maxUsers: 10,
        maxPackagesPerMonth: 200
      },
      performance: {
        packagesProcessed: 156,
        averageProcessingTime: '4.1h',
        customerSatisfaction: 4.3,
        efficiency: 78,
        lastActivity: new Date('2024-08-11T09:15:00'),
        monthlyTarget: 150,
        completedTasks: 134
      }
    },
    {
      id: '4',
      email: 'aminata.ba@fretbf.com',
      name: 'Aminata Ba',
      role: UserRole.AGENT,
      companyId: '3',
      isActive: false,
      company: {
        id: '3',
        name: 'Fret International BF',
        email: 'contact@fretbf.com',
        planType: 'ENTERPRISE' as any,
        subscriptionStatus: 'TRIAL' as any,
        maxUsers: 100,
        maxPackagesPerMonth: 5000
      },
      performance: {
        packagesProcessed: 89,
        averageProcessingTime: '5.2h',
        customerSatisfaction: 4.1,
        efficiency: 65,
        lastActivity: new Date('2024-08-10T16:30:00'),
        monthlyTarget: 120,
        completedTasks: 78
      }
    }
  ]

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setAgents(mockAgents)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = 
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.company.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && agent.isActive) ||
      (statusFilter === 'INACTIVE' && !agent.isActive)

    let matchesPerformance = true
    if (performanceFilter !== 'ALL' && agent.performance) {
      const efficiency = agent.performance.efficiency
      matchesPerformance = 
        (performanceFilter === 'HIGH' && efficiency >= 90) ||
        (performanceFilter === 'MEDIUM' && efficiency >= 70 && efficiency < 90) ||
        (performanceFilter === 'LOW' && efficiency < 70)
    }

    return matchesSearch && matchesStatus && matchesPerformance
  })

  const getPerformanceLevel = (efficiency: number) => {
    if (efficiency >= 90) return { level: 'HIGH', label: 'Excellent', color: 'bg-green-100 text-green-800' }
    if (efficiency >= 70) return { level: 'MEDIUM', label: 'Bon', color: 'bg-yellow-100 text-yellow-800' }
    return { level: 'LOW', label: 'À améliorer', color: 'bg-red-100 text-red-800' }
  }

  const performanceData = agents.map(agent => ({
    name: agent.name?.split(' ')[0] || agent.email.split('@')[0],
    packages: agent.performance?.packagesProcessed || 0,
    efficiency: agent.performance?.efficiency || 0,
    satisfaction: agent.performance?.customerSatisfaction || 0
  }))

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-7 w-7 text-blue-600" />
            Gestion des Agents
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les agents et suivez leurs performances
          </p>
        </div>
        <Link
          href="/dashboard/agents/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouvel Agent</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {agents.filter(a => a.isActive).length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Colis Traités</p>
              <p className="text-2xl font-bold text-purple-600">
                {agents.reduce((sum, agent) => sum + (agent.performance?.packagesProcessed || 0), 0)}
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Efficacité Moy.</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(agents.reduce((sum, agent) => sum + (agent.performance?.efficiency || 0), 0) / agents.length)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Graphique de performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Agents</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="packages" fill="#3B82F6" name="Colis traités" />
              <Bar dataKey="efficiency" fill="#10B981" name="Efficacité %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ACTIVE' | 'INACTIVE' | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
            </select>
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Toutes performances</option>
              <option value="HIGH">Excellent (90%+)</option>
              <option value="MEDIUM">Bon (70-89%)</option>
              <option value="LOW">À améliorer (&lt;70%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des agents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colis Traités
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => {
                const performance = getPerformanceLevel(agent.performance?.efficiency || 0)
                return (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {agent.name?.charAt(0) || agent.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agent.name || 'Sans nom'}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {agent.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {agent.company.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {agent.performance?.efficiency || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${agent.performance?.efficiency || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${performance.color}`}>
                          {performance.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {agent.performance?.packagesProcessed || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        Objectif: {agent.performance?.monthlyTarget || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-900">
                          {agent.performance?.customerSatisfaction || 0}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        agent.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun agent trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
