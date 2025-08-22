export interface CommunicationTemplate {
  id: string
  companyId: string
  name: string
  subject: string
  content: string
  type: 'EMAIL' | 'SMS' | 'WHATSAPP'
  category: 'MARKETING' | 'NOTIFICATION' | 'UPDATE' | 'REMINDER'
  variables: string[] // Variables dynamiques comme {clientName}, {packageId}, etc.
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationCampaign {
  id: string
  companyId: string
  name: string
  description: string
  templateId: string
  type: 'EMAIL' | 'SMS' | 'WHATSAPP'
  targetType: 'ALL_CLIENTS' | 'SPECIFIC_CLIENTS' | 'CLIENT_SEGMENT' | 'AGENTS' | 'COMPANIES'
  targetIds: string[] // IDs des destinataires spécifiques
  targetCriteria?: {
    minOrderValue?: number
    lastOrderDays?: number
    location?: string
    transportMode?: string
  }
  scheduledAt?: Date
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED'
  sentCount: number
  deliveredCount: number
  openedCount: number
  clickedCount: number
  failedCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationLog {
  id: string
  campaignId?: string
  companyId: string
  recipientId: string
  recipientType: 'CLIENT' | 'AGENT' | 'COMPANY'
  type: 'EMAIL' | 'SMS' | 'WHATSAPP'
  subject?: string
  content: string
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'FAILED'
  errorMessage?: string
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  createdAt: Date
}

export interface WhatsAppConfig {
  id: string
  companyId: string
  phoneNumberId: string
  accessToken: string
  webhookUrl: string
  isActive: boolean
  verifyToken: string
  businessAccountId: string
}

export interface SMSConfig {
  id: string
  companyId: string
  provider: 'TWILIO' | 'NEXMO' | 'ORANGE' | 'MTN'
  apiKey: string
  apiSecret: string
  senderId: string
  isActive: boolean
}

export interface CommunicationStats {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
  recentCampaigns: CommunicationCampaign[]
  topPerformingTemplate: CommunicationTemplate | null
}
