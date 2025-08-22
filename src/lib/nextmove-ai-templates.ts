/**
 * NextMove AI - Templates de réponse multilingues avec CTAs intelligents
 * Système de templating avancé pour réponses contextuelles
 */

export interface TemplateContext {
  user_name?: string
  locale: string
  data?: Record<string, any>
  session?: any
}

export interface ResponseTemplate {
  message: string
  ctas?: string[]
  requires_input?: boolean
  escalated?: boolean
}

export class NextMoveAITemplates {
  private templates!: Record<string, Record<string, string>>
  private ctas!: Record<string, Record<string, string[]>>

  constructor() {
    this.initializeTemplates()
    this.initializeCTAs()
  }

  /**
   * Génère une réponse à partir d'un template
   */
  render(templateKey: string, context: TemplateContext): ResponseTemplate {
    const locale = context.locale || 'fr'
    const template = this.templates[templateKey]?.[locale]
    
    if (!template) {
      return {
        message: this.getFallbackMessage(locale),
        ctas: this.ctas.general[locale] || []
      }
    }

    const message = this.processTemplate(template, context)
    const ctas = this.getCTAsForTemplate(templateKey, locale)

    return {
      message,
      ctas,
      requires_input: this.requiresInput(templateKey),
      escalated: this.isEscalated(templateKey)
    }
  }

  /**
   * Traite un template avec les données du contexte
   */
  private processTemplate(template: string, context: TemplateContext): string {
    let processed = template

    // Remplacement des variables simples
    if (context.user_name) {
      processed = processed.replace(/\{\{user_name\}\}/g, context.user_name)
    }

    // Remplacement des données dynamiques
    if (context.data) {
      for (const [key, value] of Object.entries(context.data)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        processed = processed.replace(regex, String(value))
      }
    }

    // Formatage des nombres
    processed = this.formatNumbers(processed, context.locale)

    // Formatage des dates
    processed = this.formatDates(processed, context.locale)

    return processed
  }

  /**
   * Formate les nombres selon la locale
   */
  private formatNumbers(text: string, locale: string): string {
    const numberRegex = /\{\{(\w+)\.price\}\}/g
    return text.replace(numberRegex, (match, key) => {
      // Simulation - dans la vraie implémentation, récupérer la valeur
      return '125 000 FCFA'
    })
  }

  /**
   * Formate les dates selon la locale
   */
  private formatDates(text: string, locale: string): string {
    const dateRegex = /\{\{(\w+)\.date\}\}/g
    return text.replace(dateRegex, (match, key) => {
      const now = new Date()
      return locale === 'fr' 
        ? now.toLocaleDateString('fr-FR')
        : now.toLocaleDateString('en-US')
    })
  }

