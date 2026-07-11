'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

type ToastSeverity = 'success' | 'error' | 'info'

interface ToastOptions {
  message: string
  description?: string
  severity?: ToastSeverity
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastOptions & { id: number }) | null>(null)

  const showToast = useCallback((options: ToastOptions) => {
    setToast((prev) => ({ ...options, id: (prev?.id ?? 0) + 1 }))
  }, [])

  const handleClose = useCallback(() => setToast(null), [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        key={toast?.id}
        open={!!toast}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {toast ? (
          <Alert onClose={handleClose} severity={toast.severity ?? 'success'} variant="filled" sx={{ minWidth: 280 }}>
            <AlertTitle sx={{ mb: toast.description ? 0.25 : 0 }}>{toast.message}</AlertTitle>
            {toast.description}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
