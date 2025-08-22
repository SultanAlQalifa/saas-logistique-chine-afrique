import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { OpenAIService, ChatMessage } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Restrict AI chat to SUPER_ADMIN, ADMIN, and CLIENT
    if (!['SUPER_ADMIN', 'ADMIN', 'CLIENT'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Accès refusé - Fonctionnalité réservée aux utilisateurs autorisés' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { message, context, type = 'general' } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

    // Get OpenAI service instance
    const openaiService = OpenAIService.getInstance()
    let response: string

    // Generate response based on type
    switch (type) {
      case 'logistics':
        response = await openaiService.generateLogisticsResponse(message, context)
        break
      case 'faq':
        response = await openaiService.generateFAQResponse(message, context)
        break
      case 'general':
      default:
        const messages: ChatMessage[] = [
          { role: 'user', content: message }
        ]
        response = await openaiService.generateChatCompletion(messages, {
          systemPrompt: `Tu es l'assistant IA de NextMove Cargo, une plateforme de logistique Chine-Afrique. 
          Réponds de manière professionnelle et utile en français.`,
          temperature: 0.7
        })
        break
    }

    // Categorize the message for analytics
    const categorization = await openaiService.categorizeMessage(message)

    return NextResponse.json({
      response,
      categorization,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'API AI Chat - Utilisez POST pour envoyer des messages' },
    { status: 200 }
  )
}
