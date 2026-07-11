'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BudgetProgress } from '@/components/dashboard/BudgetProgress'
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart'
import { CategoryPieChart } from '@/components/charts/CategoryPieChart'
import { useMonthStats, useTransactions, useBudgets } from '@/hooks/useFinance'
import { useMonth } from '@/hooks/useMonth'

export default function DashboardPage() {
  const { month } = useMonth()
  const stats = useMonthStats(month)
  const transactions = useTransactions(month)
  const budgets = useBudgets(month)

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, sm: 3 } }}>
      <SummaryCards stats={stats} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {/* Row 1 */}
        <Card elevation={0} sx={{ gridColumn: { xs: 'span 1', md: 'span 3' }, minWidth: 0 }}>
          <CardContent sx={{ p: '16px !important' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', mb: 1.5 }}>
              Ingresos vs Gastos — últimos 6 meses
            </Typography>
            <MonthlyBarChart data={stats?.byMonth} />
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ gridColumn: { xs: 'span 1', md: 'span 1' }, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ p: '16px !important', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', mb: 1.5 }}>
              Gastos por categoría
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <CategoryPieChart byCategory={stats?.byCategory} />
            </Box>
          </CardContent>
        </Card>

        {/* Row 2 */}
        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 3' }, minWidth: 0 }}>
          <RecentTransactions transactions={transactions} />
        </Box>

        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 1' }, minWidth: 0, display: 'flex' }}>
          <BudgetProgress budgets={budgets} byCategory={stats?.byCategory} />
        </Box>
      </Box>
    </Box>
  )
}
