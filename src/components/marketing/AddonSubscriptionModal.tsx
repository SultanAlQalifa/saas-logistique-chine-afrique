'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, Check, X, AlertCircle, Crown, Package, Zap, Building } from 'lucide-react'
import { MARKETING_ADDONS, calculateAnnualSavings, type MarketingAddon } from '@/lib/marketing-addons'

interface AddonSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (addonId: string, billingCycle: 'monthly' | 'annual') => void
  addonId: string
}

export default function AddonSubscriptionModal({ isOpen, onClose, onConfirm, addonId }: AddonSubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'wallet' | 'invoice'>('wallet')
  const [isProcessing, setIsProcessing] = useState(false)

  const addon = MARKETING_ADDONS[addonId]
  if (!addon) return null

  const price = billingCycle === 'monthly' ? addon.monthlyPrice : addon.annualPrice
  const savings = billingCycle === 'annual' ? calculateAnnualSavings(addon.monthlyPrice, addon.annualPrice) : 0

  const handleSubscribe = async () => {
    setIsProcessing(true)
    
    // Simulation de l'abonnement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    onConfirm(addonId, billingCycle)
    onClose()
  }

  const getAddonIcon = () => {
    switch (addon.category) {
      case 'basic': return <Package className="h-8 w-8 text-blue-600" />
      case 'professional': return <Zap className="h-8 w-8 text-purple-600" />
      case 'premium': return <Crown className="h-8 w-8 text-orange-600" />
      case 'enterprise': return <Building className="h-8 w-8 text-gray-800" />
      default: return <Package className="h-8 w-8 text-gray-600" />
    }
  }

  const getDiscountRate = () => {
    switch (addon.category) {
      case 'basic': return '20%'
      case 'professional': return '35%'
      case 'premium': return '50%'
      case 'enterprise': return '60%'
      default: return '0%'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            {getAddonIcon()}
            <span className="ml-3">Abonnement {addon.name}</span>
          </DialogTitle>
          <DialogDescription>
            Configurez votre abonnement marketing et commencez à économiser dès aujourd'hui
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé de l'add-on */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Détails du package</span>
                <Badge className={`${
                  addon.category === 'basic' ? 'bg-blue-100 text-blue-800' :
                  addon.category === 'professional' ? 'bg-purple-100 text-purple-800' :
                  addon.category === 'premium' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {addon.category.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>{addon.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Limites mensuelles</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Campagnes : {addon.limits.campaigns === -1 ? 'Illimité' : addon.limits.campaigns}</li>
                    <li>• Promotions : {addon.limits.promotions === -1 ? 'Illimité' : addon.limits.promotions}</li>
                    <li>• Sponsorships : {addon.limits.sponsorships === -1 ? 'Illimité' : addon.limits.sponsorships}</li>
                    <li>• Boosts : {addon.limits.boosts === -1 ? 'Illimité' : addon.limits.boosts}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Avantages inclus</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Réduction {getDiscountRate()} sur toutes les opérations</li>
                    <li>• {addon.limits.emailsPerMonth === -1 ? 'Emails illimités' : `${addon.limits.emailsPerMonth.toLocaleString()} emails/mois`}</li>
                    <li>• Analytics {addon.limits.analyticsRetention === -1 ? 'illimitées' : `${addon.limits.analyticsRetention} mois`}</li>
                    <li>• {addon.features[addon.features.length - 1]}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cycle de facturation */}
          <Card>
            <CardHeader>
              <CardTitle>Cycle de facturation</CardTitle>
              <CardDescription>Choisissez votre mode de facturation préféré</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  billingCycle === 'monthly' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">Facturation mensuelle</div>
                      <div className="text-sm text-gray-500">
                        {addon.monthlyPrice.toLocaleString()} FCFA/mois
                      </div>
                    </div>
                  </div>
                  {billingCycle === 'monthly' && <Check className="h-5 w-5 text-blue-600" />}
                </div>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  billingCycle === 'annual' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium flex items-center">
                        Facturation annuelle
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                          2 mois gratuits
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {addon.annualPrice.toLocaleString()} FCFA/an
                      </div>
                      {savings > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          Économisez {savings.toLocaleString()} FCFA
                        </div>
                      )}
                    </div>
                  </div>
                  {billingCycle === 'annual' && <Check className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Méthode de paiement */}
          <Card>
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
              <CardDescription>Sélectionnez votre mode de paiement</CardDescription>
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
                    <CreditCard className="h-5 w-5 mr-3 text-green-600" />
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
                  paymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
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
                  {paymentMethod === 'credit' && <Check className="h-5 w-5 text-blue-600" />}
                </div>
              </div>

              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentMethod === 'invoice' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
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
                  {paymentMethod === 'invoice' && <Check className="h-5 w-5 text-purple-600" />}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Récapitulatif */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle>Récapitulatif de l'abonnement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Package :</span>
                <span className="font-medium">{addon.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Facturation :</span>
                <span className="font-medium">
                  {billingCycle === 'monthly' ? 'Mensuelle' : 'Annuelle'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Prix :</span>
                <span className="font-medium">{price.toLocaleString()} FCFA</span>
              </div>
              {billingCycle === 'annual' && savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Économies :</span>
                  <span className="font-medium">-{savings.toLocaleString()} FCFA</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total :</span>
                  <span>{price.toLocaleString()} FCFA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avertissement */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-800 mb-1">Activation immédiate</div>
                <div className="text-blue-700">
                  Votre abonnement sera activé immédiatement après le paiement. 
                  Les réductions s'appliqueront automatiquement à toutes vos futures opérations marketing.
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
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirmer l'abonnement
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
