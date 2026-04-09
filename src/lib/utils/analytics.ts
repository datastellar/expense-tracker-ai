import type { Transaction, ExpenseCategory } from '@/types'
import { startOfMonth, endOfMonth, format, parseISO, subMonths } from 'date-fns'

export function calculateSummary(transactions: Transaction[]) {
  const now = new Date()
  const monthStart = startOfMonth(now).toISOString().split('T')[0]
  const monthEnd = endOfMonth(now).toISOString().split('T')[0]

  const expenses = transactions.filter((t) => t.type === 'debit' && !t.is_transfer)

  const totalSpending = expenses.reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlyExpenses = expenses.filter(
    (t) => t.date >= monthStart && t.date <= monthEnd
  )
  const monthlySpending = monthlyExpenses.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  )

  const categoryBreakdown: Partial<Record<ExpenseCategory, number>> = {}
  for (const t of expenses) {
    const cat = t.category as ExpenseCategory
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + Number(t.amount)
  }

  const topCategories = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  return {
    totalSpending,
    monthlySpending,
    expenseCount: expenses.length,
    monthlyCount: monthlyExpenses.length,
    topCategories,
    categoryBreakdown,
  }
}

export function getMonthlyTrend(transactions: Transaction[], months = 6) {
  const now = new Date()
  const expenses = transactions.filter((t) => t.type === 'debit' && !t.is_transfer)

  return Array.from({ length: months }, (_, i) => {
    const month = subMonths(now, months - 1 - i)
    const monthStart = startOfMonth(month).toISOString().split('T')[0]
    const monthEnd = endOfMonth(month).toISOString().split('T')[0]

    const monthExpenses = expenses.filter(
      (t) => t.date >= monthStart && t.date <= monthEnd
    )
    const total = monthExpenses.reduce((sum, t) => sum + Number(t.amount), 0)

    return {
      month: format(month, 'MMM yyyy'),
      total,
      count: monthExpenses.length,
    }
  })
}
