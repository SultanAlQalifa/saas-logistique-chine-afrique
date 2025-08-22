import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { SupportTicket, ApiResponse, PaginatedResponse } from '@/types/api'

// Données mock pour les tickets de support
const mockTickets: SupportTicket[] = [
  {
    id: 'ticket_1',
    title: 'Problème de livraison',
    description: 'Mon colis n\'est pas arrivé à la date prévue',
    category: 'DELIVERY',
    priority: 'HIGH',
    status: 'OPEN',
    clientId: 'client_1',
    assignedAgentId: 'agent_1',
    messages: [
      {
        id: 'msg_1',
        ticketId: 'ticket_1',
        senderId: 'client_1',
        senderType: 'CLIENT',
        message: 'Bonjour, mon colis devait arriver hier mais je n\'ai rien reçu.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    companyId: 'company_1',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 'ticket_2',
    title: 'Question sur la facturation',
    description: 'Je ne comprends pas les frais supplémentaires',
    category: 'BILLING',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    clientId: 'client_2',
    assignedAgentId: 'agent_2',
    messages: [
      {
        id: 'msg_2',
        ticketId: 'ticket_2',
        senderId: 'client_2',
        senderType: 'CLIENT',
        message: 'Pourquoi y a-t-il des frais supplémentaires sur ma facture ?',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'msg_3',
        ticketId: 'ticket_2',
        senderId: 'agent_2',
        senderType: 'AGENT',
        message: 'Bonjour, ces frais correspondent aux taxes douanières. Je vais vous envoyer le détail.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    companyId: 'company_1',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
]

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<SupportTicket> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const clientId = searchParams.get('clientId')
    const companyId = searchParams.get('companyId')

    let filteredTickets = [...mockTickets]

    // Filtres
    if (companyId) {
      filteredTickets = filteredTickets.filter(ticket => ticket.companyId === companyId)
    }

    if (clientId) {
      filteredTickets = filteredTickets.filter(ticket => ticket.clientId === clientId)
    }

    if (status && status !== 'ALL') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status)
    }

    if (category && category !== 'ALL') {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category)
    }

    if (priority && priority !== 'ALL') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority)
    }

    // Pagination
    const total = filteredTickets.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedTickets,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des tickets'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SupportTicket>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Génération d'un nouveau ticket
    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority || 'MEDIUM',
      status: 'OPEN',
      clientId: body.clientId || 'client_1',
      assignedAgentId: body.assignedAgentId || undefined,
      messages: [],
      companyId: body.companyId || 'company_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockTickets.push(newTicket)

    return NextResponse.json({
      success: true,
      data: newTicket,
      message: 'Ticket créé avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating support ticket:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création du ticket'
    }, { status: 500 })
  }
}
