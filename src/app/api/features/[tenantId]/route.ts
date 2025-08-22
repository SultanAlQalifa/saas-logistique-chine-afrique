import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FeatureFlagService } from '@/lib/feature-flags'

// GET /api/features/[tenantId] - Récupérer les features d'un tenant spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { tenantId } = params

    // Vérifier les permissions
    if (session.user.role !== 'SUPER_ADMIN' && session.user.companyId !== tenantId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const tenantFeatures = await FeatureFlagService.getTenantFeatures(tenantId)
    
    return NextResponse.json({ 
      tenantId,
      features: tenantFeatures,
      count: tenantFeatures.length
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des features du tenant:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}

// PUT /api/features/[tenantId] - Synchroniser les features d'un tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { tenantId } = params
    const body = await request.json()
    const { planId, addonIds = [] } = body

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID requis' }, 
        { status: 400 }
      )
    }

    await FeatureFlagService.syncTenantFeatures(tenantId, planId, addonIds)
    const updatedFeatures = await FeatureFlagService.getTenantFeatures(tenantId)

    return NextResponse.json({ 
      tenantId,
      planId,
      addonIds,
      features: updatedFeatures,
      message: 'Features synchronisées avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la synchronisation des features:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}
