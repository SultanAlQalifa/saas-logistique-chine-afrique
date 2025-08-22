/**
 * NextMove AI - Interface principale intégrée
 * Point d'entrée unique pour l'agent IA intelligent
 */

import { NextMoveAIOrchestrator, ConversationContext, ConversationResponse } from './nextmove-ai-orchestrator'
import { NextMoveAITemplates, TemplateContext } from './nextmove-ai-templates'
import { NEXTMOVE_AI_CONFIG } from './nextmove-ai-config'

export interface NextMoveAIMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  context?: any
}

export interface NextMoveAIResponse {
  message: string
  ctas?: Array<{ text: string; action?: string }>
  requires_input?: boolean
  escalated?: boolean
  confidence?: number
  processing_time?: number
}

export class NextMoveAI {
  private orchestrator: NextMoveAIOrchestrator
  private templates: NextMoveAITemplates
  private config = NEXTMOVE_AI_CONFIG

  constructor() {
    this.orchestrator = new NextMoveAIOrchestrator()
    this.templates = new NextMoveAITemplates()
  }

  /**
   * Point d'entrée principal pour traiter un message utilisateur
   */
  async processMessage(
    message: string,
    userId: string,
    channelId: string = 'web',
    userContext?: any
  ): Promise<NextMoveAIResponse> {
    const startTime = Date.now()

    try {
      // Validation des entrées
      if (!message?.trim()) {
        return this.createErrorResponse('Message vide', 'fr')
      }

      if (!userId) {
        return this.createErrorResponse('ID utilisateur requis', 'fr')
      }

      // Contexte de conversation
      const context: ConversationContext = {
        user_id: userId,
        channel_id: channelId,
        user_context: userContext
      }

      // Traitement par l'orchestrateur
      const response = await this.orchestrator.processMessage(message, context)

      // Calcul du temps de traitement
      const processingTime = Date.now() - startTime

      return {
        message: response.message,
        ctas: response.ctas,
        requires_input: response.requires_input,
        escalated: response.escalated,
        processing_time: processingTime
      }

    } catch (error) {
      console.error('Erreur NextMove AI:', error)
      return this.createErrorResponse(
        'Désolé, je rencontre un problème technique. Voulez-vous que je vous mette en relation avec un conseiller ?',
        'fr',
        [{ text: 'Parler à un conseiller', action: 'human_contact' }, { text: 'Réessayer', action: 'retry' }]
      )
    }
  }

  /**
   * Traite un message avec template personnalisé
   */
  async processWithTemplate(
    message: string,
    templateKey: string,
    templateData: any,
    userId: string,
    locale: string = 'fr'
  ): Promise<NextMoveAIResponse> {
    try {
      const templateContext: TemplateContext = {
        locale,
        data: templateData,
        user_name: templateData?.user_name
      }

      const templateResponse = this.templates.render(templateKey, templateContext)

      return {
        message: templateResponse.message,
        ctas: templateResponse.ctas?.map(text => ({ text })),
        requires_input: templateResponse.requires_input,
        escalated: templateResponse.escalated
      }

    } catch (error) {
      console.error('Erreur template:', error)
      return this.createErrorResponse('Erreur de template', locale)
    }
  }

  /**
   * Génère une réponse de salutation personnalisée
   */
  async generateGreeting(
    userId: string,
    channelId: string,
    locale: string = 'fr'
  ): Promise<NextMoveAIResponse> {
    const templateKey = 'greeting_without_name'
    
    return this.processWithTemplate(
      '',
      templateKey,
      { user_name: undefined },
      userId,
      locale
    )
  }

  /**
   * Traite une demande de suivi de colis
   */
  async processTrackingRequest(
    trackingCode: string,
    userId: string,
    locale: string = 'fr'
  ): Promise<NextMoveAIResponse> {
    return this.processMessage(
      `Suivre le colis ${trackingCode}`,
      userId,
      'web'
    )
  }

  /**
   * Traite une demande de devis
   */
  async processQuoteRequest(
    origin: string,
    destination: string,
    weight: number,
    volume: number,
    userId: string,
    locale: string = 'fr'
  ): Promise<NextMoveAIResponse> {
    return this.processMessage(
      `Devis de ${origin} vers ${destination}, ${weight}kg, ${volume}m3`,
      userId,
      'web'
    )
  }

  /**
   * Traite une demande de factures
   */
  async processInvoiceRequest(
    userId: string,
    locale: string = 'fr'
  ): Promise<NextMoveAIResponse> {
    return this.processMessage(
      'Voir mes factures',
      userId,
      'web'
    )
  }

  /**
   * Escalade vers un agent humain
   */
  async escalateToHuman(
    reason: string,
    userId: string,
    locale: string = 'fr'
  ): Promise<NextMoveAIResponse> {
    return this.processMessage(
      'Parler à un conseiller humain',
      userId,
      'web'
    )
  }

  /**
   * Valide un code de suivi
   */
  validateTrackingCode(code: string): { valid: boolean; corrected?: string; message?: string } {
    const regex = new RegExp(this.config.business_rules.tracking_code.regex)
    
    if (regex.test(code)) {
      return { valid: true }
    }

    // Tentative d'auto-correction
    let corrected: string | null = null

    // Si que des chiffres, ajouter préfixe lettre
    if (/^\d+$/.test(code)) {
      const checksum = code.split('').reduce((sum, digit) => sum + parseInt(digit), 0)
      const letter = String.fromCharCode(65 + (checksum % 26))
      corrected = letter + code
    }

    // Si que des lettres, ajouter suffixe chiffres
    if (/^[A-Z]+$/i.test(code)) {
      const hash = code.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
      const digits = String(hash % 100).padStart(2, '0')
      corrected = code.toUpperCase() + digits
    }

    if (corrected && regex.test(corrected)) {
      return {
        valid: false,
        corrected,
        message: `Code corrigé automatiquement : ${corrected}`
      }
    }

    return {
      valid: false,
      message: 'Code de suivi invalide. Format attendu : alphanumérique 8-20 caractères (ex: DKR240815)'
    }
  }

  /**
   * Récupère les statistiques d'utilisation
   */
  getUsageStats(): any {
    return {
      version: this.config.version,
      supported_locales: this.config.supported_locales,
      intents_count: this.config.nlu.intents.length,
      tools_count: Object.keys(this.config.tools).length,
      uptime: process.uptime ? Math.floor(process.uptime()) : 0
    }
  }

  /**
   * Teste la connectivité des outils
   */
  async healthCheck(): Promise<{ status: string; details: any }> {
    try {
      // Test basique des composants
      const nluTest = await this.orchestrator['nlu'].analyze('test', {})
      const templatesTest = this.templates.render('fallback_general', { locale: 'fr' })

      return {
        status: 'healthy',
        details: {
          nlu: nluTest ? 'ok' : 'error',
          templates: templatesTest ? 'ok' : 'error',
          orchestrator: 'ok',
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }
    }
  }

  /**
   * Crée une réponse d'erreur standardisée
   */
  private createErrorResponse(
    message: string, 
    locale: string, 
    ctas?: Array<{ text: string; action?: string }>
  ): NextMoveAIResponse {
    return {
      message,
      ctas,
      requires_input: false,
      escalated: false,
      confidence: 0
    }
  }

}

// Instance singleton pour utilisation globale
export const nextMoveAI = new NextMoveAI()

// Export des types principaux
export type {
  ConversationContext,
  ConversationResponse
} from './nextmove-ai-orchestrator'

export { NEXTMOVE_AI_CONFIG } from './nextmove-ai-config'
