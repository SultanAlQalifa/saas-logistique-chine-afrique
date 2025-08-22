'use client'

import React, { useState, useEffect } from 'react'
import { Crown, Star, Zap, Shield, Users, TrendingUp, Plus, Edit, Check, X, Sparkles, Gift, Settings } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SubscriptionManager from '@/components/subscription/SubscriptionManager'

interface Plan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  description: string
  features: string[]
  popular: boolean
  maxUsers: number
  maxPackages: number
  color: string
  icon: any
}

interface Stats {
  totalSubscribers: number
  monthlyRevenue: number
  growthRate: number
  activeTrials: number
}

export default function SubscriptionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [viewMode, setViewMode] = useState<'public' | 'management'>('public')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'plan' | 'trial' | 'demo' | 'success'>('plan')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [stats, setStats] = useState<Stats>({
    totalSubscribers: 1247,
    monthlyRevenue: 45600,
    growthRate: 23.5,
    activeTrials: 89
  })

  // Vérification d'accès et redirection
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  // Fonction pour vérifier si l'utilisateur peut accéder à la gestion
  // Seuls les SUPER_ADMIN peuvent gérer les abonnements
  const canAccessManagement = () => {
    return session?.user.role === 'SUPER_ADMIN'
  }

  // Réinitialiser le mode si l'utilisateur n'a pas accès à la gestion
  useEffect(() => {
    if (viewMode === 'management' && !canAccessManagement()) {
      setViewMode('public')
    }
  }, [viewMode, session])

  // Fonctions pour gérer les actions des boutons
  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan)
    setModalType('plan')
    setShowModal(true)
  }

  const handleTrialRequest = () => {
    setModalType('trial')
    setShowModal(true)
  }

  const handleDemoRequest = () => {
    setModalType('demo')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPlan(null)
    setSuccessMessage('')
  }

  const handleConfirmSubscription = () => {
    if (selectedPlan) {
      // Rediriger vers la page de paiement avec les détails du plan
      const paymentUrl = `/dashboard/finances/payments?plan=${selectedPlan.id}&price=${selectedPlan.price}&period=${selectedPlan.period}`
      router.push(paymentUrl)
      closeModal()
    }
  }

  const handleStartTrial = () => {
    setSuccessMessage('Essai gratuit activé ! Vous avez maintenant accès à toutes nos fonctionnalités pendant 14 jours.')
    setModalType('success')
  }

  const handleSubmitDemo = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('Demande de démo envoyée ! Nous vous contacterons dans les 24h pour programmer votre démonstration personnalisée.')
    setModalType('success')
  }

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: selectedPeriod === 'monthly' ? 29 : 290,
      period: selectedPeriod,
      description: 'Parfait pour les petites entreprises qui démarrent',
      features: [
        'Jusqu\'à 5 utilisateurs',
        '100 colis par mois',
        'Support par email',
        'Dashboard basique',
        'Suivi des expéditions'
      ],
      popular: false,
      maxUsers: 5,
      maxPackages: 100,
      color: 'from-blue-500 to-blue-600',
      icon: Users
    },
    {
      id: 'professional',
      name: 'Professional',
      price: selectedPeriod === 'monthly' ? 79 : 790,
      period: selectedPeriod,
      description: 'Idéal pour les entreprises en croissance',
      features: [
        'Jusqu\'à 25 utilisateurs',
        '1000 colis par mois',
        'Support prioritaire',
        'Analytics avancées',
        'API complète',
        'Intégrations tierces',
        'Rapports personnalisés'
      ],
      popular: true,
      maxUsers: 25,
      maxPackages: 1000,
      color: 'from-purple-500 to-purple-600',
      icon: Crown
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: selectedPeriod === 'monthly' ? 199 : 1990,
      period: selectedPeriod,
      description: 'Pour les grandes entreprises avec des besoins spécifiques',
      features: [
        'Utilisateurs illimités',
        'Colis illimités',
        'Support 24/7 dédié',
        'Dashboard personnalisé',
        'White-label',
        'SLA garanti',
        'Formation équipe',
        'Intégration sur mesure'
      ],
      popular: false,
      maxUsers: -1,
      maxPackages: -1,
      color: 'from-emerald-500 to-emerald-600',
      icon: Shield
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header avec gradient moderne et toggle */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Crown className="h-10 w-10" />
                {viewMode === 'public' ? 'Abonnements Premium' : 'Gestion des Abonnements'}
              </h1>
              <p className="text-indigo-100 text-lg">
                {viewMode === 'public' 
                  ? 'Choisissez le plan parfait pour votre entreprise' 
                  : 'Administrez les plans et abonnements'
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Toggle View Mode - Conditionnel selon les permissions */}
              <div className="bg-white/20 rounded-2xl p-1 flex">
                <button
                  onClick={() => setViewMode('public')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    viewMode === 'public'
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Vue Client
                </button>
                {canAccessManagement() && (
                  <button
                    onClick={() => setViewMode('management')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'management'
                        ? 'bg-white text-indigo-600 shadow-lg'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    Gestion
                  </button>
                )}
              </div>
              <div className="hidden md:flex items-center gap-4">
                <Sparkles className="h-12 w-12 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* Contenu conditionnel selon le mode */}
      {viewMode === 'management' ? (
        /* Mode Gestion - Composant SubscriptionManager */
        <SubscriptionManager 
          onPlanChange={(plans) => {
            // Callback pour synchroniser les plans si nécessaire
            console.log('Plans updated:', plans)
          }}
          onAnalyticsChange={(analytics) => {
            // Callback pour synchroniser les analytics si nécessaire
            console.log('Analytics updated:', analytics)
          }}
        />
      ) : (
        /* Mode Public - Interface client existante */
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Abonnés</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalSubscribers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Revenus Mensuels</p>
              <p className="text-3xl font-bold text-green-900">{stats.monthlyRevenue.toLocaleString()} €</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Croissance</p>
              <p className="text-3xl font-bold text-purple-900">+{stats.growthRate}%</p>
            </div>
            <Star className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Essais Actifs</p>
              <p className="text-3xl font-bold text-orange-900">{stats.activeTrials}</p>
            </div>
            <Gift className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Toggle période */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setSelectedPeriod('yearly')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                selectedPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans d'abonnement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl shadow-2xl border-2 transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'border-purple-500 ring-4 ring-purple-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Badge populaire */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Plus Populaire
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Header du plan */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  {/* Prix */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}€</span>
                      <span className="text-gray-500">/{plan.period === 'monthly' ? 'mois' : 'an'}</span>
                    </div>
                    {selectedPeriod === 'yearly' && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Économisez {Math.round((plan.price * 12 * 0.2) / 12)}€/mois
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelection(plan)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg'
                  }`}
                >
                  {plan.popular ? 'Commencer Maintenant' : 'Choisir ce Plan'}
                </button>

                {/* Garantie */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  ✨ Garantie satisfait ou remboursé 30 jours
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Section FAQ ou avantages */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir nos plans ?</h2>
          <p className="text-gray-600 text-lg">Tous nos plans incluent ces avantages exceptionnels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sécurité Maximale</h3>
            <p className="text-gray-600">Chiffrement de bout en bout et conformité RGPD garantie</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Optimale</h3>
            <p className="text-gray-600">Infrastructure cloud haute performance avec 99.9% d'uptime</p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Support Dédié</h3>
            <p className="text-gray-600">Équipe d'experts disponible pour vous accompagner</p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre logistique ?</h2>
        <p className="text-indigo-100 text-lg mb-6">Rejoignez plus de 1000+ entreprises qui nous font confiance</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleTrialRequest}
            className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
          >
            Essai Gratuit 14 jours
          </button>
          <button 
            onClick={handleDemoRequest}
            className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-colors"
          >
            Demander une Démo
          </button>
        </div>
      </div>
        </>
      )}

      {/* Modal pour les actions */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {modalType === 'plan' && selectedPlan && (
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedPlan.color} mb-4`}>
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan {selectedPlan.name}</h3>
                <p className="text-gray-600 mb-6">Vous avez sélectionné le plan {selectedPlan.name} à {selectedPlan.price}€/{selectedPlan.period === 'monthly' ? 'mois' : 'an'}</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleConfirmSubscription}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Confirmer l'Abonnement
                  </button>
                  <button 
                    onClick={closeModal}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {modalType === 'trial' && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Essai Gratuit 14 jours</h3>
                <p className="text-gray-600 mb-6">Testez toutes nos fonctionnalités gratuitement pendant 14 jours, sans engagement.</p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleStartTrial}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Commencer l'Essai Gratuit
                  </button>
                  <button 
                    onClick={closeModal}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            )}

            {modalType === 'demo' && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Demander une Démo</h3>
                <p className="text-gray-600 mb-6">Un de nos experts vous contactera pour vous présenter notre solution.</p>
                
                <form onSubmit={handleSubmitDemo} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom de votre entreprise"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email professionnel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Programmer la Démo
                  </button>
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                </form>
              </div>
            )}

            {modalType === 'success' && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Succès !</h3>
                <p className="text-gray-600 mb-6">{successMessage}</p>
                
                <button 
                  onClick={closeModal}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Parfait !
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
