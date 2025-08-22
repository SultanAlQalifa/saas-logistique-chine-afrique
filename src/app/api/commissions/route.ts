import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { Commission, ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Commission> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const agentId = searchParams.get('agentId')
    const companyId = searchParams.get('companyId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let filteredCommissions = [...mockData.commissions]

    // Filtres
    if (companyId) {
      filteredCommissions = filteredCommissions.filter(commission => commission.companyId === companyId)
    }

    if (status && status !== 'ALL') {
      filteredCommissions = filteredCommissions.filter(commission => commission.status === status)
    }

    if (agentId) {
      filteredCommissions = filteredCommissions.filter(commission => commission.agentId === agentId)
    }

    if (startDate) {
      const start = new Date(startDate)
      filteredCommissions = filteredCommissions.filter(commission => 
        new Date(commission.createdAt) >= start
      )
    }

    if (endDate) {
      const end = new Date(endDate)
      filteredCommissions = filteredCommissions.filter(commission => 
        new Date(commission.createdAt) <= end
      )
    }

    // Pagination
    const total = filteredCommissions.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCommissions = filteredCommissions.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedCommissions,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching commissions:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des commissions'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Commission>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.packageId || !body.agentId || !body.amount || !body.rate) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Génération d'une nouvelle commission
    const newCommission: Commission = {
      id: `commission_${Date.now()}`,
      packageId: body.packageId,
      agentId: body.agentId,
      amount: parseFloat(body.amount),
      currency: body.currency || 'FCFA',
      rate: parseFloat(body.rate),
      status: body.status || 'PENDING',
      companyId: body.companyId || 'company_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockData.commissions.push(newCommission)

    return NextResponse.json({
      success: true,
      data: newCommission,
      message: 'Commission créée avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating commission:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de la commission'
    }, { status: 500 })
  }
}
