import { NextRequest, NextResponse } from 'next/server'

interface DashboardStats {
  packages: {
    total: number
    pending: number
    inTransit: number
    delivered: number
    cancelled: number
  }
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  clients: {
    total: number
    active: number
    new: number
  }
  companies: {
    total: number
    active: number
    pending: number
  }
}

const mockStats: DashboardStats = {
  packages: {
    total: 5672,
    pending: 234,
    inTransit: 1456,
    delivered: 3892,
    cancelled: 90
  },
  revenue: {
    total: 45600000,
    thisMonth: 3200000,
    lastMonth: 2800000,
    growth: 14.3
  },
  clients: {
    total: 856,
    active: 734,
    new: 45
  },
  companies: {
    total: 445,
    active: 398,
    pending: 23
  }
}

async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key')
  if (!apiKey || apiKey !== 'sk_live_nextmove_cargo_2024') {
    return { valid: false, error: 'API Key invalide' }
  }
  return { valid: true }
}

export async function GET(request: NextRequest) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json({ error: apiValidation.error }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: mockStats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
