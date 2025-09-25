import { Expense } from '@/types'

const STORAGE_KEY = 'expense-tracker-data'

export const StorageUtils = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return []

    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  addExpense: (expense: Expense): Expense[] => {
    const expenses = StorageUtils.getExpenses()
    const updatedExpenses = [...expenses, expense]
    StorageUtils.saveExpenses(updatedExpenses)
    return updatedExpenses
  },

  updateExpense: (id: string, updatedExpense: Partial<Expense>): Expense[] => {
    const expenses = StorageUtils.getExpenses()
    const expenseIndex = expenses.findIndex(expense => expense.id === id)

    if (expenseIndex === -1) {
      throw new Error('Expense not found')
    }

    const updated = {
      ...expenses[expenseIndex],
      ...updatedExpense,
      updatedAt: new Date().toISOString()
    }

    expenses[expenseIndex] = updated
    StorageUtils.saveExpenses(expenses)
    return expenses
  },

  deleteExpense: (id: string): Expense[] => {
    const expenses = StorageUtils.getExpenses()
    const filteredExpenses = expenses.filter(expense => expense.id !== id)
    StorageUtils.saveExpenses(filteredExpenses)
    return filteredExpenses
  },

  clearAllExpenses: (): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}