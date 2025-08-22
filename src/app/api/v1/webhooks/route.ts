import { NextRequest, NextResponse } from 'next/server'

interface Webhook {
  id: string
  url: string
  events: string[]
  secret: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  lastTriggered?: string
  failureCount: number
}

const mockWebhooks: Webhook[] = [
  {
    id: 'wh_001',
    url: 'https://example.com/webhooks/packages',
    events: ['package.created', 'package.updated', 'package.delivered'],
    secret: 'whsec_test123',
    status: 'ACTIVE',
    createdAt: '2024-01-01T10:00:00Z',
    lastTriggered: '2024-01-20T14:30:00Z',
    failureCount: 0
  }
]

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
      data: mockWebhooks
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json({ error: apiValidation.error }, { status: 401 })
    }

    const body = await request.json()
    const requiredFields = ['url', 'events']
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Champ requis manquant: ${field}` }, { status: 400 })
      }
    }

    const newWebhook: Webhook = {
      id: `wh_${Date.now()}`,
      url: body.url,
      events: body.events,
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      failureCount: 0
    }

    mockWebhooks.push(newWebhook)

    return NextResponse.json({
      success: true,
      data: newWebhook,
      message: 'Webhook créé avec succès'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
