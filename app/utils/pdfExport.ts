import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { format } from 'date-fns'

interface ExportStats {
  totalEntries: number
  avgMood: number
  topMood: string
  currentStreak: number
}

interface ExportOptions {
  filename?: string
  dateRange?: { start: Date; end: Date } | null
  stats?: ExportStats
}

export async function exportAnalyticsToPDF(
  elementId: string,
  options: ExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId)
  
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`)
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    })

    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Add header
    pdf.setFontSize(24)
    pdf.setTextColor(26, 58, 46)
    pdf.text('Pulse Analytics', 15, 20)
    
    // Add date range if provided
    if (options.dateRange) {
      pdf.setFontSize(12)
      pdf.setTextColor(160, 174, 192)
      const dateText = `${format(options.dateRange.start, 'MMM d, yyyy')} - ${format(options.dateRange.end, 'MMM d, yyyy')}`
      pdf.text(dateText, 15, 28)
    }
    
    // Add stats summary if provided
    if (options.stats) {
      pdf.setFontSize(10)
      pdf.setTextColor(45, 55, 72)
      let yPos = 40
      
      pdf.text(`Total Entries: ${options.stats.totalEntries}`, 15, yPos)
      yPos += 6
      pdf.text(`Average Mood: ${options.stats.avgMood.toFixed(1)}/10`, 15, yPos)
      yPos += 6
      pdf.text(`Top Mood: ${options.stats.topMood}`, 15, yPos)
      yPos += 6
      pdf.text(`Current Streak: ${options.stats.currentStreak} days`, 15, yPos)
      yPos += 10
    }
    
    // Add the canvas image
    const imgData = canvas.toDataURL('image/png')
    const startY = options.stats ? 65 : 35
    
    if (imgHeight > pageHeight - startY) {
      pdf.addImage(imgData, 'PNG', 0, startY, imgWidth, imgHeight)
    } else {
      pdf.addImage(imgData, 'PNG', 0, startY, imgWidth, imgHeight)
    }
    
    // Add footer
    pdf.setFontSize(8)
    pdf.setTextColor(160, 174, 192)
    pdf.text(
      `Generated on ${format(new Date(), 'MMMM d, yyyy')} by Pulse`,
      15,
      pageHeight - 10
    )
    
    const filename = options.filename || `pulse-analytics-${format(new Date(), 'yyyy-MM-dd')}.pdf`
    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}
