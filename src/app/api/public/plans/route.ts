import { NextRequest, NextResponse } from 'next/server'
import { MultiTenantPricingMockData } from '@/lib/multi-tenant-pricing'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le contexte tenant depuis les headers ou domaine
    const tenantId = request.headers.get('X-Tenant-ID') || 'default-tenant'
    
    // Simuler la récupération des plans tenant actifs et publics
    const tenantPlans = MultiTenantPricingMockData.createTenantPlans(tenantId)
    const publicPlans = tenantPlans.filter(plan => plan.active && plan.is_public)

    // Formater pour l'affichage public (masquer les données internes)
    const formattedPlans = publicPlans.map(plan => ({
      id: plan.id,
      name: plan.owner_plan?.name,
      slug: plan.owner_plan?.slug,
      price_month: plan.resell_price_month,
      price_year: plan.resell_price_year,
      features: plan.owner_plan?.features || [],
      limits: plan.owner_plan?.limits,
      highlighted: plan.owner_plan?.highlighted || false,
      display_order: plan.owner_plan?.display_order || 0
    }))

    // Trier par ordre d'affichage
    formattedPlans.sort((a, b) => a.display_order - b.display_order)

    return NextResponse.json({
      success: true,
      data: formattedPlans,
      tenant_id: tenantId
    })

  } catch (error) {
    console.error('Erreur récupération plans publics:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
