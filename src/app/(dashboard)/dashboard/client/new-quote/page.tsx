'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Package, 
  MapPin, 
  Calculator, 
  Send, 
  ArrowLeft,
  Truck,
  Ship,
  Plane,
  Clock,
  DollarSign,
  Weight,
  Ruler,
  FileText,
  User,
  Phone,
  Mail
} from 'lucide-react'

interface QuoteFormData {
  // Informations expéditeur
  senderName: string
  senderPhone: string
  senderEmail: string
  senderAddress: string
  
  // Informations destinataire
  receiverName: string
  receiverPhone: string
  receiverEmail: string
  receiverAddress: string
  
  // Détails du colis
  description: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  value: number
  
  // Options d'expédition
  transportMode: 'MARITIME' | 'AERIAL' | 'MARITIME_EXPRESS'
  urgency: 'STANDARD' | 'EXPRESS' | 'URGENT'
  
  // Services additionnels
  insurance: boolean
  packaging: boolean
  tracking: boolean
  
  // Notes
  notes: string
}

export default function NewQuotePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  
  const [formData, setFormData] = useState<QuoteFormData>({
    senderName: '',
    senderPhone: '',
    senderEmail: session?.user?.email || '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverAddress: '',
    description: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    value: 0,
    transportMode: 'MARITIME',
    urgency: 'STANDARD',
    insurance: false,
    packaging: false,
    tracking: true,
    notes: ''
  })

  const transportModes = [
    { 
      value: 'MARITIME', 
      label: 'Maritime Standard', 
      icon: Ship, 
      duration: '25-35 jours',
      description: 'Économique, idéal pour gros volumes'
    },
    { 
      value: 'MARITIME_EXPRESS', 
      label: 'Maritime Express', 
      icon: Ship, 
      duration: '15-20 jours',
      description: 'Plus rapide que le maritime standard'
    },
    { 
      value: 'AERIAL', 
      label: 'Aérien', 
      icon: Plane, 
      duration: '3-7 jours',
      description: 'Rapide, pour colis urgents'
    }
  ]

  const calculateEstimate = () => {
    const baseRates = {
      MARITIME: 2500,
      MARITIME_EXPRESS: 4000,
      AERIAL: 8000
    }
    
    const urgencyMultiplier = {
      STANDARD: 1,
      EXPRESS: 1.3,
      URGENT: 1.6
    }
    
    let price = baseRates[formData.transportMode] * formData.weight
    price *= urgencyMultiplier[formData.urgency]
    
    if (formData.insurance) price += formData.value * 0.02
    if (formData.packaging) price += 5000
    if (formData.tracking) price += 2000
    
    setEstimatedPrice(Math.round(price))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simuler l'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('🎉 Votre demande de devis a été envoyée avec succès ! Vous recevrez une réponse sous 24h.')
      router.push('/dashboard/client/quote-requests')
    } catch (error) {
      alert('❌ Erreur lors de l\'envoi de la demande. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateDimensions = (dimension: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => router.back()}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-4xl font-bold">📋 Nouveau Devis</h1>
            </div>
            <p className="text-green-100 text-lg">Créez une demande de devis personnalisée pour votre expédition</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
            <Calculator className="h-12 w-12" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations Expéditeur */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            📤 Informations Expéditeur
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
              <input
                type="text"
                required
                value={formData.senderName}
                onChange={(e) => updateFormData('senderName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Votre nom complet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <input
                type="tel"
                required
                value={formData.senderPhone}
                onChange={(e) => updateFormData('senderPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+221 77 123 45 67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.senderEmail}
                onChange={(e) => updateFormData('senderEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
              <input
                type="text"
                required
                value={formData.senderAddress}
                onChange={(e) => updateFormData('senderAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Adresse complète avec ville"
              />
            </div>
          </div>
        </div>

        {/* Informations Destinataire */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            📥 Informations Destinataire
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
              <input
                type="text"
                required
                value={formData.receiverName}
                onChange={(e) => updateFormData('receiverName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nom du destinataire"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <input
                type="tel"
                required
                value={formData.receiverPhone}
                onChange={(e) => updateFormData('receiverPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+86 138 0013 8000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.receiverEmail}
                onChange={(e) => updateFormData('receiverEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="email@destinataire.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
              <input
                type="text"
                required
                value={formData.receiverAddress}
                onChange={(e) => updateFormData('receiverAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Adresse complète avec ville et pays"
              />
            </div>
          </div>
        </div>

        {/* Détails du Colis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            📦 Détails du Colis
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description du contenu *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Décrivez le contenu de votre colis (électroniques, vêtements, etc.)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Weight className="h-4 w-4" />
                  Poids (kg) *
                </label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valeur déclarée (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.value}
                  onChange={(e) => updateFormData('value', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  min="0"
                  value={formData.dimensions.length}
                  onChange={(e) => updateDimensions('length', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Longueur"
                />
                <input
                  type="number"
                  min="0"
                  value={formData.dimensions.width}
                  onChange={(e) => updateDimensions('width', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Largeur"
                />
                <input
                  type="number"
                  min="0"
                  value={formData.dimensions.height}
                  onChange={(e) => updateDimensions('height', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Hauteur"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Options d'Expédition */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-orange-600" />
            🚚 Options d'Expédition
          </h3>
          
          <div className="space-y-6">
            {/* Mode de Transport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Mode de transport *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {transportModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <div
                      key={mode.value}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.transportMode === mode.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateFormData('transportMode', mode.value)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{mode.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{mode.description}</p>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mode.duration}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Urgence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Niveau d'urgence</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'STANDARD', label: 'Standard', description: 'Délai normal' },
                  { value: 'EXPRESS', label: 'Express', description: '+30% - Plus rapide' },
                  { value: 'URGENT', label: 'Urgent', description: '+60% - Priorité maximale' }
                ].map((urgency) => (
                  <div
                    key={urgency.value}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.urgency === urgency.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateFormData('urgency', urgency.value)}
                  >
                    <span className="font-medium block mb-1">{urgency.label}</span>
                    <p className="text-sm text-gray-600">{urgency.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Additionnels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Services additionnels</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.insurance}
                    onChange={(e) => updateFormData('insurance', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span>🛡️ Assurance (2% de la valeur déclarée)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.packaging}
                    onChange={(e) => updateFormData('packaging', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span>📦 Emballage professionnel (+5,000 FCFA)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.tracking}
                    onChange={(e) => updateFormData('tracking', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span>📍 Suivi GPS en temps réel (+2,000 FCFA)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            📝 Notes et Instructions
          </h3>
          <textarea
            value={formData.notes}
            onChange={(e) => updateFormData('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Instructions spéciales, préférences de livraison, etc."
          />
        </div>

        {/* Estimation et Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <button
                type="button"
                onClick={calculateEstimate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Calculator className="h-5 w-5" />
                Calculer l'estimation
              </button>
              {estimatedPrice && (
                <p className="mt-2 text-lg font-bold text-blue-800">
                  💰 Estimation: {estimatedPrice.toLocaleString('fr-FR')} FCFA
                </p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Envoyer la demande
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
