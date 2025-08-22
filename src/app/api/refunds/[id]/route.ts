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
    processedDate: undefined,
    completedDate: undefined,
    assignedTo: 'Fatou Sall',
    notes: 'Photos des dommages fournies par le client',
    attachments: ['damage_photo_1.jpg', 'damage_photo_2.jpg'],
    refundMethod: 'original_payment'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Check if user has permission to view refunds
    if (!['SUPER_ADMIN', 'ADMIN', 'CLIENT'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const refundRequest = mockRefundRequests.find(req => req.id === params.id)

    if (!refundRequest) {
      return NextResponse.json(
        { error: 'Demande de remboursement non trouvée' },
        { status: 404 }
      )
    }

    // If client role, only allow viewing own requests
    if (session.user.role === 'CLIENT' && refundRequest.clientEmail !== session.user.email) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: refundRequest
    })
  } catch (error) {
    console.error('Error fetching refund request:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Check if user has permission to update refunds
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const { status, notes, refundAmount, assignedTo } = body

    const refundIndex = mockRefundRequests.findIndex(req => req.id === params.id)

    if (refundIndex === -1) {
      return NextResponse.json(
        { error: 'Demande de remboursement non trouvée' },
        { status: 404 }
      )
    }

    // Update refund request
    const updatedRequest = {
      ...mockRefundRequests[refundIndex],
      ...(status && { status }),
      ...(notes && { notes }),
      ...(refundAmount && { refundAmount: Number(refundAmount) }),
      ...(assignedTo && { assignedTo }),
      ...(status === 'approved' && { processedDate: new Date().toISOString().split('T')[0] }),
      ...(status === 'completed' && { 
        completedDate: new Date().toISOString().split('T')[0],
        processedDate: mockRefundRequests[refundIndex].processedDate || new Date().toISOString().split('T')[0]
      }),
      // Assure que processedDate est toujours défini
      processedDate: mockRefundRequests[refundIndex].processedDate || (status === 'completed' ? new Date().toISOString().split('T')[0] : undefined)
    }

    mockRefundRequests[refundIndex] = updatedRequest

    return NextResponse.json({
      success: true,
      message: 'Demande de remboursement mise à jour avec succès',
      data: updatedRequest
    })
  } catch (error) {
    console.error('Error updating refund request:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Only SUPER_ADMIN can delete refund requests
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const refundIndex = mockRefundRequests.findIndex(req => req.id === params.id)

    if (refundIndex === -1) {
      return NextResponse.json(
        { error: 'Demande de remboursement non trouvée' },
        { status: 404 }
      )
    }

    // Remove refund request
    mockRefundRequests.splice(refundIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Demande de remboursement supprimée avec succès'
    })
  } catch (error) {
    console.error('Error deleting refund request:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}
