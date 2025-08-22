'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import CreatePackageForm from '@/components/forms/CreatePackageForm'
import { Client, CompanySettings, CreatePackageData } from '@/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreatePackagePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use mock clients for testing without authentication
        const mockClients = [
          {
            id: 'client-1',
            clientId: 'CL-001',
            companyId: 'test-company',
            name: 'Client A - Électroniques',
            email: 'clienta@example.com',
            createdAt: new Date()
          },
          {
            id: 'client-2',
            clientId: 'CL-002',
            companyId: 'test-company',
            name: 'Client B - Textiles',
            email: 'clientb@example.com',
            createdAt: new Date()
          },
          {
            id: 'client-3',
            clientId: 'CL-003',
            companyId: 'test-company',
            name: 'Client C - Machines',
            email: 'clientc@example.com',
            createdAt: new Date()
          }
        ]
        
        setClients(mockClients)

        // Use default company settings for now
        setCompanySettings({
          aerialPricePerKg: 5.0,
          maritimePricePerCbm: 150.0,
          aerialEtaDays: 7,
          aerialExpressEtaDays: 3,
          maritimeEtaDays: 60,
          maritimeExpressEtaDays: 45,
          primaryColor: '#3b82f6',
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    // Always fetch data, regardless of session status
    fetchData()
  }, [])

  const handleSubmit = async (data: any) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/dashboard/packages')
      } else {
        const error = await response.json()
        console.error('Error creating package:', error)
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Error creating package:', error)
      // TODO: Show error message to user
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!companySettings) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">Unable to load company settings. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button - Top of page */}
      <div className="flex items-center justify-start">
        <Link
          href="/dashboard/packages"
          className="flex items-center bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg border border-blue-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux Colis
        </Link>
      </div>

      {/* Form */}
      <CreatePackageForm
        clients={clients}
        companySettings={companySettings}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </div>
  )
}
