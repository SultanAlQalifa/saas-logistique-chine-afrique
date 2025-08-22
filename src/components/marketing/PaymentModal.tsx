'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Wallet, Building, Check, X, AlertCircle } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  operation: {
    type: 'campaign' | 'promotion' | 'sponsoring' | 'boost'
    name: string
    cost: number
    duration: number
    description: string
  }
}

export default function PaymentModal({ isOpen, onClose, onConfirm, operation }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'wallet' | 'invoice'>('wallet')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulation du paiement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    onConfirm()
    onClose()
  }

  const getOperationIcon = () => {
    switch (operation.type) {
      case 'campaign': return '📢'
      case 'promotion': return '🎁'
      case 'sponsoring': return '🤝'
      case 'boost': return '🚀'
      default: return '💼'
    }
  }

  const getOperationColor = () => {
    switch (operation.type) {
      case 'campaign': return 'bg-blue-100 text-blue-800'
      case 'promotion': return 'bg-green-100 text-green-800'
      case 'sponsoring': return 'bg-purple-100 text-purple-800'
      case 'boost': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <CreditCard className="h-6 w-6 mr-2 text-green-600" />
            Paiement Opération Marketing
          </DialogTitle>
          <DialogDescription>
            Confirmez le paiement pour lancer votre opération marketing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Détails de l'opération */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-2xl mr-2">{getOperationIcon()}</span>
                Détails de l'opération
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Type d'opération :</span>
                <Badge className={getOperationColor()}>
                  {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Nom :</span>
                <span className="text-gray-700">{operation.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Durée :</span>
                <span className="text-gray-700">{operation.duration} jours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Description :</span>
                <span className="text-gray-700 text-right max-w-xs">{operation.description}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Coût total :</span>
                  <span className="text-green-600">{operation.cost.toLocaleString()} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Méthodes de paiement */}
          <Card>
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
              <CardDescription>
                Choisissez votre méthode de paiement préférée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'wallet' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">Portefeuille NextMove</div>
                      <div className="text-sm text-gray-500">Solde : 2,450,000 FCFA</div>
                    </div>
                  </div>
                  {paymentMethod === 'wallet' && <Check className="h-5 w-5 text-green-600" />}
                </div>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'credit' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('credit')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">Carte de crédit</div>
                      <div className="text-sm text-gray-500">**** **** **** 1234</div>
                    </div>
                  </div>
                  {paymentMethod === 'credit' && <Check className="h-5 w-5 text-green-600" />}
                </div>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'invoice' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('invoice')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-3 text-purple-600" />
                    <div>
                      <div className="font-medium">Facturation entreprise</div>
                      <div className="text-sm text-gray-500">Paiement à 30 jours</div>
                    </div>
                  </div>
                  {paymentMethod === 'invoice' && <Check className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avertissement */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-yellow-800 mb-1">Important</div>
                <div className="text-yellow-700">
                  Le paiement sera débité immédiatement. L'opération marketing démarrera automatiquement après confirmation du paiement.
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmer le paiement
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
