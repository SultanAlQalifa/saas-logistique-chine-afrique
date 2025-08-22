import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'

// Couleurs du thème africain
const AFRICAN_COLORS = {
  primary: [44, 64, 60] as [number, number, number],
  secondary: [218, 165, 32] as [number, number, number],
  accent: [139, 69, 19] as [number, number, number],
  success: [34, 139, 34] as [number, number, number],
  warning: [255, 140, 0] as [number, number, number],
  error: [220, 20, 60] as [number, number, number]
}

// Types pour les exports
export interface ExportData {
  title: string
  data: any[]
  columns: { header: string; key: string; width?: number }[]
  metadata?: {
    company?: string
    period?: string
    generatedBy?: string
    generatedAt?: Date
  }
}

export interface ChartExportOptions {
  title: string
  filename: string
  format: 'png' | 'pdf'
  quality?: number
}

// Utilitaire pour exporter en PDF
export const exportToPDF = (exportData: ExportData) => {
  const doc = new jsPDF()
  const { title, data, columns, metadata } = exportData

  // Configuration des couleurs africaines
  const primaryColor = [255, 107, 53] // Orange africain
  const secondaryColor = [46, 139, 87] // Vert forêt
  const textColor = [44, 64, 60] // Gris foncé

  // En-tête du document
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 210, 30, 'F')
  
  // Logo et titre
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('NextMove Chine-Afrique', 20, 20)
  
  // Sous-titre
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text(title, 20, 40)

  // Métadonnées
  if (metadata) {
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFontSize(10)
    let yPos = 50
    
    if (metadata.company) {
      doc.text(`Entreprise: ${metadata.company}`, 20, yPos)
      yPos += 5
    }
    if (metadata.period) {
      doc.text(`Période: ${metadata.period}`, 20, yPos)
      yPos += 5
    }
    if (metadata.generatedBy) {
      doc.text(`Généré par: ${metadata.generatedBy}`, 20, yPos)
      yPos += 5
    }
    if (metadata.generatedAt) {
      doc.text(`Date: ${metadata.generatedAt.toLocaleDateString('fr-FR')}`, 20, yPos)
      yPos += 5
    }
  }

  // Table des données
  const tableColumns = columns.map(col => col.header)
  const tableRows = data.map(row => 
    columns.map(col => {
      const value = row[col.key]
      if (value === null || value === undefined) return '-'
      if (typeof value === 'number') return value.toLocaleString('fr-FR')
      if (value instanceof Date) return value.toLocaleDateString('fr-FR')
      return String(value)
    })
  )

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: metadata ? 70 : 50,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor as [number, number, number],
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: textColor as [number, number, number]
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248]
    },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    columnStyles: columns.reduce((acc, col, index) => {
      if (col.width) {
        acc[index] = { cellWidth: col.width }
      }
      return acc
    }, {} as any)
  })

  // Pied de page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} sur ${pageCount} - Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      20,
      doc.internal.pageSize.height - 10
    )
  }

  // Télécharger le PDF
  const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

// Utilitaire pour exporter en Excel
export const exportToExcel = (exportData: ExportData) => {
  const { title, data, columns, metadata } = exportData

  // Créer un nouveau workbook
  const wb = XLSX.utils.book_new()

  // Préparer les données avec les en-têtes
  const headers = columns.map(col => col.header)
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key]
      if (value === null || value === undefined) return ''
      if (value instanceof Date) return value.toLocaleDateString('fr-FR')
      return value
    })
  )

  // Créer la feuille de calcul
  const wsData = [headers, ...rows]
  
  // Ajouter les métadonnées en haut si disponibles
  if (metadata) {
    const metaRows = []
    metaRows.push([title])
    metaRows.push([])
    if (metadata.company) metaRows.push(['Entreprise:', metadata.company])
    if (metadata.period) metaRows.push(['Période:', metadata.period])
    if (metadata.generatedBy) metaRows.push(['Généré par:', metadata.generatedBy])
    if (metadata.generatedAt) metaRows.push(['Date:', metadata.generatedAt.toLocaleDateString('fr-FR')])
    metaRows.push([])
    
    wsData.unshift(...metaRows)
  }

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Styliser les en-têtes (si possible)
  const headerRowIndex = metadata ? metadata.company ? 6 : 4 : 0
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  
  // Définir la largeur des colonnes
  const colWidths = columns.map(col => ({ wch: col.width || 15 }))
  ws['!cols'] = colWidths

  // Ajouter la feuille au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Données')

  // Télécharger le fichier Excel
  const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, filename)
}

