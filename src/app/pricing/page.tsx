'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { Check, Ship, Plane, Truck, Clock, Zap, Package, ArrowLeft, Sparkles, Star, Shield, Calculator } from 'lucide-react'

interface PlanData {
  id: string
  name: string
  slug: string
  price_month: number
  price_year: number
  features: string[]
  limits: any
  highlighted: boolean
  display_order: number
}

interface AddonData {
  id: string
  name: string
  slug: string
  description: string
  pricing_type: string
  price: number
  unit_label: string
  taxable: boolean
  display_order: number
}

interface PricingSettings {
  tenant: {
    id: string
    name: string
    currency_default: string
    vat_rate: number
  }
  billing: {
    currency_default: string
    vat_rate: number
    fx_rates: {
      eur_to_xof: number
      eur_to_usd: number
      updated_at: string
    }
  }
  settings: {
    allow_public_quotes: boolean
    require_registration: boolean
    auto_approve_quotes: boolean
    whatsapp_notifications: boolean
  }
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PlanData[]>([])
  const [addons, setAddons] = useState<AddonData[]>([])
  const [settings, setSettings] = useState<PricingSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPricingData()
  }, [])

  const loadPricingData = async () => {
    try {
      setLoading(true)
      
      // Charger les plans publics
      const plansResponse = await fetch('/api/public/plans', {
        headers: {
          'X-Tenant-ID': 'default-tenant'
        }
      })
      
      if (!plansResponse.ok) {
        throw new Error('Erreur lors du chargement des plans')
      }
      
      const plansData = await plansResponse.json()
      setPlans(plansData.data || [])

      // Charger les add-ons publics
      const addonsResponse = await fetch('/api/public/addons', {
        headers: {
          'X-Tenant-ID': 'default-tenant'
        }
      })
      
      if (!addonsResponse.ok) {
        throw new Error('Erreur lors du chargement des add-ons')
      }
      
      const addonsData = await addonsResponse.json()
      setAddons(addonsData.data || [])

      // Charger les paramètres de tarification
      const settingsResponse = await fetch('/api/public/pricing/settings', {
        headers: {
          'X-Tenant-ID': 'default-tenant'
        }
      })
      
      if (!settingsResponse.ok) {
        throw new Error('Erreur lors du chargement des paramètres')
      }
      
      const settingsData = await settingsResponse.json()
      setSettings(settingsData.data)

    } catch (err) {
      console.error('Erreur chargement données pricing:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
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

  const formatAddonPrice = (addon: AddonData) => {
    const currency = settings?.billing.currency_default || 'EUR'
    const basePrice = formatPrice(addon.price, currency)
    
    switch (addon.pricing_type) {
      case 'percent_of_value':
        return `${(addon.price * 100).toFixed(1)}% de la valeur`
      case 'per_kg':
        return `${basePrice}/kg`
      case 'per_m3':
        return `${basePrice}/m³`
      default:
        return `${basePrice}/unité`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des tarifs...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Erreur: {error}</p>
              <button 
                onClick={loadPricingData}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-all duration-300 hover:gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Tarification transparente
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Nos <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Tarifs</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Des solutions flexibles adaptées à tous vos besoins logistiques entre la Chine et l'Afrique.
            </p>
          </div>

          {/* Subscription Plans - Dynamic */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Plans d'Abonnement</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choisissez la formule qui correspond à vos besoins</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => {
                const currency = settings?.billing.currency_default || 'EUR'
                const isHighlighted = plan.highlighted
                const planIcon = index === 0 ? Zap : index === 1 ? Sparkles : Shield
                const PlanIcon = planIcon
                
                return (
                  <div 
                    key={plan.id}
                    className={`group relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                      isHighlighted 
                        ? 'bg-white/90 backdrop-blur-sm border-2 border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 scale-105' 
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10'
                    }`}
                  >
                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isHighlighted 
                        ? 'bg-gradient-to-br from-blue-50/80 to-purple-50/40' 
                        : 'bg-gradient-to-br from-gray-50/50 to-blue-50/30'
                    }`}></div>
                    
                    {isHighlighted && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                          <Star className="w-4 h-4 inline mr-1" />
                          Populaire
                        </div>
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className={`text-center mb-8 ${isHighlighted ? 'mt-4' : ''}`}>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                          isHighlighted 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200'
                        }`}>
                          <PlanIcon className={`w-8 h-8 ${isHighlighted ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className={`text-5xl font-bold mb-2 ${
                          isHighlighted 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent'
                        }`}>
                          {plan.price_month === 0 ? 'Gratuit' : formatPrice(plan.price_month, currency)}
                          {plan.price_month > 0 && <span className="text-xl text-gray-500">/mois</span>}
                        </div>
                        <p className="text-gray-600">
                          {plan.limits?.support_level === 'basic' ? 'Pour découvrir nos services' :
                           plan.limits?.support_level === 'premium' ? 'Pour les entreprises en croissance' :
                           'Pour les grandes entreprises'}
                        </p>
                      </div>
                      
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isHighlighted ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              <Check className={`w-4 h-4 ${isHighlighted ? 'text-blue-600' : 'text-green-600'}`} />
                            </div>
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Link
                        href={plan.price_month === 0 ? "/signin" : "/quote"}
                        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 text-center block shadow-lg hover:shadow-xl ${
                          isHighlighted 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:shadow-blue-500/25' 
                            : plan.price_month === 0
                              ? 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 group-hover:shadow-lg'
                              : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white group-hover:shadow-gray-500/25'
                        }`}
                      >
                        {plan.price_month === 0 ? 'Commencer gratuitement' :
                         plan.name === 'Enterprise' ? 'Nous contacter' :
                         'Essai gratuit 14 jours'}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Transport Services */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Services de Transport</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Solutions logistiques adaptées à vos besoins</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Maritime */}
              <div className="group relative bg-gradient-to-br from-blue-50/80 to-cyan-50/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-cyan-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl shadow-lg">
                      <Ship className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Maritime</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-blue-200/30">
                      <span className="text-gray-700 font-medium">20' Container</span>
                      <span className="font-bold text-2xl text-blue-600">1 637 500 FCFA</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-blue-200/30">
                      <span className="text-gray-700 font-medium">40' Container</span>
                      <span className="font-bold text-2xl text-blue-600">2 753 400 FCFA</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-blue-200/30">
                      <span className="text-gray-700 font-medium">LCL (par m³)</span>
                      <span className="font-bold text-2xl text-blue-600">55 675 FCFA</span>
                    </div>
                    <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/60 rounded-2xl p-4 mt-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Délai: 25-35 jours</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700 mt-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Idéal pour: Gros volumes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aérien */}
              <div className="group relative bg-gradient-to-br from-purple-50/80 to-pink-50/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-pink-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg">
                      <Plane className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Aérien</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-purple-200/30">
                      <span className="text-gray-700 font-medium">Express (par kg)</span>
                      <span className="font-bold text-2xl text-purple-600">7 860 FCFA</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-purple-200/30">
                      <span className="text-gray-700 font-medium">Standard (par kg)</span>
                      <span className="font-bold text-2xl text-purple-600">5 240 FCFA</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-purple-200/30">
                      <span className="text-gray-700 font-medium">Économique (par kg)</span>
                      <span className="font-bold text-2xl text-purple-600">3 930 FCFA</span>
                    </div>
                    <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/60 rounded-2xl p-4 mt-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Délai: 3-7 jours</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700 mt-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Idéal pour: Urgences, petits volumes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Routier */}
              <div className="group relative bg-gradient-to-br from-green-50/80 to-teal-50/60 backdrop-blur-sm rounded-3xl p-8 border border-green-200/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-teal-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-teal-600 p-4 rounded-2xl shadow-lg">
                      <Truck className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Routier</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-green-200/30">
                      <span className="text-gray-700 font-medium">Camion complet</span>
                      <span className="font-bold text-2xl text-green-600">1 179 000 FCFA</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-green-200/30">
                      <span className="text-gray-700 font-medium">Groupage (par m³)</span>
                      <span className="font-bold text-2xl text-green-600">29 475 FCFA</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-green-200/30">
                      <span className="text-gray-700 font-medium">Express routier</span>
                      <span className="font-bold text-2xl text-green-600">1 441 000 FCFA</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-100/80 to-teal-100/60 rounded-2xl p-4 mt-6">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Délai: 15-20 jours</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700 mt-2">
                        <Truck className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Idéal pour: Volumes moyens</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services - Dynamic */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Services Additionnels</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Services complémentaires pour optimiser votre logistique</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {addons.map((addon, index) => {
                const addonIcons = [Package, Shield, Truck, Clock]
                const addonColors = [
                  'from-blue-500 to-indigo-600',
                  'from-green-500 to-emerald-600', 
                  'from-purple-500 to-pink-600',
                  'from-orange-500 to-amber-600'
                ]
                const addonBgColors = [
                  'from-blue-50/50 to-indigo-50/30',
                  'from-green-50/50 to-emerald-50/30',
                  'from-purple-50/50 to-pink-50/30', 
                  'from-orange-50/50 to-amber-50/30'
                ]
                const addonTextColors = [
                  'text-blue-600',
                  'text-green-600',
                  'text-purple-600',
                  'text-orange-600'
                ]
                
                const AddonIcon = addonIcons[index % addonIcons.length]
                const colorClass = addonColors[index % addonColors.length]
                const bgColorClass = addonBgColors[index % addonBgColors.length]
                const textColorClass = addonTextColors[index % addonTextColors.length]
                
                return (
                  <div key={addon.id} className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:-translate-y-2">
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgColorClass} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative z-10">
                      <div className={`bg-gradient-to-br ${colorClass} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                        <AddonIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{addon.name}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{addon.description}</p>
                      <p className={`${textColorClass} font-bold text-xl`}>
                        {formatAddonPrice(addon)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Choisissez le plan qui correspond à vos besoins et lancez-vous dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Essai gratuit 14 jours
              </Link>
              <Link
                href="/quote"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculer un devis
              </Link>
              <a
                href="https://wa.me/221776581741?text=Je%20veux%20une%20d%C3%A9mo%20NextMove%20Cargo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                📞 Réserver via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
