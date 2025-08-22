import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { Cargo, ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Cargo> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const companyId = searchParams.get('companyId')
    const search = searchParams.get('search')

    let filteredCargos = [...mockData.cargos]

    // Filtres
    if (companyId) {
      filteredCargos = filteredCargos.filter(cargo => cargo.companyId === companyId)
    }

    if (type && type !== 'ALL') {
      filteredCargos = filteredCargos.filter(cargo => cargo.type === type)
    }

    if (status && status !== 'ALL') {
      filteredCargos = filteredCargos.filter(cargo => cargo.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCargos = filteredCargos.filter(cargo => 
        cargo.name.toLowerCase().includes(searchLower) ||
        cargo.origin.toLowerCase().includes(searchLower) ||
        cargo.destination.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = filteredCargos.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCargos = filteredCargos.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedCargos,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching cargos:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des cargos'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Cargo>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.name || !body.type || !body.origin || !body.destination) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Génération d'un nouveau cargo
    const newCargo: Cargo = {
      id: `cargo_${Date.now()}`,
      name: body.name,
      type: body.type,
      origin: body.origin,
      destination: body.destination,
      departureDate: new Date(body.departureDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
      arrivalDate: new Date(body.arrivalDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
      capacity: {
        weight: parseFloat(body.capacity?.weight) || (body.type === 'AERIEN' ? 20000 : 500000),
        volume: parseFloat(body.capacity?.volume) || (body.type === 'AERIEN' ? 100 : 2000)
      },
      currentLoad: {
        weight: 0,
        volume: 0
      },
      status: body.status || 'LOADING',
      packages: [],
      companyId: body.companyId || 'company_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockData.cargos.push(newCargo)

    return NextResponse.json({
      success: true,
      data: newCargo,
      message: 'Cargo créé avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating cargo:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du cargo'
    }, { status: 500 })
  }
}
