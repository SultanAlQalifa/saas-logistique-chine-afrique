// Système de Feature Flags pour NextMove SaaS
// Contrôle granulaire des fonctionnalités selon les plans et add-ons

export type FeatureCategory = 'module' | 'section' | 'report' | 'admin'

export interface Feature {
  id: string
  name: string
  code: string
  category: FeatureCategory
  description: string
  required_plan_level?: number // 1=Starter, 2=Business, 3=Enterprise
  required_addon_id?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface PlanFeature {
  id: string
  plan_id: string
  feature_id: string
  enabled: boolean
  created_at: string
}

export interface AddonFeature {
  id: string
  addon_id: string
  feature_id: string
  enabled: boolean
  created_at: string
}

export interface TenantFeature {
  id: string
  tenant_id: string
  feature_id: string
  enabled: boolean
  source: 'plan' | 'addon' // d'où vient l'activation
  source_id: string // plan_id ou addon_id
  activated_at: string
}

// Matrice complète des fonctionnalités NextMove SaaS
export class NextMoveSaaSFeatures {
  static getAllFeatures(): Feature[] {
    return [
      // ===== MODULES DE BASE =====
      {
        id: 'feat-1',
        name: 'Gestion des Colis',
        code: 'mod_colis',
        category: 'module',
        description: 'Création, suivi et gestion des colis individuels',
        required_plan_level: 1,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-2',
        name: 'Gestion des Expéditions',
        code: 'mod_expeditions',
        category: 'module',
        description: 'Gestion des expéditions multi-colis et groupage',
        required_plan_level: 1,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-3',
        name: 'Facturation Basique',
        code: 'mod_facture_basic',
        category: 'module',
        description: 'Facturation par kg/CBM avec tarifs de base',
        required_plan_level: 1,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-4',
        name: 'Gestion Clients Finaux',
        code: 'mod_clients',
        category: 'module',
        description: 'Base de données clients et historique',
        required_plan_level: 1,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-5',
        name: 'Gestion des Devis',
        code: 'mod_devis',
        category: 'module',
        description: 'Création et suivi des devis clients',
        required_plan_level: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-6',
        name: 'Gestion des Cargos',
        code: 'mod_cargo',
        category: 'module',
        description: 'Gestion des conteneurs et groupage maritime/aérien',
        required_plan_level: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // ===== MODULES AVANCÉS =====
      {
        id: 'feat-7',
        name: 'Ressources Humaines',
        code: 'mod_rh',
        category: 'module',
        description: 'Gestion des employés, agents et chauffeurs',
        required_plan_level: 3,
        required_addon_id: 'owner-feature-rh',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-8',
        name: 'Marketing & Campagnes',
        code: 'mod_marketing',
        category: 'module',
        description: 'Campagnes email, SMS et promotions',
        required_plan_level: 2,
        required_addon_id: 'owner-feature-marketing',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-9',
        name: 'Support Client',
        code: 'mod_support',
        category: 'module',
        description: 'Système de tickets et support intégré',
        required_plan_level: 2,
        required_addon_id: 'owner-feature-support',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-10',
        name: 'Intégrations API',
        code: 'mod_api',
        category: 'module',
        description: 'API REST et intégrations ERP externes',
        required_plan_level: 3,
        required_addon_id: 'owner-feature-1', // API Avancée
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-11',
        name: 'White-label',
        code: 'mod_whitelabel',
        category: 'module',
        description: 'Personnalisation complète marque et domaine',
        required_plan_level: 3,
        required_addon_id: 'owner-feature-2', // White-label Branding
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // ===== COMMUNICATION =====
      {
        id: 'feat-12',
        name: 'WhatsApp Intégré',
        code: 'mod_whatsapp',
        category: 'module',
        description: 'Chat WhatsApp Business intégré',
        required_plan_level: 2,
        required_addon_id: 'owner-feature-whatsapp',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-13',
        name: 'Telegram Intégré',
        code: 'mod_telegram',
        category: 'module',
        description: 'Chat Telegram Bot intégré',
        required_plan_level: 2,
        required_addon_id: 'owner-feature-whatsapp', // Même add-on que WhatsApp
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-14',
        name: 'Chat IA',
        code: 'mod_ai_chat',
        category: 'module',
        description: 'Assistant IA conversationnel OpenAI',
        required_plan_level: 3,
        required_addon_id: 'owner-feature-ai',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // ===== RAPPORTS STANDARDS =====
      {
        id: 'feat-15',
        name: 'Rapport Financier Basique',
        code: 'rep_fin_basic',
        category: 'report',
        description: 'Chiffre d\'affaires et bénéfices de base',
        required_plan_level: 1,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-16',
        name: 'Rapport Logistique',
        code: 'rep_logistic',
        category: 'report',
        description: 'Statistiques colis, expéditions et performance',
        required_plan_level: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-17',
        name: 'Rapport Clients',
        code: 'rep_clients',
        category: 'report',
        description: 'Analyse clientèle, fidélité et segmentation',
        required_plan_level: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // ===== RAPPORTS AVANCÉS =====
      {
        id: 'feat-18',
        name: 'Analytics RH',
        code: 'rep_rh',
        category: 'report',
        description: 'Performance employés et analytics RH',
        required_plan_level: 3,
        required_addon_id: 'owner-feature-rh',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-19',
        name: 'Analytics Marketing',
        code: 'rep_marketing',
        category: 'report',
        description: 'ROI campagnes et conversion marketing',
        required_plan_level: 3,
        required_addon_id: 'owner-feature-marketing',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-20',
        name: 'Analytics Avancés',
        code: 'rep_advanced',
        category: 'report',
        description: 'Tableaux de bord multi-dimensionnels',
        required_plan_level: 3,
        required_addon_id: 'owner-feature-4', // Analytics Avancés
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // ===== ADMIN ENTREPRISE =====
      {
        id: 'feat-21',
        name: 'Gestion Abonnements Clients',
        code: 'adm_abos_clients',
        category: 'admin',
        description: 'Abonnements et forfaits pour clients finaux',
        required_plan_level: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-22',
        name: 'Tarification Personnalisée',
        code: 'adm_tarifs',
        category: 'admin',
        description: 'Grilles tarifaires kg/CBM personnalisées',
        required_plan_level: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-23',
        name: 'Catalogue Services Métier',
        code: 'adm_catalogue',
        category: 'admin',
        description: 'Services optionnels (assurance, emballage, etc.)',
        required_plan_level: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // ===== ADMIN PROPRIÉTAIRE =====
      {
        id: 'feat-24',
        name: 'Gestion Plans SaaS',
        code: 'adm_plans',
        category: 'admin',
        description: 'Configuration des plans d\'abonnement SaaS',
        required_plan_level: 1, // Visible pour tous mais géré par Super Admin
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-25',
        name: 'Gestion Add-ons SaaS',
        code: 'adm_addons',
        category: 'admin',
        description: 'Configuration des add-ons de fonctionnalités',
        required_plan_level: 1, // Visible pour tous mais géré par Super Admin
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'feat-26',
        name: 'Analytics Global Plateforme',
        code: 'adm_global_analytics',
        category: 'admin',
        description: 'Vue d\'ensemble de tous les tenants',
        required_plan_level: 3, // Réservé Super Admin
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  // Mapping des plans vers les features
  static getPlanFeatures(): { [planId: string]: string[] } {
    return {
      'owner-plan-1': [ // Starter
        'mod_colis',
        'mod_expeditions', 
        'mod_facture_basic',
        'mod_clients',
        'rep_fin_basic',
        'adm_plans',
        'adm_addons'
      ],
      'owner-plan-2': [ // Business
        'mod_colis',
        'mod_expeditions',
        'mod_facture_basic', 
        'mod_clients',
        'mod_devis',
        'mod_cargo',
        'mod_marketing',
        'mod_support',
        'mod_whatsapp',
        'mod_telegram',
        'rep_fin_basic',
        'rep_logistic',
        'rep_clients',
        'adm_abos_clients',
        'adm_tarifs',
        'adm_catalogue',
        'adm_plans',
        'adm_addons'
      ],
      'owner-plan-3': [ // Enterprise
        'mod_colis',
        'mod_expeditions',
        'mod_facture_basic',
        'mod_clients', 
        'mod_devis',
        'mod_cargo',
        'mod_rh',
        'mod_marketing',
        'mod_support',
        'mod_api',
        'mod_whitelabel',
        'mod_whatsapp',
        'mod_telegram',
        'mod_ai_chat',
        'rep_fin_basic',
        'rep_logistic',
        'rep_clients',
        'rep_rh',
        'rep_marketing',
        'rep_advanced',
        'adm_abos_clients',
        'adm_tarifs',
        'adm_catalogue',
        'adm_plans',
        'adm_addons',
        'adm_global_analytics'
      ]
    }
  }

  // Mapping des add-ons vers les features supplémentaires
  static getAddonFeatures(): { [addonId: string]: string[] } {
    return {
      'owner-feature-1': ['mod_api'], // API Avancée
      'owner-feature-2': ['mod_whitelabel'], // White-label
      'owner-feature-3': ['mod_api'], // Intégration ERP (même que API)
      'owner-feature-4': ['rep_advanced'], // Analytics Avancés
      'owner-feature-5': ['mod_support'], // SLA Garanti (améliore support)
      'owner-feature-rh': ['mod_rh', 'rep_rh'], // Suite RH
      'owner-feature-marketing': ['mod_marketing', 'rep_marketing'], // Suite Marketing
      'owner-feature-support': ['mod_support'], // Support Premium
      'owner-feature-whatsapp': ['mod_whatsapp', 'mod_telegram'], // Messagerie
      'owner-feature-ai': ['mod_ai_chat'] // IA Conversationnelle
    }
  }
}

// Service de gestion des feature flags
export class FeatureFlagService {
  // Vérifier si une feature est activée pour un tenant
  static async isFeatureEnabled(tenantId: string, featureCode: string): Promise<boolean> {
    // TODO: Implémenter la logique de vérification en base
    // Pour l'instant, simulation avec mock data
    return true
  }

  // Obtenir toutes les features activées pour un tenant
  static async getTenantFeatures(tenantId: string): Promise<string[]> {
    // TODO: Récupérer depuis la base tenant_features
    // Simulation avec plan Business par défaut
    const planFeatures = NextMoveSaaSFeatures.getPlanFeatures()['owner-plan-2']
    const addonFeatures = NextMoveSaaSFeatures.getAddonFeatures()['owner-feature-4'] || []
    
    return [...planFeatures, ...addonFeatures]
  }

  // Activer une feature pour un tenant (via plan ou add-on)
  static async enableFeature(tenantId: string, featureCode: string, source: 'plan' | 'addon', sourceId: string): Promise<void> {
    // TODO: Insérer dans tenant_features
    console.log(`Activating feature ${featureCode} for tenant ${tenantId} from ${source} ${sourceId}`)
  }

  // Désactiver une feature pour un tenant
  static async disableFeature(tenantId: string, featureCode: string): Promise<void> {
    // TODO: Supprimer de tenant_features
    console.log(`Disabling feature ${featureCode} for tenant ${tenantId}`)
  }

  // Synchroniser les features d'un tenant selon son plan et ses add-ons
  static async syncTenantFeatures(tenantId: string, planId: string, addonIds: string[]): Promise<void> {
    // TODO: Recalculer toutes les features du tenant
    const planFeatures = NextMoveSaaSFeatures.getPlanFeatures()[planId] || []
    const addonFeatureMap = NextMoveSaaSFeatures.getAddonFeatures()
    
    let allFeatures: string[] = [...planFeatures]
    
    addonIds.forEach(addonId => {
      const addonFeatures = addonFeatureMap[addonId] || []
      allFeatures = [...allFeatures, ...addonFeatures]
    })

    // Supprimer les doublons
    allFeatures = Array.from(new Set(allFeatures))
    
    console.log(`Syncing ${allFeatures.length} features for tenant ${tenantId}`)
  }
}

// Hook React pour vérifier les features
export function useFeatureFlag(featureCode: string, tenantId?: string): boolean {
  // TODO: Implémenter le hook React avec cache et réactivité
  // Pour l'instant, retourne true par défaut
  return true
}

// Composant de protection par feature flag
export interface FeatureGateProps {
  feature: string
  tenantId?: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

// HOC pour protéger les composants par feature flag
export function withFeatureFlag<T extends object>(
  Component: React.ComponentType<T>,
  featureCode: string
) {
  return function FeatureProtectedComponent(props: T) {
    const hasFeature = useFeatureFlag(featureCode)
    
    if (!hasFeature) {
      return null
    }
    
    return null
  }
}
