'use client'

import { DashboardStats } from '@/types'
import { formatCurrency } from '@/utils/calculations'
import { Package, TrendingUp, Truck, CheckCircle } from 'lucide-react'

interface DashboardStatsProps {
  stats: DashboardStats
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Colis',
      value: stats.totalPackages.toString(),
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'En Route',
      value: stats.packagesInTransit.toString(),
      icon: Truck,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Arrivés',
      value: stats.packagesArrived.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Revenus Total',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      growth: stats.monthlyGrowth,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stat.value}
                </p>
                {stat.growth !== undefined && (
                  <p className={`text-sm mt-1 ${
                    stat.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.growth >= 0 ? '+' : ''}{stat.growth.toFixed(1)}% from last month
                  </p>
                )}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
