'use client'

import React, { useState, useEffect } from 'react'
import { SubscriptionPlan, UserSubscription, SubscriptionAnalytics } from '@/types/subscription'
import { subscriptionEngine } from '@/utils/subscriptionEngine'
import PlanEditor from './PlanEditor'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Settings,
  Crown,
  Star,
  Check,
  X,
  Calendar,
  CreditCard
} from 'lucide-react'

interface SubscriptionManagerProps {
  onPlanChange?: (plans: SubscriptionPlan[]) => void
  onAnalyticsChange?: (analytics: SubscriptionAnalytics) => void
}

export default function SubscriptionManager({ 
  onPlanChange, 
  onAnalyticsChange 
}: SubscriptionManagerProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null)
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions' | 'analytics'>('plans')
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showPlanEditor, setShowPlanEditor] = useState(false)
  const [loading, setLoading] = useState(false)

  // Mock data initialization
  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Create sample plans
    const freePlan = subscriptionEngine.createPlan({
      name: 'Gratuit',
      description: 'Plan de base pour commencer',
      type: 'free',
      status: 'active',
      pricing: { monthly: 0, yearly: 0, currency: 'EUR' },
      features: [
        { id: '1', name: 'Envoi de colis', description: 'Envoi basique', category: 'core', enabled: true },
        { id: '2', name: 'Suivi des colis', description: 'Suivi en temps réel', category: 'core', enabled: true }
      ],
      limitations: [
        { id: '1', type: 'packages', name: 'Colis par mois', value: 5, unit: 'colis', unlimited: false, period: 'monthly' },
        { id: '2', type: 'storage', name: 'Stockage', value: 100, unit: 'MB', unlimited: false }
      ],
      permissions: [
        { id: '1', resource: 'packages', actions: ['create', 'read'] }
      ],
      trial: { enabled: false, duration: 0, features: [] },
      billing: { cycle: 'monthly', invoicing: 'automatic', paymentMethods: ['card'] },
      metadata: { popular: false, recommended: false, customizable: false, order: 1, color: '#gray', icon: 'package' },
      createdBy: 'system'
    })

    const basicPlan = subscriptionEngine.createPlan({
      name: 'Basique',
      description: 'Pour les petites entreprises',
      type: 'basic',
      status: 'active',
      pricing: { monthly: 29, yearly: 290, currency: 'EUR' },
      features: [
        { id: '1', name: 'Envoi de colis', description: 'Envoi illimité', category: 'core', enabled: true, unlimited: true },
        { id: '2', name: 'Suivi avancé', description: 'Suivi détaillé', category: 'advanced', enabled: true },
        { id: '3', name: 'Support email', description: 'Support par email', category: 'core', enabled: true }
      ],
      limitations: [
        { id: '1', type: 'packages', name: 'Colis par mois', value: 100, unit: 'colis', unlimited: false, period: 'monthly' },
        { id: '2', type: 'users', name: 'Utilisateurs', value: 3, unit: 'utilisateurs', unlimited: false }
      ],
      permissions: [
        { id: '1', resource: 'packages', actions: ['create', 'read', 'update'] },
        { id: '2', resource: 'reports', actions: ['read'] }
      ],
      trial: { enabled: true, duration: 14, features: ['basic_features'] },
      billing: { cycle: 'monthly', invoicing: 'automatic', paymentMethods: ['card', 'bank'] },
      metadata: { popular: true, recommended: false, customizable: false, order: 2, color: '#blue', icon: 'truck' },
      createdBy: 'system'
    })

    const premiumPlan = subscriptionEngine.createPlan({
      name: 'Premium',
      description: 'Pour les entreprises en croissance',
      type: 'premium',
      status: 'active',
      pricing: { monthly: 99, yearly: 990, currency: 'EUR' },
      features: [
        { id: '1', name: 'Tout du plan Basique', description: 'Toutes les fonctionnalités', category: 'core', enabled: true },
        { id: '2', name: 'API avancée', description: 'Intégrations API', category: 'premium', enabled: true },
        { id: '3', name: 'Analytics avancés', description: 'Rapports détaillés', category: 'premium', enabled: true },
        { id: '4', name: 'Support prioritaire', description: 'Support 24/7', category: 'premium', enabled: true }
      ],
      limitations: [
        { id: '1', type: 'packages', name: 'Colis par mois', value: -1, unit: 'colis', unlimited: true },
        { id: '2', type: 'users', name: 'Utilisateurs', value: 10, unit: 'utilisateurs', unlimited: false },
        { id: '3', type: 'api_calls', name: 'Appels API', value: 10000, unit: 'appels', unlimited: false, period: 'monthly' }
      ],
      permissions: [
        { id: '1', resource: 'packages', actions: ['create', 'read', 'update', 'delete'] },
        { id: '2', resource: 'reports', actions: ['read', 'export'] },
        { id: '3', resource: 'api', actions: ['read', 'create'] }
      ],
      trial: { enabled: true, duration: 30, features: ['premium_features'] },
      billing: { cycle: 'monthly', invoicing: 'automatic', paymentMethods: ['card', 'bank', 'wire'] },
      metadata: { popular: false, recommended: true, customizable: true, order: 3, color: '#purple', icon: 'crown' },
      createdBy: 'system'
    })

    setPlans([freePlan, basicPlan, premiumPlan])
    
    // Create sample subscriptions
    const sub1 = subscriptionEngine.createSubscription('user1', basicPlan.id, { trial: true })
    const sub2 = subscriptionEngine.createSubscription('user2', premiumPlan.id)
    setSubscriptions([sub1, sub2])

    // Get analytics
    const analyticsData = subscriptionEngine.getAnalytics()
    setAnalytics(analyticsData)

    // Callbacks
    onPlanChange?.([freePlan, basicPlan, premiumPlan])
    onAnalyticsChange?.(analyticsData)
  }

  const handleCreatePlan = () => {
    setIsCreating(true)
    setEditingPlan(null)
    setShowPlanEditor(true)
  }

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setIsCreating(false)
    setShowPlanEditor(true)
  }

  const handleClosePlanEditor = () => {
    setShowPlanEditor(false)
    setEditingPlan(null)
    setIsCreating(false)
  }

  const handleSavePlan = (plan: SubscriptionPlan) => {
    if (isCreating) {
      setPlans(prev => [...prev, plan])
    } else {
      setPlans(prev => prev.map(p => p.id === plan.id ? plan : p))
    }
    onPlanChange?.(plans)
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      try {
        subscriptionEngine.deletePlan(planId)
        setPlans(prev => prev.filter(p => p.id !== planId))
      } catch (error) {
        alert('Impossible de supprimer ce plan : ' + (error as Error).message)
      }
    }
  }

  const renderPlanCard = (plan: SubscriptionPlan) => (
    <div key={plan.id} className="bg-white rounded-lg shadow-md border p-6 relative">
      {plan.metadata.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Populaire
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {plan.name}
            {plan.metadata.recommended && <Star className="h-5 w-5 text-yellow-500" />}
          </h3>
          <p className="text-gray-600 text-sm">{plan.description}</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleEditPlan(plan)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeletePlan(plan.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {plan.pricing.monthly}€
          </span>
          <span className="text-gray-600">/mois</span>
        </div>
        {plan.pricing.yearly > 0 && (
          <p className="text-sm text-green-600">
            {plan.pricing.yearly}€/an (économisez {((plan.pricing.monthly * 12 - plan.pricing.yearly) / (plan.pricing.monthly * 12) * 100).toFixed(0)}%)
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-900">Fonctionnalités :</h4>
        {plan.features.slice(0, 3).map(feature => (
          <div key={feature.id} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">{feature.name}</span>
          </div>
        ))}
        {plan.features.length > 3 && (
          <p className="text-sm text-gray-500">+{plan.features.length - 3} autres fonctionnalités</p>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <h4 className="font-medium text-gray-900">Limitations :</h4>
        {plan.limitations.slice(0, 2).map(limit => (
          <div key={limit.id} className="text-sm text-gray-600">
            {limit.name}: {limit.unlimited ? 'Illimité' : `${limit.value} ${limit.unit}`}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          plan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {plan.status === 'active' ? 'Actif' : 'Inactif'}
        </span>
        
        <div className="text-sm text-gray-500">
          {subscriptionEngine.getSubscriptionsByPlan(plan.id).length} abonnés
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Abonnements</h2>
          <p className="text-gray-600">Gérez vos plans d'abonnement et analysez les performances</p>
        </div>
        
        <button
          onClick={handleCreatePlan}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition duration-200"
        >
          <Plus className="h-4 w-4" />
          Nouveau Plan
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'plans', label: 'Plans', icon: Crown },
            { id: 'subscriptions', label: 'Abonnements', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(renderPlanCard)}
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Abonnements Actifs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prochaine facturation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map(subscription => {
                  const plan = plans.find(p => p.id === subscription.planId)
                  return (
                    <tr key={subscription.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subscription.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan?.name || 'Plan inconnu'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                          subscription.status === 'trial' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.status === 'active' ? 'Actif' :
                           subscription.status === 'trial' ? 'Essai' :
                           subscription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subscription.billing.nextBillingDate.toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Modifier
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Annuler
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abonnements Totaux</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalSubscriptions}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abonnements Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.activeSubscriptions}</p>
              </div>
              <Crown className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MRR</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.mrr}€</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ARR</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.overview.arr}€</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Plan Editor Modal */}
      <PlanEditor
        plan={editingPlan}
        isOpen={showPlanEditor}
        onClose={handleClosePlanEditor}
        onSave={handleSavePlan}
      />
    </div>
  )
}
