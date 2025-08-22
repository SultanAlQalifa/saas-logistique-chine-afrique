'use client'

import React, { useState } from 'react'
import { Image, Plus, Edit, Trash2, Eye, DollarSign, Ruler, Calendar, Save, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface BannerType {
  id: string
  name: string
  width: number
  height: number
  position: string
  basePrice: number
  description: string
  maxFileSize: number
  formats: string[]
  isActive: boolean
}

interface Banner {
  id: string
  title: string
  typeId: string
  imageUrl: string
  targetUrl: string
  startDate: string
  endDate: string
  price: number
  status: 'active' | 'pending' | 'expired' | 'draft'
  clicks: number
  impressions: number
  ctr: number
}

export default function BannerManagementPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  // Vérifier si l'utilisateur est une entreprise
  const isEnterprise = session?.user?.role === 'ADMIN'
  
  if (!isEnterprise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Accès Restreint</h1>
          <p className="text-gray-600 mb-4">La gestion des bannières est réservée aux entreprises uniquement.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    )
  }

  const [activeTab, setActiveTab] = useState<'types' | 'banners'>('types')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Types de bannières disponibles
  const [bannerTypes, setBannerTypes] = useState<BannerType[]>([
    {
      id: '1',
      name: 'Header Principal',
      width: 1200,
      height: 200,
      position: 'Header',
      basePrice: 50000,
      description: 'Bannière principale en haut de page',
      maxFileSize: 2,
      formats: ['JPG', 'PNG', 'GIF'],
      isActive: true
    },
    {
      id: '2',
      name: 'Sidebar Droite',
      width: 300,
      height: 600,
      position: 'Sidebar',
      basePrice: 30000,
      description: 'Bannière verticale dans la sidebar',
      maxFileSize: 1.5,
      formats: ['JPG', 'PNG'],
      isActive: true
    },
    {
      id: '3',
      name: 'Footer Large',
      width: 1000,
      height: 150,
      position: 'Footer',
      basePrice: 25000,
      description: 'Bannière dans le pied de page',
      maxFileSize: 1,
      formats: ['JPG', 'PNG'],
      isActive: true
    },
    {
      id: '4',
      name: 'Mobile Banner',
      width: 320,
      height: 100,
      position: 'Mobile',
      basePrice: 20000,
      description: 'Bannière optimisée mobile',
      maxFileSize: 0.5,
      formats: ['JPG', 'PNG'],
      isActive: true
    },
    {
      id: '5',
      name: 'Popup Interstitiel',
      width: 800,
      height: 600,
      position: 'Popup',
      basePrice: 75000,
      description: 'Popup plein écran haute visibilité',
      maxFileSize: 3,
      formats: ['JPG', 'PNG', 'GIF'],
      isActive: true
    }
  ])

  // Bannières existantes
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Promotion Électronique',
      typeId: '1',
      imageUrl: '/banners/promo-electronics.jpg',
      targetUrl: 'https://example.com/electronics',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      price: 50000,
      status: 'active',
      clicks: 1250,
      impressions: 45000,
      ctr: 2.78
    },
    {
      id: '2',
      title: 'Vente Flash Mode',
      typeId: '2',
      imageUrl: '/banners/flash-sale.jpg',
      targetUrl: 'https://example.com/fashion',
      startDate: '2024-01-20',
      endDate: '2024-01-30',
      price: 30000,
      status: 'active',
      clicks: 890,
      impressions: 28000,
      ctr: 3.18
    }
  ])

  const getBannerTypeName = (typeId: string) => {
    const type = bannerTypes.find(t => t.id === typeId)
    return type ? type.name : 'Type inconnu'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'pending': return 'En attente'
      case 'expired': return 'Expirée'
      case 'draft': return 'Brouillon'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-purple-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <Image className="w-8 h-8 mr-3 text-purple-600" />
            Gestion des Bannières Publicitaires
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos bannières publicitaires et les formats disponibles
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('types')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'types'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Ruler className="w-4 h-4 inline mr-2" />
            Types de Bannières
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'banners'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Image className="w-4 h-4 inline mr-2" />
            Mes Bannières
          </button>
        </div>

        {/* Types de bannières */}
        {activeTab === 'types' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Formats Disponibles</h2>
              <div className="text-sm text-gray-600">
                Tarifs basés sur la position et les dimensions
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bannerTypes.map((type) => (
                <div key={type.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      type.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {type.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dimensions</span>
                      <span className="font-medium">{type.width} × {type.height}px</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Position</span>
                      <span className="font-medium">{type.position}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Prix de base</span>
                      <span className="font-bold text-purple-600">{type.basePrice.toLocaleString()} FCFA</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Taille max</span>
                      <span className="font-medium">{type.maxFileSize} MB</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Formats: </span>
                      <span className="font-medium">{type.formats.join(', ')}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                    Créer une Bannière
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mes bannières */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mes Bannières Actives</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Bannière
              </button>
            </div>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bannières</p>
                    <p className="text-2xl font-bold text-purple-600">{banners.length}</p>
                  </div>
                  <Image className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {banners.reduce((sum, b) => sum + b.impressions, 0).toLocaleString()}
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clics Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      {banners.reduce((sum, b) => sum + b.clicks, 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">CTR Moyen</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {(banners.reduce((sum, b) => sum + b.ctr, 0) / banners.length).toFixed(2)}%
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Liste des bannières */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bannière
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {banners.map((banner) => (
                      <tr key={banner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-16 bg-gray-200 rounded flex-shrink-0 mr-4">
                              <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded flex items-center justify-center">
                                <Image className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                              <div className="text-sm text-gray-500">ID: {banner.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getBannerTypeName(banner.typeId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{new Date(banner.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">→ {new Date(banner.endDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(banner.status)}`}>
                            {getStatusText(banner.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{banner.impressions.toLocaleString()} vues</div>
                          <div>{banner.clicks.toLocaleString()} clics ({banner.ctr}%)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                          {banner.price.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
