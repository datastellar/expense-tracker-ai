'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { BankAccount } from '@/types'

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAccounts = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: true })
    setAccounts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const addAccount = async (account: {
    bank_name: string
    account_name: string
    account_number: string
  }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert({ ...account, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setAccounts((prev) => [...prev, data])
    }
    return { data, error }
  }

  const deleteAccount = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id)

    if (!error) {
      setAccounts((prev) => prev.filter((a) => a.id !== id))
    }
    return { error }
  }

  return { accounts, loading, addAccount, deleteAccount, refetch: fetchAccounts }
}
