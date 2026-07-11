'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import { useMonthStats, useAllTransactions } from '@/hooks/useFinance'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import { CategoryPieChart } from '@/components/charts/CategoryPieChart'
import { formatCurrency, CATEGORIES } from '@/lib/finance'
import { useMonth } from '@/hooks/useMonth'
import { useMemo } from 'react'
import LinearProgress from '@mui/material/LinearProgress'

export default function ReportsPage() {
  const { month } = useMonth()
  const stats = useMonthStats(month)
  const allTransactions = useAllTransactions()

  const topExpenses = useMemo(() => {
    if (!stats?.byCategory) return []
    return Object.entries(stats.byCategory)
      .map(([id, amount]) => ({ id, amount, name: CATEGORIES.find((c) => c.id === id)?.name ?? id }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [stats])

  const totalExpense = topExpenses.reduce((s, e) => s + e.amount, 0)

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1.5, sm: 2.5 } }}>
        <BarChartOutlinedIcon sx={{ color: '#1B3A6B' }} />
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#1C1917' }}>Reportes</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
        <Card elevation={0}>
          <CardContent sx={{ p: { xs: '14px !important', sm: '16px !important' } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', mb: 1.5 }}>Tendencia 6 meses</Typography>
            <MonthlyBarChart data={stats?.byMonth} />
          </CardContent>
        </Card>
        <Card elevation={0}>
          <CardContent sx={{ p: { xs: '14px !important', sm: '16px !important' } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', mb: 1.5 }}>Distribución de gastos</Typography>
            <CategoryPieChart byCategory={stats?.byCategory} />
          </CardContent>
        </Card>
      </Box>

      <Card elevation={0}>
        <CardContent sx={{ p: { xs: '14px !important', sm: '16px !important' } }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', mb: 1.5 }}>Top 5 categorías de gasto</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {topExpenses.map((e, i) => {
              const pct = totalExpense > 0 ? (e.amount / totalExpense) * 100 : 0
              const colors = ['#1B3A6B', '#2952A3', '#C9B99A', '#E8C97A', '#BDB5A8']
              return (
                <Box key={e.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: colors[i], flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 12, color: '#9C9589' }}>{pct.toFixed(1)}%</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#8B2020' }}>{formatCurrency(e.amount)}</Typography>
                    </Box>
                  </Box>
                  <LinearProgress variant="determinate" value={pct}
                    sx={{ '& .MuiLinearProgress-bar': { background: colors[i] } }} />
                </Box>
              )
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
