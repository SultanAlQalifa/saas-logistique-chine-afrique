// Service de paiement pour les espaces publicitaires
import { AdPayment } from '@/types/advertising'

export interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'mobile_money' | 'bank_transfer'
  icon: string
  available: boolean
  fees: number // Pourcentage de frais
}

export interface PaymentRequest {
  amount: number
  currency: 'XOF'
  advertisementId: string
  companyId: string
  duration: number // en jours
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer'
  customerInfo: {
    name: string
    email: string
    phone: string
  }
}

export interface PaymentResponse {
  success: boolean
  paymentId: string
  transactionId?: string
  paymentUrl?: string
  message: string
  error?: string
}

class PaymentService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

  // Méthodes de paiement disponibles
  getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'orange_money',
        name: 'Orange Money',
        type: 'mobile_money',
        icon: '🟠',
        available: true,
        fees: 1.5
      },
      {
        id: 'mtn_money',
        name: 'MTN Mobile Money',
        type: 'mobile_money',
        icon: '🟡',
        available: true,
        fees: 1.5
      },
      {
        id: 'moov_money',
        name: 'Moov Money',
        type: 'mobile_money',
        icon: '🔵',
        available: true,
        fees: 1.5
      },
      {
        id: 'visa_mastercard',
        name: 'Visa/Mastercard',
        type: 'card',
        icon: '💳',
        available: true,
        fees: 2.9
      },
      {
        id: 'bank_transfer',
        name: 'Virement Bancaire',
        type: 'bank_transfer',
        icon: '🏦',
        available: true,
        fees: 0
      }
    ]
  }

  // Calculer le montant total avec frais
  calculateTotalAmount(amount: number, paymentMethodId: string): number {
    const method = this.getPaymentMethods().find(m => m.id === paymentMethodId)
    if (!method) return amount

    const fees = (amount * method.fees) / 100
    return amount + fees
  }

  // Initier un paiement
  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulation d'un appel API de paiement
      console.log('Initiation du paiement:', request)

      // Validation des données
      if (!request.amount || request.amount <= 0) {
        return {
          success: false,
          paymentId: '',
          message: 'Montant invalide',
          error: 'INVALID_AMOUNT'
        }
      }

      if (!request.customerInfo.email || !request.customerInfo.phone) {
        return {
          success: false,
          paymentId: '',
          message: 'Informations client incomplètes',
          error: 'MISSING_CUSTOMER_INFO'
        }
      }

      // Générer un ID de paiement unique
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Simulation selon le type de paiement
      switch (request.paymentMethod) {
        case 'mobile_money':
          return {
            success: true,
            paymentId,
            transactionId,
            message: 'Paiement initié. Veuillez composer le code USSD envoyé par SMS.',
            paymentUrl: `tel:*144*${request.amount}#`
          }

        case 'card':
          return {
            success: true,
            paymentId,
            transactionId,
            message: 'Redirection vers la page de paiement sécurisée...',
            paymentUrl: `https://payment-gateway.example.com/pay/${paymentId}`
          }

        case 'bank_transfer':
          return {
            success: true,
            paymentId,
            transactionId,
            message: 'Instructions de virement bancaire envoyées par email.'
          }

        default:
          return {
            success: false,
            paymentId: '',
            message: 'Méthode de paiement non supportée',
            error: 'UNSUPPORTED_PAYMENT_METHOD'
          }
      }

    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement:', error)
      return {
        success: false,
        paymentId: '',
        message: 'Erreur technique lors du paiement',
        error: 'TECHNICAL_ERROR'
      }
    }
  }

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(paymentId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    transactionId?: string
    paidAt?: string
  }> {
    try {
      // Simulation d'une vérification de statut
      console.log('Vérification du statut pour:', paymentId)

      // Simulation: 80% de chance de succès après 3 secondes
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const success = Math.random() > 0.2
      
      if (success) {
        return {
          status: 'completed',
          transactionId: `txn_${Date.now()}`,
          paidAt: new Date().toISOString()
        }
      } else {
        return {
          status: 'failed'
        }
      }

    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error)
      return {
        status: 'failed'
      }
    }
  }

  // Créer un enregistrement de paiement
  async createPaymentRecord(
    advertisementId: string,
    companyId: string,
    amount: number,
    duration: number,
    paymentMethod: 'card' | 'mobile_money' | 'bank_transfer',
    transactionId?: string
  ): Promise<AdPayment> {
    const payment: AdPayment = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      advertisementId,
      companyId,
      amount,
      currency: 'XOF',
      duration,
      paymentMethod,
      status: 'pending',
      transactionId,
      createdAt: new Date().toISOString()
    }

    // Ici, on sauvegarderait en base de données
    console.log('Enregistrement du paiement:', payment)
    
    return payment
  }

  // Confirmer un paiement
  async confirmPayment(paymentId: string, transactionId: string): Promise<boolean> {
    try {
      // Ici, on mettrait à jour le statut en base de données
      console.log(`Confirmation du paiement ${paymentId} avec transaction ${transactionId}`)
      
      // Simulation d'une mise à jour réussie
      return true
    } catch (error) {
      console.error('Erreur lors de la confirmation du paiement:', error)
      return false
    }
  }

  // Rembourser un paiement
  async refundPayment(paymentId: string, reason: string): Promise<boolean> {
    try {
      console.log(`Remboursement du paiement ${paymentId} pour: ${reason}`)
      
      // Simulation d'un remboursement réussi
      return true
    } catch (error) {
      console.error('Erreur lors du remboursement:', error)
      return false
    }
  }

  // Obtenir l'historique des paiements d'une entreprise
  async getPaymentHistory(companyId: string): Promise<AdPayment[]> {
    try {
      // Simulation de données d'historique
      const mockPayments: AdPayment[] = [
        {
          id: 'payment_1',
          advertisementId: 'ad_1',
          companyId,
          amount: 90000,
          currency: 'XOF',
          duration: 7,
          paymentMethod: 'mobile_money',
          status: 'completed',
          transactionId: 'txn_123456',
          createdAt: '2024-01-15T10:00:00Z',
          paidAt: '2024-01-15T10:05:00Z'
        },
        {
          id: 'payment_2',
          advertisementId: 'ad_2',
          companyId,
          amount: 300000,
          currency: 'XOF',
          duration: 30,
          paymentMethod: 'card',
          status: 'completed',
          transactionId: 'txn_789012',
          createdAt: '2024-01-10T14:30:00Z',
          paidAt: '2024-01-10T14:32:00Z'
        }
      ]

      return mockPayments
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error)
      return []
    }
  }
}

export const paymentService = new PaymentService()
export default PaymentService
