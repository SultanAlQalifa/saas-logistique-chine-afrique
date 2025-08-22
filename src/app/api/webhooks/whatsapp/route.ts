import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppIntegration } from '@/lib/whatsapp-integration'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    console.log('Vérification webhook WhatsApp:', { mode, token, challenge })

    const whatsapp = WhatsAppIntegration.getInstance()
    const verificationResult = await whatsapp.verifyWebhook(mode || '', token || '', challenge || '')

    if (verificationResult) {
      return new NextResponse(verificationResult, { status: 200 })
    } else {
      return NextResponse.json(
        { error: 'Token de vérification invalide' },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error('Erreur vérification webhook WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier la signature du webhook (sécurité Meta)
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')
    
    if (!verifyWebhookSignature(body, signature)) {
      console.warn('Signature webhook WhatsApp invalide')
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 401 }
      )
    }

    const parsedBody = JSON.parse(body)
    console.log('Message WhatsApp reçu:', JSON.stringify(parsedBody, null, 2))

    const whatsapp = WhatsAppIntegration.getInstance()
    await whatsapp.processIncomingMessage(parsedBody)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur traitement webhook WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  if (!signature) return false
  
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) {
    console.warn('WHATSAPP_APP_SECRET non configuré')
    return true // En développement, on peut ignorer la vérification
  }

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
