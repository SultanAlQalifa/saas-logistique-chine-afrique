import { NextRequest, NextResponse } from 'next/server'
import { WebhookService } from '@/lib/payments'
import { PaymentProvider } from '@/types/payments'
import crypto from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider.toUpperCase() as PaymentProvider
    const body = await request.text()
    const signature = request.headers.get('x-signature') || request.headers.get('x-paystack-signature') || request.headers.get('stripe-signature')

    // Verify webhook signature based on provider
    const isValidSignature = await verifyWebhookSignature(provider, body, signature)
    if (!isValidSignature) {
      console.error(`Invalid webhook signature for ${provider}`)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(body)
    
    // Determine event type based on provider
    let eventType: string
    switch (provider) {
      case 'WAVE':
        eventType = payload.event_type || 'unknown'
        break
      case 'PAYSTACK':
        eventType = payload.event || 'unknown'
        break
      case 'STRIPE':
        eventType = payload.type || 'unknown'
        break
      case 'ORANGE_MONEY':
        eventType = payload.event || 'unknown'
        break
      case 'MTN_MONEY':
        eventType = payload.event_type || 'unknown'
        break
      default:
        eventType = 'unknown'
    }

    // Process webhook
    await WebhookService.processWebhook(provider, eventType, payload)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Webhook processing error for ${params.provider}:`, error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function verifyWebhookSignature(
  provider: PaymentProvider,
  body: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) {
    return false
  }

  try {
    switch (provider) {
      case 'WAVE':
        return verifyWaveSignature(body, signature)
      case 'PAYSTACK':
        return verifyPaystackSignature(body, signature)
      case 'STRIPE':
        return verifyStripeSignature(body, signature)
      case 'ORANGE_MONEY':
        return verifyOrangeMoneySignature(body, signature)
      case 'MTN_MONEY':
        return verifyMTNMoneySignature(body, signature)
      default:
        return false
    }
  } catch (error) {
    console.error(`Signature verification error for ${provider}:`, error)
    return false
  }
}

function verifyWaveSignature(body: string, signature: string): boolean {
  // Mock Wave signature verification
  const secret = process.env.WAVE_WEBHOOK_SECRET || 'wave_secret'
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return signature === expectedSignature
}

function verifyPaystackSignature(body: string, signature: string): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY || 'paystack_secret'
  const expectedSignature = crypto
    .createHmac('sha512', secret)
    .update(body)
    .digest('hex')
  
  return signature === expectedSignature
}

function verifyStripeSignature(body: string, signature: string): boolean {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || 'stripe_secret'
  
  // Stripe signature format: t=timestamp,v1=signature
  const elements = signature.split(',')
  const signatureHash = elements.find(element => element.startsWith('v1='))?.split('=')[1]
  
  if (!signatureHash) {
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return signatureHash === expectedSignature
}

function verifyOrangeMoneySignature(body: string, signature: string): boolean {
  // Mock Orange Money signature verification
  const secret = process.env.ORANGE_MONEY_WEBHOOK_SECRET || 'orange_secret'
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return signature === expectedSignature
}

function verifyMTNMoneySignature(body: string, signature: string): boolean {
  // Mock MTN Money signature verification
  const secret = process.env.MTN_MONEY_WEBHOOK_SECRET || 'mtn_secret'
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return signature === expectedSignature
}
