'use client'

import { useState, useEffect } from 'react'
import { Expense } from '@/types'
import { StorageUtils } from '@/utils'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true)
        const loadedExpenses = StorageUtils.getExpenses()
        setExpenses(loadedExpenses)
        setError(null)
      } catch (err) {
        setError('Failed to load expenses')
        console.error('Error loading expenses:', err)
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [])

  const addExpense = async (expense: Expense): Promise<void> => {
    try {
      const updatedExpenses = StorageUtils.addExpense(expense)
      setExpenses(updatedExpenses)
      setError(null)
    } catch (err) {
      setError('Failed to add expense')
      console.error('Error adding expense:', err)
      throw err
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>): Promise<void> => {
    try {
      const updatedExpenses = StorageUtils.updateExpense(id, updates)
      setExpenses(updatedExpenses)
      setError(null)
    } catch (err) {
      setError('Failed to update expense')
      console.error('Error updating expense:', err)
      throw err
    }
  }

  const deleteExpense = async (id: string): Promise<void> => {
    try {
      const updatedExpenses = StorageUtils.deleteExpense(id)
      setExpenses(updatedExpenses)
      setError(null)
    } catch (err) {
      setError('Failed to delete expense')
      console.error('Error deleting expense:', err)
      throw err
    }
  }

  const clearAllExpenses = async (): Promise<void> => {
    try {
      StorageUtils.clearAllExpenses()
      setExpenses([])
      setError(null)
    } catch (err) {
      setError('Failed to clear expenses')
      console.error('Error clearing expenses:', err)
      throw err
    }
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllExpenses
  }
}