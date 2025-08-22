import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { Package, ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Package>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const shippingMode = searchParams.get('shippingMode')
    const search = searchParams.get('search')
    const companyId = searchParams.get('companyId')

    let filteredPackages = [...mockData.packages]

    // Filtres
    if (companyId) {
      filteredPackages = filteredPackages.filter(pkg => pkg.companyId === companyId)
    }

    if (status && status !== 'ALL') {
      filteredPackages = filteredPackages.filter(pkg => pkg.status === status)
    }

    if (shippingMode && shippingMode !== 'ALL') {
      filteredPackages = filteredPackages.filter(pkg => pkg.shippingMode === shippingMode)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPackages = filteredPackages.filter(pkg => 
        pkg.trackingNumber.toLowerCase().includes(searchLower) ||
        pkg.senderName.toLowerCase().includes(searchLower) ||
        pkg.recipientName.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = filteredPackages.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPackages = filteredPackages.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedPackages,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({
      success: false,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Package>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.senderName || !body.recipientName || !body.weight || !body.shippingMode) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Génération d'un nouveau colis
    const newPackage: Package = {
      id: `package_${Date.now()}`,
      trackingNumber: `NMC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      senderName: body.senderName,
      senderPhone: body.senderPhone || '',
      senderAddress: body.senderAddress || '',
      recipientName: body.recipientName,
      recipientPhone: body.recipientPhone || '',
      recipientAddress: body.recipientAddress || '',
      weight: parseFloat(body.weight),
      dimensions: body.dimensions || undefined,
      shippingMode: body.shippingMode,
      status: 'PENDING',
      price: body.price || 0,
      currency: 'FCFA',
      companyId: body.companyId || 'company_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockData.packages.push(newPackage)

    return NextResponse.json({
      success: true,
      data: newPackage,
      message: 'Colis créé avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du colis'
    }, { status: 500 })
  }
}
