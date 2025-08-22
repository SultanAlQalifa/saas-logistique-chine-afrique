'use client'

import { useState } from 'react'
import { Calendar, ChevronDown, X } from 'lucide-react'

export interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

export interface DateFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
  placeholder?: string
  className?: string
}

const DATE_PRESETS = [
  {
    label: "Aujourd'hui",
    getValue: () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const endOfDay = new Date(today)
      endOfDay.setHours(23, 59, 59, 999)
      return { startDate: today, endDate: endOfDay }
    }
  },
  {
    label: "Hier",
    getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const endOfDay = new Date(yesterday)
      endOfDay.setHours(23, 59, 59, 999)
      return { startDate: yesterday, endDate: endOfDay }
    }
  },
  {
    label: "7 derniers jours",
    getValue: () => {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const start = new Date()
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      return { startDate: start, endDate: end }
    }
  },
  {
    label: "30 derniers jours",
    getValue: () => {
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const start = new Date()
      start.setDate(start.getDate() - 29)
      start.setHours(0, 0, 0, 0)
      return { startDate: start, endDate: end }
    }
  },
  {
    label: "Ce mois",
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      return { startDate: start, endDate: end }
    }
  },
  {
    label: "Mois dernier",
    getValue: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      return { startDate: start, endDate: end }
    }
  }
]

export default function DateFilter({ value, onChange, placeholder = "Sélectionner une période", className = "" }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customMode, setCustomMode] = useState(false)
  const [startDateInput, setStartDateInput] = useState('')
  const [endDateInput, setEndDateInput] = useState('')

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDisplayText = () => {
    if (!value.startDate && !value.endDate) {
      return placeholder
    }
    
    if (value.startDate && value.endDate) {
      const start = formatDate(value.startDate)
      const end = formatDate(value.endDate)
      
      // Vérifier si c'est le même jour
      if (start === end) {
        return start
      }
      
      return `${start} - ${end}`
    }
    
    if (value.startDate) {
      return `À partir du ${formatDate(value.startDate)}`
    }
    
    if (value.endDate) {
      return `Jusqu'au ${formatDate(value.endDate)}`
    }
    
    return placeholder
  }

  const handlePresetSelect = (preset: typeof DATE_PRESETS[0]) => {
    const range = preset.getValue()
    onChange(range)
    setIsOpen(false)
    setCustomMode(false)
  }

  const handleCustomDateApply = () => {
    const startDate = startDateInput ? new Date(startDateInput) : null
    const endDate = endDateInput ? new Date(endDateInput) : null
    
    if (startDate) {
      startDate.setHours(0, 0, 0, 0)
    }
    
    if (endDate) {
      endDate.setHours(23, 59, 59, 999)
    }
    
    onChange({ startDate, endDate })
    setIsOpen(false)
    setCustomMode(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange({ startDate: null, endDate: null })
    setStartDateInput('')
    setEndDateInput('')
  }

  const hasValue = value.startDate || value.endDate

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={hasValue ? "text-gray-900" : "text-gray-500"}>
            {getDisplayText()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasValue && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {!customMode ? (
            <div className="p-2">
              <div className="space-y-1">
                {DATE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
                <hr className="my-2" />
                <button
                  onClick={() => setCustomMode(true)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 rounded-md transition-colors text-blue-600"
                >
                  📅 Période personnalisée
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Période personnalisée</h3>
                <button
                  onClick={() => setCustomMode(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={endDateInput}
                    onChange={(e) => setEndDateInput(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setCustomMode(false)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCustomDateApply}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
