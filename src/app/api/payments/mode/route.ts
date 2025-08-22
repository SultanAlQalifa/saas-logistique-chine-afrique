import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PaymentModeService, AuditService } from '@/lib/payments'
import { PaymentMode } from '@/types/payments'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mode = await PaymentModeService.getTenantMode(session.user.companyId)
    
    return NextResponse.json({ mode })
  } catch (error) {
    console.error('Error getting payment mode:', error)
    return NextResponse.json(
      { error: 'Failed to get payment mode' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mode }: { mode: PaymentMode } = await request.json()

    if (!mode || !['API_PROPRE', 'DELEGUE'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid payment mode' },
        { status: 400 }
      )
    }

    await PaymentModeService.setTenantMode(session.user.companyId, mode)

    // Audit log
    await AuditService.log(
      'TENANT',
      session.user.id,
      'UPDATE_PAYMENT_MODE',
      'tenant_payment_mode',
      session.user.companyId,
      { mode },
      request.ip,
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({ success: true, mode })
  } catch (error) {
    console.error('Error setting payment mode:', error)
    
    if (error instanceof Error && error.message.includes('Platform cannot change')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to set payment mode' },
      { status: 500 }
    )
  }
}
