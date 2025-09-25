import { Expense, ExpenseSummary, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types'
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

export const calculateExpenseSummary = (expenses: Expense[]): ExpenseSummary => {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd })
  })

  const monthlySpending = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const categoryBreakdown = EXPENSE_CATEGORIES.reduce((acc, category) => {
    acc[category] = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
    return acc
  }, {} as Record<ExpenseCategory, number>)

  const topCategories = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategories
  }
}

export const getMonthlyTrend = (expenses: Expense[], months: number = 6) => {
  const now = new Date()
  const trends = []

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd })
    })

    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    trends.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      total,
      count: monthlyExpenses.length
    })
  }

  return trends
}

export const getCategoryTrend = (expenses: Expense[], category: ExpenseCategory, months: number = 6) => {
  const now = new Date()
  const trends = []

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)

    const categoryExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expense.category === category &&
             isWithinInterval(expenseDate, { start: monthStart, end: monthEnd })
    })

    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    trends.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      total,
      count: categoryExpenses.length
    })
  }

  return trends
}