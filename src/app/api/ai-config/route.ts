import { NextResponse } from 'next/server'
import { ConfigManager } from '@/lib/config-manager'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const aiConfig = await ConfigManager.getAIConfig()
    
    // Return only non-sensitive AI configuration
    const publicConfig = {
      gpt5Enabled: aiConfig.gpt5Enabled,
      gpt5Model: aiConfig.gpt5Model,
      maxTokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
      systemPrompt: aiConfig.systemPrompt,
      autoResponse: aiConfig.autoResponse,
      responseDelay: aiConfig.responseDelay,
      fallbackModel: aiConfig.fallbackModel,
      contextWindow: aiConfig.contextWindow,
      streamingEnabled: aiConfig.streamingEnabled,
      // Include API key status (but not the key itself)
      hasApiKey: !!(aiConfig.openaiApiKey && aiConfig.openaiApiKey !== '' && aiConfig.openaiApiKey.startsWith('sk-'))
    }

    return NextResponse.json({ 
      success: true, 
      config: publicConfig
    })
  } catch (error) {
    console.error('Error loading AI config:', error)
    return NextResponse.json({ 
      error: 'Error loading AI configuration' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    // Vérifier les permissions (seuls les SUPER_ADMIN peuvent modifier la config)
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ 
        error: 'Accès non autorisé' 
      }, { status: 403 })
    }

    const body = await request.json()
    
    // Valider les données
    const allowedFields = [
      'openaiApiKey', 'gpt5Enabled', 'gpt5Model', 'maxTokens', 
      'temperature', 'systemPrompt', 'autoResponse', 'responseDelay',
      'fallbackModel', 'contextWindow', 'streamingEnabled'
    ]
    
    const updateData: any = {}
    for (const field of allowedFields) {
      if (body.hasOwnProperty(field)) {
        updateData[field] = body[field]
      }
    }

    // Valider la clé API OpenAI si fournie
    if (updateData.openaiApiKey && !updateData.openaiApiKey.startsWith('sk-')) {
      return NextResponse.json({ 
        error: 'Clé API OpenAI invalide. Elle doit commencer par "sk-"' 
      }, { status: 400 })
    }

    // Sauvegarder la configuration
    await ConfigManager.updateSection('ai', updateData)
    
    return NextResponse.json({ 
      success: true,
      message: 'Configuration IA mise à jour avec succès'
    })
  } catch (error) {
    console.error('Error saving AI config:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de la sauvegarde de la configuration' 
    }, { status: 500 })
  }
}

