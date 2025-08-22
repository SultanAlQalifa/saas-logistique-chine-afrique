import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PaymentProviderService, PaymentModeService, AuditService } from '@/lib/payments'
import { PaymentProvider, PaymentProviderCredentials } from '@/types/payments'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mode = await PaymentModeService.getTenantMode(session.user.companyId)
    
    if (mode === 'DELEGUE') {
      return NextResponse.json({ 
        providers: [],
        message: 'Using platform payment tunnel - no provider configuration needed'
      })
    }

    const providers = await PaymentProviderService.getTenantProviders(session.user.companyId)
    
    // Remove sensitive credentials from response
    const sanitizedProviders = providers.map(provider => ({
      id: provider.id,
      provider: provider.provider,
      active: provider.active,
      created_at: provider.created_at,
      updated_at: provider.updated_at
    }))

    return NextResponse.json({ providers: sanitizedProviders })
  } catch (error) {
    console.error('Error getting payment providers:', error)
    return NextResponse.json(
      { error: 'Failed to get payment providers' },
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

    const mode = await PaymentModeService.getTenantMode(session.user.companyId)
    
    if (mode === 'DELEGUE') {
      return NextResponse.json(
        { error: 'Cannot add providers in DELEGUE mode' },
        { status: 400 }
      )
    }

    const { provider, credentials }: { 
      provider: PaymentProvider, 
      credentials: PaymentProviderCredentials 
    } = await request.json()

    if (!provider || !credentials) {
      return NextResponse.json(
        { error: 'Provider and credentials are required' },
        { status: 400 }
      )
    }

    await PaymentProviderService.addTenantProvider(
      session.user.companyId,
      provider,
      credentials
    )

    // Audit log (without sensitive data)
    await AuditService.log(
      'TENANT',
      session.user.id,
      'ADD_PAYMENT_PROVIDER',
      'tenant_payment_provider',
      session.user.companyId,
      { provider },
      request.ip,
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding payment provider:', error)
    
    if (error instanceof Error && error.message.includes('Maximum')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add payment provider' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { providerId, active }: { providerId: string, active: boolean } = await request.json()

    if (!providerId || typeof active !== 'boolean') {
      return NextResponse.json(
        { error: 'Provider ID and active status are required' },
        { status: 400 }
      )
    }

    await PaymentProviderService.toggleProviderStatus(providerId, active)

    // Audit log
    await AuditService.log(
      'TENANT',
      session.user.id,
      'TOGGLE_PAYMENT_PROVIDER',
      'tenant_payment_provider',
      providerId,
      { active },
      request.ip,
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error toggling payment provider:', error)
    return NextResponse.json(
      { error: 'Failed to toggle payment provider' },
      { status: 500 }
    )
  }
}
