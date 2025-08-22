'use client'

import React, { useState } from 'react'
import { Settings, Save, Eye, DollarSign, Calendar, Target, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdvertisingConfigPage() {
  const router = useRouter()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  const [config, setConfig] = useState({
    // Tarification des espaces publicitaires
    pricing: {
      headerBanner: {
        daily: 15000,
        weekly: 90000,
        monthly: 300000
      },
      sidebarBanner: {
        daily: 12000,
        weekly: 72000,
        monthly: 240000
      },
      footerBanner: {
        daily: 10000,
        weekly: 60000,
        monthly: 200000
      },
      dashboardBanner: {
        daily: 8000,
        weekly: 48000,
        monthly: 160000
      }
    },
    
    // Configuration générale
    general: {
      maxCampaignDuration: 365, // jours
      minCampaignDuration: 1,
      moderationRequired: true,
      autoApproval: false,
      maxFileSize: 5, // MB
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
      commissionRate: 0.05 // 5% de commission
    },
    
    // Remises par durée
    discounts: {
      weekly: 0.14, // 14% de remise
      monthly: 0.33 // 33% de remise
    },
    
    // Configuration paiement échelonné (contrôlé par les entreprises)
    installmentPayments: {
      enabled: true,
      availablePlans: [2, 3, 4], // 2, 3 ou 4 fois
      fees: {
        twoPayments: 0.05, // 5%
        threePayments: 0.08, // 8%
        fourPayments: 0.12 // 12%
      },
      maxAmount: 1000000 // Montant max pour paiement échelonné
    }
  })

  const handleSave = () => {
    console.log('Sauvegarde de la configuration publicitaire:', config)
    setShowSuccessMessage(true)
    
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const updatePricing = (space: string, period: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [space]: {
          ...prev.pricing[space as keyof typeof prev.pricing],
          [period]: value
        }
      }
    }))
  }

  const updateGeneral = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value
      }
    }))
  }

  const updateDiscount = (period: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      discounts: {
        ...prev.discounts,
        [period]: value / 100 // Convertir en décimal
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6">
      {/* Message de succès */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50 animate-fade-in">
          <Save className="w-5 h-5 mr-2" />
          Configuration publicitaire sauvegardée !
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
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
            <Settings className="w-8 h-8 mr-3 text-purple-600" />
            Configuration Espaces Publicitaires
          </h1>
          <p className="text-gray-600 mt-2">
            Configurez les tarifs, règles et paramètres des espaces publicitaires
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tarification des espaces */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold">Tarification des Espaces</h2>
            </div>

            <div className="space-y-6">
              {/* Header Banner */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Bannière Header (728x90)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Jour (FCFA)</label>
                    <input
                      type="number"
                      value={config.pricing.headerBanner.daily}
                      onChange={(e) => updatePricing('headerBanner', 'daily', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Semaine (FCFA)</label>
                    <input
                      type="number"
                      value={config.pricing.headerBanner.weekly}
                      onChange={(e) => updatePricing('headerBanner', 'weekly', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mois (FCFA)</label>
                    <input
                      type="number"
                      value={config.pricing.headerBanner.monthly}
                      onChange={(e) => updatePricing('headerBanner', 'monthly', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar Banner */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Bannière Sidebar (300x250)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Jour (FCFA)</label>
                    <input
                      type="number"
                      value={config.pricing.sidebarBanner.daily}
                      onChange={(e) => updatePricing('sidebarBanner', 'daily', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Semaine (FCFA)</label>
                    <input
                      type="number"
                      value={config.pricing.sidebarBanner.weekly}
                      onChange={(e) => updatePricing('sidebarBanner', 'weekly', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Mois (FCFA)</label>
                    <input
                      type="number"
                      value={config.pricing.sidebarBanner.monthly}
                      onChange={(e) => updatePricing('sidebarBanner', 'monthly', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration générale */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Configuration Générale</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée max campagne (jours)
                </label>
                <input
                  type="number"
                  value={config.general.maxCampaignDuration}
                  onChange={(e) => updateGeneral('maxCampaignDuration', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille max fichier (MB)
                </label>
                <input
                  type="number"
                  value={config.general.maxFileSize}
                  onChange={(e) => updateGeneral('maxFileSize', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission plateforme (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={config.general.commissionRate * 100}
                  onChange={(e) => updateGeneral('commissionRate', Number(e.target.value) / 100)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Modération obligatoire
                </label>
                <input
                  type="checkbox"
                  checked={config.general.moderationRequired}
                  onChange={(e) => updateGeneral('moderationRequired', e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Approbation automatique
                </label>
                <input
                  type="checkbox"
                  checked={config.general.autoApproval}
                  onChange={(e) => updateGeneral('autoApproval', e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Remises par durée */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold">Remises par Durée</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remise semaine (%)
                </label>
                <input
                  type="number"
                  value={config.discounts.weekly * 100}
                  onChange={(e) => updateDiscount('weekly', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remise mois (%)
                </label>
                <input
                  type="number"
                  value={config.discounts.monthly * 100}
                  onChange={(e) => updateDiscount('monthly', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Note sur paiement échelonné */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-blue-900">Paiement Échelonné</h2>
            </div>
            
            <div className="text-blue-800">
              <p className="mb-3">
                La configuration du paiement échelonné est gérée par chaque entreprise individuellement.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Les entreprises peuvent activer/désactiver cette option</li>
                <li>Elles configurent leurs propres frais et conditions</li>
                <li>Le SUPER_ADMIN ne contrôle que les paramètres globaux</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Résumé de configuration */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Résumé de la Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700">
            <div>
              <p><strong>Header Banner:</strong> {config.pricing.headerBanner.daily.toLocaleString()} FCFA/jour</p>
              <p><strong>Sidebar Banner:</strong> {config.pricing.sidebarBanner.daily.toLocaleString()} FCFA/jour</p>
            </div>
            <div>
              <p><strong>Remise semaine:</strong> {(config.discounts.weekly * 100)}%</p>
              <p><strong>Remise mois:</strong> {(config.discounts.monthly * 100)}%</p>
            </div>
            <div>
              <p><strong>Commission:</strong> {(config.general.commissionRate * 100)}%</p>
              <p><strong>Modération:</strong> {config.general.moderationRequired ? 'Activée' : 'Désactivée'}</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Sauvegarder la Configuration
          </button>
        </div>
      </div>
    </div>
  )
}
