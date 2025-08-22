import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WhatsAppProactiveNotifications } from '@/lib/whatsapp-proactive-notifications'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { to, template, lang = 'fr', vars = [] } = await request.json()

    if (!to || !template) {
      return NextResponse.json(
        { error: 'Paramètres manquants: to et template requis' },
        { status: 400 }
      )
    }

    const notifications = WhatsAppProactiveNotifications.getInstance()
    
    // Vérifier que le template existe
    const templateObj = notifications.getTemplate(template)
    if (!templateObj) {
      return NextResponse.json(
        { error: `Template non trouvé: ${template}` },
        { status: 400 }
      )
    }

    // Envoyer le template via l'API WhatsApp
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
    
    const payload = {
      messaging_product: 'whatsapp',
      to: to.replace('+', ''),
      type: 'template',
      template: {
        name: template,
        language: { code: lang },
        components: [
          {
            type: 'body',
            parameters: vars.map((value: string) => ({
              type: 'text',
              text: value
            }))
          }
        ]
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const result = await response.json()
      return NextResponse.json({
        success: true,
        message: 'Template envoyé avec succès',
        messageId: result.messages?.[0]?.id
      })
    } else {
      const error = await response.text()
      console.error('Erreur API WhatsApp:', error)
      return NextResponse.json(
        { error: 'Échec envoi template WhatsApp' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erreur envoi template WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
