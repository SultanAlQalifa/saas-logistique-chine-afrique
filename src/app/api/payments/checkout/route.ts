import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { OrderService, PaymentModeService, PaymentProviderService, AuditService } from '@/lib/payments'
import { CheckoutRequest, PaymentProvider, PaymentChannel } from '@/types/payments'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      order_id, 
      channel, 
      provider, 
      source_token, 
      return_url, 
      cancel_url 
    }: CheckoutRequest = await request.json()

    if (!order_id || !channel) {
      return NextResponse.json(
        { error: 'Order ID and channel are required' },
        { status: 400 }
      )
    }

    // Get order
    const order = await OrderService.getOrder(order_id)
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify order belongs to tenant
    if (order.tenant_id !== session.user.companyId) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is already paid
    if (order.status === 'SUCCEEDED') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      )
    }

    // Get payment mode
    const mode = await PaymentModeService.getTenantMode(session.user.companyId)
    
    let selectedProvider: PaymentProvider
    let providerCredentials: any

    if (mode === 'API_PROPRE') {
      // Use tenant's own providers
      if (!provider) {
        return NextResponse.json(
          { error: 'Provider is required in API_PROPRE mode' },
          { status: 400 }
        )
      }

      const tenantProviders = await PaymentProviderService.getTenantProviders(session.user.companyId)
      const tenantProvider = tenantProviders.find(p => p.provider === provider && p.active)
      
      if (!tenantProvider) {
        return NextResponse.json(
          { error: 'Provider not configured or inactive' },
          { status: 400 }
        )
      }

      selectedProvider = provider
      providerCredentials = JSON.parse(tenantProvider.credentials)
    } else {
      // Use platform providers (DELEGUE mode)
      const ownerProviders = await PaymentProviderService.getOwnerProviders()
      
      // Select appropriate provider based on channel
      const availableProvider = ownerProviders.find(p => {
        if (channel === 'MOBILE_MONEY') {
          return ['WAVE', 'ORANGE_MONEY', 'MTN_MONEY'].includes(p.provider)
        } else if (channel === 'CARD') {
          return ['PAYSTACK', 'STRIPE', 'FLUTTERWAVE'].includes(p.provider)
        }
        return false
      })

      if (!availableProvider) {
        return NextResponse.json(
          { error: 'No suitable payment provider available' },
          { status: 400 }
        )
      }

      selectedProvider = availableProvider.provider
      providerCredentials = JSON.parse(availableProvider.credentials)
    }

    // Generate payment URL based on provider
    const paymentUrl = await generatePaymentUrl(
      selectedProvider,
      providerCredentials,
      order,
      channel,
      source_token,
      return_url,
      cancel_url
    )

    // Audit log
    await AuditService.log(
      'TENANT',
      session.user.id,
      'INITIATE_CHECKOUT',
      'order',
      order_id,
      { 
        provider: selectedProvider, 
        channel, 
        mode,
        amount: order.amount_ccy,
        currency: order.currency_code
      },
      request.ip,
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      payment_url: paymentUrl,
      provider: selectedProvider,
      channel,
      order_reference: order.reference
    })
  } catch (error) {
    console.error('Error initiating checkout:', error)
    return NextResponse.json(
      { error: 'Failed to initiate checkout' },
      { status: 500 }
    )
  }
}

async function generatePaymentUrl(
  provider: PaymentProvider,
  credentials: any,
  order: any,
  channel: PaymentChannel,
  sourceToken?: string,
  returnUrl?: string,
  cancelUrl?: string
): Promise<string> {
  switch (provider) {
    case 'WAVE':
      return generateWavePaymentUrl(credentials, order, returnUrl, cancelUrl)
    
    case 'PAYSTACK':
      return generatePaystackPaymentUrl(credentials, order, returnUrl, cancelUrl)
    
    case 'STRIPE':
      return generateStripePaymentUrl(credentials, order, sourceToken, returnUrl, cancelUrl)
    
    case 'ORANGE_MONEY':
      return generateOrangeMoneyPaymentUrl(credentials, order, returnUrl, cancelUrl)
    
    case 'MTN_MONEY':
      return generateMTNMoneyPaymentUrl(credentials, order, returnUrl, cancelUrl)
    
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

async function generateWavePaymentUrl(
  credentials: any,
  order: any,
  returnUrl?: string,
  cancelUrl?: string
): Promise<string> {
  // Mock Wave payment URL generation
  const params = new URLSearchParams({
    amount: order.amount_ccy.toString(),
    currency: order.currency_code,
    reference: order.reference,
    description: `Payment for order ${order.reference}`,
    return_url: returnUrl || `${process.env.NEXTAUTH_URL}/payments/success`,
    cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/payments/cancel`
  })

  return `https://api.wave.com/v1/checkout?${params.toString()}`
}

async function generatePaystackPaymentUrl(
  credentials: any,
  order: any,
  returnUrl?: string,
  cancelUrl?: string
): Promise<string> {
  // Mock Paystack payment URL generation
  const params = new URLSearchParams({
    amount: (order.amount_ccy * 100).toString(), // Paystack uses kobo
    currency: order.currency_code,
    reference: order.reference,
    callback_url: returnUrl || `${process.env.NEXTAUTH_URL}/payments/success`,
    cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/payments/cancel`
  })

  return `https://checkout.paystack.com?${params.toString()}`
}

async function generateStripePaymentUrl(
  credentials: any,
  order: any,
  sourceToken?: string,
  returnUrl?: string,
  cancelUrl?: string
): Promise<string> {
  // Mock Stripe payment URL generation
  const params = new URLSearchParams({
    amount: (order.amount_ccy * 100).toString(), // Stripe uses cents
    currency: order.currency_code.toLowerCase(),
    payment_method_types: 'card',
    success_url: returnUrl || `${process.env.NEXTAUTH_URL}/payments/success`,
    cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/payments/cancel`,
    metadata: JSON.stringify({ order_reference: order.reference })
  })

  return `https://checkout.stripe.com/pay?${params.toString()}`
}

async function generateOrangeMoneyPaymentUrl(
  credentials: any,
  order: any,
  returnUrl?: string,
  cancelUrl?: string
): Promise<string> {
  // Mock Orange Money payment URL generation
  const params = new URLSearchParams({
    amount: order.amount_ccy.toString(),
    currency: order.currency_code,
    reference: order.reference,
    return_url: returnUrl || `${process.env.NEXTAUTH_URL}/payments/success`,
    cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/payments/cancel`
  })

  return `https://api.orange.com/orange-money/checkout?${params.toString()}`
}

async function generateMTNMoneyPaymentUrl(
  credentials: any,
  order: any,
  returnUrl?: string,
  cancelUrl?: string
): Promise<string> {
  // Mock MTN Money payment URL generation
  const params = new URLSearchParams({
    amount: order.amount_ccy.toString(),
    currency: order.currency_code,
    reference: order.reference,
    return_url: returnUrl || `${process.env.NEXTAUTH_URL}/payments/success`,
    cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/payments/cancel`
  })

  return `https://api.mtn.com/collection/checkout?${params.toString()}`
}
