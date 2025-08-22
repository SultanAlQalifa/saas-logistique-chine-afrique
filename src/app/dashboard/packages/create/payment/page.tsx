'use client'

import React, { useState, Suspense } from 'react'
import { ArrowLeft, Package, CreditCard, Calendar, CheckCircle, AlertCircle, MapPin } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface PaymentOption {
  id: string
  name: string
  description: string
  amount: number
  timing: string
  icon: React.ReactNode
}

function PackagePaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  // Récupération des données du colis depuis les paramètres URL
  const packageData = {
    origin: searchParams.get('origin') || 'Chine',
    destination: searchParams.get('destination') || 'Côte d\'Ivoire',
    weight: parseFloat(searchParams.get('weight') || '5'),
    dimensions: searchParams.get('dimensions') || '30x20x15 cm',
    totalAmount: parseFloat(searchParams.get('amount') || '85000')
  }

  // Vérifier si l'utilisateur est un client particulier
  const isIndividualClient = session?.user?.role === 'CLIENT'

  // Options de paiement selon le type d'utilisateur
  const paymentOptions: PaymentOption[] = isIndividualClient ? [
    {
      id: 'full_payment',
      name: 'Paiement Intégral',
      description: 'Payez la totalité maintenant',
      amount: packageData.totalAmount,
      timing: 'Immédiat',
      icon: <CreditCard className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'split_payment',
      name: 'Paiement en 2 Tranches',
      description: 'Dépôt maintenant + Solde à la récupération',
      amount: packageData.totalAmount * 0.6, // 60% au dépôt
      timing: '60% maintenant, 40% à la livraison',
      icon: <Package className="w-6 h-6 text-green-600" />
    }
  ] : [
    {
      id: 'full_payment',
      name: 'Paiement Intégral',
      description: 'Paiement unique pour les entreprises',
      amount: packageData.totalAmount,
      timing: 'Immédiat',
      icon: <CreditCard className="w-6 h-6 text-blue-600" />
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handlePaymentSubmit = () => {
    if (!selectedOption) {
      alert('Veuillez sélectionner une option de paiement')
      return
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const selectedPayment = paymentOptions.find(opt => opt.id === selectedOption)
    
    if (selectedOption === 'split_payment') {
      alert(`✅ Paiement en 2 tranches configuré !\n\nDépôt: ${formatCurrency(selectedPayment?.amount || 0)}\nSolde à la récupération: ${formatCurrency(packageData.totalAmount * 0.4)}\n\nVotre colis sera traité dès réception du dépôt.`)
    } else {
      alert(`✅ Paiement intégral de ${formatCurrency(packageData.totalAmount)} confirmé !\n\nVotre colis sera traité immédiatement.`)
    }
    
    router.push('/dashboard/packages')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-blue-600" />
            Options de Paiement
          </h1>
          <p className="text-gray-600 mt-2">
            {isIndividualClient 
              ? 'Choisissez votre mode de paiement : intégral ou en 2 tranches'
              : 'Paiement intégral requis pour les entreprises'
            }
          </p>
        </div>

        {/* Résumé du colis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Résumé de votre envoi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <MapPin className="w-5 h-5 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">Trajet</p>
              <p className="font-semibold">{packageData.origin} → {packageData.destination}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Package className="w-5 h-5 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">Poids</p>
              <p className="font-semibold">{packageData.weight} kg</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Package className="w-5 h-5 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-gray-600">Dimensions</p>
              <p className="font-semibold">{packageData.dimensions}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <CreditCard className="w-5 h-5 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold text-lg">{formatCurrency(packageData.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Options de paiement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedOption === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center mb-4">
                {option.icon}
                <h3 className="text-xl font-bold text-gray-900 ml-3">{option.name}</h3>
              </div>

              <p className="text-gray-600 mb-4">{option.description}</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Montant à payer maintenant:</span>
                  <span className="font-bold text-lg text-blue-600">{formatCurrency(option.amount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Calendrier:</span>
                  <span className="font-medium text-gray-900">{option.timing}</span>
                </div>

                {option.id === 'split_payment' && (
                  <div className="bg-green-50 p-3 rounded-lg mt-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-700">Solde à la récupération:</span>
                      <span className="font-semibold text-green-800">
                        {formatCurrency(packageData.totalAmount * 0.4)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedOption === option.id && (
                <div className="mt-4 flex items-center justify-center text-blue-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Option sélectionnée</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informations client */}
        {selectedOption && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold mb-4">Informations de facturation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+225 XX XX XX XX"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse de livraison
                </label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète de livraison"
                />
              </div>
            </div>
          </div>
        )}

        {/* Informations importantes */}
        {selectedOption === 'split_payment' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Paiement en 2 tranches</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• <strong>1ère tranche (60%)</strong> : Payée maintenant pour traitement du colis</li>
                  <li>• <strong>2ème tranche (40%)</strong> : Payée à la récupération du colis</li>
                  <li>• Le colis ne sera remis qu'après paiement du solde</li>
                  <li>• Notification SMS/Email envoyée avant l'arrivée du colis</li>
                  <li>• Délai de grâce de 7 jours pour la récupération</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retour
          </button>
          
          {selectedOption && (
            <button
              onClick={handlePaymentSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all flex items-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {selectedOption === 'split_payment' ? 'Payer le Dépôt' : 'Payer Maintenant'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PackagePaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des options de paiement...</p>
      </div>
    </div>}>
      <PackagePaymentContent />
    </Suspense>
  )
}
