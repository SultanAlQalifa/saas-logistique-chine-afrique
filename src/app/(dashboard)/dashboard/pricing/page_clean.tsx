'use client'

import { useState, useEffect } from 'react'
import { Calculator, Settings, Info } from 'lucide-react'

type TransportMode = 'MARITIME' | 'MARITIME_EXPRESS' | 'AERIAL' | 'AERIAL_EXPRESS'

export default function PricingManagementPage() {
  const [viewMode, setViewMode] = useState<'public' | 'management'>('public')
  const [loading, setLoading] = useState(true)
  const [showTransportInfo, setShowTransportInfo] = useState(false)

  // États pour le calculateur
  const [calculatorData, setCalculatorData] = useState({
    transportMode: 'MARITIME' as TransportMode,
    origin: '',
    destination: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0
  })

  const [calculationResult, setCalculationResult] = useState<any>(null)

  // Informations dynamiques pour chaque type de transport
  const transportInfo = {
    MARITIME: {
      title: "🚢 Transport Maritime",
      description: "Solution économique pour les gros volumes",
      features: [
        "⏱️ Délai: 25-35 jours",
        "💰 Coût: Le plus économique",
        "📦 Volume: Conteneurs 20/40 pieds",
        "🌊 Fiabilité: Service régulier"
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200"
    },
    MARITIME_EXPRESS: {
      title: "🚢⚡ Maritime Express",
      description: "Transport maritime accéléré",
      features: [
        "⏱️ Délai: 18-25 jours",
        "💰 Coût: Modéré",
        "📦 Volume: Priorité de chargement",
        "🎯 Service: Suivi renforcé"
      ],
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
      borderColor: "border-cyan-200"
    },
    AERIAL: {
      title: "✈️ Transport Aérien",
      description: "Rapidité et sécurité optimales",
      features: [
        "⏱️ Délai: 5-7 jours",
        "💰 Coût: Élevé",
        "📦 Volume: Limité par poids",
        "🎯 Précision: Livraison précise"
      ],
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200"
    },
    AERIAL_EXPRESS: {
      title: "🚀 Aérien Express",
      description: "Solution la plus rapide",
      features: [
        "⏱️ Délai: 2-4 jours",
        "💰 Coût: Premium",
        "📦 Volume: Colis urgents",
        "⚡ Urgence: Traitement ultra-prioritaire"
      ],
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200"
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const handleCalculate = () => {
    // Simulation d'un calcul simple basé sur le mode de transport
    let basePrice = 0
    let calculationBase = 0
    let unit = ''

    if (calculatorData.transportMode === 'AERIAL' || calculatorData.transportMode === 'AERIAL_EXPRESS') {
      // Mode aérien : calcul basé sur le poids uniquement
      calculationBase = calculatorData.weight
      unit = 'kg'
      basePrice = calculatorData.weight * (calculatorData.transportMode === 'AERIAL_EXPRESS' ? 8500 : 5200)
    } else {
      // Mode maritime : calcul basé sur le CBM uniquement
      const cbm = (calculatorData.length * calculatorData.width * calculatorData.height) / 1000000
      calculationBase = cbm
      unit = 'm³'
      basePrice = cbm * (calculatorData.transportMode === 'MARITIME_EXPRESS' ? 850000 : 650000)
    }

    setCalculationResult({
      finalPrice: basePrice,
      calculationBase: calculationBase,
      unit: unit,
      calculationMethod: calculatorData.transportMode === 'AERIAL' || calculatorData.transportMode === 'AERIAL_EXPRESS' ? 'WEIGHT' : 'CBM',
      deliveryDelay: { 
        text: calculatorData.transportMode === 'AERIAL_EXPRESS' ? '2-4 jours' :
              calculatorData.transportMode === 'AERIAL' ? '5-7 jours' :
              calculatorData.transportMode === 'MARITIME_EXPRESS' ? '18-25 jours' : '25-35 jours'
      },
      estimatedDelivery: { range: 'Selon destination' }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header avec gradient moderne */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Calculator className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">🧮 Calculateur de Prix</h1>
                <p className="text-green-100 mt-1">Estimation instantanée de vos coûts de transport</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode('public')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'public'
                    ? 'bg-white text-green-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Calculateur Public
              </button>
              <button
                onClick={() => setViewMode('management')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'management'
                    ? 'bg-white text-green-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Gestion Tarifs
              </button>
            </div>
          </div>
        </div>
        {/* Éléments décoratifs */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'public' ? (
          // Mode Public - Calculateur simple
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulaire de calcul */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="h-6 w-6 mr-3 text-green-600" />
                Paramètres de Transport
              </h2>

              <div className="space-y-6">
                {/* Mode de transport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mode de Transport
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(transportInfo).map(([mode, info]) => (
                      <button
                        key={mode}
                        onClick={() => setCalculatorData({...calculatorData, transportMode: mode as TransportMode})}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          calculatorData.transportMode === mode
                            ? `bg-gradient-to-r ${info.bgColor} ${info.borderColor} border-2`
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="font-medium text-sm">{info.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{info.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Origine et Destination */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origine
                    </label>
                    <input
                      type="text"
                      value={calculatorData.origin}
                      onChange={(e) => setCalculatorData({...calculatorData, origin: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ville de départ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={calculatorData.destination}
                      onChange={(e) => setCalculatorData({...calculatorData, destination: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ville d'arrivée"
                    />
                  </div>
                </div>

                {/* Champs conditionnels selon le mode */}
                {calculatorData.transportMode === 'AERIAL' || calculatorData.transportMode === 'AERIAL_EXPRESS' ? (
                  // Mode aérien : poids uniquement
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      value={calculatorData.weight}
                      onChange={(e) => setCalculatorData({...calculatorData, weight: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Poids en kilogrammes"
                    />
                  </div>
                ) : (
                  // Mode maritime : dimensions uniquement
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        value={calculatorData.length}
                        onChange={(e) => setCalculatorData({...calculatorData, length: parseFloat(e.target.value) || 0})}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Longueur"
                      />
                      <input
                        type="number"
                        value={calculatorData.width}
                        onChange={(e) => setCalculatorData({...calculatorData, width: parseFloat(e.target.value) || 0})}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Largeur"
                      />
                      <input
                        type="number"
                        value={calculatorData.height}
                        onChange={(e) => setCalculatorData({...calculatorData, height: parseFloat(e.target.value) || 0})}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Hauteur"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Calculator className="h-5 w-5 inline mr-2" />
                  Calculer le Prix
                </button>
              </div>
            </div>

            {/* Résultats */}
            <div className="space-y-6">
              {/* Info transport */}
              <div className={`bg-gradient-to-r ${transportInfo[calculatorData.transportMode].bgColor} border ${transportInfo[calculatorData.transportMode].borderColor} rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {transportInfo[calculatorData.transportMode].title}
                  </h3>
                  <button
                    onClick={() => setShowTransportInfo(true)}
                    className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{transportInfo[calculatorData.transportMode].description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {transportInfo[calculatorData.transportMode].features.map((feature, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-white/30 rounded-lg px-3 py-2">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Résultat du calcul */}
              {calculationResult && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    💰 Estimation de Prix
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {formatCurrency(calculationResult.finalPrice)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Basé sur {calculationResult.calculationBase.toFixed(2)} {calculationResult.unit}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm text-blue-600 font-medium">Délai de livraison</div>
                        <div className="text-lg font-bold text-blue-800">{calculationResult.deliveryDelay.text}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-sm text-purple-600 font-medium">Estimation</div>
                        <div className="text-lg font-bold text-purple-800">{calculationResult.estimatedDelivery.range}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Mode Gestion - Interface administrative
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Tarifs</h3>
              <p className="text-gray-600 mb-6">Interface de gestion administrative des règles de tarification</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-800 text-sm">
                  🚧 Module en développement - Fonctionnalités avancées à venir
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'informations transport */}
      {showTransportInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {transportInfo[calculatorData.transportMode].title}
              </h3>
              <button
                onClick={() => setShowTransportInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">{transportInfo[calculatorData.transportMode].description}</p>
              
              <div className="space-y-3">
                {transportInfo[calculatorData.transportMode].features.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-700">{feature}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowTransportInfo(false)}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
