'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Cargo } from '@/types'
import { CargoStatus, TransportMode } from '@prisma/client'
import { Ship, Plus, MapPin, Calendar, Package, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

interface CargoWithStats extends Cargo {
  packagesCount: number
  totalValue: number
  utilization: number
}

export default function MesCargosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cargos, setCargos] = useState<CargoWithStats[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for charts
  const statusData = [
    { name: 'En Transit', value: 2, color: '#f59e0b' },
    { name: 'Planifiés', value: 1, color: '#8b5cf6' },
    { name: 'Terminés', value: 2, color: '#10b981' },
  ]

  const monthlyData = [
    { month: 'Jan', cargos: 3, packages: 145 },
    { month: 'Fév', cargos: 2, packages: 98 },
    { month: 'Mar', cargos: 4, packages: 187 },
    { month: 'Avr', cargos: 3, packages: 156 },
    { month: 'Mai', cargos: 5, packages: 234 },
    { month: 'Jun', cargos: 4, packages: 198 },
  ]

  useEffect(() => {
    // Vérifier les permissions d'accès
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Seuls les utilisateurs d'entreprise (ADMIN) peuvent voir cette page
    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    // Mock cargos data - cargos de cette entreprise uniquement
    const mockCargosWithStats: CargoWithStats[] = [
      {
        id: '1',
        cargoId: 'CG-2024-001',
        companyId: session.user.companyId || '',
        transportMode: TransportMode.MARITIME,
        carrier: 'COSCO Shipping',
        originPort: 'Shanghai',
        destinationPort: 'Douala',
        departureDate: new Date('2024-01-15'),
        estimatedArrival: new Date('2024-03-15'),
        status: CargoStatus.IN_TRANSIT,
        packages: [],
        packagesCount: 45,
        totalValue: 18500,
        utilization: 78
      },
      {
        id: '2',
        cargoId: 'CG-2024-002',
        companyId: session.user.companyId || '',
        transportMode: TransportMode.AERIAL,
        carrier: 'Air France Cargo',
        originPort: 'Guangzhou',
        destinationPort: 'Abidjan',
        departureDate: new Date('2024-01-20'),
        estimatedArrival: new Date('2024-01-27'),
        status: CargoStatus.COMPLETED,
        packages: [],
        packagesCount: 28,
        totalValue: 12800,
        utilization: 95
      },
      {
        id: '3',
        cargoId: 'CG-2024-003',
        companyId: session.user.companyId || '',
        transportMode: TransportMode.MARITIME_EXPRESS,
        carrier: 'MSC',
        originPort: 'Shenzhen',
        destinationPort: 'Lagos',
        departureDate: new Date('2024-02-01'),
        estimatedArrival: new Date('2024-03-20'),
        status: CargoStatus.PLANNED,
        packages: [],
        packagesCount: 0,
        totalValue: 0,
        utilization: 0
      },
      {
        id: '4',
        cargoId: 'CG-2024-005',
        companyId: session.user.companyId || '',
        transportMode: TransportMode.MARITIME,
        carrier: 'CMA CGM',
        originPort: 'Ningbo',
        destinationPort: 'Douala',
        departureDate: new Date('2024-01-05'),
        estimatedArrival: new Date('2024-02-28'),
        status: CargoStatus.COMPLETED,
        packages: [],
        packagesCount: 62,
        totalValue: 24800,
        utilization: 88
      },
      {
        id: '5',
        cargoId: 'CG-2024-006',
        companyId: session.user.companyId || '',
        transportMode: TransportMode.AERIAL_EXPRESS,
        carrier: 'DHL Cargo',
        originPort: 'Beijing',
        destinationPort: 'Abidjan',
        departureDate: new Date('2024-02-15'),
        estimatedArrival: new Date('2024-02-18'),
        status: CargoStatus.IN_TRANSIT,
        packages: [],
        packagesCount: 15,
        totalValue: 8900,
        utilization: 65
      }
    ]

    setCargos(mockCargosWithStats)
    setLoading(false)
  }, [session, status, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getStatusBadge = (status: CargoStatus) => {
    const statusConfig: Record<CargoStatus, { label: string; color: string }> = {
      [CargoStatus.PLANNED]: { label: 'Planifié', color: 'bg-gray-100 text-gray-800' },
      [CargoStatus.IN_TRANSIT]: { label: 'En Transit', color: 'bg-yellow-100 text-yellow-800' },
      [CargoStatus.ARRIVED]: { label: 'Arrivé', color: 'bg-green-100 text-green-800' },
      [CargoStatus.COMPLETED]: { label: 'Terminé', color: 'bg-blue-100 text-blue-800' },
    }

    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const totalCargos = cargos.length
  const activeCargos = cargos.filter(c => c.status === 'IN_TRANSIT').length
  const totalPackages = cargos.reduce((sum, c) => sum + c.packagesCount, 0)
  const totalValue = cargos.reduce((sum, c) => sum + c.totalValue, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Cargos</h1>
          <p className="text-gray-600">Cargos de votre entreprise</p>
        </div>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouveau Cargo</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cargos</p>
              <p className="text-2xl font-bold text-gray-900">{totalCargos}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Ship className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Transit</p>
              <p className="text-2xl font-bold text-yellow-600">{activeCargos}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Colis</p>
              <p className="text-2xl font-bold text-purple-600">{totalPackages}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
              <p className="text-2xl font-bold text-green-600">{totalValue.toLocaleString('fr-FR')} €</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Statut</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Mensuelle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cargos" fill="#3B82F6" name="Cargos" />
                <Bar dataKey="packages" fill="#10B981" name="Colis" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cargos Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Cargos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transporteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itinéraire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrivée
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cargos.map((cargo) => (
                <tr key={cargo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cargo.cargoId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cargo.carrier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cargo.originPort} → {cargo.destinationPort}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cargo.transportMode === TransportMode.MARITIME && 'Maritime'}
                      {cargo.transportMode === TransportMode.MARITIME_EXPRESS && 'Maritime Express'}
                      {cargo.transportMode === TransportMode.AERIAL && 'Aérien'}
                      {cargo.transportMode === TransportMode.AERIAL_EXPRESS && 'Aérien Express'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cargo.packagesCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cargo.totalValue.toLocaleString('fr-FR')} €</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${cargo.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{cargo.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(cargo.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cargo.estimatedArrival?.toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
