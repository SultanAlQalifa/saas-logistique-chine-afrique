'use client'

import React, { Suspense } from 'react'
import { Skeleton } from './loading-skeleton'

interface LazyPageProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LazyPage({ children, fallback }: LazyPageProps) {
  const defaultFallback = (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

export default LazyPage
