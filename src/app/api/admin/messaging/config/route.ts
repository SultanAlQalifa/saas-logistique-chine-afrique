import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Simuler le chargement de la configuration messagerie
    const config = {
      sms: {
        provider: process.env.SMS_PROVIDER || 'twilio',
        apiKey: process.env.SMS_API_KEY || '',
        apiSecret: process.env.SMS_API_SECRET || '',
        senderId: process.env.SMS_SENDER_ID || 'NextMove',
        enabled: process.env.SMS_ENABLED === 'true'
      },
      whatsapp: {
        businessApiKey: process.env.WHATSAPP_API_KEY || '',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
        webhookToken: process.env.WHATSAPP_WEBHOOK_TOKEN || '',
        enabled: process.env.WHATSAPP_ENABLED === 'true'
      },
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || '',
        enabled: process.env.TELEGRAM_ENABLED === 'true'
      },
      slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
        channel: process.env.SLACK_CHANNEL || '#general',
        enabled: process.env.SLACK_ENABLED === 'true'
      }
    }

    return NextResponse.json(config)

  } catch (error) {
    console.error('Erreur chargement config messagerie:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const config = await request.json()

    // Validation des données
    if (config.sms?.enabled && (!config.sms.apiKey || !config.sms.apiSecret)) {
      return NextResponse.json(
        { error: 'Configuration SMS incomplète' },
        { status: 400 }
      )
    }

    if (config.whatsapp?.enabled && !config.whatsapp.businessApiKey) {
      return NextResponse.json(
        { error: 'Configuration WhatsApp incomplète' },
        { status: 400 }
      )
    }

    if (config.telegram?.enabled && !config.telegram.botToken) {
      return NextResponse.json(
        { error: 'Configuration Telegram incomplète' },
        { status: 400 }
      )
    }

    // Dans un vrai projet, sauvegarder en base de données chiffrée
    console.log('Configuration messagerie sauvegardée:', {
      sms: {
        provider: config.sms?.provider,
        enabled: config.sms?.enabled,
        senderId: config.sms?.senderId
      },
      whatsapp: {
        enabled: config.whatsapp?.enabled,
        phoneNumberId: config.whatsapp?.phoneNumberId
      },
      telegram: {
        enabled: config.telegram?.enabled,
        chatId: config.telegram?.chatId
      },
      slack: {
        enabled: config.slack?.enabled,
        channel: config.slack?.channel
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Configuration messagerie sauvegardée avec succès'
    })

  } catch (error) {
    console.error('Erreur sauvegarde config messagerie:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
