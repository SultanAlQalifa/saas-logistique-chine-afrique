import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IntelligentChatbot } from '@/lib/intelligent-chatbot'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

    const chatbot = IntelligentChatbot.getInstance()
    const response = await chatbot.processMessage(
      message,
      session.user.id || session.user.email || 'anonymous',
      conversationHistory
    )

    return NextResponse.json({
      success: true,
      response
    })

  } catch (error) {
    console.error('Erreur API chatbot:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const chatbot = IntelligentChatbot.getInstance()
    const metrics = await chatbot.getMetrics()

    return NextResponse.json({
      success: true,
      metrics
    })

  } catch (error) {
    console.error('Erreur récupération métriques chatbot:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
