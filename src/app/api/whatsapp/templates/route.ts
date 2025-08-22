import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { WhatsAppBusinessService } from '@/lib/whatsapp-business'

// GET /api/whatsapp/templates - Récupérer les templates disponibles
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Seuls les admins peuvent voir les templates
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    const templates = await WhatsAppBusinessService.getMessageTemplates()

    return NextResponse.json({
      success: true,
      data: templates
    })

  } catch (error) {
    console.error('Error fetching WhatsApp templates:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des templates' },
      { status: 500 }
    )
  }
}
