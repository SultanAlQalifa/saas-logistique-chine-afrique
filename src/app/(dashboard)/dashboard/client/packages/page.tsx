'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Clock, 
  Truck,
  Ship,
  Plane,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Weight,
  DollarSign,
  ExternalLink
} from 'lucide-react'

interface ClientPackage {
  id: string
  packageId: string
  description: string
  status: 'PLANNED' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED' | 'DELAYED'
  weight: number
  transportMode: 'MARITIME' | 'AERIAL' | 'MARITIME_EXPRESS'
  trackingPin: string
  createdAt: Date
  estimatedDelivery?: Date
  currentLocation: string
  destination: string
  price: number
  progress: number
}

export default function ClientPackagesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [packages, setPackages] = useState<ClientPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data pour les colis du client
    const mockPackages: ClientPackage[] = [
      {
        id: '1',
        packageId: 'CO-001234',
        description: 'Électroniques - Smartphones et accessoires',
        status: 'IN_TRANSIT',
        weight: 5.2,
        transportMode: 'AERIAL',
        trackingPin: 'A3X9K2',
        createdAt: new Date('2024-01-15'),
        estimatedDelivery: new Date('2024-01-22'),
        currentLocation: 'Aéroport de Casablanca',
        destination: 'Guangzhou, Chine',
        price: 125000,
        progress: 65
      },
      {
        id: '2',
        packageId: 'CO-001235',
        description: 'Textiles - Vêtements traditionnels',
        status: 'ARRIVED',
        weight: 15.8,
        transportMode: 'MARITIME',
        trackingPin: 'B7Y4M1',
        createdAt: new Date('2023-12-10'),
        estimatedDelivery: new Date('2024-01-15'),
        currentLocation: 'Port de Shanghai',
        destination: 'Shanghai, Chine',
        price: 85000,
        progress: 100
      },
      {
        id: '3',
        packageId: 'CO-001236',
        description: 'Produits cosmétiques et soins',
        status: 'PLANNED',
        weight: 8.5,
        transportMode: 'MARITIME_EXPRESS',
        trackingPin: 'C5Z8N6',
        createdAt: new Date('2024-01-20'),
        estimatedDelivery: new Date('2024-02-05'),
        currentLocation: 'Entrepôt Dakar',
        destination: 'Beijing, Chine',
        price: 95000,
        progress: 15
      },
      {
        id: '4',
        packageId: 'CO-001237',
        description: 'Artisanat local - Sculptures et bijoux',
        status: 'DELIVERED',
        weight: 3.2,
        transportMode: 'AERIAL',
        trackingPin: 'D1M5P8',
        createdAt: new Date('2023-12-01'),
        estimatedDelivery: new Date('2023-12-08'),
        currentLocation: 'Livré',
        destination: 'Shenzhen, Chine',
        price: 75000,
        progress: 100
      }
    ]
    
    setPackages(mockPackages)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ARRIVED': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'DELAYED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANNED': return <Clock className="h-4 w-4" />
      case 'IN_TRANSIT': return <Truck className="h-4 w-4" />
      case 'ARRIVED': return <MapPin className="h-4 w-4" />
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />
      case 'DELAYED': return <AlertCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'Planifié'
      case 'IN_TRANSIT': return 'En transit'
      case 'ARRIVED': return 'Arrivé'
      case 'DELIVERED': return 'Livré'
      case 'DELAYED': return 'Retardé'
      default: return status
    }
  }

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'AERIAL': return <Plane className="h-4 w-4 text-blue-600" />
      case 'MARITIME': return <Ship className="h-4 w-4 text-blue-600" />
      case 'MARITIME_EXPRESS': return <Ship className="h-4 w-4 text-purple-600" />
      default: return <Truck className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransportLabel = (mode: string) => {
    switch (mode) {
      case 'AERIAL': return 'Aérien'
      case 'MARITIME': return 'Maritime'
      case 'MARITIME_EXPRESS': return 'Maritime Express'
      default: return mode
    }
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesFilter = filter === 'ALL' || pkg.status === filter
    const matchesSearch = pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.trackingPin.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: packages.length,
    inTransit: packages.filter(p => p.status === 'IN_TRANSIT').length,
    arrived: packages.filter(p => p.status === 'ARRIVED').length,
    delivered: packages.filter(p => p.status === 'DELIVERED').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">📦 Mes Colis</h1>
            <p className="text-green-100 text-lg">Suivez vos expéditions en temps réel</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            <Package className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Colis</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">En Transit</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.inTransit}</p>
            </div>
            <Truck className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Arrivés</p>
              <p className="text-2xl font-bold text-purple-900">{stats.arrived}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Livrés</p>
              <p className="text-2xl font-bold text-green-900">{stats.delivered}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PLANNED">Planifiés</option>
                <option value="IN_TRANSIT">En transit</option>
                <option value="ARRIVED">Arrivés</option>
                <option value="DELIVERED">Livrés</option>
                <option value="DELAYED">Retardés</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par description, ID ou PIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Liste des Colis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPackages.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun colis trouvé</h3>
            <p className="text-gray-500">
              {packages.length === 0 
                ? "Vous n'avez pas encore de colis en cours d'expédition."
                : "Aucun colis ne correspond à vos critères de recherche."
              }
            </p>
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              {/* Header du colis */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.packageId}</h3>
                  <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(pkg.status)}`}>
                  {getStatusIcon(pkg.status)}
                  {getStatusLabel(pkg.status)}
                </span>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression</span>
                  <span className="text-sm text-gray-500">{pkg.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${pkg.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {getTransportIcon(pkg.transportMode)}
                  <span className="text-sm text-gray-600">{getTransportLabel(pkg.transportMode)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{pkg.weight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 truncate">{pkg.currentLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{pkg.price.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Destination et dates */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Destination:</span>
                  <span className="text-sm text-gray-600">{pkg.destination}</span>
                </div>
                {pkg.estimatedDelivery && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Livraison estimée:</span>
                    <span className="text-sm text-gray-600">{pkg.estimatedDelivery.toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="bg-blue-50 px-3 py-1 rounded-lg">
                  <span className="text-xs font-mono text-blue-700">PIN: {pkg.trackingPin}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/track/${pkg.trackingPin}`)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Suivre le colis"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => alert(`Détails du colis ${pkg.packageId}`)}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
