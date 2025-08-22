import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppBusinessService } from '@/lib/whatsapp-business'

// GET /api/whatsapp/webhook - Vérification du webhook WhatsApp
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    // Vérifier le token de vérification
    const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
    
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('WhatsApp webhook verified successfully')
      return new NextResponse(challenge, { status: 200 })
    } else {
      console.error('WhatsApp webhook verification failed')
      return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
    }

  } catch (error) {
    console.error('Error verifying WhatsApp webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/whatsapp/webhook - Recevoir les événements WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Traiter le webhook de manière asynchrone
    await WhatsAppBusinessService.handleWebhook(body)
    
    // Répondre immédiatement à WhatsApp
    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('Error handling WhatsApp webhook:', error)
    // Toujours répondre 200 à WhatsApp pour éviter les retry
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
