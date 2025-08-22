import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdsCentralService } from '@/lib/ads-central'

// GET /api/ads/[provider]/campaigns - Récupérer les campagnes d'un provider
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { provider } = params
    const tenantId = session.user.companyId || 'default_tenant'

    // Validation du provider
    if (!['meta', 'google', 'tiktok'].includes(provider)) {
      return NextResponse.json(
        { error: 'Provider non supporté' },
        { status: 400 }
      )
    }

    const campaigns = await AdsCentralService.getTenantCampaigns(tenantId, provider)

    return NextResponse.json({
      provider,
      tenant_id: tenantId,
      campaigns,
      count: campaigns.length
    })

  } catch (error) {
    console.error(`Erreur lors de la récupération des campagnes ${params.provider}:`, error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/ads/[provider]/campaigns - Créer une nouvelle campagne
export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier les permissions (Admin ou Super Admin)
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      )
    }

    const { provider } = params
    const tenantId = session.user.companyId || 'default_tenant'
    const body = await request.json()

    const { name, objective, budget_xof, budget_currency = 'XOF', ...extraData } = body

    // Validation des données
    if (!name || !objective || !budget_xof || budget_xof <= 0) {
      return NextResponse.json(
        { error: 'Données manquantes: name, objective, budget_xof requis' },
        { status: 400 }
      )
    }

    let campaign
    switch (provider) {
      case 'meta':
        campaign = await AdsCentralService.createMetaCampaign(tenantId, {
          name,
          objective,
          budget_xof,
          budget_currency,
          targeting: extraData.targeting,
          creative: extraData.creative
        })
        break

      case 'google':
        campaign = await AdsCentralService.createGoogleCampaign(tenantId, {
          name,
          objective,
          budget_xof,
          budget_currency,
          keywords: extraData.keywords,
          targeting: extraData.targeting
        })
        break

      case 'tiktok':
        campaign = await AdsCentralService.createTikTokCampaign(tenantId, {
          name,
          objective,
          budget_xof,
          budget_currency,
          targeting: extraData.targeting,
          creative: extraData.creative
        })
        break

      default:
        return NextResponse.json(
          { error: 'Provider non supporté' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: 'Campagne créée avec succès',
      campaign
    }, { status: 201 })

  } catch (error) {
    console.error(`Erreur lors de la création de campagne ${params.provider}:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
