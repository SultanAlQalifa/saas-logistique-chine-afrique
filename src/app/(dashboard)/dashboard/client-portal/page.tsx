'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { 
  Package, 
  Search, 
  Eye, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle,
  AlertCircle,
  User,
  Plus,
  Send,
  X
} from 'lucide-react'

interface ClientPackage {
  id: string
  packageId: string
  description: string
  weight: number
  status: 'in_transit' | 'arrived' | 'collected' | 'delayed'
  trackingPin: string
  estimatedArrival?: Date
  actualArrival?: Date
  origin: string
  destination: string
  transportMode: 'AERIAL' | 'MARITIME'
}

const mockPackages: ClientPackage[] = [
  {
    id: '1',
    packageId: 'CO-001234',
    description: 'Électroniques',
    weight: 2.5,
    status: 'in_transit',
    trackingPin: 'A3X9K2',
    estimatedArrival: new Date('2024-02-15'),
    origin: 'Guangzhou, Chine',
    destination: 'Abidjan, Côte d\'Ivoire',
    transportMode: 'AERIAL'
  },
  {
    id: '2',
    packageId: 'CO-001235',
    description: 'Textiles',
    weight: 15.0,
    status: 'arrived',
    trackingPin: 'B7Y4M1',
    estimatedArrival: new Date('2024-02-10'),
    actualArrival: new Date('2024-02-09'),
    origin: 'Shanghai, Chine',
    destination: 'Dakar, Sénégal',
    transportMode: 'MARITIME'
  }
]

