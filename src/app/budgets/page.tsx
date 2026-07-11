'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { useState } from 'react'
import { useBudgets, useMonthStats, budgetActions } from '@/hooks/useFinance'
import { getCategoriesByType, formatCurrency, formatMonth } from '@/lib/finance'
import { useMonth } from '@/hooks/useMonth'
import { useToast } from '@/hooks/useToast'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import type { Budget } from '@/types/finance'

interface PendingBudget {
  categoryId: string
  limit: number
}

export default function BudgetsPage() {
  const { month } = useMonth()
  const budgets = useBudgets(month)
  const stats = useMonthStats(month)
  const [newCatId, setNewCatId] = useState('')
  const [newLimit, setNewLimit] = useState('')
  const [pending, setPending] = useState<PendingBudget | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const expenseCategories = getCategoriesByType('expense')
  const existingIds = budgets?.map((b) => b.categoryId) ?? []
  const availableCategories = expenseCategories.filter((c) => !existingIds.includes(c.id))
  const pendingCategory = pending ? expenseCategories.find((c) => c.id === pending.categoryId) : undefined

  function handleAdd() {
    const limit = parseFloat(newLimit)
    if (!newCatId || !limit || limit <= 0) return
    setPending({ categoryId: newCatId, limit })
  }

  async function handleConfirmSave() {
    if (!pending) return
    setSaving(true)
    await budgetActions.upsert({ categoryId: pending.categoryId, limit: pending.limit, month })
    setSaving(false)
    setPending(null)
    setNewCatId(''); setNewLimit('')

    showToast({
      severity: 'success',
      message: 'Presupuesto agregado',
      description: `${pendingCategory?.name ?? pending.categoryId} · ${formatCurrency(pending.limit)} mensual`,
    })
  }

  return (
    <>
    <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1.5, sm: 2.5 } }}>
        <TrackChangesOutlinedIcon sx={{ color: '#1B3A6B' }} />
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#1C1917' }}>Presupuestos</Typography>
      </Box>

      {/* Add budget */}
      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent sx={{ p: { xs: '14px !important', sm: '16px !important' } }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917', mb: 1.5 }}>Agregar presupuesto</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 }, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}>
              <InputLabel>Categoría</InputLabel>
              <Select label="Categoría" value={newCatId} onChange={(e) => setNewCatId(e.target.value)}>
                {availableCategories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              size="small" label="Límite mensual" type="number" value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
              sx={{ width: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}
            />
            <Button variant="contained" size="small" onClick={handleAdd} disabled={!newCatId || !newLimit} sx={{ height: 40, flex: { xs: '1 1 100%', sm: '0 1 auto' } }}>
              Agregar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Budget cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(280px, 1fr))' }, gap: 1.5 }}>
        {budgets?.map((budget: import('@/types/finance').Budget) => {
          const spent = stats?.byCategory[budget.categoryId] ?? 0
          const pct = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0
          const over = spent > budget.limit
          const nearly = pct > 80 && !over
          const cat = expenseCategories.find((c) => c.id === budget.categoryId)
          const barColor = over ? '#8B2020' : nearly ? '#7A4F00' : '#1B3A6B'

          return (
            <Card key={budget.id} elevation={0}>
              <CardContent sx={{ p: '16px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {over
                      ? <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: '#8B2020' }} />
                      : <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#1A6B45' }} />
                    }
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#1C1917' }}>{cat?.name}</Typography>
                  </Box>
                  <Button size="small" onClick={() => budget.id && budgetActions.delete(budget.id)}
                    sx={{ fontSize: 11, color: '#9C9589', minWidth: 0, p: '2px 8px' }}>
                    Eliminar
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: 12, color: '#9C9589' }}>Gastado</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: over ? '#8B2020' : '#1C1917' }}>
                    {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={pct} sx={{ mb: 0.75, '& .MuiLinearProgress-bar': { background: barColor } }} />
                <Typography sx={{ fontSize: 11, color: over ? '#8B2020' : nearly ? '#7A4F00' : '#9C9589' }}>
                  {over
                    ? `Excedido por ${formatCurrency(spent - budget.limit)}`
                    : `Disponible: ${formatCurrency(budget.limit - spent)} (${(100 - pct).toFixed(0)}%)`
                  }
                </Typography>
              </CardContent>
            </Card>
          )
        })}
        {budgets?.length === 0 && (
          <Box sx={{ gridColumn: '1/-1', py: 8, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 14, color: '#9C9589' }}>Sin presupuestos. Agrega uno arriba.</Typography>
          </Box>
        )}
      </Box>
    </Box>

    <ConfirmDialog
      open={!!pending}
      title="Confirmar presupuesto"
      loading={saving}
      onCancel={() => setPending(null)}
      onConfirm={handleConfirmSave}
    >
      {pending && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Typography sx={{ fontSize: 13, color: '#6B6560' }}>Revisa los datos antes de guardar:</Typography>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5,
              p: 1.75, borderRadius: '12px', background: '#EBF1FC', border: '0.5px solid #2952A330',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1C1917' }}>
                {pendingCategory?.name ?? pending.categoryId}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#6B6560', mt: 0.25 }}>
                {formatMonth(month)}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#1B3A6B', whiteSpace: 'nowrap' }}>
              {formatCurrency(pending.limit)}
            </Typography>
          </Box>
        </Box>
      )}
    </ConfirmDialog>
    </>
  )
}
