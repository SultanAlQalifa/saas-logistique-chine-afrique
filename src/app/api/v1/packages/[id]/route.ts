import { NextRequest, NextResponse } from 'next/server'

// Mock data (en production, récupérer depuis la base de données)
const mockPackages = [
  {
    id: 'pkg_001',
    trackingNumber: 'TRK-2024-001',
    senderName: 'Jean Dupont',
    senderEmail: 'jean@example.com',
    senderPhone: '+33123456789',
    recipientName: 'Marie Martin',
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
  }
]

async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key')
  
  if (!apiKey || apiKey !== 'sk_live_nextmove_cargo_2024') {
    return { valid: false, error: 'API Key invalide' }
  }
  return { valid: true }
}

// GET /api/v1/packages/[id] - Récupérer un colis spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const packageId = params.id
    const packageData = mockPackages.find(pkg => pkg.id === packageId)

    if (!packageData) {
      return NextResponse.json(
        { error: 'Colis non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: packageData
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/v1/packages/[id] - Mettre à jour un colis
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const packageId = params.id
    const body = await request.json()
    
    const packageIndex = mockPackages.findIndex(pkg => pkg.id === packageId)
    if (packageIndex === -1) {
      return NextResponse.json(
        { error: 'Colis non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour le colis
    mockPackages[packageIndex] = {
      ...mockPackages[packageIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: mockPackages[packageIndex],
      message: 'Colis mis à jour avec succès'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/packages/[id] - Supprimer un colis
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const packageId = params.id
    const packageIndex = mockPackages.findIndex(pkg => pkg.id === packageId)
    
    if (packageIndex === -1) {
      return NextResponse.json(
        { error: 'Colis non trouvé' },
        { status: 404 }
      )
    }

    mockPackages.splice(packageIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Colis supprimé avec succès'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
