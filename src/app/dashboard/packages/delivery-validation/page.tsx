'use client'

import React, { useState } from 'react'
import { Package, CheckCircle, XCircle, AlertCircle, CreditCard, FileCheck, Search, Filter } from 'lucide-react'
import { Package as PackageType } from '@/types'
import { getDeliveryStatus, validatePOD, updatePaymentStatus } from '@/utils/packageValidation'
import PackageDeliveryStatus from '@/components/packages/PackageDeliveryStatus'

export default function DeliveryValidationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'READY' | 'BLOCKED' | 'PARTIAL'>('ALL')
  
  // Mock data - à remplacer par des données réelles
  const [packages, setPackages] = useState<PackageType[]>([
    {
      id: '1',
      packageId: 'PKG-001',
      companyId: 'comp1',
      clientId: 'client1',
      description: 'Électroniques - Smartphones',
      weight: 2.5,
      transportMode: 'AERIAL',
      finalPrice: 75000,
      trackingPin: 'A3X9K1',
      status: 'ARRIVED',
      podValidated: true,
      podValidatedAt: new Date('2024-01-15'),
      podValidatedBy: 'admin@company.com',
      paymentStatus: 'COMPLETED',
      paymentAmount: 75000,
      remainingAmount: 0,
      canBeDelivered: true,
      client: { id: 'client1', clientId: 'CLI-001', companyId: 'comp1', name: 'Jean Dupont', createdAt: new Date() }
    },
    {
      id: '2',
      packageId: 'PKG-002',
      companyId: 'comp1',
      clientId: 'client2',
      description: 'Vêtements - Collection été',
      weight: 5.0,
      transportMode: 'MARITIME',
      finalPrice: 120000,
      trackingPin: 'M7B2C3',
      status: 'ARRIVED',
      podValidated: false,
      paymentStatus: 'PARTIAL',
      paymentAmount: 72000,
      remainingAmount: 48000,
      canBeDelivered: false,
      client: { id: 'client2', clientId: 'CLI-002', companyId: 'comp1', name: 'Marie Martin', createdAt: new Date() }
    },
    {
      id: '3',
      packageId: 'PKG-003',
      companyId: 'comp1',
      clientId: 'client3',
      description: 'Matériel médical',
      weight: 1.8,
      transportMode: 'AERIAL_EXPRESS',
      finalPrice: 95000,
      trackingPin: 'AE4X7Y',
      status: 'ARRIVED',
      podValidated: true,
      podValidatedAt: new Date('2024-01-16'),
      podValidatedBy: 'admin@company.com',
      paymentStatus: 'PENDING',
      paymentAmount: 0,
      remainingAmount: 95000,
      canBeDelivered: false,
      client: { id: 'client3', clientId: 'CLI-003', companyId: 'comp1', name: 'Dr. Ahmed Hassan', createdAt: new Date() }
    }
  ])

  const handleValidatePOD = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? validatePOD(pkg, 'admin@company.com')
        : pkg
    ))
  }

  const handleCompletePayment = (packageId: string) => {
    setPackages(prev => prev.map(pkg => {
      if (pkg.id === packageId) {
        const finalPrice = pkg.finalPrice || 0
        return updatePaymentStatus(pkg, finalPrice, 'COMPLETED')
      }
      return pkg
    }))
  }

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.client.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'ALL') return matchesSearch
    
    const deliveryStatus = getDeliveryStatus(pkg)
    return matchesSearch && deliveryStatus.status === statusFilter
  })

  const stats = {
    total: packages.length,
    ready: packages.filter(pkg => getDeliveryStatus(pkg).canDeliver).length,
    blocked: packages.filter(pkg => getDeliveryStatus(pkg).status === 'BLOCKED').length,
    partial: packages.filter(pkg => getDeliveryStatus(pkg).status === 'PARTIAL').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <Package className="w-8 h-8 mr-3 text-blue-600" />
            Validation Livraison & Récupération
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les validations POD et paiements pour autoriser les livraisons
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Colis</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Prêts</p>
                <p className="text-2xl font-bold text-green-700">{stats.ready}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Partiels</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.partial}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Bloqués</p>
                <p className="text-2xl font-bold text-red-700">{stats.blocked}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par ID, description ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="READY">Prêts</option>
                <option value="PARTIAL">Partiels</option>
                <option value="BLOCKED">Bloqués</option>
              </select>
            </div>
          </div>
        </div>

        {/* Packages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.packageId}</h3>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  <p className="text-sm text-gray-500">Client: {pkg.client.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {pkg.finalPrice?.toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="text-sm text-gray-500">{pkg.weight} kg</p>
                </div>
              </div>
              
              <PackageDeliveryStatus
                package={pkg}
                onValidatePOD={handleValidatePOD}
                onCompletePayment={handleCompletePayment}
                showActions={true}
              />
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun colis trouvé</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Essayez d\'ajuster vos filtres de recherche'
                : 'Aucun colis en attente de validation'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
