'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Transaction } from '@/types'

interface FetchOptions {
  category?: string
  bankAccountId?: string
  startDate?: string
  endDate?: string
  search?: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async (options?: FetchOptions) => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category)
    }
    if (options?.bankAccountId) {
      query = query.eq('bank_account_id', options.bankAccountId)
    }
    if (options?.startDate) {
      query = query.gte('date', options.startDate)
    }
    if (options?.endDate) {
      query = query.lte('date', options.endDate)
    }
    if (options?.search) {
      query = query.ilike('description', `%${options.search}%`)
    }

    const { data } = await query
    setTransactions(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...tx, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setTransactions((prev) => [data, ...prev])
    }
    return { data, error }
  }

  const addTransactionsBatch = async (
    txs: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]
  ) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const rows = txs.map((tx) => ({ ...tx, user_id: user.id }))
    const { data, error } = await supabase
      .from('transactions')
      .insert(rows)
      .select()

    if (!error && data) {
      setTransactions((prev) => [...data, ...prev])
    }
    return { data, error }
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? data : t))
      )
    }
    return { data, error }
  }

  const deleteTransaction = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    }
    return { error }
  }

  return {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    addTransactionsBatch,
    updateTransaction,
    deleteTransaction,
  }
}
