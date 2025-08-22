import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PayoutService, PaymentModeService, AuditService } from '@/lib/payments'
import { PayoutRequestData, PayoutChannel } from '@/types/payments'
import { getCurrencyRate } from '@/lib/currency'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mode = await PaymentModeService.getTenantMode(session.user.companyId)
    
    if (mode === 'API_PROPRE') {
      return NextResponse.json(
        { error: 'Payouts not available in API_PROPRE mode - funds go directly to your accounts' },
        { status: 400 }
      )
    }

    const { 
      amount_ccy, 
      amount_xof, 
      currency, 
      target_channel, 
      target_details, 
      notes 
    }: PayoutRequestData = await request.json()

    if (!target_channel || !target_details) {
      return NextResponse.json(
        { error: 'Target channel and details are required' },
        { status: 400 }
      )
    }

    // Validate target channel
    const validChannels: PayoutChannel[] = ['ORANGE_MONEY', 'WAVE', 'MTN_MONEY', 'BANK_TRANSFER', 'CASH', 'CHECK']
    if (!validChannels.includes(target_channel)) {
      return NextResponse.json(
        { error: 'Invalid target channel' },
        { status: 400 }
      )
    }

    // Calculate amount in XOF
    let requestAmountXof: number

    if (amount_xof) {
      requestAmountXof = amount_xof
    } else if (amount_ccy && currency) {
      const fxRate = await getCurrencyRate(currency, 'XOF')
      requestAmountXof = amount_ccy * fxRate
    } else {
      return NextResponse.json(
        { error: 'Either amount_xof or (amount_ccy + currency) is required' },
        { status: 400 }
      )
    }

    // Validate minimum amount (e.g., 1000 XOF)
    if (requestAmountXof < 1000) {
      return NextResponse.json(
        { error: 'Minimum payout amount is 1,000 XOF' },
        { status: 400 }
      )
    }

    // Validate target details based on channel
    const validationError = validateTargetDetails(target_channel, target_details)
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      )
    }

    const payoutRequest = await PayoutService.createPayoutRequest(
      session.user.companyId,
      session.user.id,
      requestAmountXof,
      target_channel,
      target_details,
      notes
    )

    // Audit log
    await AuditService.log(
      'TENANT',
      session.user.id,
      'CREATE_PAYOUT_REQUEST',
      'payout_request',
      payoutRequest.id,
      { 
        amount_xof: requestAmountXof,
        target_channel,
        requested_ccy: currency,
        requested_amount: amount_ccy
      },
      request.ip,
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      payout_request: {
        id: payoutRequest.id,
        request_xof: payoutRequest.request_xof,
        target_channel: payoutRequest.target_channel,
        status: payoutRequest.status,
        created_at: payoutRequest.created_at
      }
    })
  } catch (error) {
    console.error('Error creating payout request:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Insufficient funds')) {
        return NextResponse.json(
          { error: 'Insufficient wallet balance for payout' },
          { status: 400 }
        )
      }
      if (error.message.includes('Daily payout limit')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create payout request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const status = url.searchParams.get('status')

    const skip = (page - 1) * limit

    const where: any = { tenant_id: session.user.companyId }
    if (status) {
      where.status = status
    }

    // Mock data pour la démonstration
    const mockPayouts = [
      {
        id: 'payout-001',
        request_xof: 50000,
        target_channel: 'ORANGE_MONEY',
        status: 'PENDING',
        created_at: new Date().toISOString(),
        created_user: {
          name: 'Admin User'
        }
      }
    ]

    const payouts = mockPayouts
    const total = mockPayouts.length

    // Sanitize target details for response
    const sanitizedPayouts = payouts.map(payout => ({
      ...payout,
      target_details: { phone: '+221701234567' } // Mock target details
    }))

    return NextResponse.json({
      payouts: sanitizedPayouts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error getting payout requests:', error)
    return NextResponse.json(
      { error: 'Failed to get payout requests' },
      { status: 500 }
    )
  }
}

function validateTargetDetails(channel: PayoutChannel, details: any): string | null {
  switch (channel) {
    case 'ORANGE_MONEY':
    case 'MTN_MONEY':
    case 'WAVE':
      if (!details.phone_number) {
        return 'Phone number is required for mobile money payouts'
      }
      if (!/^\+?[1-9]\d{1,14}$/.test(details.phone_number)) {
        return 'Invalid phone number format'
      }
      break

    case 'BANK_TRANSFER':
      if (!details.account_number || !details.bank_name || !details.account_name) {
        return 'Account number, bank name, and account name are required for bank transfers'
      }
      break

    case 'CASH':
      if (!details.pickup_location || !details.recipient_name) {
        return 'Pickup location and recipient name are required for cash payouts'
      }
      break

    case 'CHECK':
      if (!details.recipient_name || !details.pickup_location) {
        return 'Recipient name and pickup location are required for check payouts'
      }
      break

    default:
      return 'Invalid payout channel'
  }

  return null
}
