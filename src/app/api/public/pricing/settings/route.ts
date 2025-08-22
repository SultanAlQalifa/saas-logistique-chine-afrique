import { NextRequest, NextResponse } from 'next/server'
import { MultiTenantPricingMockData } from '@/lib/multi-tenant-pricing'

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('X-Tenant-ID') || 'default-tenant'
    
    // Récupérer le contexte tenant et les paramètres de facturation
    const tenantContext = MultiTenantPricingMockData.createTenantContext(tenantId)
    const billingSettings = MultiTenantPricingMockData.createBillingSettings()

    return NextResponse.json({
      success: true,
      data: {
        tenant: {
          id: tenantContext.id,
          name: tenantContext.name,
          currency_default: tenantContext.currency_default,
          vat_rate: tenantContext.vat_rate
        },
        billing: {
          currency_default: tenantContext.currency_default,
          vat_rate: tenantContext.vat_rate,
          fx_rates: {
            eur_to_xof: billingSettings.fx_eur_to_xof,
            eur_to_usd: billingSettings.fx_eur_to_usd,
            updated_at: billingSettings.fx_updated_at
          }
        },
        settings: tenantContext.settings
      },
      tenant_id: tenantId
    })

  } catch (error) {
    console.error('Erreur récupération paramètres pricing:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
