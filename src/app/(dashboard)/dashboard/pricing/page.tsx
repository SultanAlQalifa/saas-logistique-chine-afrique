'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, Settings, Ship, Plane, Globe, Plus, Edit3, Eye, BarChart3, TrendingUp, Users, Package, FileText, Info } from 'lucide-react'

type TransportMode = 'MARITIME' | 'MARITIME_EXPRESS' | 'AERIAL' | 'AERIAL_EXPRESS'

export default function PricingManagementPage() {
  const [viewMode, setViewMode] = useState<'public' | 'management'>('public')
  const [loading, setLoading] = useState(true)
  const [showTransportInfo, setShowTransportInfo] = useState(false)
  const [showNewRuleModal, setShowNewRuleModal] = useState(false)
  const [showMaritimeModal, setShowMaritimeModal] = useState(false)
  const [showAerialModal, setShowAerialModal] = useState(false)
  const [showZoneModal, setShowZoneModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

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

  // Fonction pour rediriger vers la demande de devis
  const handleQuoteRequest = () => {
    // Stocker les données du calcul dans le localStorage pour les récupérer après connexion
    const quoteData = {
      calculatorData,
      calculationResult,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('pendingQuoteRequest', JSON.stringify(quoteData))
    
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = checkUserAuthentication()
    
    if (isLoggedIn) {
      // Utilisateur connecté : redirection directe vers la création de devis
      window.location.href = '/dashboard/client/quotes/new'
    } else {
      // Utilisateur non connecté : redirection vers la page de connexion
      window.location.href = '/auth/signin?redirect=/dashboard/client/quotes/new'
    }
  }

  // Fonction pour vérifier l'état de connexion de l'utilisateur
  const checkUserAuthentication = () => {
    // Vérifier la présence d'un token d'authentification
    const token = localStorage.getItem('authToken') || 
                  sessionStorage.getItem('authToken') ||
                  document.cookie.includes('auth-token')
    
    // Vérifier si l'utilisateur est dans un contexte dashboard (URL contient /dashboard/)
    const isDashboardContext = window.location.pathname.includes('/dashboard/')
    
    return !!(token || isDashboardContext)
  }

  const calculatePrice = () => {
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
                  onClick={calculatePrice}
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
                  
                  {/* Bouton Demander un devis */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleQuoteRequest}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      <FileText className="h-5 w-5 inline mr-2" />
                      Demander un devis officiel
                    </button>
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Transformez cette estimation en demande de devis personnalisée
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Mode Gestion - Interface administrative complète
          <div className="space-y-8">
            {/* En-tête de gestion */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Settings className="h-8 w-8 mr-3 text-green-600" />
                    Gestion des Tarifs
                  </h2>
                  <p className="text-gray-600 mt-2">Configuration avancée des règles de tarification</p>
                </div>
                <button 
                  onClick={() => setShowNewRuleModal(true)}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  + Nouvelle Règle
                </button>
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div 
                    className="text-2xl font-bold text-blue-600 hover:underline"
                    onClick={() => alert('📋 Règles Actives: 12\n\n• Source: Système de configuration\n• Maritime: 6 règles\n• Aérien: 4 règles\n• Express: 2 règles\n• Dernière mise à jour: ' + new Date().toLocaleDateString('fr-FR'))}
                  >
                    12
                  </div>
                  <div className="text-sm text-blue-700">Règles Actives</div>
                  <div className="opacity-0 group-hover:opacity-100 text-xs text-blue-500 mt-1 transition-opacity">Cliquez pour détails</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div 
                    className="text-2xl font-bold text-green-600 hover:underline"
                    onClick={() => alert('🌍 Zones Géographiques: 8\n\n• UEMOA: 8 pays\n• CEMAC: 6 pays\n• Maghreb: 3 pays\n• Autres: 2 pays\n• Total couverture: 19 pays\n• Partenaires locaux: 45')}
                  >
                    8
                  </div>
                  <div className="text-sm text-green-700">Zones Géographiques</div>
                  <div className="opacity-0 group-hover:opacity-100 text-xs text-green-500 mt-1 transition-opacity">Voir répartition</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div 
                    className="text-2xl font-bold text-purple-600 hover:underline"
                    onClick={() => alert('🚛 Modes de Transport: 4\n\n• Maritime Standard: 25-35 jours\n• Maritime Express: 18-25 jours\n• Aérien Standard: 5-7 jours\n• Aérien Express: 2-4 jours\n• Partenaires: 12 compagnies')}
                  >
                    4
                  </div>
                  <div className="text-sm text-purple-700">Modes Transport</div>
                  <div className="opacity-0 group-hover:opacity-100 text-xs text-purple-500 mt-1 transition-opacity">Voir modes</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div 
                    className="text-2xl font-bold text-orange-600 hover:underline"
                    onClick={() => alert('📊 Précision des Calculs: 95%\n\n• Algorithme IA avancé\n• Facteurs considérés: 15+\n• Marge d\'erreur: ±5%\n• Calibrage mensuel\n• Données historiques: 2 ans\n• Taux de satisfaction: 98%')}
                  >
                    95%
                  </div>
                  <div className="text-sm text-orange-700">Précision Calculs</div>
                  <div className="opacity-0 group-hover:opacity-100 text-xs text-orange-500 mt-1 transition-opacity">Voir métriques</div>
                </div>
              </div>
            </div>

            {/* Configuration des tarifs par mode */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Tarifs Maritime */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    🚢 Transport Maritime
                  </h3>
                  <button 
                    onClick={() => setShowMaritimeModal(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Modifier</button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800">Prix par CBM</span>
                      <span className="text-blue-600 font-bold">650,000 FCFA</span>
                    </div>
                    <div className="text-sm text-blue-600">Délai: 25-35 jours</div>
                  </div>
                  
                  <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-cyan-800">Maritime Express</span>
                      <span className="text-cyan-600 font-bold">850,000 FCFA</span>
                    </div>
                    <div className="text-sm text-cyan-600">Délai: 18-25 jours</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                      onClick={() => setShowMaritimeModal(true)}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Voir Détails
                    </button>
                    <button 
                      onClick={() => setShowMaritimeModal(true)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Configurer
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarifs Aérien */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    ✈️ Transport Aérien
                  </h3>
                  <button 
                    onClick={() => setShowAerialModal(true)}
                    className="text-green-600 hover:text-green-800 font-medium transition-colors">Modifier</button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Prix par KG</span>
                      <span className="text-green-600 font-bold">5,200 FCFA</span>
                    </div>
                    <div className="text-sm text-green-600">Délai: 5-7 jours</div>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-emerald-800">Aérien Express</span>
                      <span className="text-emerald-600 font-bold">8,500 FCFA</span>
                    </div>
                    <div className="text-sm text-emerald-600">Délai: 2-4 jours</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                      onClick={() => setShowAerialModal(true)}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Voir Détails
                    </button>
                    <button 
                      onClick={() => setShowAerialModal(true)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Configurer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Zones géographiques */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  🌍 Zones Géographiques
                </h3>
                <button 
                  onClick={() => setShowZoneModal(true)}
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors">+ Ajouter Zone</button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { zone: 'UEMOA', pays: 8, couleur: 'blue' },
                  { zone: 'CEMAC', pays: 6, couleur: 'green' },
                  { zone: 'Maghreb', pays: 3, couleur: 'purple' },
                  { zone: 'Autres', pays: 2, couleur: 'orange' }
                ].map((zone, index) => (
                  <div key={index} className={`bg-${zone.couleur}-50 p-4 rounded-lg border border-${zone.couleur}-200`}>
                    <div className="font-medium text-gray-800">{zone.zone}</div>
                    <div className="text-sm text-gray-600">{zone.pays} pays</div>
                    <button 
                      onClick={() => alert(`🌍 Zone ${zone.zone}:\n\n• ${zone.pays} pays couverts\n• Tarifs spéciaux appliqués\n• Partenaires locaux actifs`)}
                      className={`mt-2 text-${zone.couleur}-600 hover:text-${zone.couleur}-800 text-sm font-medium`}
                    >
                      Gérer →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Actions Rapides</h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-6 rounded-xl text-left hover:from-blue-100 hover:to-blue-200 transition-all"
                >
                  <div className="text-blue-600 font-bold mb-2">📊 Exporter Tarifs</div>
                  <div className="text-sm text-blue-700">Télécharger la configuration complète</div>
                </button>
                
                <button 
                  onClick={() => alert('📈 Analyse des performances:\n\n• Rentabilité par mode\n• Évolution des prix\n• Comparaison concurrentielle\n• Recommandations IA')}
                  className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 p-6 rounded-xl text-left hover:from-green-100 hover:to-green-200 transition-all"
                >
                  <div className="text-green-600 font-bold mb-2">📈 Analyser Performance</div>
                  <div className="text-sm text-green-700">Rapport détaillé des tarifs</div>
                </button>
                
                <button 
                  onClick={() => alert('🔄 Synchronisation:\n\n• Mise à jour automatique\n• API partenaires\n• Taux de change\n• Ajustements saisonniers')}
                  className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 p-6 rounded-xl text-left hover:from-purple-100 hover:to-purple-200 transition-all"
                >
                  <div className="text-purple-600 font-bold mb-2">🔄 Synchroniser</div>
                  <div className="text-sm text-purple-700">Mise à jour des données</div>
                </button>
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

      {/* Modal Nouvelle Règle */}
      {showNewRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">✨ Nouvelle Règle de Tarification</h3>
              <button onClick={() => setShowNewRuleModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la règle</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Ex: Tarif Spécial UEMOA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode de transport</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    <option>Maritime Standard</option>
                    <option>Maritime Express</option>
                    <option>Aérien Standard</option>
                    <option>Aérien Express</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire (FCFA)</label>
                  <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="650000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Délai (jours)</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="25-35" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zones applicables</label>
                <div className="grid grid-cols-2 gap-2">
                  {['UEMOA', 'CEMAC', 'Maghreb', 'Autres'].map(zone => (
                    <label key={zone} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">{zone}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button onClick={() => setShowNewRuleModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={() => { setShowNewRuleModal(false); alert('✅ Nouvelle règle créée avec succès !'); }} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Créer la règle</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tarifs Maritimes */}
      {showMaritimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">🚢 Configuration Tarifs Maritimes</h3>
              <button onClick={() => setShowMaritimeModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Maritime Standard</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix par CBM (FCFA)</label>
                    <input type="number" defaultValue="650000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Délai (jours)</label>
                    <input type="text" defaultValue="25-35" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <h4 className="font-semibold text-cyan-800 mb-3">Maritime Express</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix par CBM (FCFA)</label>
                    <input type="number" defaultValue="850000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Délai (jours)</label>
                    <input type="text" defaultValue="18-25" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Zones d'application</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Niger', 'Guinée', 'Bénin', 'Togo', 'Ghana', 'Nigeria', 'Cameroun', 'Gabon'].map(pays => (
                    <label key={pays} className="flex items-center text-sm">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span>{pays}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button onClick={() => setShowMaritimeModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={() => { setShowMaritimeModal(false); alert('✅ Tarifs maritimes mis à jour avec succès !'); }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tarifs Aériens */}
      {showAerialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">✈️ Configuration Tarifs Aériens</h3>
              <button onClick={() => setShowAerialModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Aérien Standard</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix par KG (FCFA)</label>
                    <input type="number" defaultValue="5200" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Délai (jours)</label>
                    <input type="text" defaultValue="5-7" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-3">Aérien Express</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix par KG (FCFA)</label>
                    <input type="number" defaultValue="8500" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Délai (jours)</label>
                    <input type="text" defaultValue="2-4" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Compagnies partenaires</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Air France', 'Turkish Airlines', 'Royal Air Maroc', 'Ethiopian Airlines', 'Emirates', 'Qatar Airways'].map(compagnie => (
                    <label key={compagnie} className="flex items-center text-sm">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span>{compagnie}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button onClick={() => setShowAerialModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={() => { setShowAerialModal(false); alert('✅ Tarifs aériens mis à jour avec succès !'); }} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Zone */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">🌍 Ajouter Nouvelle Zone</h3>
              <button onClick={() => setShowZoneModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la zone</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Ex: Afrique Centrale" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code zone</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Ex: AC" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays inclus</label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {['Cameroun', 'Tchad', 'République Centrafricaine', 'Congo', 'RD Congo', 'Gabon', 'Guinée Équatoriale', 'São Tomé-et-Príncipe', 'Angola', 'Zambie', 'Zimbabwe', 'Botswana'].map(pays => (
                    <label key={pays} className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      <span>{pays}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient maritime</label>
                  <input type="number" step="0.1" defaultValue="1.0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coefficient aérien</label>
                  <input type="number" step="0.1" defaultValue="1.0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button onClick={() => setShowZoneModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={() => { setShowZoneModal(false); alert('✅ Nouvelle zone créée avec succès !'); }} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Créer la zone</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Export */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">📊 Exporter les Tarifs</h3>
              <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format d'export</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Excel (.xlsx)</option>
                  <option>CSV (.csv)</option>
                  <option>PDF (.pdf)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Données à inclure</label>
                <div className="space-y-2">
                  {['Règles actives', 'Historique des modifications', 'Zones géographiques', 'Coefficients', 'Statistiques'].map(item => (
                    <label key={item} className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <button onClick={() => setShowExportModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
              <button onClick={() => { setShowExportModal(false); alert('📥 Export en cours... Le fichier sera téléchargé dans quelques secondes.'); }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Exporter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
