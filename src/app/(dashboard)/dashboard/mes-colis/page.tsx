'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Package, PackageStatus } from '@/types'
import { TransportMode } from '@prisma/client'
import { Search, Edit, Plus, TrendingUp, Package as PackageIcon, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import ExportButtons, { ChartExportButton } from '@/components/export/ExportButtons'

interface ModalData {
  type: 'edit' | 'success'
  title: string
  packageData?: Package
}

export default function MesColisPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)
  const [editForm, setEditForm] = useState({
    description: '',
    weight: 0,
    status: PackageStatus.PLANNED as PackageStatus,
    finalPrice: 0
  })

  // Mock data pour l'évolution des colis de l'entreprise
  const packagesEvolutionData = [
    { month: 'Jan', colis: 12 },
    { month: 'Fév', colis: 18 },
    { month: 'Mar', colis: 15 },
    { month: 'Avr', colis: 22 },
    { month: 'Mai', colis: 19 },
    { month: 'Jun', colis: 25 },
  ]

  // Mock data pour les statuts des colis
  const statusData = [
    { status: 'Prévu', count: 1, color: '#6B7280' },
    { status: 'En Route', count: 1, color: '#F59E0B' },
    { status: 'Arrivé', count: 1, color: '#10B981' },
    { status: 'Retiré', count: 1, color: '#3B82F6' },
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

    // Mock packages data - colis de cette entreprise uniquement
    const mockCompanyPackages: Package[] = [
      {
        id: '1',
        packageId: 'CO-001234',
        description: 'Électroniques - Smartphones',
        weight: 2.5,
        status: PackageStatus.IN_TRANSIT,
        companyId: session.user.companyId || 'logitrans',
        clientId: 'client-1',
        transportMode: TransportMode.AERIAL,
        trackingPin: 'A3X9K2',
        finalPrice: 125.50,
        paymentStatus: 'PENDING' as const,
        client: {
          id: 'client-1',
          clientId: 'CL-001',
          companyId: session.user.companyId || 'logitrans',
          name: 'Client A - Électroniques',
          createdAt: new Date()
        }
      },
      {
        id: '2',
        packageId: 'CO-001237',
        description: 'Cosmétiques - Produits de beauté',
        weight: 8.5,
        status: PackageStatus.COLLECTED,
        companyId: session.user.companyId || 'logitrans',
        clientId: 'client-1',
        transportMode: TransportMode.AERIAL_EXPRESS,
        trackingPin: 'D9K2L7',
        finalPrice: 85.00,
        paymentStatus: 'COMPLETED' as const,
        client: {
          id: 'client-1',
          clientId: 'CL-001',
          companyId: session.user.companyId || 'logitrans',
          name: 'Client A - Électroniques',
          createdAt: new Date()
        }
      },
      {
        id: '3',
        packageId: 'CO-001239',
        description: 'Vêtements - Mode féminine',
        weight: 12.0,
        length: 50,
        width: 35,
        height: 25,
        cbm: 0.044,
        status: PackageStatus.ARRIVED,
        companyId: session.user.companyId || 'logitrans',
        clientId: 'client-2',
        transportMode: TransportMode.MARITIME,
        trackingPin: 'F3H8K1',
        finalPrice: 220.00,
        paymentStatus: 'PARTIAL' as const,
        client: {
          id: 'client-2',
          clientId: 'CL-002',
          companyId: session.user.companyId || 'logitrans',
          name: 'Client B - Mode',
          createdAt: new Date()
        }
      },
      {
        id: '4',
        packageId: 'CO-001240',
        description: 'Accessoires - Bijoux fantaisie',
        weight: 1.2,
        status: PackageStatus.PLANNED,
        companyId: session.user.companyId || 'logitrans',
        clientId: 'client-3',
        transportMode: TransportMode.AERIAL_EXPRESS,
        trackingPin: 'G5M9P3',
        finalPrice: 45.25,
        paymentStatus: 'PENDING' as const,
        client: {
          id: 'client-3',
          clientId: 'CL-003',
          companyId: session.user.companyId || 'logitrans',
          name: 'Client C - Accessoires',
          createdAt: new Date()
        }
      }
    ]

    setPackages(mockCompanyPackages)
    setFilteredPackages(mockCompanyPackages)
    setLoading(false)
  }, [session, status, router])

  // Filter packages based on search term and status
  useEffect(() => {
    let filtered = packages

    if (searchTerm) {
      filtered = filtered.filter(pkg => 
        pkg.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.trackingPin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.client.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(pkg => pkg.status === statusFilter)
    }

    setFilteredPackages(filtered)
  }, [packages, searchTerm, statusFilter])

  const getStatusBadge = (status: PackageStatus) => {
    const statusConfig = {
      [PackageStatus.PLANNED]: { label: 'Prévu', color: 'bg-gray-100 text-gray-800' },
      [PackageStatus.IN_TRANSIT]: { label: 'En Route', color: 'bg-yellow-100 text-yellow-800' },
      [PackageStatus.ARRIVED]: { label: 'Arrivé', color: 'bg-green-100 text-green-800' },
      [PackageStatus.COLLECTED]: { label: 'Retiré', color: 'bg-blue-100 text-blue-800' },
    }

    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PackageIcon className="h-7 w-7 text-blue-600" />
            Mes Colis
          </h1>
          <p className="text-gray-600">Gérez les colis de votre entreprise</p>
        </div>
        <Link
          href="/dashboard/packages/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouveau Colis</span>
          <span className="sm:hidden">Nouveau</span>
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Colis</p>
              <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
            </div>
            <PackageIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Transit</p>
              <p className="text-2xl font-bold text-yellow-600">
                {packages.filter(p => p.status === PackageStatus.IN_TRANSIT).length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Arrivés</p>
              <p className="text-2xl font-bold text-green-600">
                {packages.filter(p => p.status === PackageStatus.ARRIVED).length}
              </p>
            </div>
            <PackageIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retirés</p>
              <p className="text-2xl font-bold text-blue-600">
                {packages.filter(p => p.status === PackageStatus.COLLECTED).length}
              </p>
            </div>
            <PackageIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des colis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution Mensuelle
            </h3>
          </div>
          <div id="packages-evolution-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={packagesEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="colis" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PackageIcon className="h-5 w-5" />
              Répartition par Statut
            </h3>
          </div>
          <div id="packages-status-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher par ID, PIN, description ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tous les statuts</option>
              <option value={PackageStatus.PLANNED}>Prévu</option>
              <option value={PackageStatus.IN_TRANSIT}>En Route</option>
              <option value={PackageStatus.ARRIVED}>Arrivé</option>
              <option value={PackageStatus.COLLECTED}>Retiré</option>
            </select>
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste de Mes Colis ({filteredPackages.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Colis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PIN Suivi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Poids
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
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
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pkg.packageId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {pkg.trackingPin}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {pkg.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.weight} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.transportMode === TransportMode.AERIAL && 'Aérien'}
                    {pkg.transportMode === TransportMode.AERIAL_EXPRESS && 'Aérien Express'}
                    {pkg.transportMode === TransportMode.MARITIME && 'Maritime'}
                    {pkg.transportMode === TransportMode.MARITIME_EXPRESS && 'Maritime Express'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.finalPrice?.toFixed(2)} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(pkg.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        setModalData({
                          type: 'edit',
                          title: `📦 Modifier Colis - ${pkg.packageId}`,
                          packageData: pkg
                        })
                        setEditForm({
                          description: pkg.description,
                          weight: pkg.weight,
                          status: pkg.status,
                          finalPrice: pkg.finalPrice || 0
                        })
                        setShowModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun colis trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{modalData.title}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              {modalData.type === 'edit' && modalData.packageData && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">📦 ID:</span>
                        <p className="font-mono text-gray-900">{modalData.packageData.packageId}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">🔍 PIN:</span>
                        <p className="font-mono text-gray-900">{modalData.packageData.trackingPin}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">👤 Client:</span>
                        <p className="text-gray-900">{modalData.packageData.client.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">🚚 Transport:</span>
                        <p className="text-gray-900">
                          {modalData.packageData.transportMode === TransportMode.AERIAL && 'Aérien'}
                          {modalData.packageData.transportMode === TransportMode.AERIAL_EXPRESS && 'Aérien Express'}
                          {modalData.packageData.transportMode === TransportMode.MARITIME && 'Maritime'}
                          {modalData.packageData.transportMode === TransportMode.MARITIME_EXPRESS && 'Maritime Express'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📝 Description
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ⚖️ Poids (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={editForm.weight}
                          onChange={(e) => setEditForm({...editForm, weight: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          💰 Prix Final (FCFA)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.finalPrice}
                          onChange={(e) => setEditForm({...editForm, finalPrice: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🎯 Statut
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value as PackageStatus})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={PackageStatus.PLANNED}>Prévu</option>
                        <option value={PackageStatus.IN_TRANSIT}>En Route</option>
                        <option value={PackageStatus.ARRIVED}>Arrivé</option>
                        <option value={PackageStatus.COLLECTED}>Retiré</option>
                      </select>
                    </div>
                  </form>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        // Update package in the list
                        const updatedPackages = packages.map(pkg => 
                          pkg.id === modalData.packageData?.id 
                            ? { ...pkg, ...editForm }
                            : pkg
                        )
                        setPackages(updatedPackages)
                        
                        setModalData({
                          type: 'success',
                          title: '✅ Colis Modifié avec Succès'
                        })
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      💾 Sauvegarder
                    </button>
                  </div>
                </div>
              )}

              {modalData.type === 'success' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h4 className="text-lg font-semibold text-green-900 mb-2">Modification Réussie!</h4>
                    <p className="text-green-700">
                      Les informations du colis ont été mises à jour avec succès.
                    </p>
                    <div className="mt-4 text-sm text-green-600">
                      📅 Modifié le: {new Date().toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
