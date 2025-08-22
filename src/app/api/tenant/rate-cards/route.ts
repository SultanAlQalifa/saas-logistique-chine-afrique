import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { MultiTenantPricingMockData } from '@/lib/multi-tenant-pricing'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const tenantId = session.user.role === 'SUPER_ADMIN' 
      ? request.nextUrl.searchParams.get('tenant_id') || 'default-tenant'
      : session.user.companyId || 'default-tenant'

    const rateCards = MultiTenantPricingMockData.createTenantRateCards(tenantId)
    const rules = MultiTenantPricingMockData.createTenantRateRules(tenantId)

    return NextResponse.json({
      success: true,
      data: {
        rate_cards: rateCards,
        rate_rules: rules
      }
    })

  } catch (error) {
    console.error('Erreur récupération grilles tarifaires:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const {
      mode,
      origin_region,
      origin_country,
      origin_city,
      destination_region,
      destination_country,
      destination_city,
      rate_basis,
      tiers,
      min_charge,
      fuel_surcharge_percent = 0,
      security_surcharge_percent = 0,
      peak_season_surcharge_percent = 0,
      currency = 'EUR',
      active = true,
      valid_from,
      valid_until
    } = body

    const tenantId = session.user.role === 'SUPER_ADMIN' 
      ? body.tenant_id || 'default-tenant'
      : session.user.companyId || 'default-tenant'

    // Validation
    if (!mode || !origin_country || !destination_country || !rate_basis || !tiers || !Array.isArray(tiers)) {
      return NextResponse.json(
        { error: 'Paramètres manquants: mode, origin_country, destination_country, rate_basis, tiers requis' },
        { status: 400 }
      )
    }

    // Validation des paliers
    for (const tier of tiers) {
      if (typeof tier.min !== 'number' || typeof tier.price !== 'number') {
        return NextResponse.json(
          { error: 'Paliers invalides: min et price requis pour chaque palier' },
          { status: 400 }
        )
      }
    }

    const newRateCard = {
      id: `rate-card-${Date.now()}`,
      tenant_id: tenantId,
      mode,
      origin_region,
      origin_country,
      origin_city,
      destination_region,
      destination_country,
      destination_city,
      rate_basis,
      tiers: tiers.sort((a, b) => a.min - b.min), // Trier par ordre croissant
      min_charge: min_charge || 0,
      fuel_surcharge_percent,
      security_surcharge_percent,
      peak_season_surcharge_percent,
      currency,
      active,
      valid_from: valid_from || new Date().toISOString(),
      valid_until,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newRateCard
    })

  } catch (error) {
    console.error('Erreur création grille tarifaire:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de la grille requis' }, { status: 400 })
    }

    // Validation des paliers si fournis
    if (updates.tiers && Array.isArray(updates.tiers)) {
      updates.tiers = updates.tiers.sort((a: any, b: any) => a.min - b.min)
    }

    const updatedRateCard = {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updatedRateCard
    })

  } catch (error) {
    console.error('Erreur mise à jour grille tarifaire:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de la grille requis' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Grille tarifaire supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression grille tarifaire:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
