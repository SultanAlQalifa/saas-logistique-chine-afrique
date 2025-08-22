import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Types pour l'API
interface Package {
  id: string
  trackingNumber: string
  senderName: string
  senderEmail: string
  senderPhone: string
  recipientName: string
  recipientEmail: string
  recipientPhone: string
  recipientAddress: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  value: number
  currency: string
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  origin: string
  destination: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  actualDelivery?: string
}

// Mock data pour démonstration
const mockPackages: Package[] = [
  {
    id: 'pkg_001',
    trackingNumber: 'TRK-2024-001',
    senderName: 'Société ABC',
    senderEmail: 'jean@example.com',
    senderPhone: '+33123456789',
    recipientName: 'Client XYZ',
    recipientEmail: 'marie@example.com',
    recipientPhone: '+225123456789',
    recipientAddress: '123 Rue de la Paix, Abidjan, Côte d\'Ivoire',
    weight: 2.5,
    dimensions: { length: 30, width: 20, height: 15 },
    value: 150000,
    currency: 'FCFA',
    status: 'IN_TRANSIT',
    origin: 'Guangzhou, Chine',
    destination: 'Abidjan, Côte d\'Ivoire',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    estimatedDelivery: '2024-01-25T00:00:00Z'
  },
  {
    id: 'pkg_002',
    trackingNumber: 'TRK-2024-002',
    senderName: 'Ahmed Kone',
    senderEmail: 'ahmed@example.com',
    senderPhone: '+225987654321',
    recipientName: 'Fatou Diallo',
    recipientEmail: 'fatou@example.com',
    recipientPhone: '+221123456789',
    recipientAddress: '456 Avenue Bourguiba, Dakar, Sénégal',
    weight: 5.0,
    dimensions: { length: 40, width: 30, height: 25 },
    value: 300000,
    currency: 'FCFA',
    status: 'DELIVERED',
    origin: 'Shenzhen, Chine',
    destination: 'Dakar, Sénégal',
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    estimatedDelivery: '2024-01-20T00:00:00Z',
    actualDelivery: '2024-01-20T16:45:00Z'
  }
]

// Fonction pour valider la clé API
async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key')
  
  if (!apiKey) {
    return { valid: false, error: 'API Key manquante' }
  }

  // Pour la démo, on accepte une clé API simple
  // En production, vérifier en base de données
  if (apiKey !== 'sk_live_nextmove_cargo_2024') {
    return { valid: false, error: 'API Key invalide' }
  }

  return { valid: true }
}

// GET /api/v1/packages - Récupérer tous les colis
export async function GET(request: NextRequest) {
  try {
    // Validation de la clé API
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredPackages = mockPackages

    // Filtrer par statut si spécifié
    if (status) {
      filteredPackages = mockPackages.filter(pkg => pkg.status === status)
    }

    // Pagination
    const paginatedPackages = filteredPackages.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedPackages,
      pagination: {
        total: filteredPackages.length,
        limit,
        offset,
        hasMore: offset + limit < filteredPackages.length
      }
    })

  } catch (error) {
    console.error('Erreur API packages GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST /api/v1/packages - Créer un nouveau colis
export async function POST(request: NextRequest) {
  try {
    // Validation de la clé API
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validation des champs requis
    const requiredFields = [
      'senderName', 'senderEmail', 'senderPhone',
      'recipientName', 'recipientEmail', 'recipientPhone', 'recipientAddress',
      'weight', 'dimensions', 'value', 'currency', 'origin', 'destination'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Champ requis manquant: ${field}` },
          { status: 400 }
        )
      }
    }

    // Créer le nouveau colis
    const newPackage: Package = {
      id: `pkg_${Date.now()}`,
      trackingNumber: `TRK-${new Date().getFullYear()}-${String(mockPackages.length + 1).padStart(3, '0')}`,
      senderName: body.senderName,
      senderEmail: body.senderEmail,
      senderPhone: body.senderPhone,
      recipientName: body.recipientName,
      recipientEmail: body.recipientEmail,
      recipientPhone: body.recipientPhone,
      recipientAddress: body.recipientAddress,
      weight: parseFloat(body.weight),
      dimensions: {
        length: parseFloat(body.dimensions.length),
        width: parseFloat(body.dimensions.width),
        height: parseFloat(body.dimensions.height)
      },
      value: parseFloat(body.value),
      currency: body.currency,
      status: 'PENDING',
      origin: body.origin,
      destination: body.destination,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: body.estimatedDelivery
    }

    // En production, sauvegarder en base de données
    mockPackages.push(newPackage)

    return NextResponse.json({
      success: true,
      data: newPackage,
      message: 'Colis créé avec succès'
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur API packages POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
