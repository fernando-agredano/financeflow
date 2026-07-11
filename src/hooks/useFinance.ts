'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { db } from '@/lib/db'
import { getPrevMonths, formatShortMonth } from '@/lib/finance'
import type { Transaction, Budget, MonthStats, FilterState } from '@/types/finance'

export function useTransactions(month?: string) {
  return useLiveQuery(async () => {
    if (!month) return db.transactions.orderBy('date').reverse().toArray()
    return db.transactions
      .where('date').startsWith(month)
      .reverse()
      .sortBy('date')
  }, [month])
}

export function useAllTransactions() {
  return useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray())
}

export function useFilteredTransactions(filters: FilterState) {
  const all = useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray())
  return useMemo(() => {
    if (!all) return []
    return (all ?? []).filter((t: import('@/types/finance').Transaction) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.categoryId && t.categoryId !== filters.categoryId) return false
      if (filters.dateFrom && t.date < filters.dateFrom) return false
      if (filters.dateTo && t.date > filters.dateTo) return false
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  }, [all, filters])
}

export function useBudgets(month: string) {
  return useLiveQuery(() => db.budgets.where('month').equals(month).toArray(), [month])
}

export function useMonthStats(month: string): MonthStats | null {
  const transactions = useLiveQuery(
    () => db.transactions.where('date').startsWith(month).toArray(),
    [month]
  )

  const prevMonths = useMemo(() => getPrevMonths(6), [])

  const prevTransactions = useLiveQuery(
    () => db.transactions.where('date').aboveOrEqual(prevMonths[0]).toArray(),
    [prevMonths]
  )

  return useMemo(() => {
    if (!transactions) return null

    const income = transactions.filter((t: import('@/types/finance').Transaction) => t.type === 'income').reduce((s: number, t: import('@/types/finance').Transaction) => s + t.amount, 0)
    const expense = transactions.filter((t: import('@/types/finance').Transaction) => t.type === 'expense').reduce((s: number, t: import('@/types/finance').Transaction) => s + t.amount, 0)
    const balance = income - expense
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0

    const byCategory: Record<string, number> = {}
    transactions.filter((t: import('@/types/finance').Transaction) => t.type === 'expense').forEach((t: import('@/types/finance').Transaction) => {
      byCategory[t.categoryId] = (byCategory[t.categoryId] ?? 0) + t.amount
    })

    const byMonth = prevMonths.map((m) => {
      const mTxs = prevTransactions?.filter((t: import('@/types/finance').Transaction) => t.date.startsWith(m)) ?? []
      return {
        month: formatShortMonth(m),
        income: mTxs.filter((t: import('@/types/finance').Transaction) => t.type === 'income').reduce((s: number, t: import('@/types/finance').Transaction) => s + t.amount, 0),
        expense: mTxs.filter((t: import('@/types/finance').Transaction) => t.type === 'expense').reduce((s: number, t: import('@/types/finance').Transaction) => s + t.amount, 0),
      }
    })

    return { income, expense, balance, savingsRate, byCategory, byMonth }
  }, [transactions, prevTransactions, prevMonths])
}

// CRUD operations
export const txActions = {
  add: (tx: Omit<Transaction, 'id'>) => db.transactions.add(tx as Transaction),
  update: (id: number, data: Partial<Transaction>) => db.transactions.update(id, data),
  delete: (id: number) => db.transactions.delete(id),
}

export const budgetActions = {
  upsert: async (budget: Omit<Budget, 'id'>) => {
    const existing = await db.budgets
      .where('categoryId').equals(budget.categoryId)
      .and((b) => b.month === budget.month)
      .first()
    if (existing?.id) return db.budgets.update(existing.id, budget)
    return db.budgets.add(budget as Budget)
  },
  delete: (id: number) => db.budgets.delete(id),
}
