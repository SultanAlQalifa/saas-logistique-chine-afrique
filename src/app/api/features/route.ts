import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextMoveSaaSFeatures, FeatureFlagService } from '@/lib/feature-flags'

// GET /api/features - Récupérer toutes les features disponibles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')

    // Seuls les Super Admin peuvent voir toutes les features
    if (session.user.role !== 'SUPER_ADMIN' && !tenantId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const allFeatures = NextMoveSaaSFeatures.getAllFeatures()
    
    if (tenantId) {
      // Retourner les features avec leur statut pour ce tenant
      const tenantFeatures = await FeatureFlagService.getTenantFeatures(tenantId)
      const featuresWithStatus = allFeatures.map(feature => ({
        ...feature,
        enabled: tenantFeatures.includes(feature.code)
      }))
      
      return NextResponse.json({ 
        features: featuresWithStatus,
        tenantId 
      })
    }

    // Retourner toutes les features (Super Admin uniquement)
    return NextResponse.json({ features: allFeatures })

  } catch (error) {
    console.error('Erreur lors de la récupération des features:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}

// POST /api/features - Créer une nouvelle feature (Super Admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { code, name, description, category, module } = body

    if (!code || !name || !category || !module) {
      return NextResponse.json(
        { error: 'Champs requis manquants' }, 
        { status: 400 }
      )
    }

    // TODO: Implémenter la création en base de données
    const newFeature = {
      code,
      name,
      description: description || '',
      category,
      module,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ 
      feature: newFeature,
      message: 'Feature créée avec succès' 
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur lors de la création de la feature:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' }, 
      { status: 500 }
    )
  }
}
