/**
 * NextMove AI - Système NLU (Natural Language Understanding)
 * Détection d'intentions et extraction d'entités
 */

import { NEXTMOVE_AI_CONFIG, Intent, EntityConfig } from './nextmove-ai-config'

export interface NLUResult {
  intent: string
  confidence: number
  entities: Record<string, any>
  slots: Record<string, any>
  normalized_input: string
  input?: string
}

export interface EntityMatch {
  value: any
  confidence: number
  start: number
  end: number
  normalized?: any
}

export class NextMoveNLU {
  private config = NEXTMOVE_AI_CONFIG

  /**
   * Analyse le message utilisateur et détecte l'intention + entités
   */
  async analyze(input: string, context?: any): Promise<NLUResult> {
    const normalizedInput = this.normalizeInput(input)
    
    // Détection d'intention
    const intentResult = this.detectIntent(normalizedInput)
    
    // Extraction d'entités
    const entities = this.extractEntities(normalizedInput, intentResult.intent)
    
    // Mapping vers slots selon l'intention
    const slots = this.mapEntitiesToSlots(entities, intentResult.intent)

    return {
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      entities,
      slots,
      normalized_input: normalizedInput,
      input: input
    }
  }

  /**
   * Normalise l'input utilisateur
   */
  private normalizeInput(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-\.@]/g, '')
  }

  /**
   * Détecte l'intention principale du message
   */
  private detectIntent(input: string): { intent: string; confidence: number } {
    let bestMatch = { intent: 'fallback', confidence: 0 }

    for (const intent of this.config.nlu.intents) {
      const confidence = this.calculateIntentConfidence(input, intent)
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: intent.name, confidence }
      }
    }

    return bestMatch
  }

  /**
   * Calcule la confiance pour une intention donnée
   */
  private calculateIntentConfidence(input: string, intent: Intent): number {
    let maxConfidence = 0

    for (const utterance of intent.utterances) {
      const confidence = this.matchUtterance(input, utterance)
      maxConfidence = Math.max(maxConfidence, confidence)
    }

    return maxConfidence
  }

  /**
   * Compare l'input avec un pattern d'utterance
   */
  private matchUtterance(input: string, utterance: string): number {
    // Exact match
    if (input === utterance.toLowerCase()) return 1.0

    // Pattern avec wildcard *
    if (utterance.includes('*')) {
      const pattern = utterance.toLowerCase().replace(/\*/g, '.*')
      const regex = new RegExp(`^${pattern}$`)
      if (regex.test(input)) return 0.9
    }

    // Contient les mots-clés principaux
    const utteranceWords = utterance.toLowerCase().split(' ').filter(w => w !== '*')
    const inputWords = input.split(' ')
    
    let matchCount = 0
    for (const word of utteranceWords) {
      if (inputWords.some(iw => iw.includes(word) || word.includes(iw))) {
        matchCount++
      }
    }

    const confidence = matchCount / utteranceWords.length
    return confidence > 0.5 ? confidence * 0.8 : 0
  }

  /**
   * Extrait les entités du texte
   */
  private extractEntities(input: string, intent: string): Record<string, EntityMatch> {
    const entities: Record<string, EntityMatch> = {}

    // Extraction du code de suivi (prioritaire)
    const trackingMatch = this.extractTrackingCode(input)
    if (trackingMatch) {
      entities.tracking_code = trackingMatch
    }

    // Extraction des numéros de facture
    const invoiceMatch = this.extractInvoiceNumber(input)
    if (invoiceMatch) {
      entities.invoice_no = invoiceMatch
    }

    // Extraction des villes/ports
    const locationMatches = this.extractLocations(input)
    if (locationMatches.length > 0) {
      entities.origin = locationMatches[0]
      if (locationMatches.length > 1) {
        entities.destination = locationMatches[1]
      }
    }

    // Extraction des modes de transport
    const modeMatch = this.extractTransportMode(input)
    if (modeMatch) {
      entities.mode = modeMatch
    }

    // Extraction des poids et volumes
    const weightMatch = this.extractWeight(input)
    if (weightMatch) {
      entities.weight_kg = weightMatch
    }

    const volumeMatch = this.extractVolume(input)
    if (volumeMatch) {
      entities.volume_m3 = volumeMatch
    }

    // Extraction des canaux de notification
    const channelsMatch = this.extractNotificationChannels(input)
    if (channelsMatch) {
      entities.channels = channelsMatch
    }

    return entities
  }

  /**
   * Extrait et valide un code de suivi
   */
  private extractTrackingCode(input: string): EntityMatch | null {
    // Regex pour codes alphanumériques 8-20 caractères
    const patterns = [
      /\b[A-Z]{2,4}\d{6,16}\b/g,  // DKR240815, ABC123456789
      /\b\d{4,8}[A-Z]{2,4}\b/g,   // 240815DKR
      /\b[A-Z0-9]{8,20}\b/g       // Général alphanumérique
    ]

    for (const pattern of patterns) {
      const matches = input.toUpperCase().match(pattern)
      if (matches) {
        for (const match of matches) {
          if (this.validateTrackingCode(match)) {
            return {
              value: match,
              confidence: 0.9,
              start: input.indexOf(match),
              end: input.indexOf(match) + match.length,
              normalized: this.normalizeTrackingCode(match)
            }
          }
        }
      }
    }

    // Tentative d'auto-correction pour codes numériques ou alphabétiques purs
    const numericMatch = input.match(/\b\d{8,20}\b/)
    if (numericMatch) {
      const corrected = this.autoFixTrackingCode(numericMatch[0])
      if (corrected) {
        return {
          value: numericMatch[0],
          confidence: 0.7,
          start: input.indexOf(numericMatch[0]),
          end: input.indexOf(numericMatch[0]) + numericMatch[0].length,
          normalized: corrected
        }
      }
    }

    const alphaMatch = input.match(/\b[A-Z]{8,20}\b/i)
    if (alphaMatch) {
      const corrected = this.autoFixTrackingCode(alphaMatch[0])
      if (corrected) {
        return {
          value: alphaMatch[0],
          confidence: 0.7,
          start: input.indexOf(alphaMatch[0]),
          end: input.indexOf(alphaMatch[0]) + alphaMatch[0].length,
          normalized: corrected
        }
      }
    }

    return null
  }

  /**
   * Valide un code de suivi selon les business rules
   */
  private validateTrackingCode(code: string): boolean {
    const regex = new RegExp(this.config.business_rules.tracking_code.regex)
    return regex.test(code)
  }

  /**
   * Normalise un code de suivi
   */
  private normalizeTrackingCode(code: string): string {
    return code.trim().toUpperCase().replace(/\s/g, '')
  }

  /**
   * Tente de corriger automatiquement un code de suivi invalide
   */
  private autoFixTrackingCode(code: string): string | null {
    // Si que des chiffres, ajouter préfixe lettre
    if (/^\d+$/.test(code)) {
      const checksum = code.split('').reduce((sum, digit) => sum + parseInt(digit), 0)
      const letter = String.fromCharCode(65 + (checksum % 26)) // A-Z
      return letter + code
    }

    // Si que des lettres, ajouter suffixe chiffres
    if (/^[A-Z]+$/i.test(code)) {
      const hash = code.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
      const digits = String(hash % 100).padStart(2, '0')
      return code.toUpperCase() + digits
    }

    return null
  }

  /**
   * Extrait un numéro de facture
   */
  private extractInvoiceNumber(input: string): EntityMatch | null {
    const patterns = [
      /\bINV[0-9]{4,10}\b/gi,
      /\bFAC[0-9]{4,10}\b/gi,
      /\b[0-9]{6,12}\b/g
    ]

    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match) {
        return {
          value: match[0],
          confidence: 0.8,
          start: input.indexOf(match[0]),
          end: input.indexOf(match[0]) + match[0].length,
          normalized: match[0].toUpperCase().trim()
        }
      }
    }

    return null
  }

  /**
   * Extrait les villes et ports
   */
  private extractLocations(input: string): EntityMatch[] {
    const commonLocations = [
      'dakar', 'abidjan', 'douala', 'cotonou', 'lomé', 'accra', 'conakry',
      'bamako', 'ouagadougou', 'niamey', 'ndjamena', 'libreville',
      'shanghai', 'guangzhou', 'shenzhen', 'ningbo', 'qingdao', 'tianjin',
      'beijing', 'hong kong', 'dubai', 'casablanca', 'tunis', 'alger'
    ]

    const locations: EntityMatch[] = []
    
    for (const location of commonLocations) {
      const regex = new RegExp(`\\b${location}\\b`, 'gi')
      const match = input.match(regex)
      if (match) {
        locations.push({
          value: match[0],
          confidence: 0.9,
          start: input.indexOf(match[0]),
          end: input.indexOf(match[0]) + match[0].length,
          normalized: location.charAt(0).toUpperCase() + location.slice(1)
        })
      }
    }

    return locations
  }

  /**
   * Extrait le mode de transport
   */
  private extractTransportMode(input: string): EntityMatch | null {
    const modes = {
      'air': ['aérien', 'avion', 'air', 'express aérien', 'flight'],
      'sea': ['maritime', 'mer', 'bateau', 'navire', 'sea', 'ocean'],
      'road': ['routier', 'route', 'camion', 'truck', 'road', 'terrestre']
    }

    for (const [mode, keywords] of Object.entries(modes)) {
      for (const keyword of keywords) {
        if (input.toLowerCase().includes(keyword)) {
          return {
            value: keyword,
            confidence: 0.8,
            start: input.indexOf(keyword),
            end: input.indexOf(keyword) + keyword.length,
            normalized: mode
          }
        }
      }
    }

    return null
  }

  /**
   * Extrait le poids
   */
  private extractWeight(input: string): EntityMatch | null {
    const weightPattern = /(\d+(?:\.\d+)?)\s*(?:kg|kilo|kilogramme)/gi
    const match = input.match(weightPattern)
    
    if (match) {
      const value = parseFloat(match[0].replace(/[^\d.]/g, ''))
      return {
        value: match[0],
        confidence: 0.9,
        start: input.indexOf(match[0]),
        end: input.indexOf(match[0]) + match[0].length,
        normalized: value
      }
    }

    return null
  }

  /**
   * Extrait le volume
   */
  private extractVolume(input: string): EntityMatch | null {
    const volumePattern = /(\d+(?:\.\d+)?)\s*(?:m3|m³|mètre cube|cbm)/gi
    const match = input.match(volumePattern)
    
    if (match) {
      const value = parseFloat(match[0].replace(/[^\d.]/g, ''))
      return {
        value: match[0],
        confidence: 0.9,
        start: input.indexOf(match[0]),
        end: input.indexOf(match[0]) + match[0].length,
        normalized: value
      }
    }

    return null
  }

  /**
   * Extrait les canaux de notification
   */
  private extractNotificationChannels(input: string): EntityMatch | null {
    const channels = ['email', 'sms', 'whatsapp', 'telegram']
    const found: string[] = []

    for (const channel of channels) {
      if (input.toLowerCase().includes(channel)) {
        found.push(channel)
      }
    }

    if (found.length > 0) {
      return {
        value: found.join(', '),
        confidence: 0.8,
        start: 0,
        end: 0,
        normalized: found
      }
    }

    return null
  }

  /**
   * Mappe les entités extraites vers les slots requis pour l'intention
   */
  private mapEntitiesToSlots(entities: Record<string, EntityMatch>, intent: string): Record<string, any> {
    const slots: Record<string, any> = {}
    const intentConfig = this.config.nlu.intents.find(i => i.name === intent)
    
    if (!intentConfig) return slots

    // Slots requis
    if (intentConfig.required_slots) {
      for (const slot of intentConfig.required_slots) {
        if (entities[slot]) {
          slots[slot] = entities[slot].normalized || entities[slot].value
        }
      }
    }

    // Slots optionnels
    if (intentConfig.slots) {
      for (const slot of intentConfig.slots) {
        if (entities[slot]) {
          slots[slot] = entities[slot].normalized || entities[slot].value
        }
      }
    }

    return slots
  }

  /**
   * Vérifie si tous les slots requis sont remplis
   */
  hasAllRequiredSlots(intent: string, slots: Record<string, any>): boolean {
    const intentConfig = this.config.nlu.intents.find(i => i.name === intent)
    
    if (!intentConfig?.required_slots) return true

    return intentConfig.required_slots.every(slot => 
      slots[slot] !== undefined && slots[slot] !== null && slots[slot] !== ''
    )
  }

  /**
   * Retourne les slots manquants pour une intention
   */
  getMissingSlots(intent: string, slots: Record<string, any>): string[] {
    const intentConfig = this.config.nlu.intents.find(i => i.name === intent)
    
    if (!intentConfig?.required_slots) return []

    return intentConfig.required_slots.filter(slot => 
      slots[slot] === undefined || slots[slot] === null || slots[slot] === ''
    )
  }
}
