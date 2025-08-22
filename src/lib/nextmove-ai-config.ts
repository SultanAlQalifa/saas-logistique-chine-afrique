/**
 * NextMove AI - Configuration système complète
 * Version 1.0 - Agent IA intelligent pour logistique Chine-Afrique
 */

export interface NextMoveAIConfig {
  name: string
  version: string
  default_locale: string
  supported_locales: string[]
  style: AIStyle
  memory: MemoryConfig
  business_rules: BusinessRules
  nlu: NLUConfig
  tools: ToolsConfig
  orchestration: OrchestrationConfig
  response_templates: ResponseTemplates
  slot_filling: SlotFillingConfig
  error_handling: ErrorHandlingConfig
  guardrails: string[]
  ctas: CTAsConfig
  tests_acceptance: string[]
}

export interface AIStyle {
  tone: string
  emojis: string
  address_user_by_name_if_known: boolean
  avoid_generic_menus: boolean
}

export interface MemoryConfig {
  session_scope: string
  keys: string[]
  ttl_minutes: number
  persist_across_messages: boolean
}

export interface BusinessRules {
  tracking_code: TrackingCodeRule
  language: LanguageRule
  currency: CurrencyRule
}

export interface TrackingCodeRule {
  required: boolean
  regex: string
  normalize: string[]
  on_invalid: string[]
}

export interface LanguageRule {
  auto_detect: boolean
  persist_in_profile_and_cookie: boolean
}

export interface CurrencyRule {
  pivot: string
  fx_live_required: boolean
  display_note: string
}

export interface NLUConfig {
  intents: Intent[]
  entities: Record<string, EntityConfig>
}

export interface Intent {
  name: string
  utterances: string[]
  required_slots?: string[]
  slots?: string[]
}

export interface EntityConfig {
  validate_regex?: string
  normalize?: string[]
  type?: string
  min?: number
  enum?: string[]
  enum_multi?: string[]
}

export interface ToolsConfig {
  [key: string]: any
}

export interface OrchestrationConfig {
  on_message: string[]
}

export interface ResponseTemplates {
  [key: string]: string
}

export interface SlotFillingConfig {
  polite_ask_fr: Record<string, string>
}

export interface ErrorHandlingConfig {
  [key: string]: string | any
}

export interface CTAsConfig {
  tracking: string[]
  invoices: string[]
  quotes: string[]
  general: string[]
}

