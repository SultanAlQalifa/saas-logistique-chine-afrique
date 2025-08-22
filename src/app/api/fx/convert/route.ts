import { NextRequest, NextResponse } from 'next/server'
import { FxService } from '@/lib/currency'

// POST /api/fx/convert - Convertir entre devises
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, amount } = body

    // Validation des paramètres
    if (!from || !to || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Paramètres invalides. from, to et amount (>0) requis.' },
        { status: 400 }
      )
    }

    // Effectuer la conversion
    const result = await FxService.convert(amount, from, to)

    return NextResponse.json({
      from_currency: from,
      to_currency: to,
      original_amount: amount,
      converted_amount: result.amount_ccy,
      amount_xof: result.amount_xof,
      fx_rate_used: result.fx_rate_used,
      converted_at: result.converted_at
    })

  } catch (error) {
    console.error('Erreur lors de la conversion FX:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur lors de la conversion' },
      { status: 500 }
    )
  }
}
