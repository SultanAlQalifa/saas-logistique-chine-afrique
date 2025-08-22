'use client'

import { useState } from 'react'
import { Package as PackageType, PackageStatus, TransportMode } from '@/types'
import { formatCurrency, formatWeight } from '@/utils/calculations'
import { getDeliveryStatus } from '@/utils/packageValidation'
import { Search, Filter, Eye, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PackagesListProps {
  packages: PackageType[]
}

const statusColors: Record<PackageStatus, string> = {
  PLANNED: 'bg-gray-100 text-gray-800',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
  ARRIVED: 'bg-green-100 text-green-800',
  COLLECTED: 'bg-blue-100 text-blue-800',
}

const deliveryStatusColors = {
  READY: 'bg-green-100 text-green-800',
  BLOCKED: 'bg-red-100 text-red-800',
  PARTIAL: 'bg-yellow-100 text-yellow-800',
}

const transportModeLabels: Record<TransportMode, string> = {
  AERIAL: 'Aerial',
  AERIAL_EXPRESS: 'Aerial Express',
  MARITIME: 'Maritime',
  MARITIME_EXPRESS: 'Maritime Express',
}

export default function PackagesList({ packages }: PackagesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PackageStatus | 'ALL'>('ALL')
  const [transportFilter, setTransportFilter] = useState<TransportMode | 'ALL'>('ALL')

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = 
      (pkg.packageId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (pkg.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (pkg.client?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (pkg.trackingPin || '').includes(searchTerm)

    const matchesStatus = statusFilter === 'ALL' || pkg.status === statusFilter
    const matchesTransport = transportFilter === 'ALL' || pkg.transportMode === transportFilter

    return matchesSearch && matchesStatus && matchesTransport
  })

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-secondary-900">Packages</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PackageStatus | 'ALL')}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="ALL">All Status</option>
            <option value="PLANNED">Planned</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="ARRIVED">Arrived</option>
            <option value="COLLECTED">Collected</option>
          </select>

          {/* Transport Filter */}
          <select
            value={transportFilter}
            onChange={(e) => setTransportFilter(e.target.value as TransportMode | 'ALL')}
            className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="ALL">All Transport</option>
            <option value="AERIAL">Aerial</option>
            <option value="AERIAL_EXPRESS">Aerial Express</option>
            <option value="MARITIME">Maritime</option>
            <option value="MARITIME_EXPRESS">Maritime Express</option>
          </select>
        </div>
      </div>

      {/* Packages Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Transport
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Livraison
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Tracking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {filteredPackages.map((pkg) => {
              // Ajouter des valeurs par défaut pour la validation
              const packageWithDefaults = {
                ...pkg,
                podValidated: pkg.podValidated || false,
                paymentStatus: pkg.paymentStatus || 'PENDING' as const
              }
              
              const deliveryStatus = getDeliveryStatus(packageWithDefaults)
              
              return (
                <tr key={pkg.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {pkg.packageId}
                      </div>
                      <div className="text-sm text-secondary-500 truncate max-w-xs">
                        {pkg.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900">{pkg.client?.name || 'N/A'}</div>
                    <div className="text-sm text-secondary-500">{pkg.client?.clientId || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-secondary-900">
                      {transportModeLabels[pkg.transportMode]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {formatWeight(pkg.weight)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {pkg.finalPrice ? formatCurrency(pkg.finalPrice) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[pkg.status]}`}>
                      {pkg.status.replace('_', ' ').toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {deliveryStatus.canDeliver ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Autorisé</span>
                        </div>
                      ) : deliveryStatus.status === 'PARTIAL' ? (
                        <div className="flex items-center text-yellow-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Partiel</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Bloqué</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      POD: {packageWithDefaults.podValidated ? '✓' : '✗'} | 
                      Paiement: {packageWithDefaults.paymentStatus === 'COMPLETED' ? '✓' : packageWithDefaults.paymentStatus === 'PARTIAL' ? '⚠' : '✗'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-secondary-900 bg-gray-50 px-2 py-1 rounded border">
                      {pkg.trackingPin || 'A3X9K2'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/track/${pkg.trackingPin}`}
                      className="text-primary-600 hover:text-primary-900 inline-flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-2">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-1">No packages found</h3>
            <p className="text-secondary-500">
              {searchTerm || statusFilter !== 'ALL' || transportFilter !== 'ALL'
                ? 'Try adjusting your search or filters'
                : 'Create your first package to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
