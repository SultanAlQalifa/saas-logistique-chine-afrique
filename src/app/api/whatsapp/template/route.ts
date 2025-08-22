import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const { to, template, parameters } = await request.json()

    if (!to || !template) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Envoyer le template WhatsApp
    const whatsappResponse = await sendWhatsAppTemplate({
      to,
      template,
      parameters: parameters || []
    })

    return NextResponse.json({
      success: true,
      messageId: whatsappResponse.messageId,
      status: 'sent',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erreur envoi template WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

async function sendWhatsAppTemplate({ to, template, parameters }: {
  to: string
  template: string
  parameters: any[]
}) {
  const apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0'
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!accessToken || !phoneNumberId) {
    throw new Error('Configuration WhatsApp manquante')
  }

  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: template,
      language: {
        code: 'fr'
      },
      components: parameters.length > 0 ? [
        {
          type: 'body',
          parameters: parameters.map(param => ({
            type: 'text',
            text: param
          }))
        }
      ] : []
    }
  }

  // Simulation de la réponse
  return {
    messageId: `wamid.template.${Date.now()}`,
    status: 'sent'
  }

  // Code réel pour l'API WhatsApp Business (commenté)
  /*
  const response = await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Erreur API WhatsApp: ${response.statusText}`)
  }

  return response.json()
  */
}