  /**
   * Initialise tous les templates multilingues
   */
  private initializeTemplates(): void {
    this.templates = {
      // Salutations
      greeting_with_name: {
        fr: "Bonjour {{user_name}} ! 👋 Je suis votre assistant NextMove AI. Comment puis-je vous aider aujourd'hui ?",
        en: "Hello {{user_name}}! 👋 I'm your NextMove AI assistant. How can I help you today?"
      },
      
      greeting_without_name: {
        fr: "Bonjour ! 👋 Je suis votre assistant NextMove AI. Comment puis-je vous aider aujourd'hui ?",
        en: "Hello! 👋 I'm your NextMove AI assistant. How can I help you today?"
      },

      // Suivi de colis - Succès
      tracking_success: {
        fr: `✅ Suivi **{{code}}** : {{status}}.
Trajet : {{from}} → {{to}} · ETA **{{eta}}**.

Derniers événements :
{{events}}

Voulez-vous activer des **notifications** (WhatsApp/SMS) pour ce colis ou obtenir la **POD** dès livraison ?`,
        en: `✅ Tracking **{{code}}**: {{status}}.
Route: {{from}} → {{to}} · ETA **{{eta}}**.

Recent events:
{{events}}

Would you like to activate **notifications** (WhatsApp/SMS) for this package or get the **POD** upon delivery?`
      },

      // Suivi de colis - Non trouvé
      tracking_not_found: {
        fr: `Hm… je ne retrouve pas **{{code_input}}** 😕.
Pouvez-vous vérifier le numéro ? Exemple valide : **DKR240815**.
(Astuce : le numéro doit être **alphanumérique**, 8–20, ex. \`AB1234CD\`.)`,
        en: `Hmm… I can't find **{{code_input}}** 😕.
Could you check the number? Valid example: **DKR240815**.
(Tip: the number must be **alphanumeric**, 8–20 chars, e.g. \`AB1234CD\`.)`
      },

      // Auto-correction de code
      tracking_autocorrect: {
        fr: `J'ai détecté **{{original_code}}** mais je pense que vous voulez dire **{{corrected_code}}**. 
Dois-je rechercher **{{corrected_code}}** ?`,
        en: `I detected **{{original_code}}** but I think you mean **{{corrected_code}}**. 
Should I search for **{{corrected_code}}**?`
      },

      // POD disponible
      pod_available: {
        fr: `Le colis **{{code}}** est **livré** ✅.
Je peux vous envoyer la **preuve de livraison (POD)** :
• PDF par email  
• Lien WhatsApp  
Que préférez-vous ?`,
        en: `Package **{{code}}** is **delivered** ✅.
I can send you the **proof of delivery (POD)**:
• PDF by email  
• WhatsApp link  
What do you prefer?`
      },

      // POD non disponible
      pod_not_available: {
        fr: `Désolé, la preuve de livraison pour **{{code}}** n'est pas encore disponible. Elle sera générée dès la livraison du colis.`,
        en: `Sorry, the proof of delivery for **{{code}}** is not yet available. It will be generated upon package delivery.`
      },

      // Liste des factures
      invoice_list: {
        fr: `Voici vos dernières factures :
{{invoice_items}}

Vous voulez **payer** une facture, ou **télécharger** un PDF ?`,
        en: `Here are your recent invoices:
{{invoice_items}}

Would you like to **pay** an invoice or **download** a PDF?`
      },

      // Recommandation de devis
      quote_recommendation: {
        fr: `Comparatif {{origin}} → {{destination}} ({{weight_kg}} kg / {{volume_m3}} m³) :

🛩️ **Aérien** : {{air_price}} XOF · {{air_days}} jours  
🚢 **Maritime** : {{sea_price}} XOF · {{sea_days}} jours  
🚛 **Routier** : {{road_price}} XOF · {{road_days}} jours  

👉 **Recommandé** : {{best_mode}} ({{best_reason}})

Je génère le **devis officiel** ?`,
        en: `Comparison {{origin}} → {{destination}} ({{weight_kg}} kg / {{volume_m3}} m³):

🛩️ **Air** : {{air_price}} XOF · {{air_days}} days  
🚢 **Sea** : {{sea_price}} XOF · {{sea_days}} days  
🚛 **Road** : {{road_price}} XOF · {{road_days}} days  

👉 **Recommended** : {{best_mode}} ({{best_reason}})

Should I generate the **official quote**?`
      },

      // Notifications configurées
      notifications_configured: {
        fr: "Parfait ✅. J'enverrai les mises à jour via {{channels}}. Vous pourrez changer ce choix à tout moment.",
        en: "Perfect ✅. I'll send updates via {{channels}}. You can change this choice anytime."
      },

      // Escalade vers humain
      escalated_to_human: {
        fr: "Je viens d'alerter un conseiller humain 🧑‍💼. Temps estimé : {{eta_minutes}} min. Vous serez prévenu ici.",
        en: "I've just alerted a human advisor 🧑‍💼. Estimated time: {{eta_minutes}} min. You'll be notified here."
      },

      // Demande de slot - Code de suivi
      ask_tracking_code: {
        fr: "Pouvez-vous me donner le **numéro de suivi** ? (ex. **DKR240815**)",
        en: "Could you give me the **tracking number**? (e.g. **DKR240815**)"
      },

      // Demande de slot - Origine
      ask_origin: {
        fr: "Ville/port **d'origine** ?",
        en: "**Origin** city/port?"
      },

      // Demande de slot - Destination
      ask_destination: {
        fr: "Ville/port **de destination** ?",
        en: "**Destination** city/port?"
      },

      // Demande de slot - Mode
      ask_mode: {
        fr: "Mode **aérien**, **maritime** ou **routier** ?",
        en: "**Air**, **sea** or **road** mode?"
      },

      // Demande de slot - Poids
      ask_weight: {
        fr: "Quel **poids** (kg) ?",
        en: "What **weight** (kg)?"
      },

      // Demande de slot - Volume
      ask_volume: {
        fr: "Quel **volume** (m³) ?",
        en: "What **volume** (m³)?"
      },

      // Demande de slot - Canaux notification
      ask_notification_channels: {
        fr: "Quels canaux souhaitez-vous activer ? **WhatsApp**, **SMS**, **Email** ou **Telegram** ?",
        en: "Which channels would you like to activate? **WhatsApp**, **SMS**, **Email** or **Telegram**?"
      },

      // Erreurs techniques
      technical_error: {
        fr: "Je n'ai pas reçu la réponse technique à temps ⏱️. Je réessaie ou je transmets à un conseiller si vous préférez.",
        en: "I didn't receive the technical response in time ⏱️. Should I retry or transfer to an advisor if you prefer?"
      },

      // Erreur 404
      route_404_error: {
        fr: "Cette page/ressource n'existe plus (404). Je vous redirige vers l'emplacement correct.",
        en: "This page/resource no longer exists (404). I'm redirecting you to the correct location."
      },

      // Paramètre manquant
      missing_parameter: {
        fr: "Je vois un paramètre incomplet. On corrige ensemble : {{field}} manquant.",
        en: "I see an incomplete parameter. Let's fix it together: {{field}} missing."
      },

      // Fallback général
      fallback_general: {
        fr: "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ou choisir une option ci-dessous ?",
        en: "I'm not sure I understand. Could you rephrase or choose an option below?"
      },

      // Service indisponible
      service_unavailable: {
        fr: "Le service est temporairement indisponible. Voulez-vous que je vous mette en relation avec un conseiller ?",
        en: "The service is temporarily unavailable. Would you like me to connect you with an advisor?"
      }
    }
  }

