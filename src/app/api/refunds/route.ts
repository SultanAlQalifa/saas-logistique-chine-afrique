import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock data for refund requests
const mockRefundRequests = [
  {
    id: '1',
    requestNumber: 'REF-2024-001',
    clientName: 'Aminata Diallo',
    clientEmail: 'aminata.diallo@email.com',
    packageId: 'PKG-001',
    packageTrackingNumber: 'NMC240001',
    originalAmount: 75000,
    refundAmount: 75000,
    reason: 'Colis endommagé à la livraison',
    category: 'damaged',
    status: 'pending',
    priority: 'high',
    requestDate: '2024-01-15',
    assignedTo: 'Fatou Sall',
    notes: 'Photos des dommages fournies par le client',
    attachments: ['damage_photo_1.jpg', 'damage_photo_2.jpg'],
    refundMethod: 'original_payment'
  },
  {
    id: '2',
    requestNumber: 'REF-2024-002',
    clientName: 'Moussa Keita',
    clientEmail: 'moussa.keita@email.com',
    packageId: 'PKG-002',
    packageTrackingNumber: 'NMC240002',
    originalAmount: 120000,
    refundAmount: 60000,
    reason: 'Livraison en retard de plus de 10 jours',
    category: 'delay',
    status: 'approved',
    priority: 'medium',
    requestDate: '2024-01-14',
    processedDate: '2024-01-16',
    assignedTo: 'Ibrahim Sow',
    notes: 'Remboursement partiel selon politique de retard',
    attachments: [],
    refundMethod: 'mobile_money'
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Check if user has permission to view refunds
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    let filteredRequests = [...mockRefundRequests]

    // Apply filters
    if (status && status !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.status === status)
    }

    if (category && category !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.category === category)
    }

    if (priority && priority !== 'all') {
      filteredRequests = filteredRequests.filter(req => req.priority === priority)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredRequests = filteredRequests.filter(req =>
        req.requestNumber.toLowerCase().includes(searchLower) ||
        req.clientName.toLowerCase().includes(searchLower) ||
        req.packageTrackingNumber.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredRequests,
      total: filteredRequests.length
    })
  } catch (error) {
    console.error('Error fetching refund requests:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Check if user has permission to create refunds
    if (!['SUPER_ADMIN', 'ADMIN', 'CLIENT'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const {
      packageId,
      packageTrackingNumber,
      originalAmount,
      refundAmount,
      reason,
      category,
      priority,
      refundMethod,
      attachments
    } = body

    // Validate required fields
    if (!packageId || !reason || !category || !refundAmount) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Generate new refund request
    const newRefundRequest = {
      id: Date.now().toString(),
      requestNumber: `REF-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      clientName: session.user.name || 'Client',
      clientEmail: session.user.email || '',
      packageId,
      packageTrackingNumber: packageTrackingNumber || `NMC${Date.now()}`,
      originalAmount: Number(originalAmount),
      refundAmount: Number(refundAmount),
      reason,
      category,
      status: 'pending',
      priority: priority || 'medium',
      requestDate: new Date().toISOString().split('T')[0],
      processedDate: undefined,
      completedDate: undefined,
      assignedTo: '',
      notes: '',
      attachments: attachments || [],
      refundMethod: refundMethod || 'original_payment'
    }

    // In a real app, save to database
    mockRefundRequests.push(newRefundRequest)

    return NextResponse.json({
      success: true,
      message: 'Demande de remboursement créée avec succès',
      data: newRefundRequest
    })
  } catch (error) {
    console.error('Error creating refund request:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
