export interface BusinessHours {
  timezone: string
  schedule: {
    [key: string]: {
      open: string
      close: string
      closed?: boolean
    }
  }
  holidays: string[]
}

export interface HandoffRule {
  condition: 'outside_hours' | 'keyword_detected' | 'escalation_requested'
  action: 'queue_message' | 'send_auto_reply' | 'create_ticket'
  autoReply?: string
  estimatedResponse?: string
}

export class BusinessHoursManager {
  private static instance: BusinessHoursManager
  private businessHours: BusinessHours
  private handoffRules: HandoffRule[]

  private constructor() {
    this.businessHours = {
      timezone: 'Africa/Dakar',
      schedule: {
        monday: { open: '08:00', close: '18:00' },
        tuesday: { open: '08:00', close: '18:00' },
        wednesday: { open: '08:00', close: '18:00' },
        thursday: { open: '08:00', close: '18:00' },
        friday: { open: '08:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' },
        sunday: { open: '00:00', close: '00:00', closed: true }
      },
      holidays: [
        '2024-01-01', // Nouvel An
        '2024-04-04', // Fête de l'Indépendance
        '2024-05-01', // Fête du Travail
        '2024-08-15', // Assomption
        '2024-11-01', // Toussaint
        '2024-12-25'  // Noël
      ]
    }

    this.handoffRules = [
      {
        condition: 'outside_hours',
        action: 'send_auto_reply',
        autoReply: '🕐 Nous sommes actuellement fermés. Nos horaires : Lun-Ven 8h-18h, Sam 9h-14h. Un conseiller vous répondra dès l\'ouverture.',
        estimatedResponse: 'Réponse sous 2h en horaires ouvrés'
      },
      {
        condition: 'keyword_detected',
        action: 'create_ticket',
        autoReply: '🎫 Votre demande a été transmise à notre équipe support. Ticket créé, vous recevrez une réponse sous 24h.'
      },
      {
        condition: 'escalation_requested',
        action: 'queue_message',
        autoReply: '👨‍💼 Transfert vers un conseiller en cours. Patientez quelques instants...'
      }
    ]
  }

  static getInstance(): BusinessHoursManager {
    if (!BusinessHoursManager.instance) {
      BusinessHoursManager.instance = new BusinessHoursManager()
    }
    return BusinessHoursManager.instance
  }

  isBusinessHours(date?: Date): boolean {
    const now = date || new Date()
    
    // Convertir en timezone locale (Dakar)
    const dakarTime = new Intl.DateTimeFormat('fr-FR', {
      timeZone: this.businessHours.timezone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(now)

    const weekday = dakarTime.find(part => part.type === 'weekday')?.value.toLowerCase()
    const hour = parseInt(dakarTime.find(part => part.type === 'hour')?.value || '0')
    const minute = parseInt(dakarTime.find(part => part.type === 'minute')?.value || '0')
    const currentTime = hour * 60 + minute // Minutes depuis minuit

    // Mapper les jours français vers anglais
    const dayMap: { [key: string]: string } = {
      'lundi': 'monday',
      'mardi': 'tuesday',
      'mercredi': 'wednesday',
      'jeudi': 'thursday',
      'vendredi': 'friday',
      'samedi': 'saturday',
      'dimanche': 'sunday'
    }

    const dayKey = dayMap[weekday || ''] || 'sunday'
    const daySchedule = this.businessHours.schedule[dayKey]

    if (!daySchedule || daySchedule.closed) {
      return false
    }

    // Vérifier si c'est un jour férié
    const dateString = now.toISOString().split('T')[0]
    if (this.businessHours.holidays.includes(dateString)) {
      return false
    }

    // Convertir les heures d'ouverture en minutes
    const [openHour, openMinute] = daySchedule.open.split(':').map(Number)
    const [closeHour, closeMinute] = daySchedule.close.split(':').map(Number)
    const openTime = openHour * 60 + openMinute
    const closeTime = closeHour * 60 + closeMinute

    return currentTime >= openTime && currentTime < closeTime
  }

  getNextOpenTime(): Date {
    const now = new Date()
    let checkDate = new Date(now)

    // Chercher le prochain créneau ouvert (max 7 jours)
    for (let i = 0; i < 7; i++) {
      const dayName = checkDate.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        timeZone: this.businessHours.timezone 
      }).toLowerCase()

      const dayMap: { [key: string]: string } = {
        'lundi': 'monday',
        'mardi': 'tuesday',
        'mercredi': 'wednesday',
        'jeudi': 'thursday',
        'vendredi': 'friday',
        'samedi': 'saturday',
        'dimanche': 'sunday'
      }

      const dayKey = dayMap[dayName] || 'sunday'
      const daySchedule = this.businessHours.schedule[dayKey]

      if (daySchedule && !daySchedule.closed) {
        const dateString = checkDate.toISOString().split('T')[0]
        if (!this.businessHours.holidays.includes(dateString)) {
          const [openHour, openMinute] = daySchedule.open.split(':').map(Number)
          
          const nextOpen = new Date(checkDate)
          nextOpen.setHours(openHour, openMinute, 0, 0)

          // Si c'est aujourd'hui et qu'on est avant l'ouverture, ou si c'est un autre jour
          if (i > 0 || nextOpen > now) {
            return nextOpen
          }
        }
      }

      // Passer au jour suivant
      checkDate.setDate(checkDate.getDate() + 1)
    }

    // Fallback: demain 8h
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(8, 0, 0, 0)
    return tomorrow
  }

