'use client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/lib/theme'
import { useEffect } from 'react'
import { seedIfEmpty } from '@/lib/db'
import { MonthProvider } from '@/hooks/useMonth'
import { ToastProvider } from '@/hooks/useToast'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => { seedIfEmpty() }, [])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <MonthProvider>{children}</MonthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
