'use client'

import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/finance'

interface MonthlyBarChartProps {
  data: { month: string; income: number; expense: number }[] | undefined
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ background: '#FEFCF8', border: '0.5px solid #DDD8CE', borderRadius: '10px', p: 1.5, boxShadow: '0 4px 12px rgba(28,25,23,.08)' }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#1C1917', mb: 0.75 }}>{label}</Typography>
      {payload.map((p: any) => (
        <Box key={p.dataKey} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '2px', background: p.fill }} />
          <Typography sx={{ fontSize: 12, color: '#6B6560' }}>{p.name}:</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#1C1917' }}>{formatCurrency(p.value)}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  if (!data) return <Skeleton variant="rounded" height={160} sx={{ borderRadius: '10px' }} />

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barGap={3} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D0" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9C9589' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#9C9589' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0EBE018' }} />
        <Legend
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: '#9C9589', paddingTop: 8 }}
          formatter={(v) => v === 'income' ? 'Ingresos' : 'Gastos'}
        />
        <Bar dataKey="income" name="income" fill="#059669" radius={[3, 3, 0, 0]} maxBarSize={24} />
        <Bar dataKey="expense" name="expense" fill="#2563EB" radius={[3, 3, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
