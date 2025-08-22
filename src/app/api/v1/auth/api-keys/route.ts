import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED'
  createdAt: string
  lastUsed?: string
  expiresAt?: string
  usageCount: number
}

const mockApiKeys: ApiKey[] = [
  {
    id: 'ak_001',
    name: 'Production API Key',
    key: 'sk_live_nextmove_cargo_prod_2024',
    permissions: ['packages:read', 'packages:write', 'tracking:read', 'clients:read'],
    status: 'ACTIVE',
    createdAt: '2024-01-01T10:00:00Z',
    lastUsed: '2024-01-20T14:30:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    usageCount: 1247
  },
  {
    id: 'ak_002',
    name: 'Test API Key',
    key: 'sk_live_nextmove_cargo_2024',
    permissions: ['packages:read', 'packages:write', 'tracking:read', 'clients:read', 'companies:read', 'stats:read'],
    status: 'ACTIVE',
    createdAt: '2024-01-15T09:00:00Z',
    lastUsed: '2024-01-20T16:45:00Z',
    usageCount: 456
  }
]

// GET /api/v1/auth/api-keys - Récupérer toutes les clés API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mockApiKeys.map(key => ({
        ...key,
        key: key.key.substring(0, 12) + '...' // Masquer la clé complète
      }))
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST /api/v1/auth/api-keys - Créer une nouvelle clé API
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, permissions, expiresAt } = body

    if (!name || !permissions) {
      return NextResponse.json(
        { error: 'Nom et permissions requis' },
        { status: 400 }
      )
    }

    const newApiKey: ApiKey = {
      id: `ak_${Date.now()}`,
      name,
      key: `sk_${Math.random().toString(36).substring(2, 15)}_nextmove_cargo_${Date.now()}`,
      permissions,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt,
      usageCount: 0
    }

    mockApiKeys.push(newApiKey)

    return NextResponse.json({
      success: true,
      data: newApiKey,
      message: 'Clé API créée avec succès'
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
