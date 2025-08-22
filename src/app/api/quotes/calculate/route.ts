import { NextRequest, NextResponse } from 'next/server'
import { MultiTenantPricingMockData, PricingCalculator, RateCalculationRequest } from '@/lib/multi-tenant-pricing'

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('X-Tenant-ID') || 'default-tenant'
    const body = await request.json()

    const {
      mode,
      origin,
      destination,
      rate_basis,
      weight_kg,
      volume_m3,
      declared_value = 0,
      selected_addons = [],
      plan_id
    } = body

    // Validation
    if (!mode || !origin || !destination || !rate_basis) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Récupérer les données du tenant
    const rateCards = MultiTenantPricingMockData.createTenantRateCards(tenantId)
    const rules = MultiTenantPricingMockData.createTenantRateRules(tenantId)
    const tenantAddons = MultiTenantPricingMockData.createOwnerFeatureAddons()
    const tenantContext = MultiTenantPricingMockData.createTenantContext(tenantId)

    // Trouver la grille tarifaire
    const applicableRateCard = rateCards.find(card => 
      card.active &&
      card.mode === mode &&
      card.rate_basis === rate_basis &&
      (card.origin_country.toLowerCase().includes(origin.toLowerCase()) ||
       origin.toLowerCase().includes(card.origin_country.toLowerCase())) &&
      (card.destination_country.toLowerCase().includes(destination.toLowerCase()) ||
       destination.toLowerCase().includes(card.destination_country.toLowerCase()))
    )

    if (!applicableRateCard) {
      return NextResponse.json(
        { success: false, error: 'Aucune grille tarifaire disponible pour ce corridor' },
        { status: 404 }
      )
    }

    // Calculer le transport
    const calculationRequest: RateCalculationRequest = {
      tenant_id: tenantId,
      mode,
      origin,
      destination,
      rate_basis,
      weight_kg,
      volume_m3,
      declared_value,
      currency: applicableRateCard.currency
    }

    const shippingResult = PricingCalculator.calculateShippingRate(
      calculationRequest,
      applicableRateCard,
      rules
    )

    // Calculer les add-ons
    const addonResults = selected_addons.map((addonSelection: any) => {
      const addon = tenantAddons.find(a => a.id === addonSelection.addon_id)
      if (!addon) return null

      // Mock calculation for addon
      return {
        addon_id: addon.id,
        name: addon.name,
        quantity: addonSelection.quantity || 1,
        unit_price: addon.price_month_eur,
        total_price: (addonSelection.quantity || 1) * addon.price_month_eur
      }
    }).filter(Boolean)

    // Calcul final
    const quote = PricingCalculator.calculateQuote(
      shippingResult,
      addonResults,
      tenantContext.vat_rate
    )

    // Ajouter les informations du plan si sélectionné
    let planInfo = null
    if (plan_id) {
      const tenantPlans = MultiTenantPricingMockData.createTenantPlans(tenantId)
      const selectedPlan = tenantPlans.find(p => p.id === plan_id)
      if (selectedPlan) {
        planInfo = {
          id: selectedPlan.id,
          name: selectedPlan.owner_plan?.name,
          price_month: selectedPlan.resell_price_month,
          price_year: selectedPlan.resell_price_year
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        quote,
        plan: planInfo,
        corridor: `${applicableRateCard.origin_city || applicableRateCard.origin_country} → ${applicableRateCard.destination_city || applicableRateCard.destination_country}`,
        calculation_details: {
          rate_basis,
          quantity_used: rate_basis === 'per_kg' ? weight_kg : volume_m3,
          rate_card_id: applicableRateCard.id,
          tenant_id: tenantId
        }
      }
    })

  } catch (error) {
    console.error('Erreur calcul devis:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors du calcul' },
      { status: 500 }
    )
  }
}
