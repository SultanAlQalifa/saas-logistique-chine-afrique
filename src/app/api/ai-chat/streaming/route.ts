import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import openaiService, { ChatMessage } from '@/lib/openai'

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

    // Restrict AI streaming to SUPER_ADMIN, ADMIN, and CLIENT
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

    // Utilisation de l'instance exportée par défaut

    // Create system prompt based on type
    let systemPrompt = `Tu es l'assistant IA de NextMove Cargo, une plateforme de logistique Chine-Afrique. 
    Réponds de manière professionnelle et utile en français.`

    if (type === 'logistics') {
      systemPrompt = `Tu es un assistant IA spécialisé dans la logistique entre la Chine et l'Afrique pour NextMove Cargo. 
      Fournis des informations précises et des solutions concrètes sur la logistique internationale.`
    } else if (type === 'faq') {
      systemPrompt = `Tu es un assistant pour la FAQ de NextMove Cargo. 
      Réponds aux questions fréquentes de manière concise et précise.`
    }

    const messages: ChatMessage[] = [
      { role: 'user', content: message }
    ]

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const streamingResponse = await openaiService.generateStreamingCompletion(messages, {
            systemPrompt,
            temperature: 0.7,
            maxTokens: 800
          })

          for await (const chunk of streamingResponse) {
            const data = `data: ${JSON.stringify({ content: chunk })}\n\n`
            controller.enqueue(new TextEncoder().encode(data))
          }

          // Send completion signal
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          const errorData = `data: ${JSON.stringify({ error: 'Erreur lors de la génération' })}\n\n`
          controller.enqueue(new TextEncoder().encode(errorData))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('AI Streaming API Error:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
