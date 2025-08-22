'use client'

import { useState, useEffect } from 'react'
import { Package, PackageStatus, TransportMode } from '@/types'
import { 
  Package as PackageIcon, 
  Clock, 
  MapPin, 
  Truck,
  Plane,
  Ship,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ClientPortal() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for client's packages
  const mockPackages: Package[] = [
    {
      id: '1',
      packageId: 'CO-001234',
      description: 'Électroniques - Smartphones',
      weight: 2.5,
      status: PackageStatus.IN_TRANSIT,
      companyId: 'test-company',
      clientId: 'client-1',
      transportMode: TransportMode.AERIAL,
      trackingPin: 'A3X9K2',
      finalPrice: 220.00,
      paymentStatus: 'PARTIAL' as const,
      actualArrival: new Date('2024-08-10'),
      client: {
        id: 'client-1',
        clientId: 'CL-001',
        companyId: 'test-company',
        name: 'Mon Entreprise',
        createdAt: new Date()
      }
    },
    {
      id: '2',
      packageId: 'CO-001235',
      description: 'Textiles - Vêtements',
      weight: 15.0,
      length: 60,
      width: 40,
      height: 30,
      cbm: 0.072,
      status: PackageStatus.ARRIVED,
      companyId: 'test-company',
      clientId: 'client-1',
      transportMode: TransportMode.MARITIME,
      trackingPin: 'B7Y4M1',
      finalPrice: 180.00,
      paymentStatus: 'COMPLETED' as const,
      actualArrival: new Date('2024-08-10'),
      client: {
        id: 'client-1',
        clientId: 'CL-001',
        companyId: 'test-company',
        name: 'Mon Entreprise',
        createdAt: new Date()
      }
    },
    {
      id: '3',
      packageId: 'CO-001236',
      description: 'Machines - Équipements',
      weight: 50.0,
      status: PackageStatus.COLLECTED,
      companyId: 'test-company',
      clientId: 'client-1',
      transportMode: TransportMode.MARITIME_EXPRESS,
      trackingPin: 'C5Z8N6',
      finalPrice: 89.75,
      paymentStatus: 'COMPLETED' as const,
      collectedAt: new Date('2024-08-05'),
      client: {
        id: 'client-1',
        clientId: 'CL-001',
        companyId: 'test-company',
        name: 'Mon Entreprise',
        createdAt: new Date()
      }
    }
  ]

  const packageHistory = [
    { month: 'Jan', colis: 3 },
    { month: 'Fév', colis: 5 },
    { month: 'Mar', colis: 2 },
    { month: 'Avr', colis: 7 },
    { month: 'Mai', colis: 4 },
    { month: 'Jun', colis: 6 }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPackages(mockPackages)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: PackageStatus) => {
    const statusConfig = {
      [PackageStatus.PLANNED]: { label: 'Prévu', color: 'bg-gray-100 text-gray-800', icon: Clock },
      [PackageStatus.IN_TRANSIT]: { label: 'En Route', color: 'bg-yellow-100 text-yellow-800', icon: Truck },
      [PackageStatus.ARRIVED]: { label: 'Arrivé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      [PackageStatus.COLLECTED]: { label: 'Retiré', color: 'bg-blue-100 text-blue-800', icon: PackageIcon },
    }

    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case TransportMode.AERIAL:
      case TransportMode.AERIAL_EXPRESS:
        return <Plane className="h-4 w-4 text-blue-600" />
      case TransportMode.MARITIME:
      case TransportMode.MARITIME_EXPRESS:
        return <Ship className="h-4 w-4 text-green-600" />
      default:
        return <Truck className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransportLabel = (mode: TransportMode) => {
    const labels = {
      [TransportMode.AERIAL]: 'Aérien',
      [TransportMode.AERIAL_EXPRESS]: 'Aérien Express',
      [TransportMode.MARITIME]: 'Maritime',
      [TransportMode.MARITIME_EXPRESS]: 'Maritime Express'
    }
    return labels[mode]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const inTransitPackages = packages.filter(pkg => pkg.status === PackageStatus.IN_TRANSIT)
  const arrivedPackages = packages.filter(pkg => pkg.status === PackageStatus.ARRIVED)
  const collectedPackages = packages.filter(pkg => pkg.status === PackageStatus.COLLECTED)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mes Colis</h1>
        <p className="text-gray-600">Suivez l'état de vos expéditions en temps réel</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Colis</p>
              <p className="text-3xl font-bold text-gray-900">{packages.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <PackageIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Route</p>
              <p className="text-3xl font-bold text-yellow-600">{inTransitPackages.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Truck className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Arrivés</p>
              <p className="text-3xl font-bold text-green-600">{arrivedPackages.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retirés</p>
              <p className="text-3xl font-bold text-blue-600">{collectedPackages.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <PackageIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Package History Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historique de mes Expéditions
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={packageHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="colis" stroke="#10b981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active Packages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Colis Actifs
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {packages.filter(pkg => pkg.status !== PackageStatus.COLLECTED).map((pkg) => (
            <div key={pkg.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{pkg.packageId}</h4>
                    {getStatusBadge(pkg.status)}
                  </div>
                  <p className="text-gray-600 mb-2">{pkg.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {getTransportIcon(pkg.transportMode)}
                      <span>{getTransportLabel(pkg.transportMode)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <PackageIcon className="h-4 w-4" />
                      <span>{pkg.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>PIN: {pkg.trackingPin}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">€{pkg.finalPrice?.toFixed(2)}</p>
                  {pkg.estimatedArrival && pkg.status === PackageStatus.IN_TRANSIT && (
                    <p className="text-sm text-gray-500">
                      Arrivée prévue: {pkg.estimatedArrival.toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  {pkg.actualArrival && pkg.status === PackageStatus.ARRIVED && (
                    <p className="text-sm text-green-600">
                      Arrivé le: {pkg.actualArrival.toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
              
              {pkg.status === PackageStatus.ARRIVED && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Votre colis est arrivé et prêt à être retiré !
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {packages.filter(pkg => pkg.status !== PackageStatus.COLLECTED).length === 0 && (
          <div className="text-center py-12">
            <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun colis actif</h3>
            <p className="text-gray-500">
              Tous vos colis ont été retirés ou aucune expédition en cours
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {collectedPackages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Colis Récemment Retirés
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {collectedPackages.slice(0, 3).map((pkg) => (
              <div key={pkg.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{pkg.packageId}</h4>
                    <p className="text-gray-600">{pkg.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Retiré le: {pkg.collectedAt?.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(pkg.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
