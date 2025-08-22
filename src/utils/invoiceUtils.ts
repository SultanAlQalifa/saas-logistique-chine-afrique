import { InvoiceTransaction, InvoiceQRData } from '@/types/invoice'

// Fonction pour créer un hash simple (en production, utiliser une vraie fonction de hash)
function createSimpleHash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

// Générer les données pour le QR code
export function generateQRData(invoice: InvoiceTransaction): InvoiceQRData {
  const qrData: InvoiceQRData = {
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    amount: invoice.totalAmount,
    currency: invoice.currency,
    date: invoice.date.toISOString().split('T')[0],
    from: {
      name: invoice.from.name,
      company: invoice.from.company
    },
    to: {
      name: invoice.to.name,
      company: invoice.to.company
    },
    items: invoice.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.totalPrice
    })),
    transport: {
      mode: invoice.transportMode,
      origin: invoice.origin,
      destination: invoice.destination,
      estimatedDelivery: invoice.estimatedDelivery?.toISOString().split('T')[0]
    },
    payment: {
      status: invoice.paymentStatus,
      method: invoice.paymentMethod,
      paidAmount: invoice.paidAmount
    },
    verification: {
      hash: createSimpleHash(JSON.stringify({
        id: invoice.id,
        number: invoice.invoiceNumber,
        amount: invoice.totalAmount,
        date: invoice.date.toISOString()
      })),
      timestamp: new Date().toISOString()
    }
  }

  return qrData
}

// Convertir les données QR en string JSON compressé
export function qrDataToString(qrData: InvoiceQRData): string {
  return JSON.stringify(qrData)
}

// Générer un numéro de facture unique
export function generateInvoiceNumber(companyId: string): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  
  return `INV-${year}${month}-${random}`
}

// Calculer les totaux de facture
export function calculateInvoiceTotals(
  items: Array<{ quantity: number; unitPrice: number }>,
  taxRate: number = 0,
  discountAmount: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  const taxAmount = subtotal * (taxRate / 100)
  const totalAmount = subtotal + taxAmount - discountAmount

  return {
    subtotal,
    taxAmount,
    totalAmount
  }
}

// Formater la devise
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Formater la date
export function formatDate(date: Date, locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Valider les données de facture
export function validateInvoiceData(invoice: Partial<InvoiceTransaction>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!invoice.from?.name) errors.push('Nom de l\'expéditeur requis')
  if (!invoice.to?.name) errors.push('Nom du destinataire requis')
  if (!invoice.items || invoice.items.length === 0) errors.push('Au moins un article requis')
  if (!invoice.transportMode) errors.push('Mode de transport requis')
  if (!invoice.origin) errors.push('Origine requise')
  if (!invoice.destination) errors.push('Destination requise')

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Générer des données de facture de test
export function generateMockInvoice(overrides: Partial<InvoiceTransaction> = {}): InvoiceTransaction {
  const invoiceNumber = generateInvoiceNumber('company-1')
  const date = new Date()
  const dueDate = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 jours

  const items = [
    {
      id: '1',
      description: 'Expédition colis - Guangzhou vers Douala',
      quantity: 1,
      unitPrice: 150.00,
      totalPrice: 150.00,
      weight: 25.5,
      dimensions: { length: 60, width: 40, height: 30 }
    },
    {
      id: '2',
      description: 'Assurance transport',
      quantity: 1,
      unitPrice: 15.00,
      totalPrice: 15.00
    }
  ]

  const totals = calculateInvoiceTotals(items, 20, 0)

  const mockInvoice: InvoiceTransaction = {
    id: `inv-${Date.now()}`,
    invoiceNumber,
    date,
    dueDate,
    status: 'sent',
    from: {
      name: 'Logistics Pro SAS',
      company: 'Logistics Pro SAS',
      address: '123 Avenue des Champs',
      city: 'Paris',
      country: 'France',
      postalCode: '75001',
      phone: '+33 1 23 45 67 89',
      email: 'contact@logisticspro.fr'
    },
    to: {
      name: 'Jean Dupont',
      company: 'Import Export SARL',
      address: '456 Boulevard de la Liberté',
      city: 'Douala',
      country: 'Cameroun',
      phone: '+237 6 12 34 56 78',
      email: 'jean.dupont@importexport.cm'
    },
    items,
    subtotal: totals.subtotal,
    taxRate: 20,
    taxAmount: totals.taxAmount,
    totalAmount: totals.totalAmount,
    transportMode: 'MARITIME',
    origin: 'Guangzhou, Chine',
    destination: 'Douala, Cameroun',
    estimatedDelivery: new Date(date.getTime() + 45 * 24 * 60 * 60 * 1000),
    paymentMethod: 'Virement bancaire',
    paymentStatus: 'pending',
    notes: 'Merci pour votre confiance. Paiement à réception de facture.',
    terms: 'Paiement sous 30 jours. Frais de retard : 1.5% par mois.',
    currency: 'EUR',
    createdBy: 'admin',
    companyId: 'company-1',
    createdAt: date,
    updatedAt: date,
    ...overrides
  }

  // Générer les données QR
  const qrData = generateQRData(mockInvoice)
  mockInvoice.qrCodeData = qrDataToString(qrData)

  return mockInvoice
}
