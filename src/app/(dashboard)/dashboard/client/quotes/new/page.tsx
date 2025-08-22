'use client'

import React, { useState, useEffect } from 'react'
import { FileText, ArrowLeft, Calculator, Package, Truck, Ship, Plane, Save, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type TransportMode = 'MARITIME' | 'MARITIME_EXPRESS' | 'AERIAL' | 'AERIAL_EXPRESS'

export default function NewQuotePage() {
  const [formData, setFormData] = useState({
    transportMode: 'MARITIME' as TransportMode,
    origin: 'Guangzhou',
    destination: 'Abidjan',
    weight: 100,
    length: 120,
    width: 80,
    height: 100,
    description: '',
    urgency: 'normal',
    additionalServices: {
      insurance: false,
      packaging: false,
      tracking: false,
      express_customs: false,
      door_to_door: false
    }
  })

  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const transportModes = {
    MARITIME: {
      label: 'Maritime',
      icon: Ship,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      duration: '25-35 jours',
      rate: 650000
    },
    MARITIME_EXPRESS: {
      label: 'Maritime Express',
      icon: Ship,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      duration: '18-25 jours',
      rate: 850000
    },
    AERIAL: {
      label: 'Aérien',
      icon: Plane,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      duration: '3-5 jours',
      rate: 5200
    },
    AERIAL_EXPRESS: {
      label: 'Aérien Express',
      icon: Plane,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      duration: '1-2 jours',
      rate: 8500
    }
  }

  const additionalServices = {
    insurance: { label: 'Assurance Colis', price: 15000, icon: '🛡️' },
    packaging: { label: 'Emballage Renforcé', price: 8000, icon: '📦' },
    tracking: { label: 'Suivi GPS Premium', price: 5000, icon: '📍' },
    express_customs: { label: 'Dédouanement Express', price: 25000, icon: '⚡' },
    door_to_door: { label: 'Porte à Porte', price: 20000, icon: '🚪' }
  }

  // Charger les données depuis localStorage si disponibles
  useEffect(() => {
    const pendingQuote = localStorage.getItem('pendingQuoteRequest')
    if (pendingQuote) {
      try {
        const quoteData = JSON.parse(pendingQuote)
        if (quoteData.calculatorData) {
          setFormData(prev => ({
            ...prev,
            ...quoteData.calculatorData,
            additionalServices: quoteData.selectedOptions || prev.additionalServices
          }))
          if (quoteData.calculationResult) {
            setEstimatedPrice(quoteData.calculationResult.finalPrice)
          }
        }
        // Nettoyer le localStorage après utilisation
        localStorage.removeItem('pendingQuoteRequest')
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }
  }, [])

  const calculateEstimatedPrice = () => {
    const volume = (formData.length * formData.width * formData.height) / 1000000
    let basePrice = 0

    if (formData.transportMode === 'MARITIME' || formData.transportMode === 'MARITIME_EXPRESS') {
      basePrice = volume * transportModes[formData.transportMode].rate
    } else {
      basePrice = formData.weight * transportModes[formData.transportMode].rate
    }

    // Ajouter les services additionnels
    const servicesTotal = Object.entries(formData.additionalServices)
      .filter(([_, selected]) => selected)
      .reduce((total, [key, _]) => {
        return total + (additionalServices[key as keyof typeof additionalServices]?.price || 0)
      }, 0)

    return Math.round(basePrice + servicesTotal)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Générer un ID de devis
    const quoteId = `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    alert(`✅ Devis ${quoteId} créé avec succès!\n\nVotre demande a été transmise à notre équipe commerciale. Vous recevrez une réponse sous 24h.`)
    
    // Rediriger vers la liste des devis
    window.location.href = '/dashboard/client/quotes'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  useEffect(() => {
    setEstimatedPrice(calculateEstimatedPrice())
  }, [formData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Nouvelle Demande de Devis
          </h1>
          <p className="text-gray-600 mt-2">Remplissez les détails de votre expédition pour recevoir un devis personnalisé</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de transport */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                Informations de Transport
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode de transport */}
              <div>
                <label className="block text-sm font-medium mb-2">Mode de transport</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(transportModes).map(([key, mode]) => (
                    <div
                      key={key}
                      onClick={() => setFormData(prev => ({ ...prev, transportMode: key as TransportMode }))}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.transportMode === key
                          ? `border-blue-500 ${mode.bgColor}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {React.createElement(mode.icon, {
                          className: `h-4 w-4 ${mode.color}`
                        })}
                        <span className="font-medium text-sm">{mode.label}</span>
                      </div>
                      <div className="text-xs text-gray-500">{mode.duration}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Origine et Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Origine</label>
                  <Select
                    value={formData.origin}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, origin: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guangzhou">🇨🇳 Guangzhou</SelectItem>
                      <SelectItem value="Shanghai">🇨🇳 Shanghai</SelectItem>
                      <SelectItem value="Shenzhen">🇨🇳 Shenzhen</SelectItem>
                      <SelectItem value="Beijing">🇨🇳 Beijing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <Select
                    value={formData.destination}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abidjan">🇨🇮 Abidjan</SelectItem>
                      <SelectItem value="Lagos">🇳🇬 Lagos</SelectItem>
                      <SelectItem value="Dakar">🇸🇳 Dakar</SelectItem>
                      <SelectItem value="Casablanca">🇲🇦 Casablanca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dimensions et poids */}
              <div className="space-y-4">
                {formData.transportMode === 'MARITIME' || formData.transportMode === 'MARITIME_EXPRESS' ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">📦 Dimensions (cm)</label>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        type="number"
                        value={formData.length}
                        onChange={(e) => setFormData(prev => ({ ...prev, length: Number(e.target.value) }))}
                        placeholder="Longueur"
                      />
                      <Input
                        type="number"
                        value={formData.width}
                        onChange={(e) => setFormData(prev => ({ ...prev, width: Number(e.target.value) }))}
                        placeholder="Largeur"
                      />
                      <Input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                        placeholder="Hauteur"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">⚖️ Poids (kg)</label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                      placeholder="Poids en kilogrammes"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services additionnels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Services Additionnels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(additionalServices).map(([key, service]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={key}
                        checked={formData.additionalServices[key as keyof typeof formData.additionalServices]}
                        onChange={(e) => 
                          setFormData(prev => ({
                            ...prev,
                            additionalServices: {
                              ...prev.additionalServices,
                              [key]: e.target.checked
                            }
                          }))
                        }
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor={key} className="cursor-pointer">
                        <span className="mr-2">{service.icon}</span>
                        <span className="font-medium">{service.label}</span>
                      </label>
                    </div>
                    <span className="font-bold text-blue-600">
                      +{formatCurrency(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description du Colis</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez le contenu de votre colis, matériaux fragiles, instructions spéciales..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Estimation de prix */}
          {estimatedPrice && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">💰 Estimation de Prix</h3>
                    <p className="text-sm text-green-600">Prix indicatif basé sur vos paramètres</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(estimatedPrice)}
                    </div>
                    <div className="text-sm text-green-600">
                      {transportModes[formData.transportMode].duration}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder en brouillon
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la demande
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
