import { NextRequest, NextResponse } from 'next/server'
import { MultiTenantPricingMockData } from '@/lib/multi-tenant-pricing'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le contexte tenant
    const tenantId = request.headers.get('X-Tenant-ID') || 'default-tenant'
    
    // Simuler la récupération des add-ons tenant actifs et publics
    const tenantAddons = MultiTenantPricingMockData.createOwnerFeatureAddons()
    const publicAddons = tenantAddons.filter(addon => addon.active)

    // Formater pour l'affichage public
    const formattedAddons = publicAddons.map(addon => ({
      id: addon.id,
      name: addon.name,
      slug: addon.slug,
      description: addon.description,
      pricing_type: 'FIXED',
      price: addon.price_month_eur,
      unit_label: 'mois',
      taxable: true,
      display_order: 0
    }))

    // Trier par ordre d'affichage
    formattedAddons.sort((a, b) => a.display_order - b.display_order)

    return NextResponse.json({
      success: true,
      data: formattedAddons,
      tenant_id: tenantId
    })

  } catch (error) {
    console.error('Erreur récupération add-ons publics:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
