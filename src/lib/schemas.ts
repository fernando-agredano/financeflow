import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce
    .number()
    .positive('El monto debe ser mayor a 0')
    .max(9_999_999, 'Monto demasiado grande'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  description: z
    .string()
    .min(2, 'La descripción debe tener al menos 2 caracteres')
    .max(120, 'Máximo 120 caracteres'),
  date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().max(300, 'Máximo 300 caracteres').optional(),
})

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  limit: z.coerce
    .number()
    .positive('El límite debe ser mayor a 0'),
  month: z.string().min(1, 'El mes es requerido'),
})

export type TransactionInput = z.infer<typeof transactionSchema>
export type BudgetInput = z.infer<typeof budgetSchema>
