'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { formatCurrency, getCategoryById } from '@/lib/finance'
import type { Budget } from '@/types/finance'

interface BudgetProgressProps {
  budgets: Budget[] | undefined
  byCategory: Record<string, number> | undefined
}

export function BudgetProgress({ budgets, byCategory }: BudgetProgressProps) {
  return (
    <Card elevation={0} sx={{ flex: 1, minHeight: 190, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: '16px !important', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', mb: 1.5, flexShrink: 0 }}>Presupuestos del mes</Typography>

        {!budgets || !byCategory
          ? <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Box key={i}>
                  <Skeleton variant="text" width="60%" sx={{ fontSize: 12, mb: 0.5 }} />
                  <Skeleton variant="rounded" height={6} sx={{ borderRadius: 99 }} />
                </Box>
              ))}
            </Box>
          : budgets.length === 0
          ? <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontSize: 12, color: '#9C9589', textAlign: 'center' }}>
                Sin presupuestos este mes
              </Typography>
            </Box>
          : <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: budgets.length > 1 ? 'space-between' : 'center' }}>
              {budgets.map((budget) => {
                const spent = byCategory[budget.categoryId] ?? 0
                const pct = Math.min((spent / budget.limit) * 100, 100)
                const over = spent > budget.limit
                const cat = getCategoryById(budget.categoryId)
                const barColor = over ? '#8B2020' : pct > 80 ? '#D97706' : '#059669'

                return (
                  <Box key={budget.id ?? budget.categoryId}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#1C1917' }}>{cat?.name ?? budget.categoryId}</Typography>
                        {over && (
                          <Tooltip title="Presupuesto excedido" arrow>
                            <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: '#8B2020' }} />
                          </Tooltip>
                        )}
                      </Box>
                      <Typography sx={{ fontSize: 11, color: over ? '#8B2020' : '#9C9589', fontWeight: over ? 600 : 400 }}>
                        {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{ '& .MuiLinearProgress-bar': { background: barColor } }}
                    />
                  </Box>
                )
              })}
            </Box>
        }
      </CardContent>
    </Card>
  )
}