  /**
   * Initialise les CTAs par template et locale
   */
  private initializeCTAs(): void {
    this.ctas = {
      greeting_with_name: {
        fr: ["Suivre un colis", "Voir mes factures", "Créer un devis", "Parler à un conseiller"],
        en: ["Track a package", "View my invoices", "Create a quote", "Talk to an advisor"]
      },
      
      greeting_without_name: {
        fr: ["Suivre un colis", "Voir mes factures", "Créer un devis", "Parler à un conseiller"],
        en: ["Track a package", "View my invoices", "Create a quote", "Talk to an advisor"]
      },

      tracking_success: {
        fr: ["Activer notifications", "Obtenir POD", "Créer une alerte ETA", "Parler au support"],
        en: ["Enable notifications", "Get POD", "Create ETA alert", "Contact support"]
      },

      tracking_not_found: {
        fr: ["Réessayer avec un autre code", "Parler à un conseiller"],
        en: ["Try with another code", "Talk to an advisor"]
      },

      tracking_autocorrect: {
        fr: ["Oui, rechercher", "Non, corriger manuellement"],
        en: ["Yes, search", "No, correct manually"]
      },

      pod_available: {
        fr: ["Envoyer par email", "Lien WhatsApp", "Télécharger PDF"],
        en: ["Send by email", "WhatsApp link", "Download PDF"]
      },

      pod_not_available: {
        fr: ["Suivre le colis", "Activer notification POD"],
        en: ["Track package", "Enable POD notification"]
      },

      invoice_list: {
        fr: ["Payer maintenant", "Télécharger PDF", "Activer rappel", "Ouvrir ticket facturation"],
        en: ["Pay now", "Download PDF", "Enable reminder", "Open billing ticket"]
      },

      quote_recommendation: {
        fr: ["Générer devis", "Comparer autre itinéraire", "Partager par WhatsApp", "Parler à un conseiller"],
        en: ["Generate quote", "Compare other route", "Share via WhatsApp", "Talk to an advisor"]
      },

      notifications_configured: {
        fr: ["Tester les notifications", "Modifier les préférences"],
        en: ["Test notifications", "Modify preferences"]
      },

      escalated_to_human: {
        fr: [],
        en: []
      },

      technical_error: {
        fr: ["Réessayer", "Parler à un conseiller"],
        en: ["Retry", "Talk to an advisor"]
      },

      route_404_error: {
        fr: ["Aller à l'accueil", "Support", "Expéditions"],
        en: ["Go to home", "Support", "Shipments"]
      },

      missing_parameter: {
        fr: ["Corriger", "Recommencer"],
        en: ["Correct", "Start over"]
      },

      fallback_general: {
        fr: ["Suivre un colis", "Voir factures", "Créer un devis", "Parler à un conseiller"],
        en: ["Track package", "View invoices", "Create quote", "Talk to advisor"]
      },

      service_unavailable: {
        fr: ["Parler à un conseiller", "Réessayer plus tard"],
        en: ["Talk to an advisor", "Try again later"]
      },

      general: {
        fr: ["Suivre un colis", "Voir factures", "Créer un devis", "Parler à un conseiller"],
        en: ["Track package", "View invoices", "Create quote", "Talk to advisor"]
      }
    }
  }

