'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { X, FileText, Download, Send, DollarSign, User, Package, CheckCircle } from 'lucide-react'

interface BillingInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  order: {
    id: string
    trackingNumber: string
    clientName: string
    clientEmail: string
    clientPhone: string
    companyName?: string
    description: string
    weight: number
    origin: { country: string; city: string; address: string }
    destination: { country: string; city: string; address: string }
    finalPrice?: number
    estimatedPrice: number
    estimatedDelivery?: string
    paymentMethod?: 'online' | 'cash_upfront' | 'cash_on_delivery'
    acceptedAt?: string
    notes?: string
  }
  onGenerateInvoice: (invoiceData: {
    invoiceNumber: string
    dueDate: string
    taxRate: number
    discount: number
    additionalCharges: Array<{ description: string; amount: number }>
    terms: string
  }) => void
  onSendInvoice: (method: 'email' | 'sms' | 'whatsapp') => void
}

export default function BillingInvoiceModal({
  isOpen,
  onClose,
  order,
  onGenerateInvoice,
  onSendInvoice
}: BillingInvoiceModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<'details' | 'billing' | 'preview' | 'send'>('details')
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`)
  const [dueDate, setDueDate] = useState('')
  const [taxRate, setTaxRate] = useState(18)
  const [discount, setDiscount] = useState(0)
  const [additionalCharges, setAdditionalCharges] = useState<Array<{description: string, amount: number}>>([])
  const [newChargeDescription, setNewChargeDescription] = useState('')
  const [newChargeAmount, setNewChargeAmount] = useState(0)
  const [terms, setTerms] = useState('Paiement à réception de facture. Retard de paiement : pénalités de 1.5% par mois.')

  if (!isOpen) return null

  const baseAmount = order.finalPrice || order.estimatedPrice + additionalCharges.reduce((sum, charge) => sum + charge.amount, 0) - discount
  const taxAmount = (baseAmount * taxRate) / 100
  const totalAmount = baseAmount + taxAmount

  const addCharge = () => {
    if (newChargeDescription.trim() && newChargeAmount > 0) {
      setAdditionalCharges([...additionalCharges, {
        description: newChargeDescription.trim(),
        amount: newChargeAmount
      }])
      setNewChargeDescription('')
      setNewChargeAmount(0)
    }
  }

  const removeCharge = (index: number) => {
    setAdditionalCharges(additionalCharges.filter((_, i) => i !== index))
  }

  const handleGenerateInvoice = () => {
    onGenerateInvoice({
      invoiceNumber,
      dueDate,
      taxRate,
      discount,
      additionalCharges,
      terms
    })
    setStep('preview')
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'online': return '💻 Paiement en Ligne'
      case 'cash_upfront': return '💵 Cash à l\'Avance'
      case 'cash_on_delivery': return '📦 Paiement à la Réception'
      default: return 'Non défini'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🧾 Facturation & Devis</h2>
              <p className="text-green-100 mt-1">Commande #{order.trackingNumber}</p>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {['details', 'billing', 'preview', 'send'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName ? 'bg-green-600 text-white' : 
                  ['details', 'billing', 'preview', 'send'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {['details', 'billing', 'preview', 'send'].indexOf(step) > index ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    ['details', 'billing', 'preview', 'send'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 'details' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />👤 Informations Client
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom:</span>
                      <span className="font-medium">{order.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{order.clientEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">{order.clientPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />📦 Détails Commande
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">N° Suivi:</span>
                      <span className="font-medium">#{order.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{order.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix:</span>
                      <p className="text-2xl font-bold text-blue-600">{(order.finalPrice || order.estimatedPrice).toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep('billing')}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                >
                  Créer Facture ➡️
                </button>
              </div>
            </div>
          )}

          {step === 'billing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />🧾 Configuration Facture
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de Facture</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date d'Échéance</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taux de TVA (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Remise (FCFA)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">💰 Récapitulatif</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Prix de base:</span>
                    <span>{(order.finalPrice || order.estimatedPrice).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Remise:</span>
                      <span>-{discount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span>Sous-total:</span>
                    <span>{baseAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({taxRate}%):</span>
                    <span>{taxAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">{totalAmount.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('details')}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ⬅️ Retour
                </button>
                <button
                  onClick={handleGenerateInvoice}
                  disabled={!dueDate}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium disabled:opacity-50"
                >
                  Générer Facture ➡️
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800">FACTURE</h1>
                  <p className="text-gray-600 mt-2">N° {invoiceNumber}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">De:</h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">NextMove Cargo</p>
                      <p>123 Avenue des Transports</p>
                      <p>Dakar, Sénégal</p>
                      <p>contact@nextmovecargo.com</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">À:</h3>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{order.clientName}</p>
                      <p>{order.clientEmail}</p>
                      <p>{order.clientPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2">
                          <p className="font-medium">Transport de colis</p>
                          <p className="text-sm text-gray-600">#{order.trackingNumber} - {order.description}</p>
                        </td>
                        <p className="text-lg font-semibold">{(order.finalPrice || order.estimatedPrice).toLocaleString('fr-FR')} FCFA</p>
                      </tr>
                      {discount > 0 && (
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-green-600">Remise</td>
                          <td className="text-right py-2 text-green-600">-{discount.toLocaleString('fr-FR')} FCFA</td>
                        </tr>
                      )}
                      <tr className="border-b border-gray-200">
                        <td className="py-2">TVA ({taxRate}%)</td>
                        <td className="text-right py-2">{taxAmount.toLocaleString('fr-FR')} FCFA</td>
                      </tr>
                      <tr className="border-b-2 border-gray-300">
                        <td className="py-2 font-bold text-lg">TOTAL</td>
                        <td className="text-right py-2 font-bold text-lg text-green-600">{totalAmount.toLocaleString('fr-FR')} FCFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>Merci pour votre confiance !</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('billing')}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ⬅️ Modifier
                </button>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />📄 PDF
                  </button>
                  <button
                    onClick={() => setStep('send')}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                  >
                    Envoyer ➡️
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'send' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Send className="w-5 h-5 mr-2" />📤 Envoyer la Facture
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => onSendInvoice('email')}
                    className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium mb-1">📧 Email</h4>
                    <p className="text-sm text-gray-600">{order.clientEmail}</p>
                  </button>

                  <button
                    onClick={() => onSendInvoice('sms')}
                    className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-center"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium mb-1">📱 SMS</h4>
                    <p className="text-sm text-gray-600">{order.clientPhone}</p>
                  </button>

                  <button
                    onClick={() => onSendInvoice('whatsapp')}
                    className="p-6 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all text-center"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Send className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-medium mb-1">💬 WhatsApp</h4>
                    <p className="text-sm text-gray-600">{order.clientPhone}</p>
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('preview')}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ⬅️ Retour
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                >
                  ✅ Terminé
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
