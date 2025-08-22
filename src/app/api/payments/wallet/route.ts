import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { WalletService, PaymentModeService } from '@/lib/payments'
import { getCurrencyRate } from '@/lib/currency'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mode = await PaymentModeService.getTenantMode(session.user.companyId)
    
    if (mode === 'API_PROPRE') {
      return NextResponse.json({
        message: 'Wallet not available in API_PROPRE mode - payments go directly to your accounts'
      })
    }

    const wallet = await WalletService.getOrCreateWallet('TENANT', session.user.companyId)
    
    // Get display currency from query params or default to XOF
    const url = new URL(request.url)
    const displayCurrency = url.searchParams.get('currency') || 'XOF'
    
    let balanceDisplay = wallet.balance_xof
    let lockedDisplay = wallet.locked_xof
    let fxRate = 1

    if (displayCurrency !== 'XOF') {
      fxRate = await getCurrencyRate('XOF', displayCurrency)
      balanceDisplay = wallet.balance_xof * fxRate
      lockedDisplay = wallet.locked_xof * fxRate
    }

    return NextResponse.json({
      balance_xof: wallet.balance_xof,
      locked_xof: wallet.locked_xof,
      available_xof: wallet.balance_xof - wallet.locked_xof,
      balance_display: balanceDisplay,
      locked_display: lockedDisplay,
      available_display: (wallet.balance_xof - wallet.locked_xof) * fxRate,
      currency_display: displayCurrency,
      fx_rate: fxRate,
      updated_at: wallet.updated_at
    })
  } catch (error) {
    console.error('Error getting wallet:', error)
    return NextResponse.json(
      { error: 'Failed to get wallet information' },
      { status: 500 }
    )
  }
}
