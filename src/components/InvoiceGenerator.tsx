'use client'

import { useState, useRef } from 'react'
import { InvoiceTransaction, InvoiceGenerationOptions } from '@/types/invoice'
import { 
  generateQRData, 
  qrDataToString, 
  formatCurrency, 
  formatDate 
} from '@/utils/invoiceUtils'
import { 
  Download, 
  Eye, 
  QrCode, 
  FileText, 
  Printer,
  Mail,
  Share2
} from 'lucide-react'

interface InvoiceGeneratorProps {
  invoice: InvoiceTransaction
  options?: Partial<InvoiceGenerationOptions>
  onGenerate?: (invoice: InvoiceTransaction) => void
}

export default function InvoiceGenerator({ 
  invoice, 
  options = {},
  onGenerate 
}: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  const defaultOptions: InvoiceGenerationOptions = {
    template: 'standard',
    includeQR: true,
    qrPosition: 'bottom-right',
    language: 'fr',
    currency: 'EUR',
    showTax: true,
    showDiscount: false,
    ...options
  }

  // Générer les données QR
  const qrData = generateQRData(invoice)
  const qrString = qrDataToString(qrData)

  // Générer le QR code (simulation - en production utiliser une vraie lib QR)
  const generateQRCodeDataURL = (data: string): string => {
    // Simulation d'un QR code - en production, utiliser qrcode.js ou similar
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 120
    canvas.height = 120
    
    if (ctx) {
      // Fond blanc
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 120, 120)
      
      // Bordure
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.strokeRect(5, 5, 110, 110)
      
      // Pattern QR simulé
      ctx.fillStyle = '#000000'
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if ((i + j + data.length) % 3 === 0) {
            ctx.fillRect(10 + i * 10, 10 + j * 10, 8, 8)
          }
        }
      }
      
      // Texte QR au centre
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(40, 50, 40, 20)
      ctx.fillStyle = '#000000'
      ctx.font = '8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('QR', 60, 62)
    }
    
    return canvas.toDataURL()
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    
    // Simulation de génération PDF
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // En production, utiliser jsPDF ou similar
    const element = invoiceRef.current
    if (element) {
      // Ici on utiliserait html2pdf ou jsPDF pour générer le PDF
      console.log('Génération PDF de la facture:', invoice.invoiceNumber)
      
      // Créer un lien de téléchargement simulé
      const blob = new Blob(['Facture PDF simulée'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Facture-${invoice.invoiceNumber}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    }
    
    setIsGenerating(false)
    onGenerate?.(invoice)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmailInvoice = () => {
    const subject = `Facture ${invoice.invoiceNumber}`
    const body = `Bonjour,\n\nVeuillez trouver ci-joint la facture ${invoice.invoiceNumber} pour un montant de ${formatCurrency(invoice.totalAmount, invoice.currency)}.\n\nCordialement`
    const mailtoLink = `mailto:${invoice.to.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-secondary-600" />
          <h3 className="text-lg font-semibold text-secondary-900">
            Facture {invoice.invoiceNumber}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-3 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Masquer' : 'Aperçu'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>
          <button
            onClick={handleEmailInvoice}
            className="flex items-center px-3 py-2 text-sm border border-secondary-300 rounded-lg hover:bg-secondary-50"
          >
            <Mail className="h-4 w-4 mr-2" />
            Envoyer
          </button>
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Génération...' : 'Télécharger PDF'}
          </button>
        </div>
      </div>

      {/* Aperçu de la facture */}
      {showPreview && (
        <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden">
          <div ref={invoiceRef} className="p-8 bg-white">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">FACTURE</h1>
                <div className="text-sm text-secondary-600">
                  <p>N° {invoice.invoiceNumber}</p>
                  <p>Date: {formatDate(invoice.date)}</p>
                  <p>Échéance: {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
              
              {/* QR Code */}
              {defaultOptions.includeQR && (
                <div className="flex flex-col items-center">
                  <img 
                    src={generateQRCodeDataURL(qrString)} 
                    alt="QR Code Facture"
                    className="w-24 h-24 border border-secondary-200 rounded"
                  />
                  <p className="text-xs text-secondary-500 mt-1 text-center">
                    Scannez pour<br />les détails
                  </p>
                </div>
              )}
            </div>

            {/* Adresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">De:</h3>
                <div className="text-sm text-secondary-700">
                  <p className="font-medium">{invoice.from.name}</p>
                  {invoice.from.company && <p>{invoice.from.company}</p>}
                  <p>{invoice.from.address}</p>
                  <p>{invoice.from.city}, {invoice.from.country}</p>
                  {invoice.from.postalCode && <p>{invoice.from.postalCode}</p>}
                  {invoice.from.phone && <p>Tél: {invoice.from.phone}</p>}
                  {invoice.from.email && <p>Email: {invoice.from.email}</p>}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">À:</h3>
                <div className="text-sm text-secondary-700">
                  <p className="font-medium">{invoice.to.name}</p>
                  {invoice.to.company && <p>{invoice.to.company}</p>}
                  <p>{invoice.to.address}</p>
                  <p>{invoice.to.city}, {invoice.to.country}</p>
                  {invoice.to.postalCode && <p>{invoice.to.postalCode}</p>}
                  {invoice.to.phone && <p>Tél: {invoice.to.phone}</p>}
                  {invoice.to.email && <p>Email: {invoice.to.email}</p>}
                </div>
              </div>
            </div>

            {/* Informations transport */}
            <div className="bg-secondary-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-secondary-900 mb-2">Détails du transport</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-secondary-600">Mode:</span>
                  <span className="ml-2 font-medium">{invoice.transportMode.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-secondary-600">De:</span>
                  <span className="ml-2 font-medium">{invoice.origin}</span>
                </div>
                <div>
                  <span className="text-secondary-600">Vers:</span>
                  <span className="ml-2 font-medium">{invoice.destination}</span>
                </div>
                {invoice.estimatedDelivery && (
                  <div className="md:col-span-3">
                    <span className="text-secondary-600">Livraison estimée:</span>
                    <span className="ml-2 font-medium">{formatDate(invoice.estimatedDelivery)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Articles */}
            <div className="mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-secondary-200">
                    <th className="text-left py-2 text-sm font-semibold text-secondary-900">Description</th>
                    <th className="text-center py-2 text-sm font-semibold text-secondary-900">Qté</th>
                    <th className="text-right py-2 text-sm font-semibold text-secondary-900">Prix unit.</th>
                    <th className="text-right py-2 text-sm font-semibold text-secondary-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-secondary-100">
                      <td className="py-3 text-sm">
                        <div>
                          <p className="font-medium text-secondary-900">{item.description}</p>
                          {item.weight && (
                            <p className="text-xs text-secondary-500">Poids: {item.weight}kg</p>
                          )}
                          {item.dimensions && (
                            <p className="text-xs text-secondary-500">
                              Dim: {item.dimensions.length}×{item.dimensions.width}×{item.dimensions.height}cm
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-center text-sm text-secondary-700">{item.quantity}</td>
                      <td className="py-3 text-right text-sm text-secondary-700">
                        {formatCurrency(item.unitPrice, invoice.currency)}
                      </td>
                      <td className="py-3 text-right text-sm font-medium text-secondary-900">
                        {formatCurrency(item.totalPrice, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-secondary-600">Sous-total:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.discountAmount && invoice.discountAmount > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-secondary-600">Remise:</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(invoice.discountAmount, invoice.currency)}
                    </span>
                  </div>
                )}
                {defaultOptions.showTax && invoice.taxAmount > 0 && (
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-secondary-600">TVA ({invoice.taxRate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-lg font-bold border-t border-secondary-200">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
                </div>
              </div>
            </div>

            {/* Statut de paiement */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary-600">Statut du paiement:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  invoice.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : invoice.paymentStatus === 'partial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {invoice.paymentStatus === 'paid' ? 'Payé' : 
                   invoice.paymentStatus === 'partial' ? 'Partiellement payé' : 'En attente'}
                </span>
                {invoice.paymentMethod && (
                  <>
                    <span className="text-sm text-secondary-600">Méthode:</span>
                    <span className="text-sm font-medium">{invoice.paymentMethod}</span>
                  </>
                )}
              </div>
            </div>

            {/* Notes et conditions */}
            {(invoice.notes || invoice.terms) && (
              <div className="border-t border-secondary-200 pt-6">
                {invoice.notes && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-secondary-900 mb-2">Notes:</h4>
                    <p className="text-sm text-secondary-700">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-2">Conditions:</h4>
                    <p className="text-sm text-secondary-700">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer avec info QR */}
            {defaultOptions.includeQR && (
              <div className="border-t border-secondary-200 pt-4 mt-6">
                <div className="flex items-center justify-center text-xs text-secondary-500">
                  <QrCode className="h-3 w-3 mr-1" />
                  Le QR code contient tous les détails de cette transaction pour vérification
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informations QR Code */}
      {defaultOptions.includeQR && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <QrCode className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">QR Code Transactionnel</h4>
              <p className="text-sm text-blue-700 mb-2">
                Le QR code contient toutes les informations de cette facture :
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Numéro et montant de la facture</li>
                <li>• Détails des articles et transport</li>
                <li>• Informations de paiement</li>
                <li>• Hash de vérification pour l'authenticité</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
