'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

// Hook pour la pagination optimisée
export function usePagination<T>(data: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }, [data, currentPage, itemsPerPage])
  
  const totalPages = Math.ceil(data.length / itemsPerPage)
  
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])
  
  return {
    data: paginatedData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

// Hook pour la recherche optimisée avec debounce
export function useSearch<T>(data: T[], searchFields: (keyof T)[], delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [searchTerm, delay])
  
  const filteredData = useMemo(() => {
    if (!debouncedTerm) return data
    
    return data.filter(item =>
      searchFields.some(field => {
        const value = item[field]
        return String(value).toLowerCase().includes(debouncedTerm.toLowerCase())
      })
    )
  }, [data, debouncedTerm, searchFields])
  
  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    isSearching: searchTerm !== debouncedTerm
  }
}

// Hook pour le cache local avec expiration
export function useLocalCache<T>(key: string, defaultValue: T, expirationMinutes: number = 30) {
  const [data, setData] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const { value, timestamp } = JSON.parse(cached)
        const isExpired = Date.now() - timestamp > expirationMinutes * 60 * 1000
        
        if (!isExpired) {
          return value
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error)
    }
    
    return defaultValue
  })
  
  const updateCache = useCallback((newData: T) => {
    setData(newData)
    
    try {
      localStorage.setItem(key, JSON.stringify({
        value: newData,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn('Cache write error:', error)
    }
  }, [key])
  
  const clearCache = useCallback(() => {
    setData(defaultValue)
    localStorage.removeItem(key)
  }, [key, defaultValue])
  
  return { data, updateCache, clearCache }
}

// Hook pour les filtres optimisés
export function useFilters<T>(data: T[]) {
  const [filters, setFilters] = useState<Record<string, any>>({})
  
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true
        
        const itemValue = (item as any)[key]
        if (Array.isArray(value)) {
          return value.includes(itemValue)
        }
        return itemValue === value
      })
    })
  }, [data, filters])
  
  const setFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])
  
  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])
  
  const removeFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])
  
  return {
    filters,
    filteredData,
    setFilter,
    clearFilters,
    removeFilter,
    hasFilters: Object.keys(filters).length > 0
  }
}

// Hook pour le tri optimisé
export function useSorting<T>(data: T[]) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })
  
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [data, sortConfig])
  
  const requestSort = useCallback((key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])
  
  return {
    sortedData,
    sortConfig,
    requestSort
  }
}

// Hook combiné pour toutes les optimisations
export function useOptimizedTable<T>(
  data: T[],
  options: {
    searchFields: (keyof T)[]
    itemsPerPage?: number
    cacheKey?: string
    cacheExpiration?: number
  }
) {
  const { searchTerm, setSearchTerm, filteredData: searchedData } = useSearch(data, options.searchFields)
  const { filters, filteredData: filteredSearchedData, setFilter, clearFilters } = useFilters(searchedData)
  const { sortedData, sortConfig, requestSort } = useSorting(filteredSearchedData)
  const pagination = usePagination(sortedData, options.itemsPerPage)
  
  return {
    // Search
    searchTerm,
    setSearchTerm,
    
    // Filters
    filters,
    setFilter,
    clearFilters,
    
    // Sorting
    sortConfig,
    requestSort,
    
    // Pagination
    ...pagination,
    
    // Stats
    totalItems: data.length,
    filteredItems: sortedData.length,
    showingItems: pagination.data.length
  }
}
