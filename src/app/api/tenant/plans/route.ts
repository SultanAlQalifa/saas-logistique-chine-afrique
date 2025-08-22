import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { MultiTenantPricingMockData } from '@/lib/multi-tenant-pricing'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Seuls les ADMIN et SUPER_ADMIN peuvent voir les plans tenant
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const tenantId = session.user.role === 'SUPER_ADMIN' 
      ? request.nextUrl.searchParams.get('tenant_id') || 'default-tenant'
      : session.user.companyId || 'default-tenant'

    const tenantPlans = MultiTenantPricingMockData.createTenantPlans(tenantId)
    const ownerPlans = MultiTenantPricingMockData.createOwnerPlans()

    return NextResponse.json({
      success: true,
      data: {
        tenant_plans: tenantPlans,
        available_owner_plans: ownerPlans
      }
    })

  } catch (error) {
    console.error('Erreur récupération plans tenant:', error)
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
      owner_plan_id,
      margin_mode,
      margin_value,
      active = true,
      is_public = true,
      notes
    } = body

    const tenantId = session.user.role === 'SUPER_ADMIN' 
      ? body.tenant_id || 'default-tenant'
      : session.user.companyId || 'default-tenant'

    // Validation
    if (!owner_plan_id || !margin_mode || margin_value === undefined) {
      return NextResponse.json(
        { error: 'Paramètres manquants: owner_plan_id, margin_mode, margin_value requis' },
        { status: 400 }
      )
    }

    // Récupérer le plan propriétaire
    const ownerPlans = MultiTenantPricingMockData.createOwnerPlans()
    const ownerPlan = ownerPlans.find(p => p.id === owner_plan_id)
    if (!ownerPlan) {
      return NextResponse.json({ error: 'Plan propriétaire introuvable' }, { status: 404 })
    }

    // Calculer les prix de revente
    let resell_price_month, resell_price_year
    if (margin_mode === 'percent') {
      resell_price_month = Math.round(ownerPlan.price_month_eur * (1 + margin_value / 100))
      resell_price_year = Math.round(ownerPlan.price_year_eur * (1 + margin_value / 100))
    } else {
      resell_price_month = ownerPlan.price_month_eur + margin_value
      resell_price_year = ownerPlan.price_year_eur + margin_value
    }

    const newTenantPlan = {
      id: `tenant-plan-${Date.now()}`,
      tenant_id: tenantId,
      owner_plan_id,
      resell_price_month,
      resell_price_year,
      margin_mode,
      margin_value,
      active,
      is_public,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_plan: ownerPlan
    }

    return NextResponse.json({
      success: true,
      data: newTenantPlan
    })

  } catch (error) {
    console.error('Erreur création plan tenant:', error)
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
      return NextResponse.json({ error: 'ID du plan requis' }, { status: 400 })
    }

    // Simuler la mise à jour
    const updatedPlan = {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updatedPlan
    })

  } catch (error) {
    console.error('Erreur mise à jour plan tenant:', error)
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
      return NextResponse.json({ error: 'ID du plan requis' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Plan supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression plan tenant:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
