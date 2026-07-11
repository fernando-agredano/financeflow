'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { getCurrentMonth } from '@/lib/finance'

interface MonthContextValue {
  month: string
  setMonth: (month: string) => void
}

const MonthContext = createContext<MonthContextValue | null>(null)

export function MonthProvider({ children }: { children: ReactNode }) {
  const [month, setMonth] = useState(getCurrentMonth)
  return <MonthContext.Provider value={{ month, setMonth }}>{children}</MonthContext.Provider>
}

export function useMonth() {
  const ctx = useContext(MonthContext)
  if (!ctx) throw new Error('useMonth must be used within MonthProvider')
  return ctx
}
