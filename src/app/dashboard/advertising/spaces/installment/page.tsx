'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Calendar, CheckCircle, AlertCircle, Calculator } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface InstallmentPlan {
  id: string
  name: string
  payments: number
  interval: 'weekly' | 'monthly'
  totalAmount: number
  installmentAmount: number
  fees: number
  description: string
}

export default function InstallmentPaymentPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })

  // Prix de base pour l'espace publicitaire (exemple)
  const baseAmount = 150000 // 150,000 FCFA pour 1 mois

  // Vérifier si l'utilisateur est un client particulier (seuls les clients peuvent payer en plusieurs fois)
  const isIndividualClient = session?.user?.role === 'CLIENT'
  
  // Redirection si l'utilisateur est une entreprise
  useEffect(() => {
    if (session && !isIndividualClient) {
      alert('❌ Le paiement en plusieurs fois n\'est disponible que pour les clients particuliers.\n\nLes entreprises doivent effectuer un paiement unique.')
      router.back()
    }
  }, [session, isIndividualClient, router])

  // Plans de paiement échelonné disponibles
  const installmentPlans: InstallmentPlan[] = [
    {
      id: 'plan_2x',
      name: 'Paiement en 2 fois',
      payments: 2,
      interval: 'monthly',
      totalAmount: baseAmount + (baseAmount * 0.05), // +5% de frais
      installmentAmount: (baseAmount + (baseAmount * 0.05)) / 2,
      fees: baseAmount * 0.05,
      description: 'Payez en 2 mensualités avec 5% de frais'
    },
    {
      id: 'plan_3x',
      name: 'Paiement en 3 fois',
      payments: 3,
      interval: 'monthly',
      totalAmount: baseAmount + (baseAmount * 0.08), // +8% de frais
      installmentAmount: (baseAmount + (baseAmount * 0.08)) / 3,
      fees: baseAmount * 0.08,
      description: 'Payez en 3 mensualités avec 8% de frais'
    },
    {
      id: 'plan_4x',
      name: 'Paiement en 4 fois',
      payments: 4,
      interval: 'weekly',
      totalAmount: baseAmount + (baseAmount * 0.12), // +12% de frais
      installmentAmount: (baseAmount + (baseAmount * 0.12)) / 4,
      fees: baseAmount * 0.12,
      description: 'Payez en 4 versements hebdomadaires avec 12% de frais'
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handlePlanSelection = (plan: InstallmentPlan) => {
    setSelectedPlan(plan)
  }

  const handleSubmit = () => {
    if (!selectedPlan) {
      alert('Veuillez sélectionner un plan de paiement')
      return
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Simulation de la création du plan de paiement
    alert(`✅ Plan de paiement "${selectedPlan.name}" créé avec succès !\n\nProchain paiement: ${formatCurrency(selectedPlan.installmentAmount)}\nÉchéance: Dans 7 jours`)
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-blue-600" />
            Paiement en Plusieurs Fois
          </h1>
          <p className="text-gray-600 mt-2">
            Choisissez votre plan de paiement échelonné pour votre espace publicitaire
          </p>
        </div>

        {/* Résumé de l'achat */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Résumé de votre achat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Espace publicitaire</p>
              <p className="font-semibold">Bannière Header Premium</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Durée</p>
              <p className="font-semibold">1 mois</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Prix de base</p>
              <p className="font-semibold">{formatCurrency(baseAmount)}</p>
            </div>
          </div>
        </div>

        {/* Plans de paiement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {installmentPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelection(plan)}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedPlan?.id === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-blue-200'
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nombre de paiements:</span>
                  <span className="font-semibold">{plan.payments}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Montant par paiement:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(plan.installmentAmount)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Frais de service:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(plan.fees)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total à payer:</span>
                    <span className="font-bold text-lg">{formatCurrency(plan.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Paiements {plan.interval === 'weekly' ? 'hebdomadaires' : 'mensuels'}
                </span>
              </div>

              {selectedPlan?.id === plan.id && (
                <div className="mt-4 flex items-center justify-center text-blue-600">
                  <CheckCircle className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Plan sélectionné</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Informations client */}
        {selectedPlan && (
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
                  Entreprise
                </label>
                <input
                  type="text"
                  value={customerInfo.company}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de votre entreprise (optionnel)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditions et avertissements */}
        {selectedPlan && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Conditions importantes</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Le premier paiement sera débité immédiatement</li>
                  <li>• Les paiements suivants seront prélevés automatiquement</li>
                  <li>• En cas d'échec de paiement, des frais supplémentaires s'appliquent</li>
                  <li>• L'espace publicitaire sera activé dès le premier paiement</li>
                  <li>• Aucun remboursement possible après activation</li>
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
            Annuler
          </button>
          
          {selectedPlan && (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Créer le Plan de Paiement
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
