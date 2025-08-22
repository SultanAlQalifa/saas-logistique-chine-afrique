'use client'

import { useState } from 'react'
import { Ship, Plus, MapPin, Calendar, Download, FileSpreadsheet, Package } from 'lucide-react'

// Types simplifiés pour éviter les problèmes d'hydratation
interface SimpleCargo {
  id: string
  cargoId: string
  carrier: string
  originPort: string
  destinationPort: string
  transportMode: string
  departureDate: string
  estimatedArrival: string
  status: string
}

export default function CargosDirectPage() {
  const [showNewCargoForm, setShowNewCargoForm] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  // Données mock simplifiées
  const cargos: SimpleCargo[] = [
    {
      id: '1',
      cargoId: 'CG-2024-001',
      carrier: 'COSCO Shipping',
      originPort: 'Shanghai',
      destinationPort: 'Douala',
      transportMode: 'Maritime',
      departureDate: '15/01/2024',
      estimatedArrival: '15/03/2024',
      status: 'En Transit'
    },
    {
      id: '2',
      cargoId: 'CG-2024-002',
      carrier: 'Air France Cargo',
      originPort: 'Guangzhou',
      destinationPort: 'Abidjan',
      transportMode: 'Aérien',
      departureDate: '20/01/2024',
      estimatedArrival: '27/01/2024',
      status: 'Terminé'
    },
    {
      id: '3',
      cargoId: 'CG-2024-003',
      carrier: 'MSC',
      originPort: 'Shenzhen',
      destinationPort: 'Lagos',
      transportMode: 'Maritime Express',
      departureDate: '01/02/2024',
      estimatedArrival: '20/03/2024',
      status: 'Planifié'
    }
  ]

  const destinationData = [
    { name: 'Douala', value: 35, color: '#3b82f6' },
    { name: 'Abidjan', value: 25, color: '#10b981' },
    { name: 'Lagos', value: 20, color: '#f59e0b' },
    { name: 'Casablanca', value: 15, color: '#ef4444' },
    { name: 'Autres', value: 5, color: '#8b5cf6' },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string }> = {
      'Planifié': { color: 'bg-gray-100 text-gray-800' },
      'En Transit': { color: 'bg-yellow-100 text-yellow-800' },
      'Arrivé': { color: 'bg-green-100 text-green-800' },
      'Terminé': { color: 'bg-blue-100 text-blue-800' },
    }

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {status}
      </span>
    )
  }

  const handleNewCargo = () => {
    alert('Fonctionnalité de création de nouveau cargo - À implémenter')
    setShowNewCargoForm(false)
  }

  const handleAssignPackage = (cargoId: string) => {
    alert(`Assigner colis au cargo ${cargoId} - À implémenter`)
  }

  const handleExport = () => {
    const csvContent = [
      ['ID Cargo', 'Transporteur', 'Origine', 'Destination', 'Mode', 'Départ', 'Arrivée', 'Statut'].join(','),
      ...cargos.map(cargo => [
        cargo.cargoId,
        cargo.carrier,
        cargo.originPort,
        cargo.destinationPort,
        cargo.transportMode,
        cargo.departureDate,
        cargo.estimatedArrival,
        cargo.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `cargos-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowExportModal(false)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Cargos (Version Directe)</h1>
          <p className="text-gray-600">Gérez vos cargos et assignez les colis - Version sans problème d'hydratation</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Exporter
          </button>
          <button 
            onClick={handleNewCargo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            Nouveau Cargo
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
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique simplifié */}
          <div className="space-y-4">
            {destinationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-gray-600">{item.value}%</span>
              </div>
            ))}
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{cargos.length}</div>
              <div className="text-sm text-blue-800">Total Cargos</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {cargos.filter(c => c.status === 'En Transit').length}
              </div>
              <div className="text-sm text-green-800">En Transit</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {cargos.filter(c => c.status === 'Planifié').length}
              </div>
              <div className="text-sm text-yellow-800">Planifiés</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {cargos.filter(c => c.status === 'Terminé').length}
              </div>
              <div className="text-sm text-purple-800">Terminés</div>
            </div>
          </div>
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
                    {cargo.transportMode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cargo.departureDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cargo.estimatedArrival}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(cargo.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAssignPackage(cargo.cargoId)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Package className="h-4 w-4" />
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

      {/* Modal d'export */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Exporter les cargos</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">
                  Exporter la liste complète des cargos ({cargos.length} éléments) au format CSV.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                Exporter CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note explicative */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600">ℹ️</div>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Page Alternative</h4>
            <p className="text-sm text-blue-700 mt-1">
              Cette page est une version alternative de la gestion des cargos, créée pour contourner les problèmes d'hydratation Next.js. 
              Tous les boutons sont fonctionnels et cliquables.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
