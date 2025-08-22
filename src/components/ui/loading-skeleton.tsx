'use client'

import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table'
  animation?: 'pulse' | 'wave' | 'none'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_1.6s_ease-in-out_infinite]',
    none: ''
  }

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-2xl',
    table: 'rounded-md'
  }

  const style = {
    width: width || undefined,
    height: height || undefined
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

// Composants de skeleton pré-configurés
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="rectangular" width={80} height={24} />
      </div>
      <Skeleton variant="text" lines={1} className="mb-2" />
      <Skeleton variant="text" lines={2} className="mb-4" />
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" width="100%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={40} />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {Array.from({ length: cols }).map((_, index) => (
              <th key={index} className="px-6 py-4">
                <Skeleton variant="text" height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton variant="text" height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton variant="text" width="60%" height={14} className="mb-2" />
          <Skeleton variant="text" width="40%" height={32} className="mb-3" />
          <div className="flex items-center">
            <Skeleton variant="rectangular" width={60} height={20} />
            <Skeleton variant="text" width={40} height={12} className="ml-2" />
          </div>
        </div>
        <Skeleton variant="circular" width={56} height={56} />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-gray-200 rounded-3xl p-8 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton variant="text" width={300} height={32} className="mb-3" />
            <Skeleton variant="text" width={400} height={20} />
          </div>
          <Skeleton variant="rectangular" width={150} height={48} />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <div className="mb-6">
          <div className="flex space-x-2 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" width={120} height={40} />
            ))}
          </div>
          <div className="flex justify-between items-center mb-6">
            <Skeleton variant="rectangular" width={300} height={48} />
            <div className="flex gap-4">
              <Skeleton variant="rectangular" width={100} height={48} />
              <Skeleton variant="rectangular" width={100} height={48} />
            </div>
          </div>
        </div>
        <TableSkeleton rows={8} cols={5} />
      </div>
    </div>
  )
}
