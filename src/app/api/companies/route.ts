import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { Company, ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Company> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const subscriptionPlan = searchParams.get('subscriptionPlan')
    const isActive = searchParams.get('isActive')

    let filteredCompanies = [...mockData.companies]

    // Filtres
    if (subscriptionPlan && subscriptionPlan !== 'ALL') {
      filteredCompanies = filteredCompanies.filter(company => company.subscriptionPlan === subscriptionPlan)
    }

    if (isActive !== null && isActive !== undefined) {
      const activeFilter = isActive === 'true'
      filteredCompanies = filteredCompanies.filter(company => company.isActive === activeFilter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCompanies = filteredCompanies.filter(company => 
        company.name.toLowerCase().includes(searchLower) ||
        company.email.toLowerCase().includes(searchLower) ||
        company.city.toLowerCase().includes(searchLower) ||
        company.country.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = filteredCompanies.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedCompanies,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des entreprises'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Company>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Vérifier si l'entreprise existe déjà
    const existingCompany = mockData.companies.find(company => 
      company.email === body.email
    )

    if (existingCompany) {
      return NextResponse.json({
        success: false,
        error: 'Une entreprise avec cet email existe déjà'
      }, { status: 400 })
    }

    // Génération d'une nouvelle entreprise
    const newCompany: Company = {
      id: `company_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address || '',
      city: body.city || '',
      country: body.country || 'Sénégal',
      website: body.website || undefined,
      logo: body.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${body.name}`,
      subscriptionPlan: body.subscriptionPlan || 'BASIC',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockData.companies.push(newCompany)

    return NextResponse.json({
      success: true,
      data: newCompany,
      message: 'Entreprise créée avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de l\'entreprise'
    }, { status: 500 })
  }
}
