// Configuration NextMove AI Assistant
export const AI_ASSISTANT_CONFIG = {
  name: "NextMove AI Assistant",
  version: "1.0",
  
  language: {
    default: "fr",
    supported: ["fr", "en"],
    behavior: {
      detect_and_switch: true,
      persistent_user_locale: true,
      fallback: "fr"
    }
  },

  tone: {
    style: "conversationnel, amical mais professionnel, naturel, empathique",
    emojis: "utilisés avec parcimonie pour renforcer le ton amical",
    address_user_by_name_if_known: true,
    formality: {
      default: 'informel',
      contexts: {
        support: 'semi-formel',
        payment: 'formel',
        complaint: 'empathique',
        technical: 'clair et pédagogique'
      }
    },
    // Expressions naturelles à utiliser de manière aléatoire
    natural_expressions: {
      greetings: [
        "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        "Salut ! Besoin d'un coup de main ?",
        "Bonjour ! En quoi puis-je vous être utile ?"
      ],
      acknowledgments: [
        "Je comprends tout à fait",
        "Je vois ce que vous voulez dire",
        "C'est noté",
        "Je saisis votre point"
      ],
      thinking: [
        "Je regarde ça pour vous",
        "Laissez-moi vérifier",
        "Je consulte les informations",
        "Un instant, je me renseigne"
      ]
    },
    // Variations de style selon le contexte
    style_variations: {
      friendly: {
        fillers: ["alors", "écoutez", "vous savez", "je dirais"],
        expressions: ["super !", "parfait !", "génial !", "d'accord"]
      },
      professional: {
        fillers: ["en effet", "ainsi", "par conséquent", "de plus"],
        expressions: ["je vous en prie", "avec plaisir", "bien entendu"]
      }
    }
  },

  persona: {
    name: "Sophie",
    role: "Conseillère logistique",
    short_bio: "Je suis Sophie, votre assistante dédiée pour la logistique entre la Chine et l'Afrique. Je suis là pour vous accompagner au quotidien dans le suivi de vos expéditions, la gestion des documents et toutes vos questions logistiques. N'hésitez pas à me poser des questions, même les plus techniques !",
    personality_traits: [
      "empathique",
      "proactive",
      "rigoureuse",
      "à l'écoute",
      "souriante"
    ],
    // Comportements humains à reproduire
    human_like_behaviors: {
      use_contractions: true,  // "je suis" au lieu de "je suis"
      occasional_typos: 0.02,  // 2% de chance d'avoir une faute de frappe
      thinking_time: {
        min: 500,  // temps minimum avant réponse en ms
        max: 2000  // temps maximum avant réponse en ms
      },
      // Réponses pour quand l'IA ne sait pas
      fallback_responses: [
        "Je ne suis pas certaine d'avoir bien compris. Pourriez-vous reformuler ?",
        "Je vais avoir besoin d'un peu plus de détails pour vous aider au mieux.",
        "Pouvez-vous préciser votre demande ? Je veux m'assurer de bien vous répondre."
      ]
    }
  },

  objectives: [
    "Créer une expérience conversationnelle fluide et naturelle",
    "Adapter le ton et le style en fonction du contexte et de l'utilisateur",
    "Utiliser des expressions courantes et naturelles en français",
    "Varier les formulations pour éviter les réponses robotiques",
    "Intégrer des éléments de langage non-verbal (ponctuation expressive, emojis modérés)",
    "Faire preuve d'empathie et de compréhension",
    "Maintenir une personnalité cohérente à travers les interactions",
    "Être proactive en suggérant des actions pertinentes",
    "Orchestrer les outils: tracking, POD, factures, devis, paiements, FX, marketing ROI, support 360º",
    "Respecter les règles: sécurité, confidentialité, validation tracking, XOF pivot, i18n, accessibilité"
  ],

  ui_prefs: {
    theme_modes: ["light", "dark", "auto"],
    theme_persistence: ["cookie_365d", "user_profile"],
    sidebar: {
      auto_collapse: true,
      accordion: true,
      pin_unpin: true,
      keyboard_access: true
    },
    language_switcher: {
      show_in_header_and_user_menu: true,
      works_on_all_pages: true
    }
  },

  business_rules: {
    tracking_code: {
      format: "ALPHANUMÉRIQUE STRICT (≥1 lettre & ≥1 chiffre), 8–20 caractères, A–Z 0–9",
      regex_strict: "^(?=.*[A-Z])(?=.*\\d)[A-Z0-9]{8,20}$",
      sanitize: ["trim", "uppercase", "remove_spaces"],
      migration: {
        numeric_only: "prefix by letter from checksum (A–Z)",
        alpha_only: "suffix by 2 digits from hash",
        keep_alias_90_days: true
      }
    },
    currencies: {
      pivot: "XOF",
      support_all_world_currencies: true,
      fx_live_required: true,
      show_rate_timestamp: true
    },
    payments_modes: {
      platform_owner: "toujours propriétaire de ses propres agrégateurs; jamais déléguée",
      tenant_modes: ["API_PROPRE", "DELEGUE"],
      split_payments_for_clients: {
        enabled: true,
        flows: ["acompte", "solde à la livraison", "solde à POD validé"]
      }
    },
    marketing_tunnel: {
      centralized_credentials_owner: true,
      providers: ["meta", "google", "tiktok"],
      roi_tracking_enabled: true
    },
    pod: {
      capture: ["signature numérique", "photo", "geoloc"],
      output: ["reçu PDF", "preuve consultable"]
    },
    notifications_multichannel: {
      channels: ["email", "sms", "whatsapp", "telegram"],
      templates_custom_by_tenant: true
    }
  },

  nlu: {
    intents: [
      {
        name: "inscription",
        utterances: ["inscription", "m'inscrire", "ouvrir un compte", "signup", "register"]
      },
      {
        name: "connexion",
        utterances: ["connexion", "se connecter", "login", "sign in", "ouvrir une session"]
      },
      {
        name: "suivi_colis",
        utterances: ["suivi", "suivre", "tracking", "où est mon colis", "DKR*", "numéro de suivi *"],
        slots: ["tracking_code"]
      },
      {
        name: "pod",
        utterances: ["POD", "preuve de livraison", "signature", "photo livraison", "reçu livraison"],
        slots: ["tracking_code"]
      },
      {
        name: "factures",
        utterances: ["facture", "mes factures", "payer facture", "télécharger facture *"],
        slots: ["invoice_no"]
      },
      {
        name: "devis",
        utterances: ["devis", "créer devis", "combien ça coûte", "tarif *", "itinéraire *"],
        slots: ["mode", "origin", "destination", "weight_kg", "volume_m3", "incoterm", "ready_date"]
      },
      {
        name: "paiement_fractionne",
        utterances: ["payer en plusieurs fois", "acompte", "paiement fractionné", "solde à la livraison"]
      },
      {
        name: "notifications",
        utterances: ["notifications", "alerte", "whatsapp", "sms", "email"]
      },
      {
        name: "marketing_roi",
        utterances: ["ROI", "performance campagne", "facebook ads", "google ads", "tiktok ads"]
      },
      {
        name: "support",
        utterances: ["support", "ticket", "parler à un conseiller", "humain"]
      },
      {
        name: "documentation",
        utterances: ["documentation", "guide", "aide", "tutoriel", "mode d'emploi"]
      },
      {
        name: "general_qa",
        utterances: ["*"]
      }
    ],
    entities: {
      tracking_code: {
        validate_regex: "^(?=.*[A-Z])(?=.*\\d)[A-Z0-9]{8,20}$",
        normalize: ["uppercase", "trim"]
      },
      invoice_no: { normalize: ["trim", "uppercase"] },
      origin: { type: "city_or_port" },
      destination: { type: "city_or_port" },
      weight_kg: { type: "float", min: 0.1 },
      volume_m3: { type: "float", min: 0.01 },
      incoterm: { enum: ["EXW", "FCA", "FOB", "CIF", "DAP", "DDP"] },
      mode: { enum: ["air", "sea", "road"] }
    }
  },

  templates: {
    hello: {
      fr: "Bonsoir {{name}} 👋. Je vois {{n_shipments}} expédition(s) active(s). Je peux vous aider à suivre **{{first_tracking}}**, régler une facture, ou créer un devis. Que préférez-vous ?",
      en: "Good evening {{name}} 👋. I see {{n_shipments}} active shipment(s). I can track **{{first_tracking}}**, help with a payment, or create a quote. What would you like?"
    },
    tracking_summary: {
      fr: `Voici vos colis actifs :
{{#each shipments}}
• **{{code}}** → {{dest}} — {{status}} (ETA {{eta}})
{{/each}}
Souhaitez-vous des **notifications WhatsApp/SMS** pour ces mises à jour ?`
    },
    pod_offer: {
      fr: "Le colis **{{code}}** est livré ✅. Je peux vous envoyer la **preuve de livraison (POD)** avec signature/photo. Préférez-vous **PDF** par email ou WhatsApp ?"
    },
    invoice_due: {
      fr: "La facture **{{invoice}}** ({{amount}}) est due **{{due_in}}**. Voulez-vous la régler maintenant ? J'ai aussi l'option **paiement fractionné** si utile."
    },
    best_route: {
      fr: `J'ai comparé pour {{origin}} → {{destination}} ({{weight}} kg / {{volume}} m³) :
• **Aérien** : {{air_price}} XOF · {{air_days}} j
• **Maritime** : {{sea_price}} XOF · {{sea_days}} j
• **Routier** : {{road_price}} XOF · {{road_days}} j
👉 Recommandé : **{{recommended_mode}}** ({{reason}}). Je crée le **devis** ?`
    },
    roi_report: {
      fr: `Sur la période {{range}} :
• Meta : {{meta_conv}} conv · CTR {{meta_ctr}} · dépense {{meta_spend}} XOF
• Google : {{g_conv}} · CTR {{g_ctr}} · {{g_spend}} XOF
• TikTok : {{t_conv}} · CTR {{t_ctr}} · {{t_spend}} XOF
ROI global estimé : **{{roi}}**. Voulez-vous **optimiser** la campagne la moins performante ?`
    }
  },

  acceptance_tests: [
    {
      name: "Changement de langue partout",
      steps: [
        { go_to: "/finances/facturation" },
        { action: "switch_language(en)", expect: "labels in English" },
        { action: "switch_language(fr)", expect: "labels back in French" }
      ]
    },
    {
      name: "Sidebar intelligente",
      steps: [
        { open_section: "Opérations" },
        { open_section: "Finances", expect: "Opérations retracted" },
        { wait_idle: "8s", expect: "sidebar collapsed to right unless pinned" }
      ]
    },
    {
      name: "Tracking alphanum",
      steps: [
        { input: "12345678", expect: "auto-correct OR validation error" },
        { migrate_lookup: true }
      ]
    },
    {
      name: "POD disponible",
      steps: [
        { intent: "pod" },
        { slot: { tracking_code: "DKR240815" } },
        { tool: "get_pod", expect: "pod_url returned and offered via email/WhatsApp" }
      ]
    },
    {
      name: "Paiement fractionné",
      steps: [
        { feature_gate: "split_payments=enabled" },
        { tool: "split_payment_create", expect: "schedule upfront+remainder" }
      ]
    },
    {
      name: "Itinéraire & tarif auto",
      steps: [
        { tool: "recommend_route_and_price", expect: "3 modes comparés + recommandation" }
      ]
    },
    {
      name: "ROI marketing",
      steps: [
        { tool: "marketing_roi_overview", expect: "summary with ROI and suggested action" }
      ]
    }
  ]
}

// Types pour l'assistant IA
export interface AIContext {
  user: {
    name?: string
    tenant?: string
    locale: string
    role: string
  }
  recent_shipments?: Array<{
    code: string
    destination: string
    status: string
    eta: string
  }>
  recent_invoices?: Array<{
    invoice_no: string
    amount: number
    due_date: string
    status: string
  }>
  active_features?: string[]
}

export interface AIIntent {
  name: string
  confidence: number
  slots: Record<string, any>
}

export interface AIResponse {
  text: string
  actions?: Array<{
    type: string
    label: string
    data: any
  }>
  context_update?: Partial<AIContext>
}
