import { NextRequest, NextResponse } from 'next/server'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  country: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt: string
  totalPackages: number
  totalSpent: number
}

// Mock clients data
const mockClients: Client[] = [
  {
    id: 'client_001',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33123456789',
    company: 'Import Export SARL',
    address: '123 Rue de la République, Paris, France',
    country: 'France',
    status: 'ACTIVE',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    totalPackages: 15,
    totalSpent: 2500000
  },
  {
    id: 'client_002',
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    phone: '+225123456789',
    address: '456 Boulevard Lagunaire, Abidjan, Côte d\'Ivoire',
    country: 'Côte d\'Ivoire',
    status: 'ACTIVE',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    totalPackages: 8,
    totalSpent: 1200000
  }
]

async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key')
  if (!apiKey || apiKey !== 'sk_live_nextmove_cargo_2024') {
    return { valid: false, error: 'API Key invalide' }
  }
  return { valid: true }
}

// GET /api/v1/clients - Récupérer tous les clients
export async function GET(request: NextRequest) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const country = searchParams.get('country')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredClients = mockClients

    if (status) {
      filteredClients = filteredClients.filter(client => client.status === status)
    }

    if (country) {
      filteredClients = filteredClients.filter(client => 
        client.country.toLowerCase().includes(country.toLowerCase())
      )
    }

    const paginatedClients = filteredClients.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedClients,
      pagination: {
        total: filteredClients.length,
        limit,
        offset,
        hasMore: offset + limit < filteredClients.length
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST /api/v1/clients - Créer un nouveau client
export async function POST(request: NextRequest) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json(
        { error: apiValidation.error },
        { status: 401 }
      )
    }

    const body = await request.json()

    const requiredFields = ['name', 'email', 'phone', 'address', 'country']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Champ requis manquant: ${field}` },
          { status: 400 }
        )
      }
    }

    const newClient: Client = {
      id: `client_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      address: body.address,
      country: body.country,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalPackages: 0,
      totalSpent: 0
    }

    mockClients.push(newClient)

    return NextResponse.json({
      success: true,
      data: newClient,
      message: 'Client créé avec succès'
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