// Configuration complète NextMove AI
export const NEXTMOVE_AI_CONFIG: NextMoveAIConfig = {
  name: "NextMove AI",
  version: "1.0",
  default_locale: "fr",
  supported_locales: ["fr", "en"],
  
  style: {
    tone: "humain, clair, pro, chaleureux, concis",
    emojis: "modérés et pertinents",
    address_user_by_name_if_known: true,
    avoid_generic_menus: true
  },

  memory: {
    session_scope: "per_user_per_channel",
    keys: [
      "last_intent",
      "pending_slots",
      "conversation_topic",
      "last_entities",
      "user_prefs"
    ],
    ttl_minutes: 120,
    persist_across_messages: true
  },

  business_rules: {
    tracking_code: {
      required: true,
      regex: "^(?=.*[A-Z])(?=.*\\d)[A-Z0-9]{8,20}$",
      normalize: ["trim", "uppercase", "remove_spaces"],
      on_invalid: [
        "try_autofix_numeric_only: prefix letter from checksum (A–Z)",
        "try_autofix_alpha_only: suffix 2 digits from hash",
        "if_still_invalid: politely_ask_again_with_example"
      ]
    },
    language: {
      auto_detect: true,
      persist_in_profile_and_cookie: true
    },
    currency: {
      pivot: "XOF",
      fx_live_required: true,
      display_note: "converti depuis XOF (taux HH:MM)"
    }
  },

  nlu: {
    intents: [
      {
        name: "track_shipment",
        utterances: ["suivre", "suivi", "tracking", "où est mon colis", "prochain chargement", "DKR*", "numéro de suivi *"],
        required_slots: ["tracking_code"]
      },
      {
        name: "pod",
        utterances: ["POD", "preuve de livraison", "signature", "photo livraison", "reçu"],
        required_slots: ["tracking_code"]
      },
      {
        name: "invoices",
        utterances: ["facture", "voir mes factures", "payer facture *", "télécharger facture *"],
        slots: ["invoice_no"]
      },
      {
        name: "create_quote",
        utterances: ["devis", "combien ça coûte", "tarif", "expédier *", "itinéraire *"],
        slots: ["origin", "destination", "mode", "incoterm", "weight_kg", "volume_m3", "ready_date"]
      },
      {
        name: "notifications",
        utterances: ["notifications", "whatsapp", "sms", "email", "telegram"],
        slots: ["channels"]
      },
      {
        name: "support_human",
        utterances: ["parler à un conseiller", "humain", "agent", "aide humaine"]
      },
      {
        name: "smalltalk",
        utterances: ["bonjour", "salut", "bonsoir", "merci", "ok"]
      },
      {
        name: "fallback",
        utterances: ["*"]
      }
    ],
    entities: {
      tracking_code: {
        validate_regex: "^(?=.*[A-Z])(?=.*\\d)[A-Z0-9]{8,20}$",
        normalize: ["uppercase", "trim"]
      },
      invoice_no: {
        normalize: ["uppercase", "trim"]
      },
      origin: {
        type: "city_or_port"
      },
      destination: {
        type: "city_or_port"
      },
      mode: {
        enum: ["air", "sea", "road"]
      },
      incoterm: {
        enum: ["EXW", "FCA", "FOB", "CIF", "DAP", "DDP"]
      },
      weight_kg: {
        type: "number",
        min: 0.1
      },
      volume_m3: {
        type: "number",
        min: 0.01
      },
      channels: {
        enum_multi: ["email", "sms", "whatsapp", "telegram"]
      }
    }
  },

  tools: {
    get_user_context: {},
    track_shipment: {},
    get_pod: {},
    list_invoices: {},
    download_invoice_pdf: {},
    recommend_route_and_price: {},
    create_quote: {},
    setup_notifications: {},
    marketing_roi_overview: {},
    open_ticket: {},
    escalate_to_human: {},
    fx_convert: {},
    health_check_routes: {},
    log_ui_issue: {}
  },

  orchestration: {
    on_message: [
      "set_locale_from: [msg, user_profile, cookie, default]",
      "ctx := get_user_context()",
      "detect_intent()",
      "if intent == smalltalk:",
      "  respond_human_short_with_context()",
      "  offer_shortcuts(['Suivre un colis','Voir factures','Créer un devis'])",
      "  exit",
      "if intent in [track_shipment, pod, invoices, create_quote, notifications]:",
      "  fill_missing_slots(max_questions: 2)",
      "  enforce_business_rules()",
      "  call_corresponding_tool()",
      "  if tool_error:",
      "    respond_empathic_with_next_steps()",
      "    offer_escalation_to_human()",
      "  else:",
      "    craft_human_answer_with_ctas()",
      "  save_context(last_intent, last_entities)",
      "  exit",
      "if intent == support_human:",
      "  escalate_to_human(context=last_turn_summary)",
      "  respond: 'Je viens de transférer votre demande à un conseiller disponible.'",
      "  exit",
      "else:",
      "  try_understand_entities()",
      "  if found_tracking_like_string:",
      "    normalize_and_attempt_track()",
      "  else:",
      "    short_clarifying_question(max 1)",
      "    suggest_actions(['Suivi colis','Devis','Factures'])",
      "  exit"
    ]
  },

  response_templates: {
    tracking_success_fr: `✅ Suivi **{{code}}** : {{status}}.
Trajet : {{from}} → {{to}} · ETA **{{eta}}**.
{{#if has_events}}Derniers événements :
{{#each events.slice(0,3)}}• {{this.ts}} — {{this.label}}
{{/each}}{{/if}}
Voulez-vous activer des **notifications** (WhatsApp/SMS) pour ce colis ou obtenir la **POD** dès livraison ?`,

    tracking_not_found_fr: `Hm… je ne retrouve pas **{{code_input}}** 😕.
Pouvez-vous vérifier le numéro ? Exemple valide : **DKR240815**.
(Astuce : le numéro doit être **alphanumérique**, 8–20, ex. \`AB1234CD\`.)`,

    pod_offer_fr: `Le colis **{{code}}** est **livré** ✅.
Je peux vous envoyer la **preuve de livraison (POD)** :
• PDF par email  
• Lien WhatsApp  
Que préférez-vous ?`,

    invoice_list_fr: `Voici vos dernières factures :
{{#each items}}
• **{{this.id}}** — {{this.total}} {{this.currency}} — {{this.status}} (échéance {{this.due_at}})
{{/each}}
Vous voulez **payer** une facture, ou **télécharger** un PDF ?`,

    quote_recommendation_fr: `Comparatif {{origin}} → {{destination}} ({{weight_kg}} kg / {{volume_m3}} m³) :
• Aérien : {{air.price}} XOF · {{air.days}} j  
• Maritime : {{sea.price}} XOF · {{sea.days}} j  
• Routier : {{road.price}} XOF · {{road.days}} j  
👉 Recommandé : **{{best.mode}}** ({{best.reason}}). Je génère le **devis** ?`,

    notifications_ok_fr: "Parfait ✅. J'enverrai les mises à jour via {{channels_human}}. Vous pourrez changer ce choix à tout moment.",

    escalated_fr: "Je viens d'alerter un conseiller humain 🧑‍💼. Temps estimé : {{eta_minutes}} min. Vous serez prévenu ici."
  },

  slot_filling: {
    polite_ask_fr: {
      tracking_code: "Pouvez-vous me donner le **numéro de suivi** ? (ex. **DKR240815**)",
      origin: "Ville/port **d'origine** ?",
      destination: "Ville/port **de destination** ?",
      mode: "Mode **air**, **mer** ou **route** ?",
      weight_kg: "Quel **poids** (kg) ?",
      volume_m3: "Quel **volume** (m³) ?"
    }
  },

  error_handling: {
    tool_timeouts_fr: "Je n'ai pas reçu la réponse technique à temps ⏱️. Je réessaie ou je transmets à un conseiller si vous préférez.",
    api_404_fr: "Cette page/ressource n'existe plus (404). Je vous redirige vers l'emplacement correct.",
    api_invalid_fr: "Je vois un paramètre incomplet. On corrige ensemble : {{field}} manquant.",
    ui_link_fix: {
      on_route_404: {
        log_ui_issue: ["route_404", "path", "meta"],
        propose_redirects: ["/", "/support", "/operations/expeditions"],
        speak: "Lien invalide corrigé. Vous pouvez accéder à **Support** ou **Expéditions**."
      }
    }
  },

  guardrails: [
    "never_return_generic_menu_when_context_present: true",
    "always_use_context_if_slots_completed: true",
    "if_user_types_pure_number_or_letters_for_tracking: try_autofix + confirm_correction_in_natural_language",
    "never_expose_raw_errors: wrap_with_empathy_and_next_steps",
    "short_answers > long paragraphs; attach CTAs"
  ],

  ctas: {
    tracking: ["Activer notifications", "Obtenir POD", "Créer une alerte ETA", "Parler au support"],
    invoices: ["Payer maintenant", "Télécharger PDF", "Activer rappel", "Ouvrir ticket facturation"],
    quotes: ["Générer devis", "Comparer autre itinéraire", "Partager par WhatsApp", "Parler à un conseiller"],
    general: ["Suivre un colis", "Voir factures", "Créer un devis", "Parler à un conseiller"]
  },

  tests_acceptance: [
    "Quand l'utilisateur dit 'Suivre mes colis' puis envoie **DKR240815**, l'agent appelle `track_shipment` et répond avec `tracking_success_fr` + CTAs (pas de menu générique).",
    "Si l'utilisateur envoie **12345678**, l'agent auto-corrige (ex. K12345678) et confirme avant d'appeler `track_shipment`.",
    "Si l'utilisateur tape 'prochain chargement', l'agent interprète comme suivi et redemande **tracking_code** (1 question max), puis appelle l'API.",
    "En cas d'API 404, l'agent ne boucle pas. Il propose redirections sûres (Support/Accueil/Expéditions) et log l'issue."
  ]
}

// Types pour la session mémoire
export interface AISession {
  user_id: string
  channel_id: string
  last_intent?: string
  pending_slots?: Record<string, any>
  conversation_topic?: string
  last_entities?: Record<string, any>
  user_prefs?: {
    locale: string
    theme?: string
    notifications?: boolean
  }
  created_at: Date
  updated_at: Date
}

// Types pour les outils
export interface TrackingResult {
  code: string
  status: string
  from: string
  to: string
  eta: string
  events: Array<{
    ts: string
    label: string
    location?: string
  }>
}

export interface PODResult {
  pdf_url: string
  photos: string[]
  signed_by: string
  signed_at: string
  geo?: {
    lat: number
    lng: number
    address: string
  }
}

export interface InvoiceItem {
  id: string
  total: number
  currency: string
  status: string
  due_at: string
}

export interface QuoteRecommendation {
  origin: string
  destination: string
  weight_kg: number
  volume_m3: number
  air: { price: number; days: number }
  sea: { price: number; days: number }
  road: { price: number; days: number }
  best: { mode: string; reason: string }
}