  shouldHandoffToHuman(message: string, context?: any): {
    shouldHandoff: boolean
    rule?: HandoffRule
    reason?: string
  } {
    // Mots-clés déclenchant un handoff
    const escalationKeywords = [
      'parler à un conseiller',
      'agent humain',
      'support',
      'réclamation',
      'problème urgent',
      'pas satisfait',
      'remboursement',
      'annulation',
      'litige'
    ]

    const messageNormalized = message.toLowerCase()

    // Vérifier les mots-clés d'escalade
    for (const keyword of escalationKeywords) {
      if (messageNormalized.includes(keyword)) {
        const rule = this.handoffRules.find(r => r.condition === 'escalation_requested')
        return {
          shouldHandoff: true,
          rule,
          reason: `Mot-clé détecté: "${keyword}"`
        }
      }
    }

    // Vérifier les horaires
    if (!this.isBusinessHours()) {
      const rule = this.handoffRules.find(r => r.condition === 'outside_hours')
      return {
        shouldHandoff: true,
        rule,
        reason: 'Hors horaires ouvrés'
      }
    }

    return { shouldHandoff: false }
  }

  generateOutOfHoursMessage(): string {
    const nextOpen = this.getNextOpenTime()
    const nextOpenFormatted = nextOpen.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: this.businessHours.timezone
    })

    const rule = this.handoffRules.find(r => r.condition === 'outside_hours')
    let message = rule?.autoReply || '🕐 Nous sommes actuellement fermés.'
    
    message += `\n\n📅 **Prochaine ouverture** : ${nextOpenFormatted}`
    message += `\n\n💬 Vous pouvez laisser votre message, nous vous répondrons dès l'ouverture.`
    message += `\n\n📱 Pour une urgence, vous pouvez aussi nous contacter via WhatsApp.`

    return message
  }

  createTicketFromMessage(message: string, userId: string, context?: any): {
    ticketId: string
    message: string
  } {
    // Générer un ID de ticket unique
    const ticketId = `TK-${Date.now().toString(36).toUpperCase()}`
    
    // Message de confirmation
    const confirmationMessage = `🎫 **Ticket ${ticketId} créé**\n\n` +
      `Votre demande a été transmise à notre équipe support.\n\n` +
      `📧 Vous recevrez une réponse par email sous 24h.\n` +
      `📱 Vous pouvez aussi suivre l'avancement ici ou sur WhatsApp.\n\n` +
      `**Résumé** : ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`

    // Ici on pourrait sauvegarder le ticket en base de données
    console.log('Ticket créé:', {
      id: ticketId,
      userId,
      message,
      context,
      createdAt: new Date(),
      status: 'open'
    })

    return {
      ticketId,
      message: confirmationMessage
    }
  }

  getBusinessHoursInfo(): string {
    let info = '🕐 **Nos horaires d\'ouverture** :\n\n'
    
    Object.entries(this.businessHours.schedule).forEach(([day, schedule]) => {
      const dayFr = {
        monday: 'Lundi',
        tuesday: 'Mardi', 
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche'
      }[day]

      if (schedule.closed) {
        info += `**${dayFr}** : Fermé\n`
      } else {
        info += `**${dayFr}** : ${schedule.open} - ${schedule.close}\n`
      }
    })

    info += `\n🌍 **Fuseau horaire** : ${this.businessHours.timezone}`
    
    if (this.isBusinessHours()) {
      info += `\n\n🟢 **Actuellement ouvert** - Nos conseillers sont disponibles`
    } else {
      const nextOpen = this.getNextOpenTime()
      const nextOpenFormatted = nextOpen.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
      info += `\n\n🔴 **Actuellement fermé**\n📅 Prochaine ouverture : ${nextOpenFormatted}`
    }

    return info
  }

  // Méthodes de configuration (pour les admins)
  updateBusinessHours(newHours: Partial<BusinessHours>): void {
    this.businessHours = { ...this.businessHours, ...newHours }
  }

  addHoliday(date: string): void {
    if (!this.businessHours.holidays.includes(date)) {
      this.businessHours.holidays.push(date)
    }
  }

  removeHoliday(date: string): void {
    this.businessHours.holidays = this.businessHours.holidays.filter(h => h !== date)
  }
}