// Utilitaire pour exporter un graphique
export const exportChart = async (elementId: string, options: ChartExportOptions) => {
  const { title, filename, format, quality = 1 } = options
  
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Élément avec l'ID "${elementId}" non trouvé`)
    }

    // Capturer l'élément en canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: quality,
      useCORS: true,
      allowTaint: true,
      logging: false
    })

    if (format === 'png') {
      // Télécharger en PNG
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${filename}.png`)
        }
      }, 'image/png')
    } else if (format === 'pdf') {
      // Créer un PDF avec le graphique
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      
      // Configuration des couleurs africaines
      const primaryColor = [255, 107, 53]
      
      // En-tête
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(0, 0, 210, 25, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('NextMove Chine-Afrique', 20, 17)
      
      // Titre du graphique
      pdf.setTextColor(44, 64, 60)
      pdf.setFontSize(14)
      pdf.text(title, 20, 35)
      
      // Calculer les dimensions pour centrer l'image
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      
      // Calculer le ratio pour ajuster l'image
      const maxWidth = pdfWidth - 40 // Marges de 20 de chaque côté
      const maxHeight = pdfHeight - 80 // Espace pour en-tête et pied de page
      
      let finalWidth = imgWidth
      let finalHeight = imgHeight
      
      if (imgWidth > maxWidth) {
        finalWidth = maxWidth
        finalHeight = (imgHeight * maxWidth) / imgWidth
      }
      
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight
        finalWidth = (imgWidth * maxHeight) / imgHeight
      }
      
      // Centrer l'image
      const x = (pdfWidth - finalWidth) / 2
      const y = 45
      
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
      
      // Pied de page
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text(
        `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
        20,
        pdfHeight - 10
      )
      
      pdf.save(`${filename}.pdf`)
    }
  } catch (error) {
    console.error('Erreur lors de l\'export du graphique:', error)
    throw error
  }
}

// Utilitaire pour exporter plusieurs graphiques en PDF
export const exportMultipleCharts = async (
  charts: { elementId: string; title: string }[],
  filename: string
) => {
  try {
    const pdf = new jsPDF()
    const primaryColor = [255, 107, 53]
    
    for (let i = 0; i < charts.length; i++) {
      const { elementId, title } = charts[i]
      
      if (i > 0) {
        pdf.addPage()
      }
      
      // En-tête pour chaque page
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(0, 0, 210, 25, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('NextMove Chine-Afrique', 20, 17)
      
      pdf.setTextColor(AFRICAN_COLORS.primary[0], AFRICAN_COLORS.primary[1], AFRICAN_COLORS.primary[2])
      pdf.setFontSize(16)
      pdf.text(title, 20, 30)
      
      // Subtitle
      pdf.setTextColor(AFRICAN_COLORS.secondary[0], AFRICAN_COLORS.secondary[1], AFRICAN_COLORS.secondary[2])
      pdf.setFontSize(14)
      pdf.text('Subtitle', 20, 40)
      
      // Capturer et ajouter le graphique
      const element = document.getElementById(elementId)
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 1,
          useCORS: true,
          allowTaint: true,
          logging: false
        })
        
        const imgData = canvas.toDataURL('image/png')
        
        // Calculer les dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const maxWidth = pdfWidth - 40
        const maxHeight = pdfHeight - 80
        
        let finalWidth = canvas.width
        let finalHeight = canvas.height
        
        if (canvas.width > maxWidth) {
          finalWidth = maxWidth
          finalHeight = (canvas.height * maxWidth) / canvas.width
        }
        
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight
          finalWidth = (canvas.width * maxHeight) / canvas.height
        }
        
        const x = (pdfWidth - finalWidth) / 2
        const y = 45
        
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
      }
      
      // Pied de page
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text(
        `Page ${i + 1} sur ${charts.length} - Généré le ${new Date().toLocaleDateString('fr-FR')}`,
        20,
        pdf.internal.pageSize.getHeight() - 10
      )
    }
    
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('Erreur lors de l\'export multiple:', error)
    throw error
  }
}

