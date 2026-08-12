import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Category, Transaction } from '@/types/finance'

export const CATEGORIES: Category[] = [
  { id: 'trabajo',        name: 'Trabajo',        type: 'income',  icon: 'Work',            color: '#059669' },
  { id: 'inversiones',    name: 'Inversiones',    type: 'income',  icon: 'TrendingUp',      color: '#2563EB' },
  { id: 'freelance',      name: 'Freelance',      type: 'income',  icon: 'Laptop',          color: '#0D9488' },
  { id: 'otros-ingresos', name: 'Otros ingresos', type: 'income',  icon: 'AddCircle',       color: '#16A34A' },
  { id: 'vivienda',       name: 'Vivienda',       type: 'expense', icon: 'Home',            color: '#1B3A6B' },
  { id: 'alimentacion',   name: 'Alimentación',   type: 'expense', icon: 'ShoppingCart',    color: '#D97706' },
  { id: 'transporte',     name: 'Transporte',     type: 'expense', icon: 'DirectionsCar',   color: '#0EA5E9' },
  { id: 'entretenimiento',name: 'Entretenimiento',type: 'expense', icon: 'Movie',           color: '#DC2626' },
  { id: 'salud',          name: 'Salud',          type: 'expense', icon: 'LocalHospital',   color: '#0369A1' },
  { id: 'educacion',      name: 'Educación',      type: 'expense', icon: 'School',          color: '#06B6D4' },
  { id: 'ropa',           name: 'Ropa',           type: 'expense', icon: 'Checkroom',       color: '#EA580C' },
  { id: 'otros-gastos',   name: 'Otros gastos',   type: 'expense', icon: 'MoreHoriz',       color: '#64748B' },
]

export const getCategoryById = (id: string) =>
  CATEGORIES.find((c) => c.id === id)

export const getCategoriesByType = (type: 'income' | 'expense') =>
  CATEGORIES.filter((c) => c.type === type)

// Formatters
export function formatCurrency(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
}

export function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number)
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
}

export function formatShortMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number)
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('es-MX', { month: 'short' })
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getPrevMonths(n: number): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return months
}

