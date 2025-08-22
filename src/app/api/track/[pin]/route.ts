import { NextRequest, NextResponse } from 'next/server'

// Mock data for tracking - matches the tracking page data
const mockTrackingData: Record<string, any> = {
  'A1B2C3': {
    packageId: 'CO-001',
    trackingPin: 'A1B2C3',
    description: 'Electronics and accessories',
    weight: 25.5,
    transportMode: 'MARITIME',
    status: 'IN_TRANSIT',
    estimatedArrival: '2025-03-15T00:00:00Z',
    actualArrival: null,
    collectedAt: null,
    client: {
      name: 'Jean Dupont',
      clientId: 'CL-001'
    },
    cargo: {
      cargoId: 'CG2501001',
      carrier: 'China Shipping Lines',
      originPort: 'Shanghai Port',
      destinationPort: 'Port of Le Havre',
      departureDate: '2025-01-15T00:00:00Z',
      arrivalDate: '2025-03-15T00:00:00Z',
      status: 'IN_TRANSIT'
    },
    company: {
      name: 'Demo Logistics Company',
      email: 'contact@demologistics.com',
      phone: '+33 1 23 45 67 89'
    },
    createdAt: '2025-01-10T09:00:00Z'
  },
  'D4E5F6': {
    packageId: 'CO-002',
    trackingPin: 'D4E5F6',
    description: 'Textile products',
    weight: 5.2,
    transportMode: 'AERIAL_EXPRESS',
    status: 'PLANNED',
    estimatedArrival: '2025-01-20T00:00:00Z',
    actualArrival: null,
    collectedAt: null,
    client: {
      name: 'Marie Martin',
      clientId: 'CL-002'
    },
    cargo: null,
    company: {
      name: 'Demo Logistics Company',
      email: 'contact@demologistics.com',
      phone: '+33 1 23 45 67 89'
    },
    createdAt: '2025-01-12T10:00:00Z'
  },
  'G7H8I9': {
    packageId: 'CO-003',
    trackingPin: 'G7H8I9',
    description: 'Machinery parts',
    weight: 45.0,
    transportMode: 'MARITIME_EXPRESS',
    status: 'ARRIVED',
    estimatedArrival: '2025-01-10T00:00:00Z',
    actualArrival: '2025-01-10T00:00:00Z',
    collectedAt: null,
    client: {
      name: 'Jean Dupont',
      clientId: 'CL-001'
    },
    cargo: null,
    company: {
      name: 'Demo Logistics Company',
      email: 'contact@demologistics.com',
      phone: '+33 1 23 45 67 89'
    },
    createdAt: '2025-01-08T14:00:00Z'
  },
  'A3X9K2': {
    packageId: 'CO-001234',
    trackingPin: 'A3X9K2',
    description: 'Électroniques - Smartphones',
    weight: 2.5,
    transportMode: 'AERIAL',
    status: 'IN_TRANSIT',
    estimatedArrival: '2024-01-20T00:00:00Z',
    actualArrival: null,
    collectedAt: '2024-01-16T14:30:00Z',
    client: {
      name: 'Client A - Électroniques',
      clientId: 'CLI-001'
    },
    cargo: {
      cargoId: 'CAR-001',
      carrier: 'Air France Cargo',
      originPort: 'Guangzhou',
      destinationPort: 'Abidjan',
      departureDate: '2024-01-17T08:15:00Z',
      arrivalDate: '2024-01-20T00:00:00Z',
      status: 'IN_TRANSIT'
    },
    company: {
      name: 'Logistique Chine-Afrique',
      email: 'contact@logistique-ca.com',
      phone: '+225 01 02 03 04'
    },
    createdAt: '2024-01-15T09:00:00Z',
    timeline: [
      {
        date: '2024-01-15 09:00',
        status: 'Colis créé',
        location: 'Guangzhou, Chine',
        description: 'Colis enregistré dans le système',
        completed: true
      },
      {
        date: '2024-01-16 14:30',
        status: 'Collecté',
        location: 'Guangzhou, Chine',
        description: 'Colis collecté par le transporteur',
        completed: true
      },
      {
        date: '2024-01-17 08:15',
        status: 'En transit',
        location: 'Aéroport de Guangzhou',
        description: 'Colis en route vers la destination',
        completed: true
      },
      {
        date: '2024-01-18 16:45',
        status: 'En cours',
        location: 'Aéroport Charles de Gaulle',
        description: 'Colis en transit international',
        completed: false
      },
      {
        date: 'Estimé: 2024-01-20',
        status: 'Arrivée prévue',
        location: 'Abidjan, Côte d\'Ivoire',
        description: 'Livraison prévue au destinataire',
        completed: false
      }
    ]
  },
  'B7Y4M1': {
    packageId: 'CO-001235',
    trackingPin: 'B7Y4M1',
    description: 'Textiles - Vêtements',
    weight: 15.0,
    transportMode: 'MARITIME',
    status: 'ARRIVED',
    estimatedArrival: '2024-01-18T00:00:00Z',
    actualArrival: '2024-01-18T10:30:00Z',
    collectedAt: '2024-01-10T09:00:00Z',
    client: {
      name: 'Client B - Textiles',
      clientId: 'CLI-002'
    },
    cargo: {
      cargoId: 'CAR-002',
      carrier: 'CMA CGM',
      originPort: 'Shanghai',
      destinationPort: 'Abidjan',
      departureDate: '2024-01-12T00:00:00Z',
      arrivalDate: '2024-01-18T10:30:00Z',
      status: 'ARRIVED'
    },
    company: {
      name: 'Logistique Chine-Afrique',
      email: 'contact@logistique-ca.com',
      phone: '+225 01 02 03 04'
    },
    createdAt: '2024-01-10T09:00:00Z'
  },
  'C5Z8N6': {
    packageId: 'CO-001236',
    trackingPin: 'C5Z8N6',
    description: 'Machines - Équipements industriels',
    weight: 50.0,
    transportMode: 'MARITIME',
    status: 'PLANNED',
    estimatedArrival: '2024-02-15T00:00:00Z',
    actualArrival: null,
    collectedAt: null,
    client: {
      name: 'Client C - Industrie',
      clientId: 'CLI-003'
    },
    cargo: {
      cargoId: 'CAR-003',
      carrier: 'MSC',
      originPort: 'Shenzhen',
      destinationPort: 'Abidjan',
      departureDate: '2024-02-01T00:00:00Z',
      arrivalDate: '2024-02-15T00:00:00Z',
      status: 'PLANNED'
    },
    company: {
      name: 'Logistique Chine-Afrique',
      email: 'contact@logistique-ca.com',
      phone: '+225 01 02 03 04'
    },
    createdAt: '2024-01-20T14:00:00Z'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pin: string } }
) {
  try {
    const { pin } = params

    if (!pin) {
      return NextResponse.json({ error: 'Invalid tracking PIN' }, { status: 400 })
    }

    // Check both original PIN and uppercase version for consistency
    const trackingInfo = mockTrackingData[pin] || mockTrackingData[pin.toUpperCase()]

    if (!trackingInfo) {
      return NextResponse.json({ 
        error: 'Package not found', 
        message: 'PIN de suivi introuvable. Essayez: A1B2C3, D4E5F6, G7H8I9, A3X9K2, B7Y4M1, ou C5Z8N6' 
      }, { status: 404 })
    }

    return NextResponse.json(trackingInfo)
  } catch (error) {
    console.error('Error fetching tracking info:', error)
    return NextResponse.json({ 
      error: 'Unable to fetch tracking information. Please try again.',
      message: 'Erreur lors de la récupération des informations de suivi. Veuillez réessayer.'
    }, { status: 500 })
  }
}
