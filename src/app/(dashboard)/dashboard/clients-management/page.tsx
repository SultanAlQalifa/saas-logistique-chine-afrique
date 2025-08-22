'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
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
  DollarSign,
  Star,
  Activity
} from 'lucide-react'
import { Client } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'

export default function ClientsManagementPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [countryFilter, setCountryFilter] = useState<string>('ALL')
  const [activityFilter, setActivityFilter] = useState<'HIGH' | 'MEDIUM' | 'LOW' | 'ALL'>('ALL')

  // Mock data pour les clients avec statistiques détaillées
  const mockClients: (Client & {
    stats: {
      totalPackages: number
      totalSpent: number
      averageOrderValue: number
      lastOrderDate: Date
      satisfaction: number
      activity: 'HIGH' | 'MEDIUM' | 'LOW'
      preferredTransport: string
    }
  })[] = [
    {
      id: '1',
      clientId: 'CL-001',
      companyId: '1',
      name: 'Aïcha Ouattara',
      email: 'aicha.ouattara@gmail.com',
      phone: '+225 07 12 34 56',
      address: '123 Rue des Jardins, Cocody',
      country: 'Côte d\'Ivoire',
      city: 'Abidjan',
      createdAt: new Date('2024-01-15'),
      stats: {
        totalPackages: 45,
        totalSpent: 2850.75,
        averageOrderValue: 63.35,
        lastOrderDate: new Date('2024-08-10'),
        satisfaction: 4.8,
        activity: 'HIGH',
        preferredTransport: 'Aérien Express'
      }
    },
    {
      id: '2',
      clientId: 'CL-002',
      companyId: '1',
      name: 'Mamadou Diallo',
      email: 'mamadou.diallo@yahoo.fr',
      phone: '+223 76 54 32 10',
      address: '456 Avenue de la Liberté',
      country: 'Mali',
      city: 'Bamako',
      createdAt: new Date('2024-02-20'),
      stats: {
        totalPackages: 32,
        totalSpent: 1950.50,
        averageOrderValue: 60.95,
        lastOrderDate: new Date('2024-08-08'),
        satisfaction: 4.5,
        activity: 'HIGH',
        preferredTransport: 'Maritime'
      }
    },
    {
      id: '3',
      clientId: 'CL-003',
      companyId: '2',
      name: 'Fatoumata Sanogo',
      email: 'fatoumata.sanogo@hotmail.com',
      phone: '+226 70 11 22 33',
      address: '789 Boulevard du Progrès',
      country: 'Burkina Faso',
      city: 'Ouagadougou',
      createdAt: new Date('2024-03-10'),
      stats: {
        totalPackages: 18,
        totalSpent: 1125.25,
        averageOrderValue: 62.51,
        lastOrderDate: new Date('2024-07-25'),
        satisfaction: 4.2,
        activity: 'MEDIUM',
        preferredTransport: 'Aérien'
      }
    },
    {
      id: '4',
      clientId: 'CL-004',
      companyId: '1',
      name: 'Ibrahim Koné',
      email: 'ibrahim.kone@gmail.com',
      phone: '+221 77 88 99 00',
      address: '321 Rue de la Paix',
      country: 'Sénégal',
      city: 'Dakar',
      createdAt: new Date('2024-04-05'),
      stats: {
        totalPackages: 8,
        totalSpent: 485.00,
        averageOrderValue: 60.63,
        lastOrderDate: new Date('2024-06-15'),
        satisfaction: 3.9,
        activity: 'LOW',
        preferredTransport: 'Maritime Express'
      }
    },
    {
      id: '5',
      clientId: 'CL-005',
      companyId: '3',
      name: 'Mariam Traoré',
      email: 'mariam.traore@outlook.com',
      phone: '+227 96 12 34 56',
      address: '654 Avenue de l\'Indépendance',
      country: 'Niger',
      city: 'Niamey',
      createdAt: new Date('2024-05-12'),
      stats: {
        totalPackages: 25,
        totalSpent: 1680.90,
        averageOrderValue: 67.24,
        lastOrderDate: new Date('2024-08-09'),
        satisfaction: 4.6,
        activity: 'HIGH',
        preferredTransport: 'Aérien Express'
      }
    }
  ]

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setClients(mockClients)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCountry = countryFilter === 'ALL' || client.country === countryFilter
    const matchesActivity = activityFilter === 'ALL' || client.stats?.activity === activityFilter

    return matchesSearch && matchesCountry && matchesActivity
  })

  const activityColors = {
    HIGH: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-red-100 text-red-800',
  }

  const activityLabels = {
    HIGH: 'Très actif',
    MEDIUM: 'Modéré',
    LOW: 'Peu actif',
  }

  // Données pour les graphiques
  const clientsByCountry = clients.reduce((acc, client) => {
    const country = client.country || 'Non spécifié'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieData = Object.entries(clientsByCountry).map(([country, count]) => ({
    name: country,
    value: count,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Object.keys(clientsByCountry).indexOf(country) % 5]
  }))

  const monthlyData = [
    { month: 'Jan', nouveaux: 12, actifs: 45 },
    { month: 'Fév', nouveaux: 8, actifs: 52 },
    { month: 'Mar', nouveaux: 15, actifs: 48 },
    { month: 'Avr', nouveaux: 10, actifs: 61 },
    { month: 'Mai', nouveaux: 18, actifs: 55 },
    { month: 'Jun', nouveaux: 14, actifs: 67 },
    { month: 'Jul', nouveaux: 22, actifs: 73 },
    { month: 'Aoû', nouveaux: 16, actifs: 69 }
  ]

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
            <Users className="h-7 w-7 text-blue-600" />
            Gestion des Clients
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos clients et analysez leur comportement
          </p>
        </div>
        <Link
          href="/dashboard/clients/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouveau Client</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Très Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => c.stats?.activity === 'HIGH').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">CA Total</p>
              <p className="text-2xl font-bold text-purple-600">
                {clients.reduce((sum, client) => sum + (client.stats?.totalSpent || 0), 0).toLocaleString()} €
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfaction Moy.</p>
              <p className="text-2xl font-bold text-orange-600">
                {(clients.reduce((sum, client) => sum + (client.stats?.satisfaction || 0), 0) / clients.length).toFixed(1)}/5
              </p>
            </div>
            <Star className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des clients */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Clients</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="nouveaux" stroke="#3B82F6" name="Nouveaux clients" />
                <Line type="monotone" dataKey="actifs" stroke="#10B981" name="Clients actifs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par pays */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Pays</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
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
                placeholder="Rechercher par nom, email, ID client, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Tous les pays</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Mali">Mali</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Niger">Niger</option>
            </select>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Toute activité</option>
              <option value="HIGH">Très actif</option>
              <option value="MEDIUM">Modéré</option>
              <option value="LOW">Peu actif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistiques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">ID: {client.clientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {client.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {client.city}
                    </div>
                    <div className="text-sm text-gray-500">{client.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${activityColors[client.stats?.activity || 'LOW']}`}>
                      {activityLabels[client.stats?.activity || 'LOW']}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      {client.stats?.totalPackages || 0} colis
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      {client.stats?.totalSpent?.toLocaleString() || 0} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-900">
                        {client.stats?.satisfaction || 0}/5
                      </span>
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun client trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
