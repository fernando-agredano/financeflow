import Dexie, { type Table } from 'dexie'
import type { Transaction, Budget } from '@/types/finance'

class FinanceDB extends Dexie {
  transactions!: Table<Transaction, number>
  budgets!: Table<Budget, number>

  constructor() {
    super('financeflow-db')
    this.version(1).stores({
      transactions: '++id, date, type, categoryId, amount, createdAt',
      budgets: '++id, categoryId, month',
    })
  }
}

export const db = new FinanceDB()

// Seed with sample data on first load
export async function seedIfEmpty() {
  const count = await db.transactions.count()
  if (count > 0) return

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prevMonth = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`

  const transactions: Omit<Transaction, 'id'>[] = [
    { type: 'income',  amount: 45000, categoryId: 'trabajo',        description: 'Salario mensual',         date: `${currentMonth}-01`, createdAt: new Date().toISOString() },
    { type: 'income',  amount: 3500,  categoryId: 'inversiones',     description: 'Dividendos CETES',        date: `${currentMonth}-08`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 12000, categoryId: 'vivienda',        description: 'Renta departamento',      date: `${currentMonth}-05`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 1840,  categoryId: 'alimentacion',    description: 'Supermercado Chedraui',   date: `${currentMonth}-03`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 950,   categoryId: 'alimentacion',    description: 'Restaurante familiar',    date: `${currentMonth}-10`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 650,   categoryId: 'transporte',      description: 'Gasolina',                date: `${currentMonth}-07`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 199,   categoryId: 'entretenimiento', description: 'Streaming servicios',     date: `${currentMonth}-06`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 480,   categoryId: 'salud',           description: 'Farmacia',                date: `${currentMonth}-12`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 320,   categoryId: 'transporte',      description: 'Uber rides',              date: `${currentMonth}-09`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 2200,  categoryId: 'entretenimiento', description: 'Cena cumpleaños',         date: `${currentMonth}-14`, createdAt: new Date().toISOString() },
    { type: 'income',  amount: 42000, categoryId: 'trabajo',        description: 'Salario mensual',         date: `${prevMonth}-01`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 12000, categoryId: 'vivienda',        description: 'Renta departamento',      date: `${prevMonth}-05`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 7800,  categoryId: 'alimentacion',    description: 'Supermercado mes',        date: `${prevMonth}-03`, createdAt: new Date().toISOString() },
    { type: 'expense', amount: 3200,  categoryId: 'transporte',      description: 'Gasolina mes',            date: `${prevMonth}-07`, createdAt: new Date().toISOString() },
  ]

  await db.transactions.bulkAdd(transactions as Transaction[])

  const budgets: Omit<Budget, 'id'>[] = [
    { categoryId: 'alimentacion',    limit: 10000, month: currentMonth },
    { categoryId: 'transporte',      limit: 3500,  month: currentMonth },
    { categoryId: 'entretenimiento', limit: 2500,  month: currentMonth },
    { categoryId: 'salud',           limit: 5000,  month: currentMonth },
    { categoryId: 'vivienda',        limit: 14000, month: currentMonth },
  ]

  await db.budgets.bulkAdd(budgets as Budget[])
}
