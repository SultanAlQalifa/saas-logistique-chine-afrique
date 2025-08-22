'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { X, Package, MapPin, Calendar, DollarSign, CreditCard, Banknote, HandCoins, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

interface OrderAcceptanceModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: string
    trackingNumber: string
    clientName: string
    clientEmail: string
    clientPhone: string
    description: string
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    origin: {
      country: string
      city: string
      address: string
    }
    destination: {
      country: string
      city: string
      address: string
    }
    estimatedPrice: number
    requestedDate: string
    urgency: 'standard' | 'express' | 'urgent'
    specialInstructions?: string
  }
  onAccept: (acceptanceData: {
    finalPrice: number
    estimatedDelivery: string
    paymentMethod: 'online' | 'cash_upfront' | 'cash_on_delivery'
    notes?: string
  }) => void
  onReject: (reason: string) => void
}

export default function OrderAcceptanceModal({
  isOpen,
  onClose,
  order,
  onAccept,
  onReject
}: OrderAcceptanceModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<'review' | 'pricing' | 'payment' | 'confirmation'>('review')
  const [finalPrice, setFinalPrice] = useState(order.estimatedPrice)
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash_upfront' | 'cash_on_delivery'>('online')
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejection, setShowRejection] = useState(false)

  if (!isOpen) return null

  const handleAccept = () => {
    onAccept({
      finalPrice,
      estimatedDelivery,
      paymentMethod,
      notes: notes.trim() || undefined
    })
    onClose()
  }

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason.trim())
      onClose()
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-50'
      case 'express': return 'text-orange-600 bg-orange-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '🚨 Urgent'
      case 'express': return '⚡ Express'
      default: return '📦 Standard'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📦 Acceptation de Commande</h2>
              <p className="text-blue-100 mt-1">#{order.trackingNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {!showRejection ? (
          <>
            {/* Steps Indicator */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                {['review', 'pricing', 'payment', 'confirmation'].map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === stepName ? 'bg-blue-600 text-white' : 
                      ['review', 'pricing', 'payment', 'confirmation'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {['review', 'pricing', 'payment', 'confirmation'].indexOf(step) > index ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        ['review', 'pricing', 'payment', 'confirmation'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {step === 'review' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Client Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        👤 Informations Client
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nom:</span> {order.clientName}</p>
                        <p><span className="font-medium">Email:</span> {order.clientEmail}</p>
                        <p><span className="font-medium">Téléphone:</span> {order.clientPhone}</p>
                      </div>
                    </div>

                    {/* Package Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Détails du Colis
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Description:</span> {order.description}</p>
                        <p><span className="font-medium">Poids:</span> {order.weight} kg</p>
                        <p><span className="font-medium">Dimensions:</span> {order.dimensions.length} × {order.dimensions.width} × {order.dimensions.height} cm</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(order.urgency)}`}>
                          {getUrgencyText(order.urgency)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Itinéraire
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-green-700 mb-1">🚀 Origine</p>
                        <p>{order.origin.city}, {order.origin.country}</p>
                        <p className="text-gray-600">{order.origin.address}</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-700 mb-1">🎯 Destination</p>
                        <p>{order.destination.city}, {order.destination.country}</p>
                        <p className="text-gray-600">{order.destination.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Instructions Spéciales
                      </h3>
                      <p className="text-sm text-gray-700">{order.specialInstructions}</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setShowRejection(true)}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      ❌ Refuser
                    </button>
                    <button
                      onClick={() => setStep('pricing')}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Continuer ➡️
                    </button>
                  </div>
                </div>
              )}

              {step === 'pricing' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      💰 Tarification Finale
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix Estimé Initial
                        </label>
                        <p className="text-lg text-gray-600">{order.estimatedPrice.toLocaleString('fr-FR')} FCFA</p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prix Final Proposé *
                        </label>
                        <input
                          type="number"
                          value={finalPrice}
                          onChange={(e) => setFinalPrice(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Prix en FCFA"
                        />
                      </div>

                      <div className="bg-white rounded-lg p-4 border">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de Livraison Estimée *
                        </label>
                        <input
                          type="date"
                          value={estimatedDelivery}
                          onChange={(e) => setEstimatedDelivery(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="bg-white rounded-lg p-4 border">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes Additionnelles
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Conditions spéciales, remarques..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep('review')}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      ⬅️ Retour
                    </button>
                    <button
                      onClick={() => setStep('payment')}
                      disabled={!finalPrice || !estimatedDelivery}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuer ➡️
                    </button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      💳 Options de Paiement
                    </h3>
                    
                    <div className="space-y-4">
                      <div 
                        onClick={() => setPaymentMethod('online')}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">💻 Paiement en Ligne</h4>
                              <p className="text-sm text-gray-600">Carte bancaire, Mobile Money, virement</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === 'online' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                          }`} />
                        </div>
                      </div>

                      <div 
                        onClick={() => setPaymentMethod('cash_upfront')}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === 'cash_upfront' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <Banknote className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">💵 Cash à l'Avance</h4>
                              <p className="text-sm text-gray-600">Paiement comptant avant expédition</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === 'cash_upfront' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`} />
                        </div>
                      </div>

                      <div 
                        onClick={() => setPaymentMethod('cash_on_delivery')}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === 'cash_on_delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                              <HandCoins className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">📦 Paiement à la Réception</h4>
                              <p className="text-sm text-gray-600">Cash contre remise du colis</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === 'cash_on_delivery' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep('pricing')}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      ⬅️ Retour
                    </button>
                    <button
                      onClick={() => setStep('confirmation')}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Continuer ➡️
                    </button>
                  </div>
                </div>
              )}

              {step === 'confirmation' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      ✅ Récapitulatif de l'Acceptation
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Commande</p>
                            <p className="font-medium">#{order.trackingNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Client</p>
                            <p className="font-medium">{order.clientName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prix Final</p>
                            <p className="font-medium text-green-600">{finalPrice.toLocaleString('fr-FR')} FCFA</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Livraison Estimée</p>
                            <p className="font-medium">{new Date(estimatedDelivery).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Mode de Paiement</p>
                            <p className="font-medium">
                              {paymentMethod === 'online' && '💻 Paiement en Ligne'}
                              {paymentMethod === 'cash_upfront' && '💵 Cash à l\'Avance'}
                              {paymentMethod === 'cash_on_delivery' && '📦 Paiement à la Réception'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {notes && (
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <p className="text-sm text-gray-600 mb-1">Notes</p>
                          <p className="text-sm">{notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep('payment')}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      ⬅️ Retour
                    </button>
                    <button
                      onClick={handleAccept}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                    >
                      ✅ Accepter la Commande
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <X className="w-5 h-5 mr-2" />
                ❌ Refus de Commande
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison du Refus *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                    placeholder="Expliquez pourquoi vous refusez cette commande..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowRejection(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ⬅️ Retour
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ❌ Confirmer le Refus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
