'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, Mail, Phone, MapPin, Percent, Calendar, UserCheck } from 'lucide-react'

interface Agent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  commissionRate?: number
  zone?: string
  specialization?: string
  notes?: string
  createdAt: Date
}

export default function AgentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock agent data - replace with actual API call
    const mockAgent: Agent = {
      id: params.id as string,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de la Paix',
      city: 'Paris',
      country: 'France',
      commissionRate: 5.5,
      zone: 'afrique-ouest',
      specialization: 'maritime',
      notes: 'Agent expérimenté spécialisé dans le transport maritime vers l\'Afrique de l\'Ouest.',
      createdAt: new Date('2023-01-15')
    }

    setAgent(mockAgent)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Agent non trouvé</h3>
          <p className="text-gray-500 mb-4">L'agent demandé n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => router.push('/dashboard/contacts')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retour aux contacts
          </button>
        </div>
      </div>
    )
  }

  const getZoneLabel = (zone: string) => {
    const zones: Record<string, string> = {
      'afrique-ouest': 'Afrique de l\'Ouest',
      'afrique-centrale': 'Afrique Centrale',
      'afrique-est': 'Afrique de l\'Est',
      'afrique-nord': 'Afrique du Nord',
      'chine': 'Chine',
      'international': 'International'
    }
    return zones[zone] || zone
  }

  const getSpecializationLabel = (specialization: string) => {
    const specializations: Record<string, string> = {
      'maritime': 'Transport Maritime',
      'aerien': 'Transport Aérien',
      'douane': 'Procédures Douanières',
      'commercial': 'Développement Commercial',
      'logistique': 'Logistique Générale'
    }
    return specializations[specialization] || specialization
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {agent.firstName} {agent.lastName}
          </h1>
        </div>
        <button
          onClick={() => router.push(`/dashboard/contacts/agents/${agent.id}/edit`)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Informations personnelles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Prénom</label>
                <p className="text-gray-900">{agent.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                <p className="text-gray-900">{agent.lastName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Contact</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900">{agent.email}</p>
              </div>
              {agent.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                  <p className="text-gray-900">{agent.phone}</p>
                </div>
              )}
            </div>
          </div>

          {(agent.address || agent.city || agent.country) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Localisation</h2>
              </div>
              <div className="space-y-2">
                {agent.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Adresse</label>
                    <p className="text-gray-900">{agent.address}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agent.city && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Ville</label>
                      <p className="text-gray-900">{agent.city}</p>
                    </div>
                  )}
                  {agent.country && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Pays</label>
                      <p className="text-gray-900">{agent.country}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {agent.notes && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{agent.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Informations professionnelles</h2>
            </div>
            <div className="space-y-4">
              {agent.commissionRate && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Taux de commission</label>
                  <p className="text-gray-900">{agent.commissionRate}%</p>
                </div>
              )}
              {agent.zone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Zone d'activité</label>
                  <p className="text-gray-900">{getZoneLabel(agent.zone)}</p>
                </div>
              )}
              {agent.specialization && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Spécialisation</label>
                  <p className="text-gray-900">{getSpecializationLabel(agent.specialization)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Informations système</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date de création</label>
              <p className="text-gray-900">{agent.createdAt.toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
