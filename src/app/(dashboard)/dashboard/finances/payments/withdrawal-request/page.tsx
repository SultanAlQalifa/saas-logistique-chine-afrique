'use client'

import { useState } from 'react'
import { 
  Smartphone, 
  DollarSign, 
  Send, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  Building
} from 'lucide-react'

interface WithdrawalForm {
  amount: string
  method: string
  phoneNumber: string
  reason: string
}

const paymentMethods = [
  { id: 'orange_money', name: 'Orange Money', logo: '🟠', prefix: '+221 7' },
  { id: 'free_money', name: 'Free Money', logo: '🔵', prefix: '+221 7' },
  { id: 'wave', name: 'Wave', logo: '💙', prefix: '+221 7' },
  { id: 'mtn_momo', name: 'MTN Mobile Money', logo: '🟡', prefix: '+225 0' }
]

export default function WithdrawalRequestPage() {
  const [form, setForm] = useState<WithdrawalForm>({
    amount: '',
    method: '',
    phoneNumber: '',
    reason: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount.replace(/[^\d]/g, ''))
    return isNaN(num) ? '' : new Intl.NumberFormat('fr-FR').format(num)
  }

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    setForm(prev => ({ ...prev, amount: numericValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.amount || !form.method || !form.phoneNumber) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires')
      return
    }

    const amount = parseFloat(form.amount)
    if (amount < 1000) {
      alert('⚠️ Le montant minimum est de 1 000 FCFA')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulation d'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitted(true)
      alert(`✅ Demande de décaissement envoyée !\n\nMontant: ${formatCurrency(form.amount)} FCFA\nMéthode: ${paymentMethods.find(m => m.id === form.method)?.name}\nNuméro: ${form.phoneNumber}\n\n⏳ Votre demande sera traitée sous 24h.`)
    } catch (error) {
      alert('❌ Erreur lors de l\'envoi de la demande. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedMethod = paymentMethods.find(m => m.id === form.method)

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Demande Envoyée !</h1>
          <p className="text-gray-600 mb-6">
            Votre demande de décaissement a été transmise à notre équipe. 
            Vous recevrez une notification une fois traitée.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800">
              <div className="font-semibold">Récapitulatif:</div>
              <div>Montant: {formatCurrency(form.amount)} FCFA</div>
              <div>Méthode: {selectedMethod?.name}</div>
              <div>Numéro: {form.phoneNumber}</div>
            </div>
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setForm({ amount: '', method: '', phoneNumber: '', reason: '' })
            }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Nouvelle Demande
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </button>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Smartphone className="h-8 w-8" />
              💸 Demande de Décaissement
            </h1>
            <p className="text-blue-100">
              Demandez un décaissement de vos fonds via Mobile Money
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Montant à décaisser *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.amount ? formatCurrency(form.amount) : ''}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold pr-16"
                  placeholder="0"
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  FCFA
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Montant minimum: 1 000 FCFA</p>
            </div>

            {/* Méthode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📱 Méthode de paiement *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setForm(prev => ({ ...prev, method: method.id }))}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      form.method === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{method.logo}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.prefix}X XXX XX XX</div>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded-full ${
                        form.method === method.id ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📞 Numéro de téléphone *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={selectedMethod ? `${selectedMethod.prefix}X XXX XX XX` : "+221 7X XXX XX XX"}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Numéro associé à votre compte {selectedMethod?.name || 'Mobile Money'}
              </p>
            </div>

            {/* Raison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Raison du décaissement (optionnel)
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Ex: Paiement fournisseur, salaires, etc."
              />
            </div>

            {/* Informations importantes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Informations importantes</h4>
                  <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                    <li>• Délai de traitement: 24h ouvrées maximum</li>
                    <li>• Frais de transaction selon l'opérateur mobile</li>
                    <li>• Vérifiez bien votre numéro de téléphone</li>
                    <li>• Vous recevrez une notification de confirmation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            {form.amount && form.method && form.phoneNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">📋 Récapitulatif</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  <div>Montant: <span className="font-semibold">{formatCurrency(form.amount)} FCFA</span></div>
                  <div>Méthode: <span className="font-semibold">{selectedMethod?.name}</span></div>
                  <div>Numéro: <span className="font-semibold">{form.phoneNumber}</span></div>
                  {form.reason && <div>Raison: <span className="font-semibold">{form.reason}</span></div>}
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isSubmitting || !form.amount || !form.method || !form.phoneNumber}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Envoyer la Demande
                </>
              )}
            </button>
          </form>
        </div>

        {/* Aide */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="h-5 w-5" />
            💡 Besoin d'aide ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
              <p>📧 support@logistique-ca.com</p>
              <p>📞 +221 33 XXX XX XX</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Horaires de traitement</h4>
              <p>🕒 Lundi - Vendredi: 8h - 18h</p>
              <p>🕒 Samedi: 8h - 12h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