export default function ClientPortalPage() {
  const { data: session, status } = useSession()
  const [packages] = useState<ClientPackage[]>(mockPackages)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<ClientPackage | null>(null)
  const [activeTab, setActiveTab] = useState('packages')
  
  // Gérer les paramètres URL pour navigation depuis notifications
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    const quoteId = urlParams.get('quoteId')
    const packageId = urlParams.get('packageId')
    
    if (tab) {
      setActiveTab(tab)
    }
    
    // Auto-scroll vers l'élément spécifique si ID fourni
    if (quoteId || packageId) {
      setTimeout(() => {
        const element = document.getElementById(quoteId || packageId || '')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50')
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50')
          }, 3000)
        }
      }, 500)
    }
  }, [])

  const [quoteRequests, setQuoteRequests] = useState<any[]>([])
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  
  // États pour le formulaire de demande de devis
  const [quoteForm, setQuoteForm] = useState({
    description: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    origin: '',
    destination: '',
    transportMode: 'AERIAL' as 'AERIAL' | 'AERIAL_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS',
    estimatedValue: '',
    notes: ''
  })

  // Fonction pour publier une demande de devis
  const publishQuoteRequest = () => {
    const newRequest = {
      id: `request-${Date.now()}`,
      description: quoteForm.description,
      weight: quoteForm.weight ? parseFloat(quoteForm.weight) : undefined,
      dimensions: (quoteForm.transportMode === 'MARITIME' || quoteForm.transportMode === 'MARITIME_EXPRESS') && quoteForm.length && quoteForm.width && quoteForm.height ? {
        length: parseFloat(quoteForm.length),
        width: parseFloat(quoteForm.width),
        height: parseFloat(quoteForm.height),
        cbm: (parseFloat(quoteForm.length) * parseFloat(quoteForm.width) * parseFloat(quoteForm.height)) / 1000000
      } : undefined,
      origin: quoteForm.origin,
      destination: quoteForm.destination,
      transportMode: quoteForm.transportMode,
      estimatedValue: quoteForm.estimatedValue ? parseFloat(quoteForm.estimatedValue) : undefined,
      notes: quoteForm.notes,
      status: 'published',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      quotes: []
    }

    setQuoteRequests([...quoteRequests, newRequest])
    setShowQuoteForm(false)
    
    // Reset form
    setQuoteForm({
      description: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      origin: '',
      destination: '',
      transportMode: 'AERIAL',
      estimatedValue: '',
      notes: ''
    })
  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-64">Chargement...</div>
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  if (!session?.user || session.user.role !== 'CLIENT') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux clients.</p>
        </div>
      </div>
    )
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.trackingPin.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'arrived': return 'bg-green-100 text-green-800'
      case 'collected': return 'bg-gray-100 text-gray-800'
      case 'delayed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_transit': return 'En transit'
      case 'arrived': return 'Arrivé'
      case 'collected': return 'Récupéré'
      case 'delayed': return 'Retardé'
      default: return 'Inconnu'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_transit': return <Truck className="h-4 w-4" />
      case 'arrived': return <CheckCircle className="h-4 w-4" />
      case 'collected': return <Package className="h-4 w-4" />
      case 'delayed': return <AlertCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <User className="h-8 w-8" />
              👤 Portail Client
            </h1>
            <p className="text-blue-100 text-lg">
              Suivez vos colis et demandez des devis personnalisés
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{packages.length}</div>
            <div className="text-blue-200 text-sm">Colis total</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'tracking'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📦 Suivi Colis
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'quotes'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📢 Mes Demandes de Devis ({quoteRequests.length})
        </button>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'tracking' && (
        <>
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En transit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {packages.filter(p => p.status === 'in_transit').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Arrivés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {packages.filter(p => p.status === 'arrived').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Récupérés</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {packages.filter(p => p.status === 'collected').length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Retardés</p>
                  <p className="text-2xl font-bold text-red-600">
                    {packages.filter(p => p.status === 'delayed').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher par ID colis, description ou PIN de suivi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Liste des colis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Mes Colis</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {pkg.packageId.slice(-2)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{pkg.packageId}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.status)}`}>
                              {getStatusIcon(pkg.status)}
                              {getStatusLabel(pkg.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{pkg.description} • {pkg.weight} kg</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {pkg.origin} → {pkg.destination}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              PIN: {pkg.trackingPin}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Onglet Demandes de Devis */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Send className="h-6 w-6" />
              📢 Demandes de Devis
            </h2>
            <p className="text-purple-100">
              Publiez vos demandes de transport et recevez des devis personnalisés des entreprises
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Mes Demandes</h3>
              <button
                onClick={() => setShowQuoteForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nouvelle Demande
              </button>
            </div>

            {quoteRequests.length === 0 ? (
              <div className="text-center py-12">
                <Send className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande de devis</h3>
                <p className="text-gray-600 mb-4">Créez votre première demande pour recevoir des offres personnalisées</p>
                <button
                  onClick={() => setShowQuoteForm(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Créer une Demande
                </button>
              </div>
            ) : (
              <div>Vos demandes apparaîtront ici</div>
            )}
          </div>
        </div>
      )}

      {/* Modal de détails du colis */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Détails du Colis</h2>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">📦 Informations Générales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">ID Colis:</span>
                      <div className="font-semibold">{selectedPackage.packageId}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">PIN de Suivi:</span>
                      <div className="font-semibold">{selectedPackage.trackingPin}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <div className="font-semibold">{selectedPackage.description}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Poids:</span>
                      <div className="font-semibold">{selectedPackage.weight} kg</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">🗺️ Trajet</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-blue-900">Origine</div>
                        <div className="text-sm text-blue-700">{selectedPackage.origin}</div>
                      </div>
                    </div>
                    <div className="ml-1.5 w-0.5 h-8 bg-blue-300"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-blue-900">Destination</div>
                        <div className="text-sm text-blue-700">{selectedPackage.destination}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">📅 Statut et Dates</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Statut actuel:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPackage.status)}`}>
                        {getStatusIcon(selectedPackage.status)}
                        {getStatusLabel(selectedPackage.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Arrivée prévue:</span>
                      <span className="font-medium">
                        {selectedPackage.estimatedArrival?.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {selectedPackage.actualArrival && (
                      <div className="flex items-center justify-between">
                        <span className="text-green-700">Arrivée réelle:</span>
                        <span className="font-medium text-green-600">
                          {selectedPackage.actualArrival.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Mode de transport:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedPackage.transportMode === 'AERIAL' 
                          ? 'bg-sky-100 text-sky-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedPackage.transportMode === 'AERIAL' ? '✈️ Aérien' : '🚢 Maritime'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de demande de devis */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle Demande de Devis</h2>
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description du colis *
                  </label>
                  <input
                    type="text"
                    value={quoteForm.description}
                    onChange={(e) => setQuoteForm({...quoteForm, description: e.target.value})}
                    placeholder="Ex: Électroniques, Textiles, Machines..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origine *
                    </label>
                    <input
                      type="text"
                      value={quoteForm.origin}
                      onChange={(e) => setQuoteForm({...quoteForm, origin: e.target.value})}
                      placeholder="Ex: Guangzhou, Chine"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination *
                    </label>
                    <input
                      type="text"
                      value={quoteForm.destination}
                      onChange={(e) => setQuoteForm({...quoteForm, destination: e.target.value})}
                      placeholder="Ex: Abidjan, Côte d'Ivoire"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de transport *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setQuoteForm({...quoteForm, transportMode: 'AERIAL'})}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          quoteForm.transportMode === 'AERIAL' 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        ✈️ Aérien
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuoteForm({...quoteForm, transportMode: 'AERIAL_EXPRESS'})}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          quoteForm.transportMode === 'AERIAL_EXPRESS' 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        ✈️ Aérien Express
                      </button>
                    </div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setQuoteForm({...quoteForm, transportMode: 'MARITIME'})}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          quoteForm.transportMode === 'MARITIME' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        🚢 Maritime
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuoteForm({...quoteForm, transportMode: 'MARITIME_EXPRESS'})}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          quoteForm.transportMode === 'MARITIME_EXPRESS' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        🚢 Maritime Express
                      </button>
                    </div>
                  </div>
                </div>

                {/* Champs conditionnels selon le mode de transport */}
                {(quoteForm.transportMode === 'AERIAL' || quoteForm.transportMode === 'AERIAL_EXPRESS') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poids (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={quoteForm.weight}
                      onChange={(e) => setQuoteForm({...quoteForm, weight: e.target.value})}
                      placeholder="Ex: 15.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                )}

                {(quoteForm.transportMode === 'MARITIME' || quoteForm.transportMode === 'MARITIME_EXPRESS') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (cm) *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          value={quoteForm.length}
                          onChange={(e) => setQuoteForm({...quoteForm, length: e.target.value})}
                          placeholder="Longueur"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={quoteForm.width}
                          onChange={(e) => setQuoteForm({...quoteForm, width: e.target.value})}
                          placeholder="Largeur"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={quoteForm.height}
                          onChange={(e) => setQuoteForm({...quoteForm, height: e.target.value})}
                          placeholder="Hauteur"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    {quoteForm.length && quoteForm.width && quoteForm.height && (
                      <div className="mt-2 text-sm text-blue-600">
                        Volume: {((parseFloat(quoteForm.length) * parseFloat(quoteForm.width) * parseFloat(quoteForm.height)) / 1000000).toFixed(3)} m³
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valeur estimée (FCFA)
                  </label>
                  <input
                    type="number"
                    value={quoteForm.estimatedValue}
                    onChange={(e) => setQuoteForm({...quoteForm, estimatedValue: e.target.value})}
                    placeholder="Ex: 2500000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes et instructions spéciales
                  </label>
                  <textarea
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                    placeholder="Ex: Produits fragiles, emballage renforcé requis..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📋 Informations importantes</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Votre demande sera visible par toutes les entreprises de transport</li>
                    <li>• Vous recevrez des devis personnalisés sous 24-48h</li>
                    <li>• La demande expire automatiquement dans 7 jours</li>
                    <li>• Aucun prix ne sera affiché avant réception des devis entreprises</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowQuoteForm(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={publishQuoteRequest}
                    disabled={!quoteForm.description || !quoteForm.origin || !quoteForm.destination || 
                      ((quoteForm.transportMode === 'AERIAL' || quoteForm.transportMode === 'AERIAL_EXPRESS') && !quoteForm.weight) ||
                      ((quoteForm.transportMode === 'MARITIME' || quoteForm.transportMode === 'MARITIME_EXPRESS') && (!quoteForm.length || !quoteForm.width || !quoteForm.height))}
                    className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publier la Demande
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
