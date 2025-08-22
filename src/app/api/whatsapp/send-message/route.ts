import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WhatsAppIntegration } from '@/lib/whatsapp-integration'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { to, type, text, templateName, variables } = await request.json()

    if (!to) {
      return NextResponse.json(
        { error: 'Destinataire requis' },
        { status: 400 }
      )
    }

    const whatsapp = WhatsAppIntegration.getInstance()
    let success = false

    if (templateName && variables) {
      // Envoi de template
      success = await whatsapp.sendTemplate(to, templateName, variables)
    } else if (text) {
      // Envoi de message libre
      success = await whatsapp.sendMessage(to, {
        type: type || 'text',
        content: text
      })
    } else {
      return NextResponse.json(
        { error: 'Contenu du message requis' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success,
      message: success ? 'Message envoyé avec succès' : 'Échec de l\'envoi du message'
    })

  } catch (error) {
    console.error('Erreur envoi message WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
