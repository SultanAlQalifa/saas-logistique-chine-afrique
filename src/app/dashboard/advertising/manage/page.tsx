'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, Edit, Trash2, Play, Pause, Eye, BarChart3, Calendar, DollarSign, Target, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { Advertisement, AdCampaign } from '@/types/advertising'
import AdBanner from '@/components/advertising/AdBanner'

export default function AdvertisingManagePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'campaigns' | 'ads' | 'analytics'>('campaigns')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)

  // Vérifier si l'utilisateur est une entreprise (seules les entreprises peuvent gérer des publicités)
  const isEnterprise = session?.user?.role === 'ADMIN'
  
  // Redirection si l'utilisateur n'est pas une entreprise
  useEffect(() => {
    if (session && !isEnterprise) {
      alert('❌ La gestion des publicités est réservée aux entreprises uniquement.\n\nLes clients particuliers n\'ont pas accès à cette fonctionnalité.')
      window.location.href = '/dashboard'
    }
  }, [session, isEnterprise])

  // Mock data - à remplacer par des données réelles
  const mockCampaigns: AdCampaign[] = [
    {
      id: '1',
      companyId: 'comp1',
      name: 'Campagne Logistique Express',
      advertisements: [],
      totalBudget: 500000,
      totalSpent: 125000,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      createdAt: '2024-01-10'
    }
  ]

  const mockAds: Advertisement[] = [
    {
      id: '1',
      companyId: 'comp1',
      companyName: 'Express Logistics',
      title: 'Transport Express Chine-Afrique',
      description: 'Livraison rapide et sécurisée de vos colis',
      imageUrl: '/api/placeholder/728/90',
      targetUrl: 'https://express-logistics.com',
      position: 'header',
      dimensions: { width: 728, height: 90 },
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      budget: 250000,
      spent: 62500,
      clicks: 1250,
      impressions: 25000,
      ctr: 5.0,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      companyId: 'comp1',
      companyName: 'Cargo Solutions',
      title: 'Solutions Cargo Professionnelles',
      description: 'Expertise en transport international',
      imageUrl: '/api/placeholder/300/250',
      targetUrl: 'https://cargo-solutions.com',
      position: 'sidebar',
      dimensions: { width: 300, height: 250 },
      status: 'pending',
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      budget: 150000,
      spent: 0,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    }
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paused: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Publicités
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos campagnes publicitaires et espaces de diffusion
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campagnes Actives</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(500000)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">25,000</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CTR Moyen</p>
                <p className="text-2xl font-bold text-gray-900">5.0%</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'campaigns', label: 'Campagnes', icon: Target },
                { id: 'ads', label: 'Publicités', icon: ImageIcon },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Onglet Campagnes */}
            {activeTab === 'campaigns' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Mes Campagnes</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Campagne
                  </button>
                </div>

                <div className="grid gap-6">
                  {mockCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <p className="text-gray-600">
                            Du {new Date(campaign.startDate).toLocaleDateString()} au {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(campaign.status)}`}>
                          {campaign.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Budget Total</p>
                          <p className="font-semibold">{formatCurrency(campaign.totalBudget)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dépensé</p>
                          <p className="font-semibold">{formatCurrency(campaign.totalSpent)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Restant</p>
                          <p className="font-semibold">{formatCurrency(campaign.totalBudget - campaign.totalSpent)}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Publicités */}
            {activeTab === 'ads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Mes Publicités</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Publicité
                  </button>
                </div>

                <div className="grid gap-6">
                  {mockAds.map((ad) => (
                    <div key={ad.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex gap-6">
                        {/* Aperçu de la publicité */}
                        <div className="flex-shrink-0">
                          <AdBanner advertisement={ad} className="scale-50 origin-top-left" />
                        </div>

                        {/* Informations */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{ad.title}</h3>
                              <p className="text-gray-600">{ad.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Position: {ad.position} • {ad.dimensions.width}x{ad.dimensions.height}px
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(ad.status)}`}>
                              {ad.status === 'active' ? 'Active' : ad.status === 'pending' ? 'En attente' : ad.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Budget</p>
                              <p className="font-semibold">{formatCurrency(ad.budget)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Impressions</p>
                              <p className="font-semibold">{ad.impressions.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Clics</p>
                              <p className="font-semibold">{ad.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">CTR</p>
                              <p className="font-semibold">{ad.ctr}%</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <a
                              href={ad.targetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {ad.targetUrl}
                            </a>

                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-yellow-600 transition-colors">
                                <Pause className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Analytics */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Analytics & Performance</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Graphique des impressions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Impressions par jour</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Graphique des impressions (à implémenter)
                    </div>
                  </div>

                  {/* Graphique des clics */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Clics par jour</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Graphique des clics (à implémenter)
                    </div>
                  </div>

                  {/* Top publicités */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Publicités</h3>
                    <div className="space-y-3">
                      {mockAds.slice(0, 3).map((ad, index) => (
                        <div key={ad.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                            <span className="font-medium">{ad.title}</span>
                          </div>
                          <span className="text-sm text-gray-600">{ad.ctr}% CTR</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dépenses */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Dépenses du mois</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(125000)}
                    </div>
                    <p className="text-sm text-green-600">+12% par rapport au mois dernier</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
