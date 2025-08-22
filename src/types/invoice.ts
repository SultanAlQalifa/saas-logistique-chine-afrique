export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  cbm?: number
}

export interface InvoiceAddress {
  name: string
  company?: string
  address: string
  city: string
  country: string
  postalCode?: string
  phone?: string
  email?: string
}

export interface InvoiceTransaction {
  id: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  
  // Parties
  from: InvoiceAddress
  to: InvoiceAddress
  
  // Items
  items: InvoiceItem[]
  
  // Pricing
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount?: number
  totalAmount: number
  
  // Transport details
  transportMode: 'AERIAL' | 'AERIAL_EXPRESS' | 'MARITIME' | 'MARITIME_EXPRESS'
  origin: string
  destination: string
  estimatedDelivery?: Date
  
  // Payment
  paymentMethod?: string
  paymentStatus: 'pending' | 'partial' | 'paid' | 'failed'
  paidAmount?: number
  
  // Additional info
  notes?: string
  terms?: string
  currency: string
  
  // QR Code data
  qrCodeData?: string
  
  // Metadata
  createdBy: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceQRData {
  invoiceId: string
  invoiceNumber: string
  amount: number
  currency: string
  date: string
  from: {
    name: string
    company?: string
  }
  to: {
    name: string
    company?: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  transport: {
    mode: string
    origin: string
    destination: string
    estimatedDelivery?: string
  }
  payment: {
    status: string
    method?: string
    paidAmount?: number
  }
  verification: {
    hash: string
    timestamp: string
  }
}

export interface InvoiceGenerationOptions {
  template: 'standard' | 'minimal' | 'detailed'
  includeQR: boolean
  qrPosition: 'top-right' | 'bottom-right' | 'bottom-center'
  language: 'fr' | 'en'
  currency: string
  showTax: boolean
  showDiscount: boolean
  watermark?: string
}
