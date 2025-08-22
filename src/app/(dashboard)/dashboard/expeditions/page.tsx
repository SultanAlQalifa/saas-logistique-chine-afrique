'use client'

import { useState } from 'react'
import { 
  Plane, 
  Ship, 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

interface Expedition {
  id: string
  expeditionId: string
  type: 'aerial' | 'maritime' | 'express'
  origin: string
  destination: string
  status: 'planned' | 'in_transit' | 'arrived' | 'delivered' | 'delayed'
  departureDate: string
  arrivalDate: string
  packages: number
  totalWeight: number
  totalVolume: number
  carrier: string
  trackingNumber: string
}

// Mock data
const mockExpeditions: Expedition[] = [
  {
    id: '1',
    expeditionId: 'EXP-2024-001',
    type: 'aerial',
    origin: 'Guangzhou, Chine',
    destination: 'Abidjan, Côte d\'Ivoire',
    status: 'in_transit',
    departureDate: '2024-01-15',
    arrivalDate: '2024-01-18',
    packages: 45,
    totalWeight: 1250,
    totalVolume: 8.5,
    carrier: 'Air France Cargo',
    trackingNumber: 'AF-CG-2024-001'
  },
  {
    id: '2',
    expeditionId: 'EXP-2024-002',
    type: 'maritime',
    origin: 'Shanghai, Chine',
    destination: 'Dakar, Sénégal',
    status: 'planned',
    departureDate: '2024-01-20',
    arrivalDate: '2024-02-15',
    packages: 156,
    totalWeight: 12500,
    totalVolume: 85.2,
    carrier: 'CMA CGM',
    trackingNumber: 'CMACGM-SH-2024-002'
  },
  {
    id: '3',
    expeditionId: 'EXP-2024-003',
    type: 'express',
    origin: 'Shenzhen, Chine',
    destination: 'Bamako, Mali',
    status: 'delivered',
    departureDate: '2024-01-10',
    arrivalDate: '2024-01-14',
    packages: 23,
    totalWeight: 580,
    totalVolume: 4.2,
    carrier: 'DHL Express',
    trackingNumber: 'DHL-SZ-2024-003'
  },
  {
    id: '4',
    expeditionId: 'EXP-2024-004',
    type: 'aerial',
    origin: 'Beijing, Chine',
    destination: 'Ouagadougou, Burkina Faso',
    status: 'delayed',
    departureDate: '2024-01-16',
    arrivalDate: '2024-01-20',
    packages: 67,
    totalWeight: 1890,
    totalVolume: 12.8,
    carrier: 'Turkish Cargo',
    trackingNumber: 'TK-BJ-2024-004'
  }
]

export default function ExpeditionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Filtrage des expéditions
  const filteredExpeditions = mockExpeditions.filter(expedition => {
    const matchesSearch = expedition.expeditionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expedition.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expedition.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expedition.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || expedition.status === statusFilter
    const matchesType = typeFilter === 'all' || expedition.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Statistiques
  const stats = {
    total: mockExpeditions.length,
    planned: mockExpeditions.filter(e => e.status === 'planned').length,
    inTransit: mockExpeditions.filter(e => e.status === 'in_transit').length,
    delivered: mockExpeditions.filter(e => e.status === 'delivered').length,
    delayed: mockExpeditions.filter(e => e.status === 'delayed').length,
    totalPackages: mockExpeditions.reduce((sum, e) => sum + e.packages, 0),
    totalWeight: mockExpeditions.reduce((sum, e) => sum + e.totalWeight, 0)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'planned':
        return { color: 'bg-blue-100 text-blue-800', icon: Calendar, label: 'Planifiée' }
      case 'in_transit':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Truck, label: 'En Transit' }
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Livrée' }
      case 'delayed':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Retardée' }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Inconnue' }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'aerial':
        return <Plane className="h-4 w-4" />
      case 'maritime':
        return <Ship className="h-4 w-4" />
      case 'express':
        return <Truck className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'aerial':
        return 'Aérien'
      case 'maritime':
        return 'Maritime'
      case 'express':
        return 'Express'
      default:
        return 'Standard'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">✈️ Expéditions</h1>
            <p className="text-blue-100 text-lg">Gérez et suivez toutes vos expéditions internationales</p>
          </div>
          <Link
            href="/dashboard/expeditions/create"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nouvelle Expédition
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Total Expéditions</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-xs text-blue-600">{stats.totalPackages} colis</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-yellow-600 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-700">En Transit</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.inTransit}</p>
              <p className="text-xs text-yellow-600">En cours</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-600 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">Livrées</p>
              <p className="text-2xl font-bold text-green-900">{stats.delivered}</p>
              <p className="text-xs text-green-600">Terminées</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-purple-600 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-700">Poids Total</p>
              <p className="text-2xl font-bold text-purple-900">{stats.totalWeight.toLocaleString('fr-FR')} kg</p>
              <p className="text-xs text-purple-600">Toutes expéditions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par ID, origine, destination, transporteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="planned">Planifiées</option>
              <option value="in_transit">En Transit</option>
              <option value="delivered">Livrées</option>
              <option value="delayed">Retardées</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="aerial">Aérien</option>
              <option value="maritime">Maritime</option>
              <option value="express">Express</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des expéditions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Expéditions ({filteredExpeditions.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expédition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpeditions.map((expedition) => {
                const statusConfig = getStatusConfig(expedition.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <tr key={expedition.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {expedition.expeditionId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {expedition.carrier}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div>{expedition.origin}</div>
                          <div className="text-gray-500">→ {expedition.destination}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {getTypeIcon(expedition.type)}
                        <span className="ml-2">{getTypeLabel(expedition.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <div>
                          <div>Départ: {new Date(expedition.departureDate).toLocaleDateString('fr-FR')}</div>
                          <div className="text-gray-500">Arrivée: {new Date(expedition.arrivalDate).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{expedition.packages} colis</div>
                        <div className="text-gray-500">{expedition.totalWeight} kg</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
