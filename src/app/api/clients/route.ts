import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { Client, ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Client> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const companyId = searchParams.get('companyId')

    let filteredClients = [...mockData.clients]

    // Filtres
    if (companyId) {
      filteredClients = filteredClients.filter(client => client.companyId === companyId)
    }

    if (type && type !== 'ALL') {
      filteredClients = filteredClients.filter(client => client.type === type)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredClients = filteredClients.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone.includes(search)
      )
    }

    // Pagination
    const total = filteredClients.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClients = filteredClients.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedClients,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des clients'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Client>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Vérifier si le client existe déjà
    const existingClient = mockData.clients.find(client => 
      client.email === body.email && client.companyId === (body.companyId || 'company_1')
    )

    if (existingClient) {
      return NextResponse.json({
        success: false,
        error: 'Un client avec cet email existe déjà'
      }, { status: 400 })
    }

    // Génération d'un nouveau client
    const newClient: Client = {
      id: `client_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address || '',
      city: body.city || '',
      country: body.country || 'Sénégal',
      type: body.type || 'INDIVIDUAL',
      companyId: body.companyId || 'company_1',
      totalPackages: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockData.clients.push(newClient)

    return NextResponse.json({
      success: true,
      data: newClient,
      message: 'Client créé avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du client'
    }, { status: 500 })
  }
}
