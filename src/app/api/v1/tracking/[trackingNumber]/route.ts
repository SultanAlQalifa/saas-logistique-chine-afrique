import { NextRequest, NextResponse } from 'next/server'

interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  details?: string
}

interface TrackingInfo {
  trackingNumber: string
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  origin: string
  destination: string
  estimatedDelivery?: string
  actualDelivery?: string
  events: TrackingEvent[]
}

// Mock tracking data
const mockTrackingData: { [key: string]: TrackingInfo } = {
  'TRK-2024-001': {
    trackingNumber: 'TRK-2024-001',
    status: 'IN_TRANSIT',
    origin: 'Guangzhou, Chine',
    destination: 'Abidjan, Côte d\'Ivoire',
    estimatedDelivery: '2024-01-25T00:00:00Z',
    events: [
      {
        id: 'evt_001',
        timestamp: '2024-01-15T10:30:00Z',
        location: 'Guangzhou, Chine',
        status: 'PICKED_UP',
        description: 'Colis récupéré chez l\'expéditeur',
        details: 'Collecte effectuée par notre équipe locale'
      },
      {
        id: 'evt_002',
        timestamp: '2024-01-16T08:15:00Z',
        location: 'Port de Guangzhou, Chine',
        status: 'IN_TRANSIT',
        description: 'Colis arrivé au port de départ',
        details: 'En attente d\'embarquement sur le navire'
      },
      {
        id: 'evt_003',
        timestamp: '2024-01-17T14:20:00Z',
        location: 'En mer - Route vers l\'Afrique',
        status: 'IN_TRANSIT',
        description: 'Colis embarqué sur le navire cargo',
        details: 'Navire: MV AFRICA EXPRESS - ETA Abidjan: 25/01/2024'
      }
    ]
  },
  'TRK-2024-002': {
    trackingNumber: 'TRK-2024-002',
    status: 'DELIVERED',
    origin: 'Shenzhen, Chine',
    destination: 'Dakar, Sénégal',
    estimatedDelivery: '2024-01-20T00:00:00Z',
    actualDelivery: '2024-01-20T16:45:00Z',
    events: [
      {
        id: 'evt_004',
        timestamp: '2024-01-10T08:15:00Z',
        location: 'Shenzhen, Chine',
        status: 'PICKED_UP',
        description: 'Colis récupéré chez l\'expéditeur'
      },
      {
        id: 'evt_005',
        timestamp: '2024-01-18T12:30:00Z',
        location: 'Port de Dakar, Sénégal',
        status: 'ARRIVED',
        description: 'Colis arrivé au port de destination'
      },
      {
        id: 'evt_006',
        timestamp: '2024-01-20T16:45:00Z',
        location: 'Dakar, Sénégal',
        status: 'DELIVERED',
        description: 'Colis livré au destinataire',
        details: 'Signé par: Fatou Diallo'
      }
    ]
  }
}

async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key')
  
  if (!apiKey || apiKey !== 'sk_live_nextmove_cargo_2024') {
    return { valid: false, error: 'API Key invalide' }
  }
  return { valid: true }
}

// GET /api/v1/tracking/[trackingNumber] - Suivre un colis
export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const trackingNumber = params.trackingNumber
    const trackingInfo = mockTrackingData[trackingNumber]

    if (!trackingInfo) {
      return NextResponse.json(
        { error: 'Numéro de suivi non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: trackingInfo
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
