import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  enableStreaming: boolean
  enableAnalytics: boolean
  responseCategories: string[]
}

// Stockage temporaire en mémoire (en production, utiliser une base de données)
let aiConfig: AIConfig = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: `Tu es l'assistant IA de NextMove Cargo, une plateforme de logistique entre la Chine et l'Afrique.

Contexte de l'entreprise:
- NextMove Cargo est une plateforme SaaS de logistique
- Spécialisée dans les échanges commerciaux Chine-Afrique
- Services: suivi de colis, gestion des expéditions, documentation douanière
- Zones couvertes: Afrique de l'Ouest et Centrale

Instructions:
- Réponds toujours en français
- Sois professionnel mais accessible
- Fournis des informations précises sur la logistique
- Propose des solutions concrètes
- Mentionne les services NextMove Cargo quand pertinent
- Si tu ne connais pas une information, recommande de contacter le support`,
  enableStreaming: true,
  enableAnalytics: true,
  responseCategories: ['Suivi', 'Tarifs', 'Documentation', 'Support', 'Général']
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      config: aiConfig
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration IA:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await req.json()
    
    // Validation des données
    if (!body.model || typeof body.temperature !== 'number' || 
        typeof body.maxTokens !== 'number' || !body.systemPrompt) {
      return NextResponse.json(
        { error: 'Données de configuration invalides' },
        { status: 400 }
      )
    }

    // Validation des limites
    if (body.temperature < 0 || body.temperature > 2) {
      return NextResponse.json(
        { error: 'La température doit être entre 0 et 2' },
        { status: 400 }
      )
    }

    if (body.maxTokens < 100 || body.maxTokens > 4000) {
      return NextResponse.json(
        { error: 'Le nombre de tokens doit être entre 100 et 4000' },
        { status: 400 }
      )
    }

    // Mise à jour de la configuration
    aiConfig = {
      model: body.model,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
      systemPrompt: body.systemPrompt,
      enableStreaming: body.enableStreaming || false,
      enableAnalytics: body.enableAnalytics || false,
      responseCategories: body.responseCategories || []
    }

    // Log de l'action
    console.log(`Configuration IA mise à jour par ${session.user.email}:`, {
      model: aiConfig.model,
      temperature: aiConfig.temperature,
      maxTokens: aiConfig.maxTokens,
      enableStreaming: aiConfig.enableStreaming,
      enableAnalytics: aiConfig.enableAnalytics
    })

    return NextResponse.json({
      success: true,
      message: 'Configuration IA sauvegardée avec succès',
      config: aiConfig
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la configuration IA:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    )
  }
}

