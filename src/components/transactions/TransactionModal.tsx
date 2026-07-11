'use client'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { TransactionForm } from './TransactionForm'

interface TransactionModalProps {
  open: boolean
  onClose: () => void
}

export function TransactionModal({ open, onClose }: TransactionModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0.5 }}>
        Nuevo movimiento
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: '12px !important' }}>
        <TransactionForm onSuccess={onClose} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
