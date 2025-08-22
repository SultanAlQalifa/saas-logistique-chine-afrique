'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, X, Minimize2, Maximize2, DollarSign, Package, Truck, Ship, Plane, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TransportMode = 'MARITIME' | 'MARITIME_EXPRESS' | 'AERIAL' | 'AERIAL_EXPRESS'

interface PricingPOSProps {
  className?: string
}

export default function PricingPOS({ className = '' }: PricingPOSProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const [calculatorData, setCalculatorData] = useState({
    transportMode: 'MARITIME' as TransportMode,
    origin: 'Guangzhou',
    destination: 'Abidjan',
    weight: 100,
    length: 120,
    width: 80,
    height: 100
  })

  const [selectedOptions, setSelectedOptions] = useState({
    insurance: false,
    packaging: false,
    tracking: false,
    express_customs: false,
    door_to_door: false
  })

  const [calculationResult, setCalculationResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Transport modes avec icônes et couleurs
  const transportModes = {
    MARITIME: {
      label: 'Maritime',
      icon: Ship,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      duration: '25-35 jours',
      description: 'Économique'
    },
    MARITIME_EXPRESS: {
      label: 'Maritime Express',
      icon: Ship,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      duration: '18-25 jours',
      description: 'Rapide'
    },
    AERIAL: {
      label: 'Aérien',
      icon: Plane,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      duration: '3-5 jours',
      description: 'Très rapide'
    },
    AERIAL_EXPRESS: {
      label: 'Aérien Express',
      icon: Plane,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      duration: '1-2 jours',
      description: 'Ultra rapide'
    }
  }

  // Options disponibles avec tarifs
  const availableOptions = {
    insurance: {
      label: 'Assurance Colis',
      description: 'Protection complète contre les dommages',
      price: 15000, // FCFA
      icon: '🛡️'
    },
    packaging: {
      label: 'Emballage Renforcé',
      description: 'Emballage professionnel sécurisé',
      price: 8000, // FCFA
      icon: '📦'
    },
    tracking: {
      label: 'Suivi GPS Premium',
      description: 'Localisation en temps réel',
      price: 5000, // FCFA
      icon: '📍'
    },
    express_customs: {
      label: 'Dédouanement Express',
      description: 'Traitement prioritaire en douane',
      price: 25000, // FCFA
      icon: '⚡'
    },
    door_to_door: {
      label: 'Porte à Porte',
      description: 'Collecte et livraison à domicile',
      price: 20000, // FCFA
      icon: '🚪'
    }
  }

  const calculatePrice = async () => {
    setIsCalculating(true)
    
    // Simulation de calcul
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const volume = (calculatorData.length * calculatorData.width * calculatorData.height) / 1000000 // m³
    
    // TARIFS OFFICIELS - Identiques à la section tarification publique
    let finalPrice = 0
    let calculationMethod = ''
    
    if (calculatorData.transportMode === 'MARITIME' || calculatorData.transportMode === 'MARITIME_EXPRESS') {
      // Maritime : Tarification au volume (m³) uniquement
      const volumeRate = calculatorData.transportMode === 'MARITIME' ? 650000 : 850000 // FCFA par m³
      finalPrice = volume * volumeRate
      calculationMethod = `Volume: ${volume.toFixed(3)} m³ × ${volumeRate.toLocaleString('fr-FR')} FCFA/m³`
    } else {
      // Aérien : Tarification au poids (kg) uniquement
      const weightRate = calculatorData.transportMode === 'AERIAL' ? 5200 : 8500 // FCFA par kg
      finalPrice = calculatorData.weight * weightRate
      calculationMethod = `Poids: ${calculatorData.weight} kg × ${weightRate.toLocaleString('fr-FR')} FCFA/kg`
    }

    // Calcul des options supplémentaires
    let optionsTotal = 0
    const selectedOptionsList: Array<{label: string, price: number, icon: string}> = []
    
    Object.entries(selectedOptions).forEach(([key, isSelected]) => {
      if (isSelected && availableOptions[key as keyof typeof availableOptions]) {
        const option = availableOptions[key as keyof typeof availableOptions]
        optionsTotal += option.price
        selectedOptionsList.push({
          label: option.label,
          price: option.price,
          icon: option.icon
        })
      }
    })

    const totalWithOptions = finalPrice + optionsTotal

    setCalculationResult({
      basePrice: Math.round(finalPrice), // Prix de base du transport
      optionsTotal: optionsTotal,
      selectedOptions: selectedOptionsList,
      weightFactor: calculatorData.transportMode.includes('AERIAL') ? calculatorData.weight * (calculatorData.transportMode === 'AERIAL' ? 5200 : 8500) : 0,
      volumeFactor: calculatorData.transportMode.includes('MARITIME') ? volume * (calculatorData.transportMode === 'MARITIME' ? 650000 : 850000) : 0,
      finalPrice: Math.round(totalWithOptions),
      volume: volume.toFixed(3),
      estimatedDays: transportModes[calculatorData.transportMode].duration,
      calculationMethod
    })
    
    setIsCalculating(false)
  }

  // Fonction pour rediriger vers la demande de devis
  const handleQuoteRequest = () => {
    // Stocker les données du calcul dans le localStorage pour les récupérer après connexion
    const quoteData = {
      calculatorData,
      selectedOptions,
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

  // Gestion du drag & drop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 600, e.clientY - dragOffset.y))
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  if (!isOpen) {
    return (
      <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-2xl rounded-full w-12 h-12 flex items-center justify-center group animate-pulse hover:animate-none transition-all duration-300"
          size="sm"
        >
          <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </Button>
        <div className="absolute -top-10 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Calculateur de Prix
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`fixed bottom-32 right-6 z-50 ${className}`}
      style={{ 
        transform: isMinimized ? 'scale(0.3)' : 'scale(1)',
        transformOrigin: 'bottom right'
      }}
    >
      <Card className="w-80 shadow-2xl border-2 border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <CardTitle className="text-sm">Calculateur Prix</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsMinimized(!isMinimized)
                }}
                className={`text-white hover:bg-white/20 rounded transition-colors flex items-center justify-center ${
                  isMinimized ? 'p-2 h-8 w-8' : 'p-1 h-6 w-6'
                }`}
              >
                {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsOpen(false)
                }}
                className={`text-white hover:bg-white/20 rounded transition-colors flex items-center justify-center ${
                  isMinimized ? 'p-2 h-8 w-8' : 'p-1 h-6 w-6'
                }`}
              >
                <X className={isMinimized ? "w-5 h-5" : "w-3 h-3"} />
              </button>
            </div>
          </div>
          <CardDescription className="text-orange-100 text-xs">
            🚀 Calcul instantané
          </CardDescription>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {/* Mode de transport */}
            <div>
              <label className="text-sm font-medium mb-2 block">Mode de transport</label>
              <Select
                value={calculatorData.transportMode}
                onValueChange={(value: TransportMode) => 
                  setCalculatorData(prev => ({ ...prev, transportMode: value }))
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  {Object.entries(transportModes).map(([key, mode]) => {
                    const Icon = mode.icon
                    return (
                      <SelectItem key={key} value={key} className="bg-white hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${mode.color}`} />
                          <span>{mode.label}</span>
                          <span className="text-xs text-gray-500">({mode.duration})</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Info dynamique du mode de transport */}
            <div className={`p-2 rounded-lg border ${transportModes[calculatorData.transportMode].bgColor} border-gray-200`}>
              <div className="flex items-center gap-2 mb-1">
                {React.createElement(transportModes[calculatorData.transportMode].icon, {
                  className: `w-4 h-4 ${transportModes[calculatorData.transportMode].color}`
                })}
                <h4 className="font-medium text-gray-800 text-sm">{transportModes[calculatorData.transportMode].label}</h4>
              </div>
              <div className="text-xs text-gray-500">
                ⏱️ {transportModes[calculatorData.transportMode].duration} • {transportModes[calculatorData.transportMode].description}
              </div>
            </div>

            {/* Origine et Destination */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium mb-1 block">Origine</label>
                <Select
                  value={calculatorData.origin}
                  onValueChange={(value) => 
                    setCalculatorData(prev => ({ ...prev, origin: value }))
                  }
                >
                  <SelectTrigger className="bg-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                    <SelectItem value="Guangzhou" className="bg-white hover:bg-gray-50">🇨🇳 Guangzhou</SelectItem>
                    <SelectItem value="Shanghai" className="bg-white hover:bg-gray-50">🇨🇳 Shanghai</SelectItem>
                    <SelectItem value="Shenzhen" className="bg-white hover:bg-gray-50">🇨🇳 Shenzhen</SelectItem>
                    <SelectItem value="Beijing" className="bg-white hover:bg-gray-50">🇨🇳 Beijing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">Destination</label>
                <Select
                  value={calculatorData.destination}
                  onValueChange={(value) => 
                    setCalculatorData(prev => ({ ...prev, destination: value }))
                  }
                >
                  <SelectTrigger className="bg-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                    <SelectItem value="Abidjan" className="bg-white hover:bg-gray-50">🇨🇮 Abidjan</SelectItem>
                    <SelectItem value="Lagos" className="bg-white hover:bg-gray-50">🇳🇬 Lagos</SelectItem>
                    <SelectItem value="Dakar" className="bg-white hover:bg-gray-50">🇸🇳 Dakar</SelectItem>
                    <SelectItem value="Casablanca" className="bg-white hover:bg-gray-50">🇲🇦 Casablanca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Poids ou Volume selon le mode de transport */}
            {calculatorData.transportMode === 'MARITIME' || calculatorData.transportMode === 'MARITIME_EXPRESS' ? (
              // Mode Maritime : Afficher le Volume
              <div>
                <label className="text-xs font-medium mb-1 block">📦 Volume (L×l×h cm)</label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    value={calculatorData.length}
                    onChange={(e) => 
                      setCalculatorData(prev => ({ ...prev, length: Number(e.target.value) }))
                    }
                    placeholder="L"
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    value={calculatorData.width}
                    onChange={(e) => 
                      setCalculatorData(prev => ({ ...prev, width: Number(e.target.value) }))
                    }
                    placeholder="l"
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    value={calculatorData.height}
                    onChange={(e) => 
                      setCalculatorData(prev => ({ ...prev, height: Number(e.target.value) }))
                    }
                    placeholder="h"
                    className="text-xs"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 Maritime : Tarification au volume</p>
              </div>
            ) : (
              // Mode Aérien : Afficher le Poids
              <div>
                <label className="text-xs font-medium mb-1 block">⚖️ Poids (kg)</label>
                <Input
                  type="number"
                  value={calculatorData.weight}
                  onChange={(e) => 
                    setCalculatorData(prev => ({ ...prev, weight: Number(e.target.value) }))
                  }
                  placeholder="100"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">✈️ Aérien : Tarification au poids</p>
              </div>
            )}

            {/* Options supplémentaires */}
            <div>
              <label className="text-xs font-medium mb-2 block">🎯 Options supplémentaires</label>
              <div className="space-y-2">
                {Object.entries(availableOptions).map(([key, option]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={key}
                        checked={selectedOptions[key as keyof typeof selectedOptions]}
                        onChange={(e) => 
                          setSelectedOptions(prev => ({ 
                            ...prev, 
                            [key]: e.target.checked 
                          }))
                        }
                        className="w-3 h-3 text-blue-600 rounded"
                      />
                      <label htmlFor={key} className="text-xs cursor-pointer">
                        <span className="mr-1">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </label>
                    </div>
                    <span className="text-xs font-bold text-blue-600">
                      +{option.price.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton de calcul */}
            <Button
              onClick={calculatePrice}
              disabled={isCalculating}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {isCalculating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Calcul en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Calculer le prix
                </div>
              )}
            </Button>

            {/* Résultat */}
            {calculationResult && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2 text-sm">💰 Estimation</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2">
                  <div className="flex items-center gap-1 text-xs text-green-700">
                    <span className="text-green-600">✅</span>
                    <span className="font-medium">Aucun frais caché - Tarification transparente</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  {calculationResult.calculationMethod && (
                    <div className="text-xs text-gray-600 py-1">
                      📊 {calculationResult.calculationMethod}
                    </div>
                  )}
                  
                  {/* Détail du prix transport */}
                  <div className="flex justify-between py-1">
                    <span>Transport:</span>
                    <span className="font-medium">{calculationResult.basePrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  
                  {/* Options sélectionnées */}
                  {calculationResult.selectedOptions && calculationResult.selectedOptions.length > 0 && (
                    <div className="space-y-1">
                      {calculationResult.selectedOptions.map((option: any, index: number) => (
                        <div key={index} className="flex justify-between text-xs text-blue-600">
                          <span>{option.icon} {option.label}:</span>
                          <span>+{option.price.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Total avec options */}
                  {calculationResult.optionsTotal > 0 && (
                    <div className="flex justify-between py-1 text-blue-600 font-medium border-t">
                      <span>Options:</span>
                      <span>+{calculationResult.optionsTotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-1 flex justify-between font-bold text-green-700">
                    <span>Total:</span>
                    <span>{calculationResult.finalPrice.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    ⏱️ {calculationResult.estimatedDays}
                    {calculatorData.transportMode.includes('MARITIME') && ` • Volume: ${calculationResult.volume} m³`}
                    {calculatorData.transportMode.includes('AERIAL') && ` • Poids: ${calculatorData.weight} kg`}
                  </div>
                </div>
                
                {/* Bouton Demander un devis */}
                <div className="mt-3 pt-3 border-t border-green-200">
                  <Button
                    onClick={handleQuoteRequest}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Demander un devis officiel
                  </Button>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Transformez cette estimation en demande de devis personnalisée
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
