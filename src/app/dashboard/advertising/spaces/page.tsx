'use client'

import React, { useState } from 'react'
import { CreditCard, Calendar, Target, Eye, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Settings, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdSpace, AD_DIMENSIONS } from '@/types/advertising'
import { AdPlaceholder } from '@/components/advertising/AdBanner'
import PaymentModal from '@/components/advertising/PaymentModal'
import { useSession } from 'next-auth/react'

export default function AdvertisingSpacesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedSpace, setSelectedSpace] = useState<AdSpace | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [bookingDuration, setBookingDuration] = useState<'day' | 'week' | 'month'>('week')

  // Vérifier si l'utilisateur est une entreprise (seules les entreprises peuvent accéder aux espaces publicitaires)
  const isEnterprise = session?.user?.role === 'ADMIN'
  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'
  
  // Redirection si l'utilisateur n'est pas une entreprise
  React.useEffect(() => {
    if (session && !isEnterprise) {
      alert('❌ Les espaces publicitaires sont réservés aux entreprises uniquement.\n\nLes clients particuliers n\'ont pas accès à cette fonctionnalité.')
      window.location.href = '/dashboard'
    }
  }, [session, isEnterprise])

  // Mock data des espaces publicitaires disponibles
  const adSpaces: AdSpace[] = [
    {
      id: 'header-banner',
      name: 'Bannière Header',
      position: 'header',
      dimensions: AD_DIMENSIONS.HEADER_BANNER,
      pricePerDay: 15000,
      pricePerWeek: 90000,
      pricePerMonth: 300000,
      currency: 'XOF',
      maxAds: 1,
      active: true,
      description: 'Bannière principale en haut de toutes les pages. Visibilité maximale garantie.'
    },
    {
      id: 'sidebar-banner',
      name: 'Bannière Sidebar',
      position: 'sidebar',
      dimensions: AD_DIMENSIONS.SIDEBAR_BANNER,
      pricePerDay: 8000,
      pricePerWeek: 48000,
      pricePerMonth: 160000,
      currency: 'XOF',
      maxAds: 2,
      active: true,
      description: 'Bannière latérale visible sur le dashboard et les pages principales.'
    },
    {
      id: 'footer-banner',
      name: 'Bannière Footer',
      position: 'footer',
      dimensions: AD_DIMENSIONS.FOOTER_BANNER,
      pricePerDay: 5000,
      pricePerWeek: 30000,
      pricePerMonth: 100000,
      currency: 'XOF',
      maxAds: 1,
      active: true,
      description: 'Bannière en bas de page, idéale pour les liens et contacts.'
    },
    {
      id: 'dashboard-card',
      name: 'Carte Dashboard',
      position: 'dashboard',
      dimensions: AD_DIMENSIONS.DASHBOARD_CARD,
      pricePerDay: 12000,
      pricePerWeek: 72000,
      pricePerMonth: 240000,
      currency: 'XOF',
      maxAds: 3,
      active: true,
      description: 'Carte publicitaire intégrée dans le dashboard utilisateur.'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getPrice = (space: AdSpace, duration: 'day' | 'week' | 'month') => {
    switch (duration) {
      case 'day': return space.pricePerDay
      case 'week': return space.pricePerWeek
      case 'month': return space.pricePerMonth
      default: return space.pricePerWeek
    }
  }

  const getDurationLabel = (duration: 'day' | 'week' | 'month') => {
    switch (duration) {
      case 'day': return 'jour'
      case 'week': return 'semaine'
      case 'month': return 'mois'
      default: return 'semaine'
    }
  }

  const handleBookSpace = (space: AdSpace) => {
    setSelectedSpace(space)
    setShowBookingModal(true)
  }

  const confirmBooking = () => {
    if (!selectedSpace) return
    
    setShowBookingModal(false)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Paiement réussi:', paymentId)
    setShowPaymentModal(false)
    setSelectedSpace(null)
    // Ici on pourrait rediriger vers la page de gestion des publicités
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Espaces Publicitaires
                </h1>
                <p className="text-gray-600 mt-2">
                  Réservez votre espace publicitaire et augmentez votre visibilité
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => router.push('/dashboard/advertising/config')}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configuration
              </button>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Espaces Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{adSpaces.filter(s => s.active).length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prix à partir de</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(5000)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Visibilité Max</p>
                <p className="text-2xl font-bold text-gray-900">100%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Réservation</p>
                <p className="text-2xl font-bold text-gray-900">Instant</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des espaces publicitaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {adSpaces.map((space) => (
            <div key={space.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header de la carte */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{space.name}</h3>
                    <p className="text-gray-600 mt-1">{space.description}</p>
                  </div>
                  {space.active ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Disponible
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <XCircle className="w-3 h-3 mr-1" />
                      Indisponible
                    </span>
                  )}
                </div>

                {/* Informations techniques */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="ml-2 font-medium">{space.dimensions.width}x{space.dimensions.height}px</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Position:</span>
                    <span className="ml-2 font-medium capitalize">{space.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Max publicités:</span>
                    <span className="ml-2 font-medium">{space.maxAds}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <span className="ml-2 font-medium">JPG, PNG, GIF</span>
                  </div>
                </div>
              </div>

              {/* Aperçu de l'espace */}
              <div className="p-6 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Aperçu de l'espace</h4>
                <div className="flex justify-center">
                  <AdPlaceholder position={space.position} />
                </div>
              </div>

              {/* Tarification */}
              <div className="p-6 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tarification</h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Par jour</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(space.pricePerDay)}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="text-xs text-blue-600">Par semaine</p>
                    <p className="text-lg font-bold text-blue-900">{formatCurrency(space.pricePerWeek)}</p>
                    <p className="text-xs text-green-600">-14% économie</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-xs text-green-600">Par mois</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(space.pricePerMonth)}</p>
                    <p className="text-xs text-green-600">-33% économie</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBookSpace(space)}
                  disabled={!space.active}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                    space.active
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {space.active ? 'Réserver cet espace' : 'Indisponible'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Avantages */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Pourquoi choisir nos espaces publicitaires ?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ciblage Précis</h3>
              <p className="text-gray-600">Atteignez directement les professionnels de la logistique Chine-Afrique</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visibilité Maximale</h3>
              <p className="text-gray-600">Vos publicités sont vues par des milliers d'utilisateurs actifs chaque jour</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Résultats Garantis</h3>
              <p className="text-gray-600">Suivi en temps réel des performances avec analytics détaillés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de réservation */}
      {showBookingModal && selectedSpace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Réserver {selectedSpace.name}</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Durée de la réservation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['day', 'week', 'month'] as const).map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setBookingDuration(duration)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      bookingDuration === duration
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <p className="text-xs">1 {getDurationLabel(duration)}</p>
                    <p className="font-bold">{formatCurrency(getPrice(selectedSpace, duration))}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total à payer:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(getPrice(selectedSpace, bookingDuration))}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowBookingModal(false)
                  setShowPaymentModal(true)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Payer maintenant
              </button>
              
              {session?.user?.role === 'CLIENT' && (
                <button
                  onClick={() => window.location.href = '/dashboard/advertising/spaces/installment'}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-6 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center text-sm"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Paiement en plusieurs fois
                </button>
              )}
              
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedSpace ? getPrice(selectedSpace, bookingDuration) : 0}
        duration={bookingDuration === 'day' ? 1 : bookingDuration === 'week' ? 7 : 30}
        spaceName={selectedSpace?.name || ''}
        advertisementId={`ad_${Date.now()}`}
        companyId="current_company_id"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
