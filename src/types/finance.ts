export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: TransactionType
  icon: string
  color: string
}

export interface Transaction {
  id?: number
  type: TransactionType
  amount: number
  categoryId: string
  description: string
  date: string
  notes?: string
  createdAt: string
}

export interface Budget {
  id?: number
  categoryId: string
  limit: number
  month: string // YYYY-MM
}

export interface MonthStats {
  income: number
  expense: number
  balance: number
  savingsRate: number
  byCategory: Record<string, number>
  byMonth: { month: string; income: number; expense: number }[]
}

export interface FilterState {
  type: TransactionType | 'all'
  categoryId: string | null
  dateFrom: string | null
  dateTo: string | null
  search: string
}
