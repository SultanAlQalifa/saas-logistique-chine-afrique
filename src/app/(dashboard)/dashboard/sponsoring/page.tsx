'use client'

import { useState, useEffect } from 'react'
import { SponsoringBanner, SponsoringPackage, SponsoringStats } from '@/types/sponsoring'
import { 
  Plus, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Calendar,
  Target,
  DollarSign,
  BarChart3,
  Settings,
  Play,
  Pause,
  Edit
} from 'lucide-react'
import { SponsoringBannerList } from '@/components/sponsoring/SponsoringBanner'

export default function SponsoringPage() {
  const [banners, setBanners] = useState<SponsoringBanner[]>([])
  const [packages, setPackages] = useState<SponsoringPackage[]>([])
  const [stats, setStats] = useState<SponsoringStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'banners' | 'packages' | 'stats'>('banners')

  // Mock data
  useEffect(() => {
    const mockBanners: SponsoringBanner[] = [
      {
        id: '1',
        companyId: 'company-1',
        title: 'Départ Shanghai → Douala - 15 Mars',
        description: 'Espace disponible dans notre prochain cargo. Tarifs préférentiels pour réservation avant le 10 Mars.',
        imageUrl: '/images/cargo-ship.jpg',
        ctaText: 'Réserver maintenant',
        ctaUrl: 'https://example.com/booking',
        type: 'DEPARTURE_ANNOUNCEMENT',
        priority: 'HIGH',
        targetAudience: 'CLIENTS',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-15'),
        isActive: true,
        budget: 500,
        clickCount: 45,
        impressionCount: 1200,
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2024-03-01')
      },
      {
        id: '2',
        companyId: 'company-1',
        title: 'Offre Spéciale Transport Express',
        description: '30% de réduction sur tous les envois express vers l\'Afrique de l\'Ouest. Offre limitée.',
        imageUrl: '/images/express-delivery.jpg',
        ctaText: 'Profiter de l\'offre',
        type: 'OFFER',
        priority: 'MEDIUM',
        targetAudience: 'ALL',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31'),
        isActive: true,
        budget: 300,
        clickCount: 28,
        impressionCount: 800,
        createdAt: new Date('2024-02-25'),
        updatedAt: new Date('2024-03-01')
      }
    ]

    const mockPackages: SponsoringPackage[] = [
      {
        id: '1',
        name: 'Pack Basique',
        description: 'Idéal pour les petites annonces',
        price: 50,
        duration: 7,
        features: ['1 bannière active', 'Ciblage basique', 'Statistiques simples'],
        bannerSlots: 1,
        priorityLevel: 'LOW',
        targetReach: 1000,
        isActive: true
      },
      {
        id: '2',
        name: 'Pack Premium',
        description: 'Pour une visibilité maximale',
        price: 200,
        duration: 30,
        features: ['3 bannières actives', 'Ciblage avancé', 'Statistiques détaillées', 'Support prioritaire'],
        bannerSlots: 3,
        priorityLevel: 'HIGH',
        targetReach: 5000,
        isActive: true
      },
      {
        id: '3',
        name: 'Pack Entreprise',
        description: 'Solution complète pour grandes entreprises',
        price: 500,
        duration: 90,
        features: ['10 bannières actives', 'Ciblage personnalisé', 'Analytics avancés', 'Gestionnaire dédié'],
        bannerSlots: 10,
        priorityLevel: 'URGENT',
        targetReach: 15000,
        isActive: true
      }
    ]

    const mockStats: SponsoringStats = {
      totalImpressions: 2000,
      totalClicks: 73,
      clickThroughRate: 3.65,
      totalSpent: 800,
      averageCostPerClick: 10.96,
      topPerformingBanner: mockBanners[0],
      recentActivity: [
        { date: new Date('2024-03-01'), impressions: 300, clicks: 12, spent: 120 },
        { date: new Date('2024-02-29'), impressions: 250, clicks: 8, spent: 80 },
        { date: new Date('2024-02-28'), impressions: 400, clicks: 15, spent: 150 }
      ]
    }

    setBanners(mockBanners)
    setPackages(mockPackages)
    setStats(mockStats)
    setLoading(false)
  }, [])

  const handleBannerAction = (bannerId: string, action: 'click' | 'impression') => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId 
        ? { 
            ...banner, 
            clickCount: action === 'click' ? banner.clickCount + 1 : banner.clickCount,
            impressionCount: action === 'impression' ? banner.impressionCount + 1 : banner.impressionCount
          }
        : banner
    ))
  }

  const toggleBannerStatus = (bannerId: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId 
        ? { ...banner, isActive: !banner.isActive }
        : banner
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Sponsoring</h1>
          <p className="text-gray-600">Créez et gérez vos bannières publicitaires</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Bannière
        </button>
      </div>

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImpressions.toLocaleString('fr-FR')}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clics</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
              </div>
              <MousePointer className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Clic</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clickThroughRate.toFixed(2)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilisé</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSpent}€</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'banners', label: 'Mes Bannières', icon: Target },
            { id: 'packages', label: 'Packs Sponsoring', icon: DollarSign },
            { id: 'stats', label: 'Statistiques', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          {/* Liste des bannières */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Mes Bannières Actives ({banners.filter(b => b.isActive).length})
              </h3>
            </div>
            
            <div className="p-6">
              {banners.length > 0 ? (
                <div className="space-y-4">
                  {banners.map(banner => (
                    <div key={banner.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{banner.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{banner.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Type: {banner.type}</span>
                            <span>Priorité: {banner.priority}</span>
                            <span>Budget: {banner.budget}€</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleBannerStatus(banner.id)}
                            className={`p-2 rounded-lg ${
                              banner.isActive 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {banner.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                            <Settings className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-gray-600">Impressions</span>
                          <p className="font-semibold">{banner.impressionCount}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-gray-600">Clics</span>
                          <p className="font-semibold">{banner.clickCount}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <span className="text-gray-600">CTR</span>
                          <p className="font-semibold">
                            {banner.impressionCount > 0 
                              ? ((banner.clickCount / banner.impressionCount) * 100).toFixed(2)
                              : 0}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune bannière</h3>
                  <p className="text-gray-600 mb-4">Créez votre première bannière publicitaire</p>
                  <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                    Créer une bannière
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Aperçu des bannières */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Aperçu des Bannières</h3>
            </div>
            <div className="p-6">
              <SponsoringBannerList 
                banners={banners.filter(b => b.isActive)} 
                onBannerAction={handleBannerAction}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="text-gray-600 mt-2">{pkg.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-orange-600">{pkg.price}€</span>
                  <span className="text-gray-600">/{pkg.duration} jours</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                Choisir ce pack
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance des Bannières</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bannière la plus performante</h4>
                {stats.topPerformingBanner && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{stats.topPerformingBanner.title}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Impressions:</span>
                        <span className="ml-2 font-medium">{stats.topPerformingBanner.impressionCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Clics:</span>
                        <span className="ml-2 font-medium">{stats.topPerformingBanner.clickCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Activité récente</h4>
                <div className="space-y-2">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {activity.date.toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex gap-4">
                        <span>{activity.impressions} vues</span>
                        <span>{activity.clicks} clics</span>
                        <span className="font-medium">{activity.spent}€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
