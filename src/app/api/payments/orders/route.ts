import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { OrderService, AuditService } from '@/lib/payments'
import { CreateOrderRequest } from '@/types/payments'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customer_id, items, currency }: CreateOrderRequest = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      )
    }

    if (!currency) {
      return NextResponse.json(
        { error: 'Currency is required' },
        { status: 400 }
      )
    }

    // Validate items
    for (const item of items) {
      if (!item.name || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { error: 'Each item must have name, quantity, and unit_price' },
          { status: 400 }
        )
      }
      if (item.quantity <= 0 || item.unit_price <= 0) {
        return NextResponse.json(
          { error: 'Quantity and unit_price must be positive' },
          { status: 400 }
        )
      }
    }

    const order = await OrderService.createOrder(
      session.user.companyId,
      customer_id || null,
      items,
      currency
    )

    // Audit log
    await AuditService.log(
      'TENANT',
      session.user.id,
      'CREATE_ORDER',
      'order',
      order.id,
      { 
        customer_id, 
        items_count: items.length, 
        total_amount: order.amount_ccy,
        currency 
      },
      request.ip,
      request.headers.get('user-agent') || undefined
    )

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        reference: order.reference,
        amount_ccy: order.amount_ccy,
        amount_xof: order.amount_xof,
        currency_code: order.currency_code,
        fx_rate_used: order.fx_rate_used,
        status: order.status,
        created_at: order.created_at
      }
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const status = url.searchParams.get('status')

    const skip = (page - 1) * limit

    const where: any = { tenant_id: session.user.companyId }
    if (status) {
      where.status = status
    }

    // Mock data pour la démonstration
    const mockOrders = [
      {
        id: 'order-001',
        reference: 'ORD-2024-001',
        amount_ccy: 150000,
        amount_xof: 150000,
        currency_code: 'XOF',
        status: 'PENDING',
        created_at: new Date().toISOString(),
        payments: [],
        refunds: []
      }
    ]

    const orders = mockOrders
    const total = mockOrders.length

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error getting orders:', error)
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    )
  }
}
