import { NextRequest, NextResponse } from 'next/server'
import { MultiTenantPricingMockData, PricingCalculator, RateCalculationRequest } from '@/lib/multi-tenant-pricing'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = request.headers.get('X-Tenant-ID') || 'default-tenant'
    
    // Paramètres de requête
    const mode = searchParams.get('mode') as 'air' | 'sea' | 'road'
    const origin = searchParams.get('origin') || ''
    const destination = searchParams.get('destination') || ''
    const basis = searchParams.get('basis') as 'per_kg' | 'per_m3'
    const weight_kg = parseFloat(searchParams.get('weight_kg') || '0')
    const volume_m3 = parseFloat(searchParams.get('volume_m3') || '0')
    const declared_value = parseFloat(searchParams.get('declared_value') || '0')

    // Validation des paramètres
    if (!mode || !origin || !destination || !basis) {
      return NextResponse.json(
        { success: false, error: 'Paramètres manquants: mode, origin, destination, basis requis' },
        { status: 400 }
      )
    }

    if (weight_kg <= 0 && volume_m3 <= 0) {
      return NextResponse.json(
        { success: false, error: 'Poids ou volume requis' },
        { status: 400 }
      )
    }

    // Récupérer les grilles tarifaires du tenant
    const rateCards = MultiTenantPricingMockData.createTenantRateCards(tenantId)
    const rules = MultiTenantPricingMockData.createTenantRateRules(tenantId)

    // Trouver la grille applicable
    const applicableRateCard = rateCards.find(card => 
      card.active &&
      card.mode === mode &&
      card.rate_basis === basis &&
      (card.origin_country.toLowerCase().includes(origin.toLowerCase()) ||
       card.origin_city?.toLowerCase().includes(origin.toLowerCase()) ||
       origin.toLowerCase().includes(card.origin_country.toLowerCase())) &&
      (card.destination_country.toLowerCase().includes(destination.toLowerCase()) ||
       card.destination_city?.toLowerCase().includes(destination.toLowerCase()) ||
       destination.toLowerCase().includes(card.destination_country.toLowerCase()))
    )

    if (!applicableRateCard) {
      return NextResponse.json({
        success: false,
        error: 'Aucune grille tarifaire trouvée pour ce corridor',
        available_routes: rateCards
          .filter(card => card.active)
          .map(card => ({
            mode: card.mode,
            origin: `${card.origin_city || card.origin_country}`,
            destination: `${card.destination_city || card.destination_country}`,
            basis: card.rate_basis
          }))
      }, { status: 404 })
    }

    // Calculer le tarif
    const calculationRequest: RateCalculationRequest = {
      tenant_id: tenantId,
      mode,
      origin,
      destination,
      rate_basis: basis,
      weight_kg,
      volume_m3,
      declared_value,
      currency: applicableRateCard.currency
    }

    const result = PricingCalculator.calculateShippingRate(
      calculationRequest,
      applicableRateCard,
      rules
    )

    return NextResponse.json({
      success: true,
      data: result,
      rate_card: {
        id: applicableRateCard.id,
        mode: applicableRateCard.mode,
        corridor: `${applicableRateCard.origin_city || applicableRateCard.origin_country} → ${applicableRateCard.destination_city || applicableRateCard.destination_country}`,
        basis: applicableRateCard.rate_basis,
        currency: applicableRateCard.currency,
        tiers: applicableRateCard.tiers,
        min_charge: applicableRateCard.min_charge,
        surcharges: {
          fuel: applicableRateCard.fuel_surcharge_percent,
          security: applicableRateCard.security_surcharge_percent,
          peak_season: applicableRateCard.peak_season_surcharge_percent
        }
      },
      tenant_id: tenantId
    })

  } catch (error) {
    console.error('Erreur calcul tarif:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors du calcul' },
      { status: 500 }
    )
  }
}
