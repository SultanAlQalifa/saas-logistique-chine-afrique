'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Package, Truck, CheckCircle, Clock, Eye, MoreHorizontal, ArrowUpDown, Grid3X3, List, Settings, Download, Bell, AlertTriangle, Calendar, MapPin, User, Phone, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import HomeBanner from '@/components/advertising/HomeBanner'

// Types pour les colis
interface ClientPackage {
  id: string
  trackingNumber: string
  status: 'in_transit' | 'pending' | 'customs' | 'processing' | 'delayed' | 'delivered'
  origin: string
  destination: string
  weight: string
  value: string
  estimatedDelivery: string
  createdAt: string
  description: string
  priority: 'high' | 'medium' | 'low'
  carrier: string
  progress: number
  lastUpdate: string
  recipient: string
  phone: string
}

export default function ClientDashboardPage() {
  const [packages, setPackages] = useState<ClientPackage[]>([
    {
      id: 'PKG-001',
      trackingNumber: 'NMC2024001',
      status: 'in_transit',
      origin: 'Guangzhou, Chine',
      destination: 'Dakar, Sénégal',
      weight: '25.5 kg',
      value: '850000 FCFA',
      estimatedDelivery: '2024-02-15',
      createdAt: '2024-01-15',
      description: 'Matériel électronique',
      priority: 'high',
      carrier: 'DHL Express',
      progress: 75,
      lastUpdate: '2024-01-20 14:30',
      recipient: 'Amadou Diallo',
      phone: '+221 77 123 45 67'
    },
    {
      id: 'PKG-003',
      trackingNumber: 'NMC2024003',
      status: 'pending',
      origin: 'Shanghai, Chine',
      destination: 'Bamako, Mali',
      weight: '8.7 kg',
      value: '320000 FCFA',
      estimatedDelivery: '2024-02-20',
      createdAt: '2024-01-18',
      description: 'Accessoires',
      priority: 'low',
      carrier: 'FedEx Economy',
      progress: 25,
      lastUpdate: '2024-01-19 09:15',
      recipient: 'Ousmane Traoré',
      phone: '+223 76 54 32 10'
    },
    {
      id: 'PKG-004',
      trackingNumber: 'NMC2024004',
      status: 'customs',
      origin: 'Beijing, Chine',
      destination: 'Cotonou, Bénin',
      weight: '15.2 kg',
      value: '680000 FCFA',
      estimatedDelivery: '2024-02-10',
      createdAt: '2024-01-12',
      description: 'Pièces automobiles',
      priority: 'high',
      carrier: 'TNT Express',
      progress: 60,
      lastUpdate: '2024-01-21 11:20',
      recipient: 'Koffi Mensah',
      phone: '+229 97 65 43 21'
    },
    {
      id: 'PKG-005',
      trackingNumber: 'NMC2024005',
      status: 'processing',
      origin: 'Hangzhou, Chine',
      destination: 'Lomé, Togo',
      weight: '6.8 kg',
      value: '275000 FCFA',
      estimatedDelivery: '2024-02-18',
      createdAt: '2024-01-20',
      description: 'Produits cosmétiques',
      priority: 'medium',
      carrier: 'Aramex',
      progress: 15,
      lastUpdate: '2024-01-21 08:45',
      recipient: 'Awa Koné',
      phone: '+228 90 12 34 56'
    },
    {
      id: 'PKG-006',
      trackingNumber: 'NMC2024006',
      status: 'delayed',
      origin: 'Tianjin, Chine',
      destination: 'Ouagadougou, Burkina Faso',
      weight: '22.1 kg',
      value: '920000 FCFA',
      estimatedDelivery: '2024-02-25',
      createdAt: '2024-01-08',
      description: 'Équipements informatiques',
      priority: 'high',
      carrier: 'DHL Express',
      progress: 45,
      lastUpdate: '2024-01-21 13:10',
      recipient: 'Ibrahim Sawadogo',
      phone: '+226 70 89 67 45'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [destinationFilter, setDestinationFilter] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'customs':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✅'
      case 'in_transit':
        return '🚚'
      case 'pending':
        return '⏳'
      case 'customs':
        return '🏛️'
      case 'processing':
        return '⚙️'
      case 'delayed':
        return '⚠️'
      default:
        return '📦'
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedPackages.length === 0) {
      alert('Veuillez sélectionner au moins un colis')
      return
    }
    
    const packageNumbers = selectedPackages.map(id => 
      packages.find(p => p.id === id)?.trackingNumber
    ).join(', ')
    
    switch (action) {
      case 'track':
        alert(`🔍 Suivi détaillé ouvert pour ${selectedPackages.length} colis : ${packageNumbers}`)
        setSelectedPackages([])
        break
      case 'export':
        const csvContent = packages
          .filter(pkg => selectedPackages.includes(pkg.id))
          .map(pkg => `${pkg.trackingNumber},${pkg.status},${pkg.origin},${pkg.destination},${pkg.weight},${pkg.value},${pkg.estimatedDelivery}`)
          .join('\n')
        const blob = new Blob([`Numéro,Statut,Origine,Destination,Poids,Valeur,Livraison Estimée\n${csvContent}`], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `colis_selection_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        alert(`📊 Export CSV généré pour ${selectedPackages.length} colis !`)
        break
      case 'notify':
        alert(`📱 Notifications envoyées aux destinataires de ${selectedPackages.length} colis !`)
        setSelectedPackages([])
        break
    }
  }

  const togglePackageSelection = (packageId: string) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    )
  }

  const selectAllPackages = () => {
    setSelectedPackages(selectedPackages.length === filteredPackages.length ? [] : filteredPackages.map(p => p.id))
  }


  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_transit': return 'En transit'
      case 'pending': return 'En attente'
      case 'customs': return 'En douane'
      case 'processing': return 'En traitement'
      case 'delayed': return 'Retardé'
      default: return status
    }
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || pkg.priority === priorityFilter
    const matchesDestination = destinationFilter === 'all' || pkg.destination.toLowerCase().includes(destinationFilter.toLowerCase())
    
    let matchesDateRange = true
    if (dateRange.start && dateRange.end) {
      const pkgDate = new Date(pkg.createdAt)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      matchesDateRange = pkgDate >= startDate && pkgDate <= endDate
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDestination && matchesDateRange
  })

  const stats = [
    {
      title: 'Total Colis',
      value: packages.length.toString(),
      change: '+3',
      icon: Package,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      title: 'En Transit',
      value: packages.filter(p => p.status === 'in_transit').length.toString(),
      change: '+1',
      icon: Truck,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Livrés',
      value: packages.filter(p => p.status === 'delivered').length.toString(),
      change: '+2',
      icon: CheckCircle,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      title: 'Priorité Haute',
      value: packages.filter(p => p.priority === 'high').length.toString(),
      change: '0',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* En-tête client */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">📦 Mes Colis</h1>
            <p className="text-blue-100 text-lg">Bienvenue dans votre espace client - Suivez vos expéditions</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-200">Client</p>
              <p className="font-semibold">Client Test</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/support/client"
          className="flex items-center gap-3 p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <MessageSquare className="h-8 w-8" />
          <div>
            <h3 className="text-lg font-semibold">Support Client</h3>
            <p className="text-sm opacity-90">Besoin d'aide ? Contactez-nous</p>
          </div>
        </Link>
        <Link
          href="/dashboard/client/profile"
          className="flex items-center gap-3 p-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <User className="h-8 w-8" />
          <div>
            <h3 className="text-lg font-semibold">Mon Profil</h3>
            <p className="text-sm opacity-90">Gérer mes informations</p>
          </div>
        </Link>
        <Link
          href="/dashboard/client/settings"
          className="flex items-center gap-3 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Settings className="h-8 w-8" />
          <div>
            <h3 className="text-lg font-semibold">Paramètres</h3>
            <p className="text-sm opacity-90">Notifications et préférences</p>
          </div>
        </Link>
      </div>

      {/* Bannières publicitaires et Statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Statistiques des colis */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 
                    stat.change === '0' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bannières publicitaires sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <HomeBanner position="sidebar" />
          
          {/* Bannière promotionnelle personnalisée pour clients */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <div className="bg-yellow-400 text-orange-900 px-2 py-1 rounded-full text-xs font-bold">
                🎯 OFFRE SPÉCIALE
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Réduction -20%</h3>
            <p className="text-sm text-orange-100 mb-4">
              Sur votre prochain envoi maritime vers l'Afrique de l'Ouest
            </p>
            <button className="w-full bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors">
              Profiter maintenant 🚢
            </button>
          </div>

          {/* Statistiques rapides */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              📊 Vos Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Économies totales</span>
                <span className="font-bold">125,000 FCFA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Colis cette année</span>
                <span className="font-bold">{packages.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Temps moyen</span>
                <span className="font-bold">12 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres avancés */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            🔍 Rechercher et Filtrer
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              {viewMode === 'grid' ? 'Liste' : 'Grille'}
            </button>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              Filtres avancés
            </button>
          </div>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher par numéro, destinataire, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Filtres de base */}
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { value: 'all', label: 'Tous les colis', count: packages.length },
            { value: 'in_transit', label: 'En transit', count: packages.filter(p => p.status === 'in_transit').length },
            { value: 'pending', label: 'En attente', count: packages.filter(p => p.status === 'pending').length },
            { value: 'customs', label: 'En douane', count: packages.filter(p => p.status === 'customs').length },
            { value: 'processing', label: 'En traitement', count: packages.filter(p => p.status === 'processing').length },
            { value: 'delayed', label: 'Retardé', count: packages.filter(p => p.status === 'delayed').length }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === filter.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
              <span className={`text-xs px-2 py-1 rounded-full ${
                statusFilter === filter.value ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Filtres avancés */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Basse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  placeholder="Filtrer par destination"
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions en lot */}
        {selectedPackages.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-blue-800 font-medium">
                {selectedPackages.length} colis sélectionné(s)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('track')}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  Suivre
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Exporter
                </button>
                <button
                  onClick={() => handleBulkAction('notify')}
                  className="flex items-center gap-2 px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  Notifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des colis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Mes Expéditions ({filteredPackages.length})
          </h2>
        </div>
        
        {/* Sélection globale */}
        {filteredPackages.length > 0 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPackages.length === filteredPackages.length}
                onChange={selectAllPackages}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Sélectionner tous ({filteredPackages.length})
              </span>
            </label>
          </div>
        )}
        
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 p-6' : 'divide-y divide-gray-200'}>
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className={viewMode === 'grid' 
              ? 'bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]'
              : 'p-6 hover:bg-gray-50 transition-colors'
            }>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPackages.includes(pkg.id)}
                    onChange={() => togglePackageSelection(pkg.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-mono text-lg font-bold text-gray-900 block">
                      {pkg.trackingNumber}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(pkg.status)}`}>
                        <span className="text-base">{getStatusIcon(pkg.status)}</span>
                        {getStatusLabel(pkg.status)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(pkg.priority)}`}>
                        {pkg.priority === 'high' ? '🔴 Haute' : pkg.priority === 'medium' ? '🟡 Moyenne' : '🟢 Basse'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                    <Eye className="h-4 w-4" />
                    Détails
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression</span>
                  <span className="text-sm font-bold text-gray-900">{pkg.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      pkg.progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      pkg.progress >= 50 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                      pkg.progress >= 25 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${pkg.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Description</p>
                    <p className="font-medium text-gray-900">{pkg.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Transporteur</p>
                    <p className="font-medium text-gray-900">{pkg.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Poids & Valeur</p>
                    <p className="font-medium text-gray-900">{pkg.weight} • {pkg.value}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Itinéraire
                    </p>
                    <p className="font-medium text-gray-900 text-sm">
                      {pkg.origin} → {pkg.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold flex items-center gap-1">
                      <User className="h-3 w-3" /> Destinataire
                    </p>
                    <p className="font-medium text-gray-900">{pkg.recipient}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {pkg.phone}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Livraison: {pkg.estimatedDelivery}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Mis à jour: {pkg.lastUpdate}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun colis trouvé</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all' 
                ? 'Vous n\'avez pas encore de colis enregistrés ou aucun colis ne correspond à vos critères de recherche.'
                : `Aucun colis avec le statut sélectionné.`
              }
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setPriorityFilter('all')
                  setDestinationFilter('all')
                  setDateRange({ start: '', end: '' })
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
              <Link
                href="/dashboard/support/client"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Contacter le support
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
