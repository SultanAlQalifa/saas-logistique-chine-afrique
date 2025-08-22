import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FeatureFlagService } from '@/lib/feature-flags'

// GET /api/features/[tenantId]/[featureCode] - Vérifier si une feature est activée
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string; featureCode: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { tenantId, featureCode } = params

    // Vérifier les permissions
    if (session.user.role !== 'SUPER_ADMIN' && session.user.companyId !== tenantId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const isEnabled = await FeatureFlagService.isFeatureEnabled(tenantId, featureCode)
    
    return NextResponse.json({ 
      tenantId,
      featureCode,
      enabled: isEnabled
    })

  } catch (error) {
    console.error('Erreur lors de la vérification de la feature:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}

// POST /api/features/[tenantId]/[featureCode] - Activer une feature
export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string; featureCode: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { tenantId, featureCode } = params
    const body = await request.json()
    const { source, sourceId } = body

    if (!source || !sourceId) {
      return NextResponse.json(
        { error: 'Source et sourceId requis' }, 
        { status: 400 }
      )
    }

    if (!['plan', 'addon'].includes(source)) {
      return NextResponse.json(
        { error: 'Source doit être "plan" ou "addon"' }, 
        { status: 400 }
      )
    }

    await FeatureFlagService.enableFeature(tenantId, featureCode, source as 'plan' | 'addon', sourceId)
    
    return NextResponse.json({ 
      tenantId,
      featureCode,
      source,
      sourceId,
      message: 'Feature activée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'activation de la feature:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}

// DELETE /api/features/[tenantId]/[featureCode] - Désactiver une feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; featureCode: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { tenantId, featureCode } = params

    await FeatureFlagService.disableFeature(tenantId, featureCode)
    
    return NextResponse.json({ 
      tenantId,
      featureCode,
      message: 'Feature désactivée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la désactivation de la feature:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}
