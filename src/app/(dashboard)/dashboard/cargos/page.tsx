'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Cargo } from '@/types'
import { CargoStatus, TransportMode } from '@prisma/client'
import { Ship, Plus, MapPin, Calendar, Shield, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import ExportButtons, { ChartExportButton } from '@/components/export/ExportButtons'
import { ExportData } from '@/utils/exportUtils'

interface ModalData {
  type: 'assign' | 'success' | 'details'
  title: string
  content: string
  cargoId?: string
  availablePackages?: number
}

export default function CargosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCargoForm, setShowNewCargoForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)

  // Mock data for destination chart
  const destinationData = [
    { name: 'Douala', value: 35, color: '#3b82f6' },
    { name: 'Abidjan', value: 25, color: '#10b981' },
    { name: 'Lagos', value: 20, color: '#f59e0b' },
    { name: 'Casablanca', value: 15, color: '#ef4444' },
    { name: 'Autres', value: 5, color: '#8b5cf6' },
  ]

  useEffect(() => {
    // Vérifier les permissions d'accès
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Seuls les SUPER_ADMIN peuvent voir tous les cargos de la plateforme
    if (session.user.role !== 'SUPER_ADMIN') {
      router.push('/dashboard')
      return
    }

    // Mock cargos data - cargos globaux de toutes les entreprises
    const mockCargos: Cargo[] = [
      {
        id: '1',
        cargoId: 'CG-2024-001',
        companyId: 'logitrans-sarl',
        transportMode: TransportMode.MARITIME,
        carrier: 'COSCO Shipping',
        originPort: 'Shanghai',
        destinationPort: 'Douala',
        departureDate: new Date('2024-01-15'),
        estimatedArrival: new Date('2024-03-15'),
        status: CargoStatus.IN_TRANSIT,
        packages: []
      },
      {
        id: '2',
        cargoId: 'CG-2024-002',
        companyId: 'africa-express',
        transportMode: TransportMode.AERIAL,
        carrier: 'Air France Cargo',
        originPort: 'Guangzhou',
        destinationPort: 'Abidjan',
        departureDate: new Date('2024-01-20'),
        estimatedArrival: new Date('2024-01-27'),
        status: CargoStatus.COMPLETED,
        packages: []
      },
      {
        id: '3',
        cargoId: 'CG-2024-003',
        companyId: 'logitrans-sarl',
        transportMode: TransportMode.MARITIME_EXPRESS,
        carrier: 'MSC',
        originPort: 'Shenzhen',
        destinationPort: 'Lagos',
        departureDate: new Date('2024-02-01'),
        estimatedArrival: new Date('2024-03-20'),
        status: CargoStatus.PLANNED,
        packages: []
      },
      {
        id: '4',
        cargoId: 'CG-2024-004',
        companyId: 'west-africa-cargo',
        transportMode: TransportMode.AERIAL_EXPRESS,
        carrier: 'DHL Cargo',
        originPort: 'Beijing',
        destinationPort: 'Casablanca',
        departureDate: new Date('2024-02-10'),
        estimatedArrival: new Date('2024-02-15'),
        status: CargoStatus.ARRIVED,
        packages: []
      }
    ]

    setCargos(mockCargos)
    setLoading(false)
  }, [session, status, router])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Message d'accès refusé pour les non-SUPER_ADMIN
  if (session?.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
          <p className="text-gray-600 mb-6">
            La gestion globale des cargos est réservée aux super administrateurs uniquement.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-sm text-amber-800">
                Cette vue affiche tous les cargos de toutes les entreprises de la plateforme.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Nouveau Cargo Form Modal */}
      {showNewCargoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🚢 Nouveau Cargo</h2>
              <button
                onClick={() => setShowNewCargoForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form className="space-y-6">
              {/* Informations de Base */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  Informations de Base
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🆔 ID Cargo
                    </label>
                    <input
                      type="text"
                      placeholder="CG-2024-XXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🚛 Transporteur
                    </label>
                    <input
                      type="text"
                      placeholder="COSCO Shipping"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mode de Transport */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mode de Transport
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'MARITIME', label: '🚢 Maritime', color: 'blue' },
                    { value: 'MARITIME_EXPRESS', label: '⚡ Maritime Express', color: 'cyan' },
                    { value: 'AERIAL', label: '✈️ Aérien', color: 'green' },
                    { value: 'AERIAL_EXPRESS', label: '🚀 Aérien Express', color: 'emerald' }
                  ].map((mode) => (
                    <label key={mode.value} className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
                      <input
                        type="radio"
                        name="transportMode"
                        value={mode.value}
                        className="sr-only"
                      />
                      <div className="text-center w-full">
                        <div className="text-lg mb-1">{mode.label.split(' ')[0]}</div>
                        <div className="text-xs font-medium text-gray-600">{mode.label.split(' ').slice(1).join(' ')}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Itinéraire */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Itinéraire
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🏁 Port d'Origine
                    </label>
                    <input
                      type="text"
                      placeholder="Shanghai, Guangzhou..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🎯 Port de Destination
                    </label>
                    <input
                      type="text"
                      placeholder="Douala, Abidjan..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Planning
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      📅 Date de Départ
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🕐 Arrivée Estimée
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewCargoForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault()
                    setModalData({
                      type: 'success',
                      title: '✅ Cargo Créé',
                      content: 'Cargo créé avec succès!\n\n🚢 ID: CG-2024-004\n📅 Créé le: ' + new Date().toLocaleString('fr-FR') + '\n🎯 Statut: Planifié\n📋 Prêt pour assignation de colis'
                    })
                    setShowModal(true)
                    setShowNewCargoForm(false)
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  🚢 Créer le Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* En-tête avec gradient amélioré */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              🚢 Cargos de la Plateforme
            </h1>
            <p className="text-blue-100 text-lg">Vue globale de tous les cargos (Super Admin)</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowNewCargoForm(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Nouveau Cargo
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques avec drill-down */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Cargos</p>
              <p 
                className="text-3xl font-bold text-blue-900 hover:underline"
                onClick={() => {
                  setModalData({
                    type: 'details',
                    title: '🚢 Total Cargos',
                    content: 'Total Cargos: ' + cargos.length + '\n\n• Source: Base cargos\n• Période: Tous les cargos\n• Répartition par statut:\n  - Planifiés: ' + cargos.filter(c => c.status === 'PLANNED').length + '\n  - En transit: ' + cargos.filter(c => c.status === 'IN_TRANSIT').length + '\n  - Terminés: ' + cargos.filter(c => c.status === 'COMPLETED').length + '\n• Dernière MAJ: ' + new Date().toLocaleString('fr-FR')
                  })
                  setShowModal(true)
                }}
              >
                {cargos.length}
              </p>
              <p className="text-xs text-blue-500 mt-1">Tous statuts</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-xl">
              <Ship className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-blue-500 mt-2 transition-opacity">Cliquez pour détails</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">En Transit</p>
              <p 
                className="text-3xl font-bold text-green-900 hover:underline"
                onClick={() => {
                  const inTransit = cargos.filter(c => c.status === 'IN_TRANSIT')
                  const carriers = Array.from(new Set(inTransit.map(c => c.carrier).filter(Boolean)))
                  const destinations = Array.from(new Set(inTransit.map(c => c.destinationPort)))
                  setModalData({
                    type: 'details',
                    title: '🚛 Cargos En Transit',
                    content: 'Cargos En Transit: ' + inTransit.length + '\n\n• Statut: Actuellement en route\n• Transporteurs: ' + carriers.join(', ') + '\n• Destinations: ' + destinations.join(', ') + '\n• Délai moyen restant: 15-45 jours\n• Suivi GPS: Disponible\n• Prochaines arrivées: ' + inTransit.slice(0,2).map(c => c.destinationPort).join(', ')
                  })
                  setShowModal(true)
                }}
              >
                {cargos.filter(c => c.status === 'IN_TRANSIT').length}
              </p>
              <p className="text-xs text-green-500 mt-1">Actifs</p>
            </div>
            <div className="p-3 bg-green-600 rounded-xl">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-green-500 mt-2 transition-opacity">Voir en transit</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Planifiés</p>
              <p 
                className="text-3xl font-bold text-purple-900 hover:underline"
                onClick={() => {
                  const planned = cargos.filter(c => c.status === 'PLANNED')
                  const destinations = Array.from(new Set(planned.map(c => c.destinationPort)))
                  setModalData({
                    type: 'details',
                    title: '📅 Cargos Planifiés',
                    content: 'Cargos Planifiés: ' + planned.length + '\n\n• Statut: En préparation\n• Prochains départs: ' + planned.map(c => c.departureDate?.toLocaleDateString('fr-FR')).join(', ') + '\n• Destinations: ' + destinations.join(', ') + '\n• Capacité disponible: 85%\n• Réservations ouvertes: Oui\n• Délai de réservation: 7 jours avant départ'
                  })
                  setShowModal(true)
                }}
              >
                {cargos.filter(c => c.status === 'PLANNED').length}
              </p>
              <p className="text-xs text-purple-500 mt-1">À venir</p>
            </div>
            <div className="p-3 bg-purple-600 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-purple-500 mt-2 transition-opacity">Voir planifiés</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl shadow-lg border border-orange-200 hover:shadow-xl transition-all cursor-pointer group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Terminés</p>
              <p 
                className="text-3xl font-bold text-orange-900 hover:underline"
                onClick={() => {
                  const completed = cargos.filter(c => c.status === 'COMPLETED')
                  const destinations = Array.from(new Set(completed.map(c => c.destinationPort)))
                  setModalData({
                    type: 'details',
                    title: '✅ Cargos Terminés',
                    content: 'Cargos Terminés: ' + completed.length + '\n\n• Statut: Livrés avec succès\n• Taux de réussite: 100%\n• Destinations livrées: ' + destinations.join(', ') + '\n• Délai moyen: 45 jours\n• Satisfaction client: 4.8/5\n• Colis livrés: ' + (completed.length * 150) + ' (estimation)'
                  })
                  setShowModal(true)
                }}
              >
                {cargos.filter(c => c.status === 'COMPLETED').length}
              </p>
              <p className="text-xs text-orange-500 mt-1">Livrés</p>
            </div>
            <div className="p-3 bg-orange-600 rounded-xl">
              <Ship className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 text-xs text-orange-500 mt-2 transition-opacity">Voir terminés</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liste des Cargos</h1>
          <p className="text-gray-600">Détails et actions sur vos cargos</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons
            data={[{
              title: 'Liste des Cargos',
              data: cargos.map(cargo => ({
                'ID Cargo': cargo.cargoId,
                'Transporteur': cargo.carrier || 'N/A',
                'Origine': cargo.originPort,
                'Destination': cargo.destinationPort,
                'Mode Transport': cargo.transportMode,
                'Date Départ': cargo.departureDate?.toLocaleDateString('fr-FR') || 'N/A',
                'Arrivée Estimée': cargo.estimatedArrival?.toLocaleDateString('fr-FR') || 'N/A',
                'Statut': cargo.status
              })),
              columns: [
                { header: 'ID Cargo', key: 'ID Cargo', width: 25 },
                { header: 'Transporteur', key: 'Transporteur', width: 30 },
                { header: 'Origine', key: 'Origine', width: 25 },
                { header: 'Destination', key: 'Destination', width: 25 },
                { header: 'Mode Transport', key: 'Mode Transport', width: 25 },
                { header: 'Date Départ', key: 'Date Départ', width: 25 },
                { header: 'Arrivée Estimée', key: 'Arrivée Estimée', width: 25 },
                { header: 'Statut', key: 'Statut', width: 20 }
              ],
              metadata: {
                company: 'SaaS Logistique Chine-Afrique',
                period: `${new Date().getFullYear()}`,
                generatedBy: 'Système de gestion',
                generatedAt: new Date()
              }
            }]}
            charts={[{ elementId: 'cargos-destination-chart', title: 'Cargos par Destination' }]}
            reportTitle="Rapport Gestion des Cargos"
            className="hidden sm:block"
          />
          <button 
            onClick={() => setShowNewCargoForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau Cargo</span>
            <span className="sm:hidden">Nouveau</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Cargos par Destination
          </h3>
          <ChartExportButton 
            chartId="cargos-destination-chart" 
            title="Cargos par Destination"
          />
        </div>
        <div id="cargos-destination-chart">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
              data={destinationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {destinationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Cargos Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des Cargos ({cargos.length})
          </h3>
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
                  Origine → Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Départ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arrivée Estimée
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
              {cargos.map((cargo) => (
                <tr key={cargo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cargo.cargoId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cargo.carrier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cargo.originPort} → {cargo.destinationPort}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cargo.transportMode === TransportMode.MARITIME && 'Maritime'}
                    {cargo.transportMode === TransportMode.MARITIME_EXPRESS && 'Maritime Express'}
                    {cargo.transportMode === TransportMode.AERIAL && 'Aérien'}
                    {cargo.transportMode === TransportMode.AERIAL_EXPRESS && 'Aérien Express'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cargo.departureDate?.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cargo.estimatedArrival?.toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(cargo.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const availablePackages = Math.floor(Math.random() * 20) + 5
                          setModalData({
                            type: 'assign',
                            title: `📦 Assigner Colis - ${cargo.cargoId}`,
                            content: `Assigner des colis au cargo ${cargo.cargoId}`,
                            cargoId: cargo.cargoId,
                            availablePackages
                          })
                          setShowModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Assigner Colis
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{modalData.title}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              {modalData.type === 'assign' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-700 mb-3">
                      📦 <strong>{modalData.availablePackages}</strong> colis disponibles pour assignation
                    </p>
                    <p className="text-sm text-gray-600">
                      🚢 Cargo: <strong>{modalData.cargoId}</strong>
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        setModalData({
                          type: 'success',
                          title: '✅ Assignation Réussie',
                          content: `${modalData.availablePackages} colis assignés au cargo ${modalData.cargoId}!\n\n📦 Colis assignés: ${modalData.availablePackages}\n🚢 Cargo: ${modalData.cargoId}\n📅 Assigné le: ${new Date().toLocaleString('fr-FR')}\n🎯 Statut: Confirmé`
                        })
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              )}

              {(modalData.type === 'details' || modalData.type === 'success') && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-medium">
                      {modalData.content}
                    </pre>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
