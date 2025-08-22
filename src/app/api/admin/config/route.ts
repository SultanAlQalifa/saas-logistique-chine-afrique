import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ConfigManager } from '@/lib/config-manager'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier si l'utilisateur est SUPER_ADMIN
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Accès refusé - SUPER_ADMIN requis' }, { status: 403 })
    }

    try {
      const configData = await ConfigManager.loadConfig()
      
      return NextResponse.json({ 
        success: true, 
        config: configData,
        message: 'Configuration récupérée avec succès'
      })
    } catch (configError) {
      console.error('Erreur ConfigManager:', configError)
      
      // Retourner une configuration par défaut si le chargement échoue
      const defaultConfig = {
        general: {
          siteName: 'NextMove Cargo',
          siteUrl: 'https://nextmove-cargo.com',
          adminEmail: 'admin@nextmove-cargo.com',
          timezone: 'Africa/Dakar',
          language: 'fr',
          currency: 'FCFA',
          maintenanceMode: false,
          companyName: 'NextMove Cargo SARL',
          companyAddress: 'Dakar, Sénégal',
          supportPhone: '+221 77 123 45 67',
          businessHours: '08:00 - 18:00'
        },
        ai: {
          openaiApiKey: 'sk-demo-key-for-development-testing-only',
          gpt5Enabled: true,
          gpt5Model: 'gpt-4-turbo',
          maxTokens: 4096,
          temperature: 0.7,
          systemPrompt: 'Vous êtes un assistant IA spécialisé en logistique Chine-Afrique.',
          autoResponse: true,
          responseDelay: 1000,
          fallbackModel: 'gpt-4-turbo',
          contextWindow: 128000,
          streamingEnabled: true
        },
        integrations: {},
        appearance: {},
        notifications: {},
        system: {},
        security: {}
      }
      
      return NextResponse.json({ 
        success: true, 
        config: defaultConfig,
        message: 'Configuration par défaut chargée'
      })
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur lors de la récupération de la configuration' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier le rôle SUPER_ADMIN
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { section, config } = body

    // Validation des données
    if (!section || !config) {
      return NextResponse.json({ 
        error: 'Section et configuration requises' 
      }, { status: 400 })
    }

    // Mettre à jour la configuration via ConfigManager
    const updatedSection = await ConfigManager.updateSection(section, config)

    // Si c'est la configuration IA, notifier le service OpenAI
    if (section === 'ai' && config.openaiApiKey) {
      try {
        // Dynamically import to avoid circular dependencies
        const { OpenAIService } = await import('@/lib/openai')
        const openaiService = OpenAIService.getInstance()
        await openaiService.updateApiKey(config.openaiApiKey)
        console.log('OpenAI service updated with new API key')
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la clé OpenAI:', error)
      }
    }

    return NextResponse.json({ 
      message: 'Configuration mise à jour avec succès',
      section,
      config: updatedSection
    })

  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erreur interne du serveur' 
    }, { status: 500 })
  }
}
