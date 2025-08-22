// Service pour la sélection d'entreprise par le client final
export interface WhatsAppProvider {
  id: string
  type: 'company' | 'super_admin'
  name: string
  display_name: string
  phone_number: string
  description: string
  logo?: string
  status: 'active' | 'inactive'
  response_time?: string
  availability: string
  specialties: string[]
  rating?: number
  total_conversations?: number
}

export interface ClientWhatsAppSelection {
  selectedProviderId: string
  selectedProviderType: 'company' | 'super_admin'
  conversationId?: string
  lastActivity?: string
}

export class ClientWhatsAppService {
  private static readonly API_BASE = '/api/whatsapp/client'

  /**
   * Récupère la liste des providers WhatsApp disponibles pour le client
   */
  static async getAvailableProviders(): Promise<WhatsAppProvider[]> {
    try {
      const response = await fetch(`${this.API_BASE}/providers`)
      const data = await response.json()
      
      if (data.success) {
        return data.providers
      }
      return []
    } catch (error) {
      console.error('Erreur lors de la récupération des providers:', error)
      return []
    }
  }

  /**
   * Sélectionne un provider WhatsApp pour le client
   */
  static async selectProvider(
    providerId: string,
    providerType: 'company' | 'super_admin'
  ): Promise<{ success: boolean; conversationId?: string; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/select-provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ providerId, providerType })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de la sélection du provider:', error)
      return { success: false, message: 'Erreur de connexion' }
    }
  }

  /**
   * Récupère la sélection actuelle du client
   */
  static async getCurrentSelection(): Promise<ClientWhatsAppSelection | null> {
    try {
      const response = await fetch(`${this.API_BASE}/current-selection`)
      const data = await response.json()
      
      if (data.success) {
        return data.selection
      }
      return null
    } catch (error) {
      console.error('Erreur lors de la récupération de la sélection:', error)
      return null
    }
  }

  /**
   * Envoie un message via le provider sélectionné
   */
  static async sendMessage(
    message: string,
    attachments?: File[]
  ): Promise<{ success: boolean; messageId?: string; message: string }> {
    try {
      const formData = new FormData()
      formData.append('message', message)
      
      if (attachments) {
        attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file)
        })
      }

      const response = await fetch(`${this.API_BASE}/send-message`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      return { success: false, message: 'Erreur d\'envoi' }
    }
  }

  /**
   * Récupère l'historique de conversation avec le provider sélectionné
   */
  static async getConversationHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.API_BASE}/conversation?limit=${limit}&offset=${offset}`
      )
      const data = await response.json()
      
      if (data.success) {
        return data.messages
      }
      return []
    } catch (error) {
      console.error('Erreur lors de la récupération de la conversation:', error)
      return []
    }
  }

  /**
   * Change de provider WhatsApp
   */
  static async switchProvider(
    newProviderId: string,
    newProviderType: 'company' | 'super_admin'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/switch-provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          newProviderId, 
          newProviderType 
        })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors du changement de provider:', error)
      return { success: false, message: 'Erreur de changement' }
    }
  }

  /**
   * Évalue la conversation avec le provider
   */
  static async rateConversation(
    rating: number,
    feedback?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.API_BASE}/rate-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, feedback })
      })
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erreur lors de l\'évaluation:', error)
      return { success: false, message: 'Erreur d\'évaluation' }
    }
  }

  /**
   * Récupère les providers recommandés basés sur le profil client
   */
  static async getRecommendedProviders(): Promise<WhatsAppProvider[]> {
    try {
      const response = await fetch(`${this.API_BASE}/recommended-providers`)
      const data = await response.json()
      
      if (data.success) {
        return data.providers
      }
      return []
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error)
      return []
    }
  }

  /**
   * Mock data pour les providers disponibles
   */
  static getMockProviders(): WhatsAppProvider[] {
    return [
      {
        id: 'super_admin',
        type: 'super_admin',
        name: 'NextMove Cargo Support',
        display_name: 'Support Officiel NextMove',
        phone_number: '+221 77 123 45 67',
        description: 'Support officiel de la plateforme NextMove Cargo. Assistance technique, questions générales et aide urgente.',
        status: 'active',
        response_time: '< 5 min',
        availability: '24/7',
        specialties: ['Support technique', 'Questions générales', 'Aide urgente', 'Problèmes de plateforme'],
        rating: 4.9,
        total_conversations: 15420
      },
      {
        id: 'logitrans_senegal',
        type: 'company',
        name: 'LogiTrans Sénégal',
        display_name: 'LogiTrans Sénégal',
        phone_number: '+221 77 456 78 90',
        description: 'Spécialiste du transport maritime Chine-Sénégal. Expert en dédouanement et livraison Dakar.',
        status: 'active',
        response_time: '< 10 min',
        availability: 'Lun-Ven 8h-18h',
        specialties: ['Transport maritime', 'Dédouanement Sénégal', 'Livraison Dakar', 'Groupage'],
        rating: 4.7,
        total_conversations: 892
      },
      {
        id: 'cargo_express_mali',
        type: 'company',
        name: 'Cargo Express Mali',
        display_name: 'Cargo Express Mali',
        phone_number: '+223 70 123 456',
        description: 'Transport rapide Chine-Mali. Spécialiste aérien et routier vers Bamako et régions.',
        status: 'active',
        response_time: '< 15 min',
        availability: 'Lun-Sam 7h-19h',
        specialties: ['Transport aérien', 'Transport routier', 'Livraison Mali', 'Express'],
        rating: 4.5,
        total_conversations: 567
      },
      {
        id: 'west_africa_logistics',
        type: 'company',
        name: 'West Africa Logistics',
        display_name: 'West Africa Logistics',
        phone_number: '+225 07 89 12 34',
        description: 'Réseau logistique Afrique de l\'Ouest. Couverture Côte d\'Ivoire, Ghana, Burkina Faso.',
        status: 'active',
        response_time: '< 20 min',
        availability: 'Lun-Ven 8h-17h',
        specialties: ['Réseau Afrique Ouest', 'Multi-pays', 'Logistique intégrée', 'Suivi GPS'],
        rating: 4.6,
        total_conversations: 1234
      }
    ]
  }
}
