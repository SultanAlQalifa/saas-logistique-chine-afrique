import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdsCentralService } from '@/lib/ads-central'

// GET /api/ads/overview - Vue d'ensemble des publicités pour un tenant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const tenantId = session.user.companyId || 'default_tenant'

    // Récupérer toutes les campagnes du tenant
    const campaigns = await AdsCentralService.getTenantCampaigns(tenantId)
    
    // Récupérer le résumé des dépenses
    const spendSummary = await AdsCentralService.getTenantSpendSummary(
      tenantId, 
      startDate || undefined, 
      endDate || undefined
    )

    // Calculer les métriques agrégées
    const totalImpressions = campaigns.reduce((sum, c) => 
      sum + (c.metrics_json?.impressions || 0), 0
    )
    const totalClicks = campaigns.reduce((sum, c) => 
      sum + (c.metrics_json?.clicks || 0), 0
    )
    const totalConversions = campaigns.reduce((sum, c) => 
      sum + (c.metrics_json?.conversions || 0), 0
    )

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0
    const cpc = totalClicks > 0 ? (spendSummary.total_spend_xof / totalClicks) : 0
    const cpa = totalConversions > 0 ? (spendSummary.total_spend_xof / totalConversions) : 0

    // Grouper par statut
    const campaignsByStatus = campaigns.reduce((acc, campaign) => {
      acc[campaign.status] = (acc[campaign.status] || 0) + 1
      return acc
    }, {} as { [status: string]: number })

    // Performance par provider
    const performanceByProvider = Object.entries(spendSummary.by_provider).map(([provider, spend]) => {
      const providerCampaigns = campaigns.filter(c => c.provider === provider)
      const providerImpressions = providerCampaigns.reduce((sum, c) => 
        sum + (c.metrics_json?.impressions || 0), 0
      )
      const providerClicks = providerCampaigns.reduce((sum, c) => 
        sum + (c.metrics_json?.clicks || 0), 0
      )
      const providerConversions = providerCampaigns.reduce((sum, c) => 
        sum + (c.metrics_json?.conversions || 0), 0
      )

      return {
        provider,
        spend_xof: spend,
        campaigns_count: providerCampaigns.length,
        impressions: providerImpressions,
        clicks: providerClicks,
        conversions: providerConversions,
        ctr: providerImpressions > 0 ? (providerClicks / providerImpressions * 100) : 0,
        cpc: providerClicks > 0 ? (spend / providerClicks) : 0
      }
    })

    return NextResponse.json({
      tenant_id: tenantId,
      period: {
        start_date: startDate,
        end_date: endDate
      },
      summary: {
        total_campaigns: campaigns.length,
        total_spend_xof: spendSummary.total_spend_xof,
        total_impressions: totalImpressions,
        total_clicks: totalClicks,
        total_conversions: totalConversions,
        avg_ctr: Math.round(ctr * 100) / 100,
        avg_conversion_rate: Math.round(conversionRate * 100) / 100,
        avg_cpc: Math.round(cpc),
        avg_cpa: Math.round(cpa)
      },
      campaigns_by_status: campaignsByStatus,
      spend_by_provider: spendSummary.by_provider,
      performance_by_provider: performanceByProvider,
      recent_campaigns: campaigns
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    })

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'overview ads:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
