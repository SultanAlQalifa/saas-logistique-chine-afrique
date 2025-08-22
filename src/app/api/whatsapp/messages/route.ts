import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WhatsAppBusinessService } from '@/lib/whatsapp-business'

// GET /api/whatsapp/messages - Récupérer l'historique des messages
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || session.user.companyId
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Vérifier les permissions
    if (session.user.role !== 'SUPER_ADMIN' && session.user.companyId !== tenantId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const messages = await WhatsAppBusinessService.getMessageHistory(tenantId, limit, offset)

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        limit,
        offset,
        total: messages.length
      }
    })

  } catch (error) {
    console.error('Error fetching WhatsApp messages:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    )
  }
}

// POST /api/whatsapp/messages - Envoyer un message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Seuls les admins peuvent envoyer des messages
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    const body = await request.json()
    const { to, message, messageType = 'text', templateName, templateLanguage, templateParameters } = body

    if (!to || (!message && !templateName)) {
      return NextResponse.json(
        { error: 'Destinataire et message/template requis' },
        { status: 400 }
      )
    }

    // Valider le numéro de téléphone
    if (!WhatsAppBusinessService.validatePhoneNumber(to)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      )
    }

    const tenantId = session.user.companyId || 'system'
    let sentMessage

    if (messageType === 'template' && templateName) {
      sentMessage = await WhatsAppBusinessService.sendTemplateMessage(
        tenantId,
        to,
        templateName,
        templateLanguage || 'fr',
        templateParameters || []
      )
    } else {
      sentMessage = await WhatsAppBusinessService.sendTextMessage(
        tenantId,
        to,
        message
      )
    }

    return NextResponse.json({
      success: true,
      data: sentMessage
    })

  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    )
  }
}
