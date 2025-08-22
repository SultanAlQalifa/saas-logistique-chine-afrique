// Types pour le système de publicités centralisées
export interface AdsCredentials {
  id: string
  provider: 'meta' | 'google' | 'tiktok'
  app_id: string
  app_secret: string
  account_id: string
  refresh_token?: string
  extra_json?: any
  active: boolean
  created_at: string
  updated_at: string
}

export interface AdsCampaign {
  id: string
  tenant_id: string
  provider: 'meta' | 'google' | 'tiktok'
  name: string
  objective: string
  budget_xof: number
  budget_currency: string
  status: 'draft' | 'active' | 'paused' | 'completed' | 'deleted'
  external_id?: string
  metrics_json?: any
  created_at: string
  updated_at: string
}

export interface AdsSpendEntry {
  id: string
  tenant_id: string
  provider: 'meta' | 'google' | 'tiktok'
  campaign_id: string
  spend_xof: number
  spend_ccy: number
  currency_code: string
  fx_rate_used: number
  impressions?: number
  clicks?: number
  conversions?: number
  period_day: string
  created_at: string
}

// Service de gestion des publicités centralisées
export class AdsCentralService {
  private static readonly PROVIDERS = {
    META: 'meta',
    GOOGLE: 'google',
    TIKTOK: 'tiktok'
  } as const

