'use client'

import React, { useState, useEffect } from 'react'
import { Settings, Save, CreditCard, Calendar, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function InstallmentPaymentsSettingsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  // Vérifier si l'utilisateur est une entreprise
  const isEnterprise = session?.user?.role === 'ADMIN'
  
  // Redirection si l'utilisateur n'est pas une entreprise
  useEffect(() => {
    if (session && !isEnterprise) {
      alert('❌ La configuration des paiements échelonnés est réservée aux entreprises uniquement.')
      router.push('/dashboard')
    }
  }, [session, isEnterprise, router])

  const [config, setConfig] = useState({
    // Activation du paiement échelonné
    enabled: true,
    
    // Plans disponibles
    availablePlans: {
      twoPayments: {
        enabled: true,
        fee: 5, // 5%
        description: 'Paiement en 2 fois'
      },
      threePayments: {
        enabled: true,
        fee: 8, // 8%
        description: 'Paiement en 3 fois'
      },
      fourPayments: {
        enabled: false,
        fee: 12, // 12%
        description: 'Paiement en 4 fois'
      }
    },
    
    // Limites et conditions
    limits: {
      minAmount: 50000, // Montant minimum pour paiement échelonné
      maxAmount: 1000000, // Montant maximum
      gracePeriod: 7, // Jours de grâce pour le paiement
      lateFee: 2500 // Frais de retard par jour
    },
    
    // Services concernés
    services: {
      packages: true, // Colis
      advertising: true, // Espaces publicitaires
      additionalServices: false // Services additionnels
    },
    
    // Notifications
    notifications: {
      reminderDays: [3, 1], // Rappels 3 jours et 1 jour avant échéance
      emailNotifications: true,
      smsNotifications: false
    }
  })

  const handleSave = () => {
    console.log('Sauvegarde configuration paiement échelonné:', config)
    setShowSuccessMessage(true)
    
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const updatePlanConfig = (plan: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      availablePlans: {
        ...prev.availablePlans,
        [plan]: {
          ...prev.availablePlans[plan as keyof typeof prev.availablePlans],
          [field]: value
        }
      }
    }))
  }

  const updateLimits = (field: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [field]: value
      }
    }))
  }

  const updateServices = (service: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: value
      }
    }))
  }

  const updateNotifications = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  if (!isEnterprise) {
    return null // Éviter le flash avant redirection
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-6">
      {/* Message de succès */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in">
          <Save className="w-5 h-5 mr-2" />
          Configuration paiement échelonné sauvegardée !
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-white/50 transition-colors flex items-center text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-green-600" />
            Configuration Paiement Échelonné
          </h1>
          <p className="text-gray-600 mt-2">
            Configurez les options de paiement en plusieurs fois pour vos clients
          </p>
        </div>

        {/* Activation générale */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Activer le paiement échelonné</h2>
              <p className="text-gray-600 mt-1">
                Permettre à vos clients de payer en plusieurs fois
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        {config.enabled && (
          <>
            {/* Plans de paiement */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Plans de Paiement</h2>
              </div>

              <div className="space-y-4">
                {Object.entries(config.availablePlans).map(([key, plan]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{plan.description}</h3>
                        <p className="text-sm text-gray-600">Frais: {plan.fee}%</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.enabled}
                          onChange={(e) => updatePlanConfig(key, 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {plan.enabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Frais (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={plan.fee}
                            onChange={(e) => updatePlanConfig(key, 'fee', Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Description</label>
                          <input
                            type="text"
                            value={plan.description}
                            onChange={(e) => updatePlanConfig(key, 'description', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Limites et conditions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-xl font-semibold">Limites et Conditions</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant minimum (FCFA)
                  </label>
                  <input
                    type="number"
                    value={config.limits.minAmount}
                    onChange={(e) => updateLimits('minAmount', Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant maximum (FCFA)
                  </label>
                  <input
                    type="number"
                    value={config.limits.maxAmount}
                    onChange={(e) => updateLimits('maxAmount', Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Période de grâce (jours)
                  </label>
                  <input
                    type="number"
                    value={config.limits.gracePeriod}
                    onChange={(e) => updateLimits('gracePeriod', Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frais de retard/jour (FCFA)
                  </label>
                  <input
                    type="number"
                    value={config.limits.lateFee}
                    onChange={(e) => updateLimits('lateFee', Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Services concernés */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-semibold mb-4">Services Concernés</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Expédition de colis
                  </label>
                  <input
                    type="checkbox"
                    checked={config.services.packages}
                    onChange={(e) => updateServices('packages', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Espaces publicitaires
                  </label>
                  <input
                    type="checkbox"
                    checked={config.services.advertising}
                    onChange={(e) => updateServices('advertising', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Services additionnels
                  </label>
                  <input
                    type="checkbox"
                    checked={config.services.additionalServices}
                    onChange={(e) => updateServices('additionalServices', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Résumé de la Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <p><strong>Plans actifs:</strong> {Object.values(config.availablePlans).filter(p => p.enabled).length}</p>
                  <p><strong>Montant min:</strong> {config.limits.minAmount.toLocaleString()} FCFA</p>
                  <p><strong>Montant max:</strong> {config.limits.maxAmount.toLocaleString()} FCFA</p>
                </div>
                <div>
                  <p><strong>Période de grâce:</strong> {config.limits.gracePeriod} jours</p>
                  <p><strong>Frais retard:</strong> {config.limits.lateFee.toLocaleString()} FCFA/jour</p>
                  <p><strong>Services:</strong> {Object.values(config.services).filter(Boolean).length} activés</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Sauvegarder la Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
