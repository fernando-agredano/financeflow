'use client'

import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getCategoryById, formatCurrency } from '@/lib/finance'

const PIE_COLORS = ['#1B3A6B', '#059669', '#2563EB', '#D97706', '#7C3AED', '#0EA5E9', '#F43F5E']

interface CategoryPieChartProps {
  byCategory: Record<string, number> | undefined
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <Box sx={{ background: '#FEFCF8', border: '0.5px solid #DDD8CE', borderRadius: '10px', p: 1.25 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#1C1917' }}>{name}</Typography>
      <Typography sx={{ fontSize: 12, color: '#6B6560' }}>{formatCurrency(value)}</Typography>
    </Box>
  )
}

export function CategoryPieChart({ byCategory }: CategoryPieChartProps) {
  if (!byCategory) return <Skeleton variant="circular" width={140} height={140} />

  const data = Object.entries(byCategory)
    .map(([id, value]) => ({ name: getCategoryById(id)?.name ?? id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', minWidth: 0 }}>
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie data={data} innerRadius={44} outerRadius={64} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
            {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.6, minWidth: 0 }}>
        {data.map((d, i) => (
          <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, flex: 1, minWidth: 0 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, color: '#6B6560', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</Typography>
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: '#1C1917', minWidth: 32, textAlign: 'right', flexShrink: 0 }}>
              {total > 0 ? `${Math.round((d.value / total) * 100)}%` : '0%'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