  /**
   * Récupère les credentials du Super Admin pour un provider
   */
  static async getProviderCredentials(provider: string): Promise<AdsCredentials | null> {
    // TODO: Implémenter la récupération depuis la base de données
    // Pour l'instant, retourner des données mock
    const mockCredentials: { [key: string]: AdsCredentials } = {
      meta: {
        id: 'cred_meta_1',
        provider: 'meta',
        app_id: process.env.META_APP_ID || 'mock_app_id',
        app_secret: process.env.META_APP_SECRET || 'mock_app_secret',
        account_id: process.env.META_AD_ACCOUNT_ID || 'mock_account_id',
        refresh_token: process.env.META_REFRESH_TOKEN,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      google: {
        id: 'cred_google_1',
        provider: 'google',
        app_id: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
        app_secret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
        account_id: process.env.GOOGLE_ADS_CUSTOMER_ID || 'mock_customer_id',
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      tiktok: {
        id: 'cred_tiktok_1',
        provider: 'tiktok',
        app_id: process.env.TIKTOK_APP_ID || 'mock_app_id',
        app_secret: process.env.TIKTOK_APP_SECRET || 'mock_app_secret',
        account_id: process.env.TIKTOK_ADVERTISER_ID || 'mock_advertiser_id',
        refresh_token: process.env.TIKTOK_ACCESS_TOKEN,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    return mockCredentials[provider] || null
  }

  /**
   * Crée une campagne Meta Ads via le tunnel central
   */
  static async createMetaCampaign(tenantId: string, campaignData: {
    name: string
    objective: string
    budget_xof: number
    budget_currency: string
    targeting?: any
    creative?: any
  }): Promise<AdsCampaign> {
    const credentials = await AdsCentralService.getProviderCredentials('meta')
    if (!credentials || !credentials.active) {
      throw new Error('Meta Ads credentials not configured')
    }

    try {
      // Simulation d'appel à l'API Meta
      const mockExternalId = `meta_campaign_${Date.now()}`
      
      // TODO: Remplacer par un vrai appel à l'API Meta
      // const response = await fetch(`https://graph.facebook.com/v18.0/${credentials.account_id}/campaigns`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${credentials.refresh_token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     name: campaignData.name,
      //     objective: campaignData.objective,
      //     status: 'PAUSED',
      //     daily_budget: Math.round(campaignData.budget_xof * 0.0016 * 100), // Conversion XOF -> USD cents
      //   })
      // })

      const campaign: AdsCampaign = {
        id: `campaign_${Date.now()}`,
        tenant_id: tenantId,
        provider: 'meta',
        name: campaignData.name,
        objective: campaignData.objective,
        budget_xof: campaignData.budget_xof,
        budget_currency: campaignData.budget_currency,
        status: 'draft',
        external_id: mockExternalId,
        metrics_json: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // TODO: Sauvegarder en base de données
      console.log('Meta campaign created:', campaign)
      
      return campaign

    } catch (error) {
      console.error('Error creating Meta campaign:', error)
      throw new Error('Failed to create Meta campaign')
    }
  }

  /**
   * Crée une campagne Google Ads via le tunnel central
   */
  static async createGoogleCampaign(tenantId: string, campaignData: {
    name: string
    objective: string
    budget_xof: number
    budget_currency: string
    keywords?: string[]
    targeting?: any
  }): Promise<AdsCampaign> {
    const credentials = await AdsCentralService.getProviderCredentials('google')
    if (!credentials || !credentials.active) {
      throw new Error('Google Ads credentials not configured')
    }

    try {
      // Simulation d'appel à l'API Google Ads
      const mockExternalId = `google_campaign_${Date.now()}`
      
      // TODO: Remplacer par un vrai appel à l'API Google Ads
      // Utiliser la Google Ads API v14+

      const campaign: AdsCampaign = {
        id: `campaign_${Date.now()}`,
        tenant_id: tenantId,
        provider: 'google',
        name: campaignData.name,
        objective: campaignData.objective,
        budget_xof: campaignData.budget_xof,
        budget_currency: campaignData.budget_currency,
        status: 'draft',
        external_id: mockExternalId,
        metrics_json: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          keywords: campaignData.keywords || []
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Google campaign created:', campaign)
      return campaign

    } catch (error) {
      console.error('Error creating Google campaign:', error)
      throw new Error('Failed to create Google campaign')
    }
  }

  /**
   * Crée une campagne TikTok Ads via le tunnel central
   */
  static async createTikTokCampaign(tenantId: string, campaignData: {
    name: string
    objective: string
    budget_xof: number
    budget_currency: string
    targeting?: any
    creative?: any
  }): Promise<AdsCampaign> {
    const credentials = await AdsCentralService.getProviderCredentials('tiktok')
    if (!credentials || !credentials.active) {
      throw new Error('TikTok Ads credentials not configured')
    }

    try {
      // Simulation d'appel à l'API TikTok
      const mockExternalId = `tiktok_campaign_${Date.now()}`
      
      // TODO: Remplacer par un vrai appel à l'API TikTok for Business

      const campaign: AdsCampaign = {
        id: `campaign_${Date.now()}`,
        tenant_id: tenantId,
        provider: 'tiktok',
        name: campaignData.name,
        objective: campaignData.objective,
        budget_xof: campaignData.budget_xof,
        budget_currency: campaignData.budget_currency,
        status: 'draft',
        external_id: mockExternalId,
        metrics_json: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('TikTok campaign created:', campaign)
      return campaign

    } catch (error) {
      console.error('Error creating TikTok campaign:', error)
      throw new Error('Failed to create TikTok campaign')
    }
  }

  /**
   * Récupère les campagnes d'un tenant
   */
  static async getTenantCampaigns(tenantId: string, provider?: string): Promise<AdsCampaign[]> {
    // TODO: Implémenter la récupération depuis la base de données
    // Pour l'instant, retourner des données mock
    const mockCampaigns: AdsCampaign[] = [
      {
        id: 'campaign_1',
        tenant_id: tenantId,
        provider: 'meta',
        name: 'Campagne Lead Generation Q4',
        objective: 'LEAD_GENERATION',
        budget_xof: 250000,
        budget_currency: 'XOF',
        status: 'active',
        external_id: 'meta_123456789',
        metrics_json: {
          impressions: 15420,
          clicks: 342,
          conversions: 28,
          spend: 89500
        },
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z'
      },
      {
        id: 'campaign_2',
        tenant_id: tenantId,
        provider: 'google',
        name: 'Mots-clés Logistique Dakar',
        objective: 'SEARCH_TRAFFIC',
        budget_xof: 180000,
        budget_currency: 'XOF',
        status: 'active',
        external_id: 'google_987654321',
        metrics_json: {
          impressions: 8930,
          clicks: 156,
          conversions: 12,
          spend: 67200,
          keywords: ['logistique dakar', 'transport colis', 'expédition sénégal']
        },
        created_at: '2024-01-10T08:00:00Z',
        updated_at: '2024-01-20T12:00:00Z'
      }
    ]

    return provider 
      ? mockCampaigns.filter(c => c.provider === provider)
      : mockCampaigns
  }

  /**
   * Synchronise les métriques d'une campagne depuis l'API du provider
   */
  static async syncCampaignMetrics(campaignId: string): Promise<void> {
    // TODO: Implémenter la synchronisation des métriques
    console.log(`Syncing metrics for campaign ${campaignId}`)
    
    // Simulation de mise à jour des métriques
    // En réalité, ceci ferait des appels aux APIs respectives pour récupérer les dernières données
  }

  /**
   * Récupère les dépenses agrégées par tenant
   */
  static async getTenantSpendSummary(tenantId: string, startDate?: string, endDate?: string): Promise<{
    total_spend_xof: number
    by_provider: { [provider: string]: number }
    by_campaign: { [campaignId: string]: number }
  }> {
    // TODO: Implémenter la récupération depuis ads_spend_ledger
    // Pour l'instant, retourner des données mock
    return {
      total_spend_xof: 156700,
      by_provider: {
        meta: 89500,
        google: 67200,
        tiktok: 0
      },
      by_campaign: {
        campaign_1: 89500,
        campaign_2: 67200
      }
    }
  }

  /**
   * Met à jour le statut d'une campagne
   */
  static async updateCampaignStatus(campaignId: string, status: AdsCampaign['status']): Promise<void> {
    // TODO: Implémenter la mise à jour en base + appel API provider
    console.log(`Updating campaign ${campaignId} status to ${status}`)
  }

  /**
   * Supprime une campagne
   */
  static async deleteCampaign(campaignId: string): Promise<void> {
    // TODO: Implémenter la suppression en base + appel API provider
    console.log(`Deleting campaign ${campaignId}`)
  }
}

// Données mock pour les providers supportés
export const mockAdsProviders = [
  {
    id: 'meta',
    name: 'Meta Ads',
    description: 'Facebook & Instagram Ads',
    icon: '📘',
    color: 'blue',
    objectives: [
      'LEAD_GENERATION',
      'TRAFFIC',
      'CONVERSIONS',
      'BRAND_AWARENESS',
      'REACH',
      'VIDEO_VIEWS'
    ],
    active: true
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Google Search & Display',
    icon: '🔍',
    color: 'green',
    objectives: [
      'SEARCH_TRAFFIC',
      'DISPLAY_AWARENESS',
      'SHOPPING',
      'VIDEO_VIEWS',
      'APP_PROMOTION'
    ],
    active: true
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    description: 'TikTok for Business',
    icon: '🎵',
    color: 'pink',
    objectives: [
      'TRAFFIC',
      'CONVERSIONS',
      'VIDEO_VIEWS',
      'BRAND_AWARENESS',
      'APP_PROMOTION'
    ],
    active: true
  }
]
