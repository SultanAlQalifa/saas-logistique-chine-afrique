import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/mock-data'
import { Transaction, ApiResponse, PaginatedResponse } from '@/types/api'

export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<Transaction> | ApiResponse<never>>> {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const paymentMethod = searchParams.get('paymentMethod')
    const companyId = searchParams.get('companyId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let filteredTransactions = [...mockData.transactions]

    // Filtres
    if (companyId) {
      filteredTransactions = filteredTransactions.filter(transaction => transaction.companyId === companyId)
    }

    if (status && status !== 'ALL') {
      filteredTransactions = filteredTransactions.filter(transaction => transaction.status === status)
    }

    if (paymentMethod && paymentMethod !== 'ALL') {
      filteredTransactions = filteredTransactions.filter(transaction => transaction.paymentMethod === paymentMethod)
    }

    if (startDate) {
      const start = new Date(startDate)
      filteredTransactions = filteredTransactions.filter(transaction => 
        new Date(transaction.createdAt) >= start
      )
    }

    if (endDate) {
      const end = new Date(endDate)
      filteredTransactions = filteredTransactions.filter(transaction => 
        new Date(transaction.createdAt) <= end
      )
    }

    // Pagination
    const total = filteredTransactions.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des transactions'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Transaction>>> {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.packageId || !body.amount || !body.paymentMethod) {
      return NextResponse.json({
        success: false,
        error: 'Champs obligatoires manquants'
      }, { status: 400 })
    }

    // Génération d'une nouvelle transaction
    const newTransaction: Transaction = {
      id: `transaction_${Date.now()}`,
      packageId: body.packageId,
      amount: parseFloat(body.amount),
      currency: body.currency || 'FCFA',
      status: body.status || 'PENDING',
      paymentMethod: body.paymentMethod,
      paymentProvider: body.paymentProvider || undefined,
      transactionRef: `TXN${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      companyId: body.companyId || 'company_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter aux données mock (simulation)
    mockData.transactions.push(newTransaction)

    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: 'Transaction créée avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la création de la transaction'
    }, { status: 500 })
  }
}
