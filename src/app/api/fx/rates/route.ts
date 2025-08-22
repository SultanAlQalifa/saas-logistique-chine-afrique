import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FxService } from '@/lib/currency'

// GET /api/fx/rates - Récupérer les taux de change actuels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const base = searchParams.get('base') || 'XOF'
    const quotes = searchParams.get('quotes')?.split(',') || []

    // Validation du paramètre base
    if (base !== 'XOF') {
      return NextResponse.json(
        { error: 'Seule la devise de base XOF est supportée' },
        { status: 400 }
      )
    }

    // Récupérer tous les taux ou seulement ceux demandés
    const allRates = await FxService.getAllRates()
    
    let filteredRates = allRates
    if (quotes.length > 0) {
      filteredRates = Object.fromEntries(
        Object.entries(allRates).filter(([currency]) => quotes.includes(currency))
      )
    }

    return NextResponse.json({
      base: 'XOF',
      rates: filteredRates,
      timestamp: new Date().toISOString(),
      cache_duration_minutes: 15
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des taux FX:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des taux' },
      { status: 500 }
    )
  }
}

// POST /api/fx/rates/refresh - Forcer la mise à jour des taux (Admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Accès refusé - Admin requis' },
        { status: 403 }
      )
    }

    await FxService.refreshRates()
    const updatedRates = await FxService.getAllRates()

    return NextResponse.json({
      message: 'Taux de change mis à jour avec succès',
      rates: updatedRates,
      updated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour des taux FX:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour des taux' },
      { status: 500 }
    )
  }
}
