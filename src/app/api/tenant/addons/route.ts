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

    const tenantAddons = MultiTenantPricingMockData.createOwnerFeatureAddons()
    const ownerAddons = MultiTenantPricingMockData.createOwnerFeatureAddons()

    return NextResponse.json({
      success: true,
      data: {
        tenant_addons: tenantAddons,
        available_owner_addons: ownerAddons
      }
    })

  } catch (error) {
    console.error('Erreur récupération add-ons tenant:', error)
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
      owner_addon_id,
      margin_mode,
      margin_value,
      active = true,
      is_public = true,
      resell_pricing_type,
      unit_label_override,
      taxable_override
    } = body

    const tenantId = session.user.role === 'SUPER_ADMIN' 
      ? body.tenant_id || 'default-tenant'
      : session.user.companyId || 'default-tenant'

    if (!owner_addon_id || !margin_mode || margin_value === undefined) {
      return NextResponse.json(
        { error: 'Paramètres manquants: owner_addon_id, margin_mode, margin_value requis' },
        { status: 400 }
      )
    }

    const ownerAddons = MultiTenantPricingMockData.createOwnerFeatureAddons()
    const ownerAddon = ownerAddons.find(a => a.id === owner_addon_id)
    if (!ownerAddon) {
      return NextResponse.json({ error: 'Add-on propriétaire introuvable' }, { status: 404 })
    }

    // Calculer le prix de revente
    let resell_price
    if (margin_mode === 'percent') {
      resell_price = ownerAddon.price_month_eur * (1 + margin_value / 100)
    } else {
      resell_price = ownerAddon.price_month_eur + margin_value
    }

    const newTenantAddon = {
      id: `tenant-addon-${Date.now()}`,
      tenant_id: tenantId,
      owner_addon_id,
      active,
      is_public,
      resell_pricing_type: resell_pricing_type || 'FIXED',
      resell_price,
      unit_label_override,
      taxable_override,
      margin_mode,
      margin_value,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_addon: ownerAddon
    }

    return NextResponse.json({
      success: true,
      data: newTenantAddon
    })

  } catch (error) {
    console.error('Erreur création add-on tenant:', error)
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
      return NextResponse.json({ error: 'ID de l\'add-on requis' }, { status: 400 })
    }

    const updatedAddon = {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updatedAddon
    })

  } catch (error) {
    console.error('Erreur mise à jour add-on tenant:', error)
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
      return NextResponse.json({ error: 'ID de l\'add-on requis' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Add-on supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression add-on tenant:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
