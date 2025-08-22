import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { Agent, ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Agent> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const zone = searchParams.get('zone')
    const isActive = searchParams.get('isActive')
    const companyId = searchParams.get('companyId')

    let filteredAgents = [...mockData.agents]

    // Filtres
    if (companyId) {
      filteredAgents = filteredAgents.filter(agent => agent.companyId === companyId)
    }

    if (zone && zone !== 'ALL') {
      filteredAgents = filteredAgents.filter(agent => agent.zone === zone)
    }

    if (isActive !== null && isActive !== undefined) {
      const activeFilter = isActive === 'true'
      filteredAgents = filteredAgents.filter(agent => agent.isActive === activeFilter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredAgents = filteredAgents.filter(agent => 
        agent.name.toLowerCase().includes(searchLower) ||
        agent.email.toLowerCase().includes(searchLower) ||
        agent.phone.includes(search) ||
        agent.zone.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = filteredAgents.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedAgents = filteredAgents.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedAgents,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des agents'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Agent>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Vérifier si l'agent existe déjà
    const existingAgent = mockData.agents.find(agent => 
      agent.email === body.email && agent.companyId === (body.companyId || 'company_1')
    )

    if (existingAgent) {
      return NextResponse.json({
        success: false,
        error: 'Un agent avec cet email existe déjà'
      }, { status: 400 })
    }

    // Génération d'un nouvel agent
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address || '',
      city: body.city || '',
      country: body.country || 'Sénégal',
      commissionRate: parseFloat(body.commissionRate) || 5.0,
      zone: body.zone || 'Dakar Centre',
      specialization: body.specialization || ['Import/Export'],
      isActive: true,
      companyId: body.companyId || 'company_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockData.agents.push(newAgent)

    return NextResponse.json({
      success: true,
      data: newAgent,
      message: 'Agent créé avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de l\'agent'
    }, { status: 500 })
  }
}
