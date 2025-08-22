'use client'

import React, { useState } from 'react'
import { Eye, CheckCircle, XCircle, Pause, Play, Trash2, Edit, BarChart3, DollarSign, Target, Users } from 'lucide-react'
import { Advertisement, AdPayment } from '@/types/advertising'
import AdBanner from '@/components/advertising/AdBanner'

export default function AdminAdvertisingPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'payments' | 'analytics'>('pending')
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)

  // Mock data - à remplacer par des données réelles
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
      status: 'pending',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      budget: 250000,
      spent: 0,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      companyId: 'comp2',
      companyName: 'Cargo Solutions',
      title: 'Solutions Cargo Professionnelles',
      description: 'Expertise en transport international',
      imageUrl: '/api/placeholder/300/250',
      targetUrl: 'https://cargo-solutions.com',
      position: 'sidebar',
      dimensions: { width: 300, height: 250 },
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      budget: 150000,
      spent: 45000,
      clicks: 890,
      impressions: 15600,
      ctr: 5.7,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-20'
    }
  ]

  const mockPayments: AdPayment[] = [
    {
      id: 'pay_1',
      advertisementId: '1',
      companyId: 'comp1',
      amount: 250000,
      currency: 'XOF',
      duration: 30,
      paymentMethod: 'mobile_money',
      status: 'completed',
      transactionId: 'txn_123456',
      createdAt: '2024-01-10T10:00:00Z',
      paidAt: '2024-01-10T10:05:00Z'
    },
    {
      id: 'pay_2',
      advertisementId: '2',
      companyId: 'comp2',
      amount: 150000,
      currency: 'XOF',
      duration: 30,
      paymentMethod: 'card',
      status: 'completed',
      transactionId: 'txn_789012',
      createdAt: '2024-01-12T14:30:00Z',
      paidAt: '2024-01-12T14:32:00Z'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paused: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-red-100 text-red-800',
      approved: 'bg-blue-100 text-blue-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const handleApproveAd = (adId: string) => {
    console.log('Approuver la publicité:', adId)
    // Ici on mettrait à jour le statut en base
  }

  const handleRejectAd = (adId: string) => {
    console.log('Rejeter la publicité:', adId)
    // Ici on mettrait à jour le statut en base
  }

  const handlePauseAd = (adId: string) => {
    console.log('Mettre en pause la publicité:', adId)
  }

  const handleDeleteAd = (adId: string) => {
    console.log('Supprimer la publicité:', adId)
  }

  const pendingAds = mockAds.filter(ad => ad.status === 'pending')
  const activeAds = mockAds.filter(ad => ad.status === 'active')
  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalAds = mockAds.length
  const totalImpressions = mockAds.reduce((sum, ad) => sum + ad.impressions, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Administration des Publicités
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez et modérez les publicités de la plateforme
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Totaux</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Publicités Actives</p>
                <p className="text-2xl font-bold text-gray-900">{activeAds.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingAds.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'pending', label: 'En Attente', icon: Eye, count: pendingAds.length },
                { id: 'active', label: 'Actives', icon: Target, count: activeAds.length },
                { id: 'payments', label: 'Paiements', icon: DollarSign, count: mockPayments.length },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Onglet En Attente */}
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Publicités en Attente de Modération</h2>
                
                {pendingAds.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune publicité en attente</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingAds.map((ad) => (
                      <div key={ad.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex gap-6">
                          {/* Aperçu */}
                          <div className="flex-shrink-0">
                            <AdBanner advertisement={ad} className="scale-75 origin-top-left" />
                          </div>

                          {/* Informations */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold">{ad.title}</h3>
                                <p className="text-gray-600">{ad.description}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Par: {ad.companyName} • Position: {ad.position} • Budget: {formatCurrency(ad.budget)}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(ad.status)}`}>
                                En attente
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">Période</p>
                                <p className="font-medium">
                                  {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Dimensions</p>
                                <p className="font-medium">{ad.dimensions.width}x{ad.dimensions.height}px</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">URL Cible</p>
                                <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm">
                                  {ad.targetUrl}
                                </a>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => handleRejectAd(ad.id)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeter
                              </button>
                              <button
                                onClick={() => handleApproveAd(ad.id)}
                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approuver
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglet Actives */}
            {activeTab === 'active' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Publicités Actives</h2>
                
                <div className="space-y-6">
                  {activeAds.map((ad) => (
                    <div key={ad.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <AdBanner advertisement={ad} className="scale-75 origin-top-left" />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{ad.title}</h3>
                              <p className="text-gray-600">{ad.companyName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(ad.status)}`}>
                              Active
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-4">
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
                            <div>
                              <p className="text-sm text-gray-600">Dépensé</p>
                              <p className="font-semibold">{formatCurrency(ad.spent)}</p>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handlePauseAd(ad.id)}
                              className="p-2 text-gray-600 hover:text-yellow-600 transition-colors"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Paiements */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Historique des Paiements</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">ID Transaction</th>
                        <th className="text-left py-3 px-4">Entreprise</th>
                        <th className="text-left py-3 px-4">Montant</th>
                        <th className="text-left py-3 px-4">Méthode</th>
                        <th className="text-left py-3 px-4">Statut</th>
                        <th className="text-left py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPayments.map((payment) => {
                        const ad = mockAds.find(a => a.id === payment.advertisementId)
                        return (
                          <tr key={payment.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-mono text-sm">{payment.transactionId}</td>
                            <td className="py-3 px-4">{ad?.companyName}</td>
                            <td className="py-3 px-4 font-semibold">{formatCurrency(payment.amount)}</td>
                            <td className="py-3 px-4 capitalize">{payment.paymentMethod.replace('_', ' ')}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(payment.status)}`}>
                                {payment.status === 'completed' ? 'Complété' : payment.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Onglet Analytics */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Analytics Globales</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenus par Mois</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      Graphique des revenus (à implémenter)
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance par Position</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Header</span>
                        <span className="font-semibold">5.7% CTR</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Sidebar</span>
                        <span className="font-semibold">3.2% CTR</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Footer</span>
                        <span className="font-semibold">2.1% CTR</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Annonceurs</h3>
                    <div className="space-y-3">
                      {mockAds.slice(0, 5).map((ad, index) => (
                        <div key={ad.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                            <span>{ad.companyName}</span>
                          </div>
                          <span className="font-semibold">{formatCurrency(ad.budget)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Statistiques Générales</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Publicités:</span>
                        <span className="font-semibold">{totalAds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CTR Moyen:</span>
                        <span className="font-semibold">4.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenus ce Mois:</span>
                        <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
                      </div>
                    </div>
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
