'use client'

import { useState, useEffect } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { useBankAccounts } from '@/hooks/useBankAccounts'
import TransactionList from '@/components/transactions/TransactionList'
import TransactionFilters from '@/components/transactions/TransactionFilters'
import TransactionForm from '@/components/transactions/TransactionForm'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Transaction, TransactionFormData } from '@/types'
import { Plus } from 'lucide-react'

export default function TransactionsPage() {
  const {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions()
  const { accounts } = useBankAccounts()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [bankAccountId, setBankAccountId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchTransactions({
      category: category !== 'all' ? category : undefined,
      bankAccountId: bankAccountId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      search: search || undefined,
    })
  }, [category, bankAccountId, startDate, endDate, search, fetchTransactions])

  const handleAdd = async (data: TransactionFormData) => {
    setFormLoading(true)
    await addTransaction({
      type: data.type,
      amount: Number(data.amount),
      category: data.category,
      description: data.description,
      date: data.date,
      notes: data.notes || null,
      bank_account_id: data.bank_account_id || null,
      is_transfer: false,
      categorized_by: 'manual',
      import_batch_id: null,
    })
    setFormLoading(false)
    setShowForm(false)
  }

  const handleEdit = async (data: TransactionFormData) => {
    if (!editingTransaction) return
    setFormLoading(true)
    await updateTransaction(editingTransaction.id, {
      type: data.type,
      amount: Number(data.amount),
      category: data.category,
      description: data.description,
      date: data.date,
      notes: data.notes || null,
      bank_account_id: data.bank_account_id || null,
    })
    setFormLoading(false)
    setEditingTransaction(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Hapus transaksi ini?')) {
      await deleteTransaction(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transaksi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        bankAccountId={bankAccountId}
        onBankAccountChange={setBankAccountId}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        accounts={accounts}
      />

      <div className="card p-0">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={32} />
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Add modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Tambah Transaksi"
      >
        <TransactionForm
          accounts={accounts}
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaksi"
      >
        {editingTransaction && (
          <TransactionForm
            defaultValues={{
              amount: String(editingTransaction.amount),
              category: editingTransaction.category as any,
              type: editingTransaction.type,
              description: editingTransaction.description,
              date: editingTransaction.date,
              notes: editingTransaction.notes || '',
              bank_account_id: editingTransaction.bank_account_id || '',
            }}
            accounts={accounts}
            onSubmit={handleEdit}
            onCancel={() => setEditingTransaction(null)}
            loading={formLoading}
            isEdit
          />
        )}
      </Modal>
    </div>
  )
}
