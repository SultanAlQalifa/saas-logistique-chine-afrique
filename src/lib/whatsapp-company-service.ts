// Service pour la gestion WhatsApp Business par entreprise
export interface CompanyWhatsAppConfig {
  id: string
  companyId: string
  phone_number_id: string
  access_token: string
  webhook_verify_token: string
  app_id: string
  app_secret: string
  business_account_id: string
  phone_number: string
  display_name: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  verified: boolean
  created_at: string
  updated_at: string
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
}

export interface WhatsAppStats {
  messagesEnvoyes: number
  messagesLivres: number
  tauxLivraison: number
  tempsReponse: string
  conversationsActives: number
  clientsUniques: number
}

export class CompanyWhatsAppService {
  private static readonly API_BASE = '/api/whatsapp/company'

  /**
   * Récupère la configuration WhatsApp d'une entreprise
   */
  static async getCompanyConfig(companyId: string): Promise<CompanyWhatsAppConfig | null> {
    try {
      const response = await fetch(`${this.API_BASE}/${companyId}/config`)
      const data = await response.json()
      
      if (data.success) {
        return data.config
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération de la config:', error)
      return null
    }
  }

  /**
   * Sauvegarde la configuration WhatsApp d'une entreprise
   */
  static async saveCompanyConfig(
    companyId: string, 
    config: Partial<CompanyWhatsAppConfig>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${companyId}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return { success: false, message: 'Erreur de connexion' }
    }
  }

  /**
   * Test la connexion WhatsApp Business
   */
  static async testConnection(
    companyId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${companyId}/test`, {
        method: 'POST'
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors du test de connexion:', error)
      return { success: false, message: 'Erreur de test de connexion' }
    }
  }

  /**
   * Récupère les statistiques WhatsApp d'une entreprise
   */
  static async getCompanyStats(companyId: string): Promise<WhatsAppStats | null> {
    try {
      const response = await fetch(`${this.API_BASE}/${companyId}/stats`)
      const data = await response.json()
      
      if (data.success) {
        return data.stats
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error)
      return null
    }
  }

  /**
   * Demande d'approbation par le SUPER_ADMIN
   */
  static async requestApproval(
    companyId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${companyId}/request-approval`, {
        method: 'POST'
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la demande d\'approbation:', error)
      return { success: false, message: 'Erreur lors de la demande' }
    }
  }

  /**
   * Envoie un message WhatsApp (pour les entreprises approuvées)
   */
  static async sendMessage(
    companyId: string,
    to: string,
    message: string,
    type: 'text' | 'template' = 'text'
  ): Promise<{ success: boolean; messageId?: string; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/${companyId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message, type })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      return { success: false, message: 'Erreur d\'envoi' }
    }
  }

  /**
   * Récupère l'historique des messages
   */
  static async getMessageHistory(
    companyId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.API_BASE}/${companyId}/messages?limit=${limit}&offset=${offset}`
      )
      const data = await response.json()
      
      if (data.success) {
        return data.messages
      }
      return []
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error)
      return []
    }
  }
}

// Service pour les SUPER_ADMIN
export class SuperAdminWhatsAppService {
  private static readonly API_BASE = '/api/whatsapp/admin'

  /**
   * Récupère toutes les demandes de configuration en attente
   */
  static async getPendingRequests(): Promise<CompanyWhatsAppConfig[]> {
    try {
      const response = await fetch(`${this.API_BASE}/pending-requests`)
      const data = await response.json()
      
      if (data.success) {
        return data.requests
      }
      return []
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error)
      return []
    }
  }

  /**
   * Approuve une configuration d'entreprise
   */
  static async approveConfig(
    configId: string,
    adminId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/approve/${configId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error)
      return { success: false, message: 'Erreur d\'approbation' }
    }
  }

  /**
   * Rejette une configuration d'entreprise
   */
  static async rejectConfig(
    configId: string,
    adminId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/reject/${configId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, reason })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors du rejet:', error)
      return { success: false, message: 'Erreur de rejet' }
    }
  }

  /**
   * Suspend une configuration d'entreprise
   */
  static async suspendConfig(
    configId: string,
    adminId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/suspend/${configId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId, reason })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la suspension:', error)
      return { success: false, message: 'Erreur de suspension' }
    }
  }

  /**
   * Récupère toutes les configurations d'entreprises
   */
  static async getAllConfigs(): Promise<CompanyWhatsAppConfig[]> {
    try {
      const response = await fetch(`${this.API_BASE}/all-configs`)
      const data = await response.json()
      
      if (data.success) {
        return data.configs
      }
      return []
    } catch (error) {
      console.error('Erreur lors de la récupération des configs:', error)
      return []
    }
  }

  /**
   * Récupère les statistiques globales
   */
  static async getGlobalStats(): Promise<{
    totalCompanies: number
    activeConfigs: number
    pendingRequests: number
    totalMessages: number
    successRate: number
  } | null> {
    try {
      const response = await fetch(`${this.API_BASE}/global-stats`)
      const data = await response.json()
      
      if (data.success) {
        return data.stats
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération des stats globales:', error)
      return null
    }
  }
}