// Utilitaire pour créer un rapport complet
export const exportCompleteReport = async (
  data: ExportData[],
  charts: { elementId: string; title: string }[],
  reportTitle: string
) => {
  try {
    const pdf = new jsPDF()
    const primaryColor = [255, 107, 53]
    const textColor = [44, 64, 60]
    
    // Page de couverture
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.rect(0, 0, 210, 297, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('NextMove', 105, 100, { align: 'center' })
    pdf.text('Chine-Afrique', 105, 120, { align: 'center' })
    
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'normal')
    pdf.text(reportTitle, 105, 150, { align: 'center' })
    
    pdf.setFontSize(12)
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 200, { align: 'center' })
    
    // Ajouter les graphiques
    for (const chart of charts) {
      pdf.addPage()
      
      // En-tête
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(0, 0, 210, 25, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('NextMove Chine-Afrique', 20, 17)
      
      pdf.setTextColor(textColor[0], textColor[1], textColor[2])
      pdf.setFontSize(14)
      pdf.text(chart.title, 20, 35)
      
      // Ajouter le graphique
      const element = document.getElementById(chart.elementId)
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 1,
          useCORS: true,
          allowTaint: true,
          logging: false
        })
        
        const imgData = canvas.toDataURL('image/png')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const maxWidth = pdfWidth - 40
        const maxHeight = 200
        
        let finalWidth = canvas.width
        let finalHeight = canvas.height
        
        if (canvas.width > maxWidth) {
          finalWidth = maxWidth
          finalHeight = (canvas.height * maxWidth) / canvas.width
        }
        
        if (finalHeight > maxHeight) {
          finalHeight = maxHeight
          finalWidth = (canvas.width * maxHeight) / canvas.height
        }
        
        const x = (pdfWidth - finalWidth) / 2
        pdf.addImage(imgData, 'PNG', x, 45, finalWidth, finalHeight)
      }
    }
    
    // Ajouter les données tabulaires
    for (const exportData of data) {
      pdf.addPage()
      
      // En-tête
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
      pdf.rect(0, 0, 210, 25, 'F')
      
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('NextMove Chine-Afrique', 20, 17)
      
      pdf.setTextColor(textColor[0], textColor[1], textColor[2])
      pdf.setFontSize(14)
      pdf.text(exportData.title, 20, 35)
      
      // Table
      const tableColumns = exportData.columns.map(col => col.header)
      const tableRows = exportData.data.map(row => 
        exportData.columns.map(col => {
          const value = row[col.key]
          if (value === null || value === undefined) return '-'
          if (typeof value === 'number') return value.toLocaleString('fr-FR')
          if (value instanceof Date) return value.toLocaleDateString('fr-FR')
          return String(value)
        })
      )

      autoTable(pdf, {
        head: [tableColumns],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: {
          fillColor: primaryColor as [number, number, number],
          textColor: [255, 255, 255] as [number, number, number],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: textColor as [number, number, number]
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
      })
    }
    
    // Numéroter les pages
    const pageCount = pdf.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      if (i > 1) { // Pas de numérotation sur la page de couverture
        pdf.setFontSize(8)
        pdf.setTextColor(128, 128, 128)
        pdf.text(
          `Page ${i - 1} sur ${pageCount - 1}`,
          pdf.internal.pageSize.getWidth() - 30,
          pdf.internal.pageSize.getHeight() - 10
        )
      }
    }
    
    const filename = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(filename)
  } catch (error) {
    console.error('Erreur lors de l\'export du rapport complet:', error)
    throw error
  }
}
