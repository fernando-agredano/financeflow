'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import { formatCurrency } from '@/lib/finance'
import type { MonthStats } from '@/types/finance'

interface SummaryCardsProps {
  stats: MonthStats | null
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const tiles = [
    {
      label: 'Ingresos',
      value: stats ? formatCurrency(stats.income) : null,
      sub: stats ? '+12% vs mes anterior' : null,
      subColor: '#1A6B45',
      icon: <TrendingUpIcon sx={{ fontSize: 18, color: '#1A6B45' }} />,
      iconBg: '#E8F5EE',
    },
    {
      label: 'Gastos',
      value: stats ? formatCurrency(stats.expense) : null,
      sub: stats ? '+8% vs mes anterior' : null,
      subColor: '#8B2020',
      icon: <TrendingDownIcon sx={{ fontSize: 18, color: '#8B2020' }} />,
      iconBg: '#FDEAEA',
    },
    {
      label: 'Balance',
      value: stats ? formatCurrency(stats.balance) : null,
      sub: stats ? (stats.balance >= 0 ? 'Superávit del mes' : 'Déficit del mes') : null,
      subColor: stats && stats.balance >= 0 ? '#1A6B45' : '#8B2020',
      icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18, color: '#1B3A6B' }} />,
      iconBg: '#1B3A6B14',
    },
    {
      label: 'Tasa de ahorro',
      value: stats ? `${stats.savingsRate.toFixed(1)}%` : null,
      sub: stats ? (stats.savingsRate >= 30 ? 'Meta del 30% alcanzada ✓' : 'Meta: 30%') : null,
      subColor: stats && stats.savingsRate >= 30 ? '#1A6B45' : '#7A4F00',
      icon: <SavingsOutlinedIcon sx={{ fontSize: 18, color: '#7A4F00' }} />,
      iconBg: '#FFF3DC',
    },
  ]

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 1.25, sm: 2 }, mb: { xs: 2, sm: 2.5 } }}>
      {tiles.map((t) => (
        <Card key={t.label} elevation={0}>
          <CardContent sx={{ p: { xs: '12px !important', sm: '14px !important' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9C9589', letterSpacing: '.3px' }}>
                {t.label.toUpperCase()}
              </Typography>
              <Box sx={{ width: 32, height: 32, borderRadius: '9px', background: t.iconBg, display: { xs: 'none', sm: 'flex' }, alignItems: 'center', justifyContent: 'center' }}>
                {t.icon}
              </Box>
            </Box>
            {t.value
              ? <Typography sx={{ fontSize: { xs: 17, sm: 21 }, fontWeight: 500, color: '#1C1917', mb: 0.4 }}>{t.value}</Typography>
              : <Skeleton variant="text" width="70%" height={32} />
            }
            {t.sub
              ? <Typography sx={{ fontSize: 11, color: t.subColor }}>{t.sub}</Typography>
              : <Skeleton variant="text" width="50%" height={16} />
            }
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
