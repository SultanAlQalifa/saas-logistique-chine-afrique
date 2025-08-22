import { NextRequest, NextResponse } from 'next/server'

interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: string
  country: string
  industry: string
  website?: string
  contactPerson: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  createdAt: string
  updatedAt: string
  totalShipments: number
  monthlyVolume: number
}

const mockCompanies: Company[] = [
  {
    id: 'comp_001',
    name: 'Africa Trade Solutions',
    email: 'contact@africatrade.com',
    phone: '+225123456789',
    address: 'Zone Industrielle, Abidjan, Côte d\'Ivoire',
    country: 'Côte d\'Ivoire',
    industry: 'Import/Export',
    website: 'https://africatrade.com',
    contactPerson: 'Kouassi Yao',
    status: 'ACTIVE',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    totalShipments: 45,
    monthlyVolume: 12000
  },
  {
    id: 'comp_002',
    name: 'Sahel Logistics SARL',
    email: 'info@sahellogistics.sn',
    phone: '+221123456789',
    address: 'Plateau, Dakar, Sénégal',
    country: 'Sénégal',
    industry: 'Logistique',
    contactPerson: 'Aminata Fall',
    status: 'ACTIVE',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
    totalShipments: 28,
    monthlyVolume: 8500
  }
]

async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key')
  if (!apiKey || apiKey !== 'sk_live_nextmove_cargo_2024') {
    return { valid: false, error: 'API Key invalide' }
  }
  return { valid: true }
}

export async function GET(request: NextRequest) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json({ error: apiValidation.error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const country = searchParams.get('country')
    const industry = searchParams.get('industry')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredCompanies = mockCompanies

    if (status) filteredCompanies = filteredCompanies.filter(c => c.status === status)
    if (country) filteredCompanies = filteredCompanies.filter(c => c.country.toLowerCase().includes(country.toLowerCase()))
    if (industry) filteredCompanies = filteredCompanies.filter(c => c.industry.toLowerCase().includes(industry.toLowerCase()))

    const paginatedCompanies = filteredCompanies.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedCompanies,
      pagination: {
        total: filteredCompanies.length,
        limit,
        offset,
        hasMore: offset + limit < filteredCompanies.length
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiValidation = await validateApiKey(request)
    if (!apiValidation.valid) {
      return NextResponse.json({ error: apiValidation.error }, { status: 401 })
    }

    const body = await request.json()
    const requiredFields = ['name', 'email', 'phone', 'address', 'country', 'industry', 'contactPerson']
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Champ requis manquant: ${field}` }, { status: 400 })
      }
    }

    const newCompany: Company = {
      id: `comp_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      country: body.country,
      industry: body.industry,
      website: body.website,
      contactPerson: body.contactPerson,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalShipments: 0,
      monthlyVolume: 0
    }

    mockCompanies.push(newCompany)

    return NextResponse.json({
      success: true,
      data: newCompany,
      message: 'Entreprise créée avec succès'
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
