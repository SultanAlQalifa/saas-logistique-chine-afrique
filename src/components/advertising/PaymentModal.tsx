'use client'

import React, { useState } from 'react'
import { X, CreditCard, Smartphone, Building, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { paymentService, PaymentMethod, PaymentRequest, PaymentResponse } from '@/lib/payment-service'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  duration: number
  spaceName: string
  advertisementId: string
  companyId: string
  onPaymentSuccess: (paymentId: string) => void
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  duration,
  spaceName,
  advertisementId,
  companyId,
  onPaymentSuccess
}: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success' | 'error'>('method')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const paymentMethods = paymentService.getPaymentMethods()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTotalAmount = () => {
    if (!selectedMethod) return amount
    return paymentService.calculateTotalAmount(amount, selectedMethod.id)
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setStep('details')
  }

  const handlePayment = async () => {
    if (!selectedMethod) return

    setLoading(true)
    setStep('processing')

    const request: PaymentRequest = {
      amount: getTotalAmount(),
      currency: 'XOF',
      advertisementId,
      companyId,
      duration,
      paymentMethod: selectedMethod.type,
      customerInfo
    }

    try {
      const response = await paymentService.initiatePayment(request)
      setPaymentResponse(response)

      if (response.success) {
        // Si c'est un paiement par carte avec URL, ouvrir dans un nouvel onglet
        if (response.paymentUrl && selectedMethod.type === 'card') {
          window.open(response.paymentUrl, '_blank')
        }
        
        // Simuler la vérification du paiement
        setTimeout(async () => {
          const status = await paymentService.checkPaymentStatus(response.paymentId)
          if (status.status === 'completed') {
            setStep('success')
            onPaymentSuccess(response.paymentId)
          } else {
            setStep('error')
          }
        }, 3000)
      } else {
        setStep('error')
      }
    } catch (error) {
      console.error('Erreur de paiement:', error)
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep('method')
    setSelectedMethod(null)
    setCustomerInfo({ name: '', email: '', phone: '' })
    setPaymentResponse(null)
    setLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Paiement Espace Publicitaire</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Résumé de la commande */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium mb-2">Résumé de la commande</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Espace:</span>
              <span>{spaceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Durée:</span>
              <span>{duration} jour{duration > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prix de base:</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            {selectedMethod && selectedMethod.fees > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Frais ({selectedMethod.fees}%):</span>
                <span>{formatCurrency(getTotalAmount() - amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(getTotalAmount())}</span>
            </div>
          </div>
        </div>

        {/* Contenu selon l'étape */}
        <div className="p-6">
          {/* Étape 1: Sélection de la méthode */}
          {step === 'method' && (
            <div>
              <h3 className="font-medium mb-4">Choisissez votre méthode de paiement</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    disabled={!method.available}
                    className={`w-full p-4 border rounded-lg text-left transition-all ${
                      method.available
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          {method.fees > 0 && (
                            <p className="text-sm text-gray-600">Frais: {method.fees}%</p>
                          )}
                        </div>
                      </div>
                      {method.type === 'card' && <CreditCard className="w-5 h-5 text-gray-400" />}
                      {method.type === 'mobile_money' && <Smartphone className="w-5 h-5 text-gray-400" />}
                      {method.type === 'bank_transfer' && <Building className="w-5 h-5 text-gray-400" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2: Détails du client */}
          {step === 'details' && selectedMethod && (
            <div>
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setStep('method')}
                  className="mr-3 p-1 hover:bg-gray-100 rounded"
                >
                  ←
                </button>
                <h3 className="font-medium">Informations de facturation</h3>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center">
                <span className="text-xl mr-3">{selectedMethod.icon}</span>
                <div>
                  <p className="font-medium">{selectedMethod.name}</p>
                  <p className="text-sm text-gray-600">Total: {formatCurrency(getTotalAmount())}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Procéder au paiement
              </button>
            </div>
          )}

          {/* Étape 3: Traitement */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-medium mb-2">Traitement du paiement...</h3>
              <p className="text-gray-600">
                {paymentResponse?.message || 'Veuillez patienter pendant le traitement de votre paiement.'}
              </p>
              {selectedMethod?.type === 'mobile_money' && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-yellow-800">
                    Composez le code USSD affiché sur votre téléphone pour confirmer le paiement.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Étape 4: Succès */}
          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Paiement réussi !</h3>
              <p className="text-gray-600 mb-4">
                Votre espace publicitaire a été réservé avec succès.
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-800">
                  ID de transaction: {paymentResponse?.transactionId}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Continuer
              </button>
            </div>
          )}

          {/* Étape 5: Erreur */}
          {step === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Erreur de paiement</h3>
              <p className="text-gray-600 mb-4">
                {paymentResponse?.message || 'Une erreur est survenue lors du traitement de votre paiement.'}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('method')}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Réessayer
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
