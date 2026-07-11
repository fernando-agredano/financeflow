'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getCategoriesByType, getCategoryById, formatCurrency, formatDate } from '@/lib/finance'
import { transactionSchema, type TransactionInput } from '@/lib/schemas'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useToast } from '@/hooks/useToast'

import { txActions } from '@/hooks/useFinance'
import { useState } from 'react'

interface TransactionFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const [txType, setTxType] = useState<'income' | 'expense'>('expense')
  const [pending, setPending] = useState<TransactionInput | null>(null)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const { control, handleSubmit, register, formState: { errors, isSubmitting }, reset, setValue } = useForm<any>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      amount: '' as any,
      categoryId: '',
      description: '',
      notes: '',
    },
  })

  const categories = getCategoriesByType(txType)

  function onSubmit(data: TransactionInput) {
    setPending({ ...data, type: txType })
  }

  async function handleConfirmSave() {
    if (!pending) return
    setSaving(true)
    await txActions.add({
      ...pending,
      createdAt: new Date().toISOString(),
    })
    setSaving(false)
    setPending(null)
    reset()

    const cat = getCategoryById(pending.categoryId)
    const isIncome = pending.type === 'income'
    showToast({
      severity: 'success',
      message: isIncome ? 'Ingreso agregado' : 'Gasto agregado',
      description: `${pending.description} — ${isIncome ? '+' : '-'}${formatCurrency(pending.amount)} · ${cat?.name ?? pending.categoryId}`,
    })
    onSuccess()
  }

  const pendingCategory = pending ? getCategoryById(pending.categoryId) : undefined
  const pendingIsIncome = pending?.type === 'income'

  return (
    <>
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Type toggle */}
      <Box>
        <Typography sx={{ fontSize: 12, color: '#9C9589', mb: 0.75 }}>Tipo de movimiento</Typography>
        <ToggleButtonGroup
          value={txType}
          exclusive
          onChange={(_, v) => { if (v) { setTxType(v); setValue('type', v); setValue('categoryId', '') } }}
          fullWidth
        >
          <ToggleButton value="income" sx={{ flex: 1, gap: 0.75 }}>
            <TrendingUpIcon sx={{ fontSize: 17 }} />
            Ingreso
          </ToggleButton>
          <ToggleButton value="expense" sx={{ flex: 1, gap: 0.75 }}>
            <TrendingDownIcon sx={{ fontSize: 17 }} />
            Gasto
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Amount */}
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Monto"
            type="number"
            size="small"
            error={!!errors.amount}
            helperText={errors.amount?.message as string}
            slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } } as any}
          />
        )}
      />

      {/* Category */}
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <FormControl size="small" error={!!errors.categoryId}>
            <InputLabel>Categoría</InputLabel>
            <Select {...field} label="Categoría">
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
            {errors.categoryId && <FormHelperText>{errors.categoryId.message as string}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* Description */}
      <TextField
        {...register('description')}
        label="Descripción"
        size="small"
        error={!!errors.description}
        helperText={errors.description?.message as string}
      />

      {/* Date */}
      <TextField
        {...register('date')}
        label="Fecha"
        type="date"
        size="small"
        error={!!errors.date}
        helperText={errors.date?.message as string}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/* Notes */}
      <TextField
        {...register('notes')}
        label="Notas (opcional)"
        size="small"
        multiline
        rows={2}
      />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, pt: 0.5 }}>
        <Button variant="outlined" fullWidth onClick={onCancel}>Cancelar</Button>
        <Button variant="contained" fullWidth type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </Button>
      </Box>
    </Box>

    <ConfirmDialog
      open={!!pending}
      title="Confirmar movimiento"
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
              p: 1.75, borderRadius: '12px',
              background: pendingIsIncome ? '#E8F5EE' : '#FDEAEA',
              border: `0.5px solid ${pendingIsIncome ? '#1A6B4530' : '#8B202030'}`,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1C1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {pending.description}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#6B6560', mt: 0.25 }}>
                {pendingCategory?.name ?? pending.categoryId} · {formatDate(pending.date)}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: pendingIsIncome ? '#0F4A2D' : '#5E1515', whiteSpace: 'nowrap' }}>
              {pendingIsIncome ? '+' : '-'}{formatCurrency(pending.amount)}
            </Typography>
          </Box>
          {pending.notes && (
            <Typography sx={{ fontSize: 12, color: '#9C9589' }}>Notas: {pending.notes}</Typography>
          )}
        </Box>
      )}
    </ConfirmDialog>
    </>
  )
}
