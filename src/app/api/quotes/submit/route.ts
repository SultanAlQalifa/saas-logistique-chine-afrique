import { NextRequest, NextResponse } from 'next/server'
import { MultiTenantPricingMockData } from '@/lib/multi-tenant-pricing'

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('X-Tenant-ID') || 'default-tenant'
    const body = await request.json()

    const {
      quote_data,
      customer_info,
      delivery_options = {},
      notes = '',
      send_whatsapp = false,
      send_email = true
    } = body

    // Validation des données client
    if (!customer_info?.name || !customer_info?.email) {
      return NextResponse.json(
        { success: false, error: 'Informations client requises (nom, email)' },
        { status: 400 }
      )
    }

    // Générer un ID de devis unique
    const quoteId = `QUOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    // Simuler la sauvegarde du devis
    const savedQuote = {
      id: quoteId,
      tenant_id: tenantId,
      status: 'pending',
      customer_info,
      quote_data,
      delivery_options,
      notes,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      pdf_url: `/api/quotes/${quoteId}/pdf`,
      tracking_url: `/quotes/${quoteId}/track`
    }

    // Simuler l'envoi des notifications
    const notifications = []
    
    if (send_email) {
      notifications.push({
        type: 'email',
        to: customer_info.email,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
    }

    if (send_whatsapp && customer_info.phone) {
      notifications.push({
        type: 'whatsapp',
        to: customer_info.phone,
        status: 'sent',
        sent_at: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        quote: savedQuote,
        notifications,
        actions: {
          download_pdf: `/api/quotes/${quoteId}/pdf`,
          track_quote: `/quotes/${quoteId}/track`,
          chat_support: `/support?quote=${quoteId}`,
          whatsapp_support: customer_info.phone ? `https://wa.me/221771234567?text=Bonjour, j'ai une question sur mon devis ${quoteId}` : null
        }
      }
    })

  } catch (error) {
    console.error('Erreur soumission devis:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la soumission' },
      { status: 500 }
    )
  }
}
