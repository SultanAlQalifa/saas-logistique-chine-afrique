'use client'

import { useState } from 'react'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Image, 
  Camera,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { exportToPDF, exportToExcel, exportChart, exportMultipleCharts, exportCompleteReport, ExportData, ChartExportOptions } from '@/utils/exportUtils'

interface ExportButtonsProps {
  data?: ExportData[]
  charts?: { elementId: string; title: string }[]
  reportTitle?: string
  className?: string
  showDropdown?: boolean
}

export default function ExportButtons({ 
  data = [], 
  charts = [], 
  reportTitle = 'Rapport',
  className = '',
  showDropdown = true
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [exportType, setExportType] = useState<string>('')

  const handleExport = async (type: string) => {
    setIsExporting(true)
    setExportType(type)
    
    try {
      switch (type) {
        case 'pdf-data':
          if (data.length > 0) {
            for (const exportData of data) {
              exportToPDF(exportData)
            }
          }
          break
          
        case 'excel-data':
          if (data.length > 0) {
            for (const exportData of data) {
              exportToExcel(exportData)
            }
          }
          break
          
        case 'pdf-charts':
          if (charts.length === 1) {
            await exportChart(charts[0].elementId, {
              title: charts[0].title,
              filename: charts[0].title.replace(/\s+/g, '_'),
              format: 'pdf'
            })
          } else if (charts.length > 1) {
            await exportMultipleCharts(charts, reportTitle.replace(/\s+/g, '_'))
          }
          break
          
        case 'png-charts':
          for (const chart of charts) {
            await exportChart(chart.elementId, {
              title: chart.title,
              filename: chart.title.replace(/\s+/g, '_'),
              format: 'png'
            })
          }
          break
          
        case 'complete-report':
          await exportCompleteReport(data, charts, reportTitle)
          break
          
        default:
          console.warn('Type d\'export non reconnu:', type)
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      alert('Erreur lors de l\'export. Veuillez réessayer.')
    } finally {
      setIsExporting(false)
      setExportType('')
      setShowMenu(false)
    }
  }

  if (!showDropdown) {
    // Boutons simples sans dropdown
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {data.length > 0 && (
          <>
            <button
              onClick={() => handleExport('pdf-data')}
              disabled={isExporting}
              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting && exportType === 'pdf-data' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel-data')}
              disabled={isExporting}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting && exportType === 'excel-data' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Excel</span>
            </button>
          </>
        )}
        {charts.length > 0 && (
          <>
            <button
              onClick={() => handleExport('png-charts')}
              disabled={isExporting}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting && exportType === 'png-charts' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Image className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">PNG</span>
            </button>
            <button
              onClick={() => handleExport('pdf-charts')}
              disabled={isExporting}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting && exportType === 'pdf-charts' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">PDF Graph</span>
            </button>
          </>
        )}
      </div>
    )
  }

  // Dropdown menu complet
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-md"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Exporter</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
              DONNÉES
            </div>
            
            {data.length > 0 ? (
              <>
                <button
                  onClick={() => handleExport('pdf-data')}
                  disabled={isExporting}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4 text-red-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Exporter en PDF</div>
                    <div className="text-xs text-gray-500">Tableaux de données formatés</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExport('excel-data')}
                  disabled={isExporting}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 disabled:opacity-50"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Exporter en Excel</div>
                    <div className="text-xs text-gray-500">Fichier .xlsx pour analyse</div>
                  </div>
                </button>
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Aucune donnée à exporter
              </div>
            )}

            {charts.length > 0 && (
              <>
                <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100 mt-2">
                  GRAPHIQUES
                </div>
                
                <button
                  onClick={() => handleExport('png-charts')}
                  disabled={isExporting}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 disabled:opacity-50"
                >
                  <Image className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Images PNG</div>
                    <div className="text-xs text-gray-500">Graphiques en haute qualité</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleExport('pdf-charts')}
                  disabled={isExporting}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 disabled:opacity-50"
                >
                  <Camera className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">PDF Graphiques</div>
                    <div className="text-xs text-gray-500">Graphiques en document PDF</div>
                  </div>
                </button>
              </>
            )}

            {data.length > 0 && charts.length > 0 && (
              <>
                <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100 mt-2">
                  RAPPORT COMPLET
                </div>
                
                <button
                  onClick={() => handleExport('complete-report')}
                  disabled={isExporting}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Rapport Complet</div>
                    <div className="text-xs text-gray-500">Graphiques + données en PDF</div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}

// Composant pour un bouton d'export simple d'un graphique
interface ChartExportButtonProps {
  chartId: string
  title: string
  className?: string
}

export function ChartExportButton({ chartId, title, className = '' }: ChartExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleExport = async (format: 'png' | 'pdf') => {
    setIsExporting(true)
    
    try {
      await exportChart(chartId, {
        title,
        filename: title.replace(/\s+/g, '_'),
        format
      })
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      alert('Erreur lors de l\'export. Veuillez réessayer.')
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        title="Exporter le graphique"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-2">
            <button
              onClick={() => handleExport('png')}
              disabled={isExporting}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3"
            >
              <Image className="h-4 w-4 text-blue-600" />
              <span className="text-sm">PNG</span>
            </button>
            
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3"
            >
              <FileText className="h-4 w-4 text-red-600" />
              <span className="text-sm">PDF</span>
            </button>
          </div>
        </div>
      )}

      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}
