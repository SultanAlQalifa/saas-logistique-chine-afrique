'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Shield, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  ArrowLeft,
  Info,
  Calculator,
  Calendar,
  CreditCard,
  Package,
  Truck,
  Plane,
  Ship
} from 'lucide-react'

interface RefundPolicy {
  id: string
  category: string
  conditions: string[]
  refundPercentage: number
  timeLimit: number
  requiredDocuments: string[]
  processingTime: string
  description: string
}

interface RefundRule {
  id: string
  title: string
  description: string
  conditions: string[]
  refundAmount: string
  timeframe: string
  exceptions: string[]
}

export default function RefundPolicyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock refund policies
  const [refundPolicies, setRefundPolicies] = useState<RefundPolicy[]>([
    {
      id: '1',
      category: 'Colis Endommagé',
      conditions: [
        'Dommages visibles à la réception',
        'Photos des dommages fournies dans les 24h',
        'Emballage original conservé',
        'Rapport de livraison signé avec mention des dommages'
      ],
      refundPercentage: 100,
      timeLimit: 48,
      requiredDocuments: ['Photos des dommages', 'Rapport de livraison', 'Facture originale'],
      processingTime: '3-5 jours ouvrables',
      description: 'Remboursement intégral pour les colis endommagés pendant le transport'
    },
    {
      id: '2',
      category: 'Colis Perdu',
      conditions: [
        'Aucune livraison après 30 jours',
        'Enquête de traçabilité complétée',
        'Confirmation de perte par le transporteur',
        'Déclaration de perte signée'
      ],
      refundPercentage: 100,
      timeLimit: 720,
      requiredDocuments: ['Numéro de tracking', 'Facture originale', 'Déclaration de perte'],
      processingTime: '7-10 jours ouvrables',
      description: 'Remboursement intégral après confirmation de perte définitive'
    },
    {
      id: '3',
      category: 'Retard de Livraison',
      conditions: [
        'Dépassement du délai garanti de plus de 7 jours',
        'Mode de transport express uniquement',
        'Pas de circonstances exceptionnelles',
        'Client non responsable du retard'
      ],
      refundPercentage: 50,
      timeLimit: 168,
      requiredDocuments: ['Reçu de paiement', 'Preuve du délai garanti'],
      processingTime: '2-3 jours ouvrables',
      description: 'Remboursement partiel pour les retards significatifs en mode express'
    },
    {
      id: '4',
      category: 'Annulation Client',
      conditions: [
        'Demande avant expédition du colis',
        'Colis non encore en transit',
        'Frais de traitement déjà engagés',
        'Annulation dans les 24h de la commande'
      ],
      refundPercentage: 80,
      timeLimit: 24,
      requiredDocuments: ['Numéro de commande', 'Justificatif de paiement'],
      processingTime: '1-2 jours ouvrables',
      description: 'Remboursement partiel après déduction des frais de traitement'
    }
  ])

  const generalRules: RefundRule[] = [
    {
      id: '1',
      title: 'Délais de Demande',
      description: 'Toute demande de remboursement doit être effectuée dans les délais spécifiés pour chaque catégorie.',
      conditions: [
        'Respect des délais par catégorie',
        'Demande formelle via le système',
        'Justificatifs complets fournis'
      ],
      refundAmount: 'Variable selon la catégorie',
      timeframe: '24h à 30 jours selon le cas',
      exceptions: ['Force majeure', 'Circonstances exceptionnelles', 'Erreur de notre part']
    },
    {
      id: '2',
      title: 'Méthodes de Remboursement',
      description: 'Les remboursements sont effectués selon la méthode de paiement originale ou alternatives approuvées.',
      conditions: [
        'Même méthode que le paiement original',
        'Compte bancaire vérifié pour virements',
        'Mobile Money pour paiements locaux'
      ],
      refundAmount: 'Montant approuvé moins les frais',
      timeframe: '1-10 jours selon la méthode',
      exceptions: ['Compte fermé', 'Méthode indisponible', 'Demande de changement']
    },
    {
      id: '3',
      title: 'Exclusions de Remboursement',
      description: 'Certaines situations ne donnent pas droit à un remboursement selon nos conditions.',
      conditions: [
        'Adresse de livraison incorrecte fournie par le client',
        'Refus de réception sans motif valable',
        'Dommages causés par un mauvais emballage du client'
      ],
      refundAmount: 'Aucun remboursement',
      timeframe: 'N/A',
      exceptions: ['Erreur prouvée de notre part', 'Circonstances exceptionnelles']
    }
  ]

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [session, status, router])

  const handleSavePolicy = () => {
    // Here you would save the policy changes
    setEditMode(false)
    // Show success message
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Shield className="h-10 w-10" />
                📋 Politique de Remboursement
              </h1>
            </div>
            <p className="text-blue-100 text-lg">
              Règles et conditions pour les demandes de remboursement
            </p>
          </div>
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleSavePolicy}
                  className="bg-green-500/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-green-500/30 transition-all flex items-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Edit className="h-5 w-5" />
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Info },
            { id: 'policies', label: 'Politiques par Catégorie', icon: FileText },
            { id: 'rules', label: 'Règles Générales', icon: Shield },
            { id: 'calculator', label: 'Calculateur', icon: Calculator }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              Statistiques Remboursements
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                <span className="text-green-700 font-medium">Taux d'approbation</span>
                <span className="text-2xl font-bold text-green-600">85%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span className="text-blue-700 font-medium">Temps moyen de traitement</span>
                <span className="text-2xl font-bold text-blue-600">3.2 jours</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="text-purple-700 font-medium">Montant moyen</span>
                <span className="text-2xl font-bold text-purple-600">67,500 FCFA</span>
              </div>
            </div>
          </div>

          {/* Transport Modes */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Truck className="h-6 w-6 text-orange-600" />
              Politiques par Mode de Transport
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Plane className="h-6 w-6 text-orange-600" />
                  <span className="font-medium text-orange-700">Aérien Express</span>
                </div>
                <span className="text-sm text-orange-600">Remboursement rapide</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Ship className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-700">Maritime</span>
                </div>
                <span className="text-sm text-blue-600">Délais étendus</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-700">Routier</span>
                </div>
                <span className="text-sm text-green-600">Conditions standard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {refundPolicies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{policy.category}</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {policy.refundPercentage}% remboursement
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{policy.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Conditions
                  </h4>
                  <ul className="space-y-1">
                    {policy.conditions.map((condition, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Délai limite
                    </h4>
                    <p className="text-sm text-gray-600">{policy.timeLimit}h après livraison</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Traitement
                    </h4>
                    <p className="text-sm text-gray-600">{policy.processingTime}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600" />
                    Documents requis
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {policy.requiredDocuments.map((doc, index) => (
                      <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-6">
          {generalRules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{rule.title}</h3>
                  <p className="text-gray-600">{rule.description}</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Conditions
                  </h4>
                  <ul className="space-y-2">
                    {rule.conditions.map((condition, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Montant
                  </h4>
                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                    {rule.refundAmount}
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 mt-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Délai
                  </h4>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    {rule.timeframe}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Exceptions
                  </h4>
                  <ul className="space-y-2">
                    {rule.exceptions.map((exception, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        {exception}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calculator className="h-8 w-8 text-blue-600" />
            Calculateur de Remboursement
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie de demande
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option>Sélectionner une catégorie</option>
                  <option>Colis Endommagé</option>
                  <option>Colis Perdu</option>
                  <option>Retard de Livraison</option>
                  <option>Annulation Client</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant original (FCFA)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 75000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode de transport
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option>Sélectionner le mode</option>
                  <option>Aérien Express</option>
                  <option>Aérien Standard</option>
                  <option>Maritime Express</option>
                  <option>Maritime Standard</option>
                  <option>Routier</option>
                </select>
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all">
                Calculer le Remboursement
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Résultat du Calcul</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <span className="text-gray-700">Montant éligible:</span>
                  <span className="font-bold text-gray-900">-- FCFA</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                  <span className="text-gray-700">Pourcentage applicable:</span>
                  <span className="font-bold text-blue-600">--%</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-green-100 rounded-xl">
                  <span className="text-green-700 font-medium">Montant du remboursement:</span>
                  <span className="font-bold text-green-600 text-xl">-- FCFA</span>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Sélectionnez une catégorie pour voir le calcul
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