// CSV Export
export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['Fecha', 'Tipo', 'Descripción', 'Categoría', 'Monto', 'Notas']
  const rows = transactions.map((t) => {
    const cat = getCategoryById(t.categoryId)
    return [
      t.date,
      t.type === 'income' ? 'Ingreso' : 'Gasto',
      `"${t.description}"`,
      cat?.name ?? t.categoryId,
      t.type === 'income' ? t.amount : -t.amount,
      `"${t.notes ?? ''}"`,
    ].join(',')
  })
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `financeflow-${getCurrentMonth()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// --- PDF chart helpers (pure vector drawing, no external image conversion) ---

function drawMonthlyBarChart(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  monthly: { label: string; income: number; expense: number }[],
) {
  if (!monthly.length) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor('#9C9589')
    doc.text('Sin datos suficientes', x + w / 2, y + h / 2, { align: 'center' })
    return
  }
  const padBottom = 14
  const chartH = h - padBottom
  const maxVal = Math.max(1, ...monthly.flatMap((m) => [m.income, m.expense]))
  const slot = w / monthly.length
  const barWidth = Math.min(13, slot * 0.3)

  doc.setDrawColor('#DDD8CE'); doc.setLineWidth(0.6)
  doc.line(x, y + chartH, x + w, y + chartH)

  monthly.forEach((m, i) => {
    const cx = x + i * slot + slot / 2
    const incomeH = (m.income / maxVal) * (chartH - 6)
    const expenseH = (m.expense / maxVal) * (chartH - 6)
    doc.setFillColor('#1A6B45')
    doc.rect(cx - barWidth - 1.5, y + chartH - incomeH, barWidth, incomeH, 'F')
    doc.setFillColor('#8B2020')
    doc.rect(cx + 1.5, y + chartH - expenseH, barWidth, expenseH, 'F')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor('#9C9589')
    doc.text(m.label, cx, y + chartH + 10, { align: 'center' })
  })
}

function drawCategoryBarChart(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  categories: { name: string; value: number; color: string }[],
) {
  if (!categories.length) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor('#9C9589')
    doc.text('Sin gastos en este periodo', x + w / 2, y + h / 2, { align: 'center' })
    return
  }
  const rowH = Math.min(22, h / categories.length)
  const labelW = 84
  const valueW = 62
  const barMaxW = Math.max(20, w - labelW - valueW)
  const maxVal = Math.max(1, ...categories.map((c) => c.value))

  categories.forEach((c, i) => {
    const rowY = y + i * rowH + rowH / 2
    const label = c.name.length > 15 ? `${c.name.slice(0, 14)}…` : c.name
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor('#1C1917')
    doc.text(label, x, rowY + 3)

    const barW = Math.max(3, (c.value / maxVal) * barMaxW)
    doc.setFillColor('#F0EBE0')
    doc.roundedRect(x + labelW, rowY - 4.5, barMaxW, 9, 2, 2, 'F')
    doc.setFillColor(c.color)
    doc.roundedRect(x + labelW, rowY - 4.5, barW, 9, 2, 2, 'F')

    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor('#1C1917')
    doc.text(formatCurrency(c.value), x + labelW + barMaxW + 6, rowY + 3, { align: 'left' })
  })
}

// PDF Export — formal statement/invoice-style layout with summary charts
export function exportToPDF(transactions: Transaction[], title = 'Movimientos'): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 40
  const contentW = pageWidth - margin * 2

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const now = new Date()
  const refCode = `FF-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  const emittedAt = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

  const dates = transactions.map((t) => t.date).sort()
  const period = dates.length
    ? `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
    : 'Sin movimientos'

  // ---- Masthead ----
  doc.setFillColor('#1B3A6B')
  doc.roundedRect(margin, 40, 28, 28, 6, 6, 'F')
  doc.setTextColor('#FEFCF8'); doc.setFont('helvetica', 'bold'); doc.setFontSize(14)
  doc.text('F', margin + 14, 40 + 19, { align: 'center' })

  doc.setTextColor('#1B3A6B'); doc.setFont('helvetica', 'bold'); doc.setFontSize(15)
  doc.text('FinanceFlow', margin + 38, 40 + 12)
  doc.setTextColor('#6B6560'); doc.setFont('helvetica', 'normal'); doc.setFontSize(9)
  doc.text(`Reporte de ${title.toLowerCase()}`, margin + 38, 40 + 25)

  doc.setTextColor('#9C9589'); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5)
  doc.text('REPORTE N.º', pageWidth - margin, 40 + 9, { align: 'right' })
  doc.setTextColor('#1B3A6B'); doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text(refCode, pageWidth - margin, 40 + 21, { align: 'right' })
  doc.setTextColor('#9C9589'); doc.setFont('helvetica', 'normal'); doc.setFontSize(8)
  doc.text(`Emitido: ${emittedAt}`, pageWidth - margin, 40 + 33, { align: 'right' })

  doc.setDrawColor('#1B3A6B'); doc.setLineWidth(1.2)
  doc.line(margin, 40 + 46, pageWidth - margin, 40 + 46)

  // ---- Meta info row (period / count / balance) ----
  const metaY = 40 + 46 + 18
  const metaColW = contentW / 3
  const metaCols = [
    { label: 'PERIODO', value: period },
    { label: 'MOVIMIENTOS', value: `${transactions.length}` },
    { label: 'SALDO NETO', value: formatCurrency(balance) },
  ]
  metaCols.forEach((col, i) => {
    const x = margin + i * metaColW
    doc.setTextColor('#9C9589'); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5)
    doc.text(col.label, x, metaY)
    doc.setTextColor('#1C1917'); doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5)
    doc.text(col.value, x, metaY + 14)
  })
  doc.setDrawColor('#DDD8CE'); doc.setLineWidth(0.5)
  doc.line(margin, metaY + 24, pageWidth - margin, metaY + 24)

  // ---- Summary strip (bordered, statement-style) ----
  const summaryY = metaY + 40
  const summaryH = 40
  doc.setDrawColor('#DDD8CE'); doc.setLineWidth(0.75)
  doc.rect(margin, summaryY, contentW, summaryH)
  const summaryCols = [
    { label: 'INGRESOS', value: formatCurrency(income), color: '#0F4A2D' },
    { label: 'GASTOS', value: formatCurrency(expense), color: '#5E1515' },
    { label: 'BALANCE', value: formatCurrency(balance), color: balance >= 0 ? '#0F4A2D' : '#5E1515' },
  ]
  summaryCols.forEach((c, i) => {
    const x = margin + i * metaColW
    if (i > 0) doc.line(x, summaryY, x, summaryY + summaryH)
    doc.setTextColor('#6B6560'); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5)
    doc.text(c.label, x + 14, summaryY + 15)
    doc.setTextColor(c.color); doc.setFont('helvetica', 'bold'); doc.setFontSize(13)
    doc.text(c.value, x + 14, summaryY + 31)
  })

  // ---- Charts row ----
  const chartsY = summaryY + summaryH + 22
  const chartH = 150
  const chartGap = 16
  const chartW = (contentW - chartGap) / 2

  // Monthly trend
  doc.setDrawColor('#DDD8CE'); doc.setLineWidth(0.75)
  doc.rect(margin, chartsY, chartW, chartH)
  doc.setTextColor('#1B3A6B'); doc.setFont('helvetica', 'bold'); doc.setFontSize(9)
  doc.text('Ingresos vs Gastos (por mes)', margin + 12, chartsY + 16)
  doc.setFillColor('#1A6B45'); doc.rect(margin + chartW - 90, chartsY + 11, 6, 6, 'F')
  doc.setTextColor('#6B6560'); doc.setFont('helvetica', 'normal'); doc.setFontSize(7)
  doc.text('Ingresos', margin + chartW - 82, chartsY + 16.5)
  doc.setFillColor('#8B2020'); doc.rect(margin + chartW - 40, chartsY + 11, 6, 6, 'F')
  doc.text('Gastos', margin + chartW - 32, chartsY + 16.5)

  const monthMap = new Map<string, { income: number; expense: number }>()
  transactions.forEach((t) => {
    const key = t.date.slice(0, 7)
    const entry = monthMap.get(key) ?? { income: 0, expense: 0 }
    if (t.type === 'income') entry.income += t.amount
    else entry.expense += t.amount
    monthMap.set(key, entry)
  })
  const monthly = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, v]) => ({ label: formatShortMonth(key), ...v }))
  drawMonthlyBarChart(doc, margin + 12, chartsY + 28, chartW - 24, chartH - 40, monthly)

  // Top categories
  const catX = margin + chartW + chartGap
  doc.setDrawColor('#DDD8CE'); doc.setLineWidth(0.75)
  doc.rect(catX, chartsY, chartW, chartH)
  doc.setTextColor('#1B3A6B'); doc.setFont('helvetica', 'bold'); doc.setFontSize(9)
  doc.text('Top categorías de gasto', catX + 12, chartsY + 16)

  const catMap = new Map<string, number>()
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    catMap.set(t.categoryId, (catMap.get(t.categoryId) ?? 0) + t.amount)
  })
  const topCategories = Array.from(catMap.entries())
    .map(([id, value]) => {
      const cat = getCategoryById(id)
      return { name: cat?.name ?? id, value, color: cat?.color ?? '#1B3A6B' }
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
  drawCategoryBarChart(doc, catX + 12, chartsY + 30, chartW - 24, chartH - 42, topCategories)

  // ---- Detail table ----
  const tableTitleY = chartsY + chartH + 24
  doc.setTextColor('#1B3A6B'); doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
  doc.text('Detalle de movimientos', margin, tableTitleY)

  const rows = transactions.map((t) => {
    const cat = getCategoryById(t.categoryId)
    const isIncome = t.type === 'income'
    return [
      formatDate(t.date),
      t.description,
      cat?.name ?? t.categoryId,
      isIncome ? 'Ingreso' : 'Gasto',
      `${isIncome ? '+' : '-'}${formatCurrency(t.amount)}`,
    ]
  })

  autoTable(doc, {
    startY: tableTitleY + 12,
    margin: { left: margin, right: margin, top: 40, bottom: 50 },
    head: [['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto']],
    body: rows,
    styles: { font: 'helvetica', fontSize: 9, textColor: '#1C1917', cellPadding: 7, lineColor: '#DDD8CE', lineWidth: 0.5 },
    headStyles: { fillColor: '#1B3A6B', textColor: '#FEFCF8', fontStyle: 'bold', fontSize: 9 },
    alternateRowStyles: { fillColor: '#F8F4EC' },
    columnStyles: { 4: { halign: 'right' } },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const isIncome = rows[data.row.index][3] === 'Ingreso'
        data.cell.styles.textColor = isIncome ? '#1A6B45' : '#8B2020'
        data.cell.styles.fontStyle = 'bold'
      }
    },
  })

  // ---- Totals block (invoice-style grand total) ----
  const afterTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 18
  const totalsW = 220
  const totalsX = pageWidth - margin - totalsW
  const totalsRowH = 18
  let totalsY = afterTableY

  if (totalsY + totalsRowH * 3 + 16 > pageHeight - 60) {
    doc.addPage()
    totalsY = 40
  }

  doc.setDrawColor('#DDD8CE'); doc.setLineWidth(0.75)
  doc.rect(totalsX, totalsY, totalsW, totalsRowH * 3 + 10)

  const totalsRows = [
    { label: 'Total ingresos', value: formatCurrency(income), color: '#0F4A2D', bold: false },
    { label: 'Total gastos', value: formatCurrency(expense), color: '#5E1515', bold: false },
    { label: 'Balance', value: formatCurrency(balance), color: balance >= 0 ? '#0F4A2D' : '#5E1515', bold: true },
  ]
  totalsRows.forEach((r, i) => {
    const rowY = totalsY + 14 + i * totalsRowH + (i === 2 ? 6 : 0)
    if (i === 2) {
      doc.setDrawColor('#1C1917'); doc.setLineWidth(0.75)
      doc.line(totalsX + 10, rowY - 12, totalsX + totalsW - 10, rowY - 12)
    }
    doc.setTextColor('#6B6560'); doc.setFont('helvetica', r.bold ? 'bold' : 'normal'); doc.setFontSize(r.bold ? 10 : 9)
    doc.text(r.label, totalsX + 12, rowY)
    doc.setTextColor(r.color); doc.setFont('helvetica', 'bold'); doc.setFontSize(r.bold ? 12 : 10)
    doc.text(r.value, totalsX + totalsW - 12, rowY, { align: 'right' })
  })

  // ---- Footer with page numbers, drawn once the full page count is known ----
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor('#DDD8CE'); doc.setLineWidth(0.5)
    doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor('#9C9589')
    doc.text('Documento generado automáticamente por FinanceFlow', margin, pageHeight - 18)
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 18, { align: 'right' })
  }

  doc.save(`financeflow-${getCurrentMonth()}.pdf`)
}

// Zod schemas (re-exported for convenience)
export { transactionSchema, budgetSchema } from './schemas'