  /**
   * Récupère les CTAs pour un template donné
   */
  private getCTAsForTemplate(templateKey: string, locale: string): string[] {
    return this.ctas[templateKey]?.[locale] || this.ctas.general[locale] || []
  }

  /**
   * Détermine si un template nécessite une saisie utilisateur
   */
  private requiresInput(templateKey: string): boolean {
    const inputRequiredTemplates = [
      'ask_tracking_code',
      'ask_origin', 
      'ask_destination',
      'ask_mode',
      'ask_weight',
      'ask_volume',
      'ask_notification_channels',
      'tracking_autocorrect'
    ]
    return inputRequiredTemplates.includes(templateKey)
  }

  /**
   * Détermine si un template indique une escalade
   */
  private isEscalated(templateKey: string): boolean {
    return templateKey === 'escalated_to_human'
  }

  /**
   * Message de fallback si template non trouvé
   */
  private getFallbackMessage(locale: string): string {
    return locale === 'fr' 
      ? "Désolé, je rencontre un problème. Comment puis-je vous aider ?"
      : "Sorry, I'm having an issue. How can I help you?"
  }

  /**
   * Formate une liste d'événements de tracking
   */
  formatTrackingEvents(events: Array<{ts: string, label: string}>, locale: string): string {
    return events.slice(0, 3)
      .map(event => `• ${event.ts} — ${event.label}`)
      .join('\n')
  }

  /**
   * Formate une liste de factures
   */
  formatInvoiceList(invoices: Array<{id: string, total: number, currency: string, status: string, due_at: string}>, locale: string): string {
    return invoices
      .map(inv => {
        const status = this.translateInvoiceStatus(inv.status, locale)
        const amount = inv.total.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')
        return `• **${inv.id}** — ${amount} ${inv.currency} — ${status} (${locale === 'fr' ? 'échéance' : 'due'} ${inv.due_at})`
      })
      .join('\n')
  }

  /**
   * Traduit le statut d'une facture
   */
  private translateInvoiceStatus(status: string, locale: string): string {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'paid': 'Payée',
        'pending': 'En attente', 
        'overdue': 'En retard',
        'cancelled': 'Annulée'
      },
      en: {
        'paid': 'Paid',
        'pending': 'Pending',
        'overdue': 'Overdue', 
        'cancelled': 'Cancelled'
      }
    }
    return translations[locale]?.[status] || status
  }

  /**
   * Traduit un mode de transport
   */
  translateTransportMode(mode: string, locale: string): string {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'air': 'Aérien',
        'sea': 'Maritime',
        'road': 'Routier'
      },
      en: {
        'air': 'Air',
        'sea': 'Sea',
        'road': 'Road'
      }
    }
    return translations[locale]?.[mode] || mode
  }
}
