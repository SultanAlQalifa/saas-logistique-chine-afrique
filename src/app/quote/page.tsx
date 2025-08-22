'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { 
  ArrowLeft, ArrowRight, Check, Package, Plane, Ship, Truck, 
  Calculator, MapPin, Weight, Box, DollarSign, FileText, 
  Download, MessageCircle, Phone, Mail, Sparkles, AlertCircle,
  ToggleLeft, ToggleRight, Plus, Minus
} from 'lucide-react'

interface QuoteCalculation {
  shipping: any
  addons: any[]
  subtotal: number
  vat_amount: number
  total: number
  currency: string
  breakdown: {
    base_shipping: number
    surcharges: number
    addons: number
    vat: number
  }
}

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [addons, setAddons] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [shipmentData, setShipmentData] = useState({
    mode: 'air' as 'air' | 'sea' | 'road',
    rate_basis: 'per_kg' as 'per_kg' | 'per_m3',
    origin: 'Shenzhen, China',
    destination: 'Dakar, Senegal',
    weight_kg: 50,
    volume_m3: 0.5,
    declared_value: 1000,
    incoterm: 'CIF',
    ready_date: new Date().toISOString().split('T')[0]
  })
  const [selectedAddons, setSelectedAddons] = useState<Array<{
    addon_id: string
    quantity: number
    enabled: boolean
  }>>([])
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  })
  const [deliveryOptions, setDeliveryOptions] = useState({
    send_whatsapp: false,
    send_email: true,
    notifications: true
  })
  const [quoteCalculation, setQuoteCalculation] = useState<QuoteCalculation | null>(null)
  const [calculationLoading, setCalculationLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (addons.length > 0 && selectedAddons.length === 0) {
      setSelectedAddons(addons.map(addon => ({
        addon_id: addon.id,
        quantity: 1,
        enabled: false
      })))
    }
  }, [addons])

  useEffect(() => {
    if (currentStep >= 2) {
      calculateQuote()
    }
  }, [shipmentData, selectedAddons, currentStep])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      const [plansRes, addonsRes, settingsRes] = await Promise.all([
        fetch('/api/public/plans', { headers: { 'X-Tenant-ID': 'default-tenant' } }),
        fetch('/api/public/addons', { headers: { 'X-Tenant-ID': 'default-tenant' } }),
        fetch('/api/public/pricing/settings', { headers: { 'X-Tenant-ID': 'default-tenant' } })
      ])

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        setPlans(plansData.data || [])
      }

      if (addonsRes.ok) {
        const addonsData = await addonsRes.json()
        setAddons(addonsData.data || [])
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        setSettings(settingsData.data)
      }

    } catch (err) {
      console.error('Erreur chargement données:', err)
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const calculateQuote = async () => {
    try {
      setCalculationLoading(true)
      setError(null)

      const enabledAddons = selectedAddons.filter(addon => addon.enabled)
      
      const response = await fetch('/api/quotes/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'default-tenant'
        },
        body: JSON.stringify({
          ...shipmentData,
          selected_addons: enabledAddons,
          plan_id: selectedPlan
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur de calcul')
      }

      const result = await response.json()
      setQuoteCalculation(result.data.quote)

    } catch (err) {
      console.error('Erreur calcul devis:', err)
      setError(err instanceof Error ? err.message : 'Erreur de calcul')
    } finally {
      setCalculationLoading(false)
    }
  }

  const submitQuote = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/quotes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': 'default-tenant'
        },
        body: JSON.stringify({
          quote_data: quoteCalculation,
          customer_info: customerInfo,
          delivery_options: deliveryOptions,
          shipment_data: shipmentData,
          selected_plan: selectedPlan,
          selected_addons: selectedAddons.filter(addon => addon.enabled)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur de soumission')
      }

      const result = await response.json()
      alert(`Devis soumis avec succès ! ID: ${result.data.quote.id}`)
      
    } catch (err) {
      console.error('Erreur soumission devis:', err)
      setError(err instanceof Error ? err.message : 'Erreur de soumission')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string = 'EUR') => {
    if (currency === 'XOF' && settings?.billing.fx_rates.eur_to_xof) {
      const priceXOF = Math.round(price * settings.billing.fx_rates.eur_to_xof)
      return `${priceXOF.toLocaleString()} FCFA`
    }
    return `${price}€`
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => prev.map(addon => 
      addon.addon_id === addonId 
        ? { ...addon, enabled: !addon.enabled }
        : addon
    ))
  }

  if (loading && plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du calculateur de devis...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Link 
              href="/pricing"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-all duration-300 hover:gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux tarifs
            </Link>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              Calculateur de devis
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Calculez votre <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Devis</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Obtenez un devis personnalisé pour vos expéditions Chine-Afrique en quelques clics
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Plan</span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Expédition</span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Add-ons</span>
              <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Récapitulatif</span>
            </div>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulaire principal */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-8 shadow-lg">
                
                {/* Étape 1: Plans */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Choisissez votre plan</h2>
                      <p className="text-gray-600">Sélectionnez le plan qui correspond à vos besoins (optionnel)</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div 
                        onClick={() => setSelectedPlan(null)}
                        className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                          selectedPlan === null ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Package className="w-6 h-6 text-gray-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Sans plan</h3>
                          <p className="text-gray-600 text-sm">Paiement à l'expédition uniquement</p>
                        </div>
                      </div>

                      {plans.map((plan) => (
                        <div 
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                            selectedPlan === plan.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                              plan.highlighted ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-100'
                            }`}>
                              <Sparkles className={`w-6 h-6 ${plan.highlighted ? 'text-white' : 'text-gray-600'}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <p className="text-2xl font-bold text-blue-600 mb-2">
                              {formatPrice(plan.price_month)}/mois
                            </p>
                            <p className="text-gray-600 text-sm">
                              {plan.features?.slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentStep === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Précédent
                  </button>

                  <button
                    onClick={currentStep === 4 ? submitQuote : nextStep}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {currentStep === 4 ? (
                      loading ? 'Soumission...' : 'Soumettre le devis'
                    ) : (
                      <>
                        Suivant
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-6 shadow-lg sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h3>
                
                {calculationLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Calcul en cours...</p>
                  </div>
                ) : quoteCalculation ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Transport</span>
                      <span className="font-medium">{formatPrice(quoteCalculation.breakdown.base_shipping, quoteCalculation.currency)}</span>
                    </div>
                    
                    {quoteCalculation.breakdown.surcharges > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Surcharges</span>
                        <span className="font-medium">{formatPrice(quoteCalculation.breakdown.surcharges, quoteCalculation.currency)}</span>
                      </div>
                    )}
                    
                    {quoteCalculation.breakdown.addons > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Services additionnels</span>
                        <span className="font-medium">{formatPrice(quoteCalculation.breakdown.addons, quoteCalculation.currency)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">TVA</span>
                      <span className="font-medium">{formatPrice(quoteCalculation.breakdown.vat, quoteCalculation.currency)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">{formatPrice(quoteCalculation.total, quoteCalculation.currency)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Remplissez le formulaire pour voir le calcul</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
