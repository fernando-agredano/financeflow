'use client'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open, title, children,
  confirmLabel = 'Confirmar', cancelLabel = 'Cancelar',
  loading = false, onConfirm, onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 16, fontWeight: 600, color: '#1C1917' }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: '4px !important' }}>{children}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" fullWidth disabled={loading} onClick={onCancel}>{cancelLabel}</Button>
        <Button variant="contained" fullWidth disabled={loading} onClick={onConfirm}>
          {loading ? 'Guardando…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
