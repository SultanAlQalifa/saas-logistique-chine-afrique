'use client'

interface WaveConfig {
  apiKey: string
  apiSecret: string
  baseUrl: string
}

interface WavePaymentRequest {
  amount: number
  currency: string
  phoneNumber: string
  description?: string
  reference?: string
}

interface WavePaymentResponse {
  success: boolean
  transactionId?: string
  status?: string
  message?: string
  error?: string
}

export class WaveMoneyAPI {
  private config: WaveConfig

  constructor() {
    this.config = {
      apiKey: process.env.WAVE_API_KEY || '',
      apiSecret: process.env.WAVE_API_SECRET || '',
      baseUrl: 'https://api.wave.com/v1'
    }
  }

  async initiatePayment(request: WavePaymentRequest): Promise<WavePaymentResponse> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          error: 'Wave Money API not configured'
        }
      }

      const payload = {
        amount: request.amount,
        currency: request.currency || 'XOF',
        phone_number: request.phoneNumber,
        description: request.description || 'NextMove Cargo Payment',
        reference: request.reference || `NM-${Date.now()}`
      }

      const response = await fetch(`${this.config.baseUrl}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Secret': this.config.apiSecret
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Wave Money API Error:', error)
        return {
          success: false,
          error: `API Error: ${response.status}`
        }
      }

      const result = await response.json()
      
      return {
        success: true,
        transactionId: result.transaction_id,
        status: result.status,
        message: result.message
      }
    } catch (error) {
      console.error('Error initiating Wave Money payment:', error)
      return {
        success: false,
        error: 'Network error'
      }
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<WavePaymentResponse> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          error: 'Wave Money API not configured'
        }
      }

      const response = await fetch(`${this.config.baseUrl}/payments/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Secret': this.config.apiSecret
        }
      })

      if (!response.ok) {
        return {
          success: false,
          error: `API Error: ${response.status}`
        }
      }

      const result = await response.json()
      
      return {
        success: true,
        transactionId: result.transaction_id,
        status: result.status,
        message: result.message
      }
    } catch (error) {
      console.error('Error checking Wave Money payment status:', error)
      return {
        success: false,
        error: 'Network error'
      }
    }
  }

  async processRefund(transactionId: string, amount?: number): Promise<WavePaymentResponse> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          error: 'Wave Money API not configured'
        }
      }

      const payload = {
        transaction_id: transactionId,
        amount: amount // Optional partial refund
      }

      const response = await fetch(`${this.config.baseUrl}/payments/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Secret': this.config.apiSecret
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        return {
          success: false,
          error: `API Error: ${response.status}`
        }
      }

      const result = await response.json()
      
      return {
        success: true,
        transactionId: result.refund_id,
        status: result.status,
        message: result.message
      }
    } catch (error) {
      console.error('Error processing Wave Money refund:', error)
      return {
        success: false,
        error: 'Network error'
      }
    }
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.apiSecret)
  }

  // Format phone number for Wave (ensure proper format)
  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')
    
    // Add country code if missing (assuming Senegal +221)
    if (cleaned.length === 9) {
      return `221${cleaned}`
    }
    
    return cleaned
  }

  // Validate phone number for Wave Money
  isValidPhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone)
    // Wave Money typically supports Senegalese numbers (221XXXXXXXXX)
    return /^221[0-9]{9}$/.test(formatted)
  }
}

export default WaveMoneyAPI
