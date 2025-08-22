'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Store, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign,
  MapPin,
  Star,
  Eye,
  MessageSquare,
  Filter,
  Search,
  Plus,
  ArrowRight,
  ArrowLeft,
  Truck,
  Ship,
  Plane,
  Package,
  Shield,
  Award,
  Globe
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { 
  mockMarketplaceStats, 
  mockServiceRequests, 
  mockServiceProviders,
  getServiceCategoryLabel,
  getRequestStatusLabel,
  calculateDaysUntilExpiry,
  formatCurrency,
  type ServiceRequest,
  type ServiceProvider
} from '@/lib/marketplace-services'

export default function MarketplacePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'providers'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const isEnterprise = session?.user?.role === 'ADMIN'

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maritime': return <Ship className="h-4 w-4" />
      case 'aerien': return <Plane className="h-4 w-4" />
      case 'terrestre': return <Truck className="h-4 w-4" />
      case 'express': return <Package className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'bidding': return 'bg-blue-100 text-blue-800'
      case 'awarded': return 'bg-purple-100 text-purple-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRequests = mockServiceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredProviders = mockServiceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.company.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Store className="h-10 w-10 mr-3" />
                Marketplace Logistique
              </h1>
              <p className="text-emerald-100 text-lg">
                🌍 Connectez-vous avec les meilleurs prestataires logistiques Chine-Afrique
              </p>
            </div>
          </div>
          {isEnterprise && (
            <Button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Publier une demande
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demandes Actives</p>
                <p className="text-2xl font-bold text-emerald-600">{mockMarketplaceStats.activeRequests}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              +12% cette semaine
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prestataires Vérifiés</p>
                <p className="text-2xl font-bold text-teal-600">{mockMarketplaceStats.verifiedProviders}</p>
              </div>
              <Shield className="w-8 h-8 text-teal-600" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {Math.round((mockMarketplaceStats.verifiedProviders / mockMarketplaceStats.totalProviders) * 100)}% du total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps de Réponse</p>
                <p className="text-2xl font-bold text-cyan-600">{mockMarketplaceStats.averageResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-cyan-600" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Moyenne plateforme
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Économies Moyennes</p>
                <p className="text-2xl font-bold text-orange-600">{mockMarketplaceStats.averageSavings}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              vs tarifs standards
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: Globe },
          { id: 'requests', label: 'Demandes de Services', icon: MessageSquare },
          { id: 'providers', label: 'Prestataires', icon: Users }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:text-emerald-600'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vue d'ensemble */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demandes Récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-emerald-600" />
                  Demandes Récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockServiceRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(request.category)}
                        <span className="font-medium text-sm">{request.title}</span>
                      </div>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {request.origin.city}, {request.origin.country} → {request.destination.city}, {request.destination.country}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{request.bidsCount} offres</span>
                      <span className="text-emerald-600 font-medium">
                        {formatCurrency(request.budget.min, request.budget.currency)} - {formatCurrency(request.budget.max, request.budget.currency)}
                      </span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('requests')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Voir toutes les demandes
                </Button>
              </CardContent>
            </Card>

            {/* Top Prestataires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-teal-600" />
                  Top Prestataires
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockServiceProviders.map((provider, index) => (
                  <div key={provider.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{provider.name}</span>
                        {provider.verified && (
                          <Shield className="h-3 w-3 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-600">{provider.company}</div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{provider.rating} ({provider.reviewCount})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{provider.completedOrders}</div>
                      <div className="text-xs text-gray-400">commandes</div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('providers')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Voir tous les prestataires
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Catégories Populaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-cyan-600" />
                Catégories de Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { category: 'maritime', count: 45, icon: Ship, color: 'from-blue-500 to-cyan-500' },
                  { category: 'aerien', count: 23, icon: Plane, color: 'from-purple-500 to-pink-500' },
                  { category: 'terrestre', count: 31, icon: Truck, color: 'from-green-500 to-emerald-500' },
                  { category: 'express', count: 18, icon: Package, color: 'from-orange-500 to-red-500' }
                ].map((item) => (
                  <button
                    key={item.category}
                    onClick={() => {
                      setSelectedCategory(item.category)
                      setActiveTab('requests')
                    }}
                    className={`bg-gradient-to-r ${item.color} rounded-lg p-4 text-white hover:scale-105 transform transition-all duration-200 cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <item.icon className="h-6 w-6" />
                      <span className="text-2xl font-bold">{item.count}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {getServiceCategoryLabel(item.category as any)}
                    </div>
                    <div className="text-xs opacity-90">demandes actives</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Demandes de Services */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher une demande..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">Toutes catégories</option>
                  <option value="maritime">Maritime</option>
                  <option value="aerien">Aérien</option>
                  <option value="terrestre">Terrestre</option>
                  <option value="express">Express</option>
                </select>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des demandes */}
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        {getCategoryIcon(request.category)}
                      </div>
                      <div>
                        <CardTitle className="flex items-center">
                          {request.title}
                          <Badge className={`ml-2 ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {request.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getRequestStatusLabel(request.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">Itinéraire</span>
                      </div>
                      <div className="text-blue-700 text-sm">
                        {request.origin.city}, {request.origin.country} → {request.destination.city}, {request.destination.country}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Budget</span>
                      </div>
                      <div className="text-green-700 font-semibold text-sm">
                        {formatCurrency(request.budget.min, request.budget.currency)} - {formatCurrency(request.budget.max, request.budget.currency)}
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-orange-800">Délai</span>
                      </div>
                      <div className="text-orange-700 text-sm">
                        {calculateDaysUntilExpiry(request.expiryDate)} jours restants
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {request.bidsCount} offres
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {request.viewsCount} vues
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {request.clientName}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                      {isEnterprise && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Faire une offre
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Prestataires */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Rechercher un prestataire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des prestataires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="border-l-4 border-l-teal-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="flex items-center">
                          {provider.name}
                          {provider.verified && (
                            <Shield className="h-4 w-4 ml-2 text-emerald-600" />
                          )}
                        </CardTitle>
                        <CardDescription>{provider.company}</CardDescription>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{provider.rating}</span>
                          <span className="text-sm text-gray-500">({provider.reviewCount} avis)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-emerald-600">{provider.completedOrders}</div>
                      <div className="text-xs text-gray-500">commandes</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Spécialités</div>
                      <div className="flex flex-wrap gap-1">
                        {provider.specialties.slice(0, 2).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {provider.specialties.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{provider.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Zones</div>
                      <div className="flex flex-wrap gap-1">
                        {provider.coverageZones.slice(0, 2).map((zone) => (
                          <Badge key={zone} variant="outline" className="text-xs">
                            {zone}
                          </Badge>
                        ))}
                        {provider.coverageZones.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.coverageZones.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm font-medium text-emerald-600">{provider.responseTime}</div>
                      <div className="text-xs text-gray-500">Réponse</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-teal-600">{provider.languages.length}</div>
                      <div className="text-xs text-gray-500">Langues</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-cyan-600">{provider.certifications.length}</div>
                      <div className="text-xs text-gray-500">Certifs</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir profil
                    </Button>
                    {isEnterprise && (
                      <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
