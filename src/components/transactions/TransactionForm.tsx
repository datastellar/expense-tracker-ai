'use client'

import { useForm } from 'react-hook-form'
import { EXPENSE_CATEGORIES, type ExpenseCategory, type TransactionFormData, type BankAccount } from '@/types'
import { Loader2 } from 'lucide-react'

interface TransactionFormProps {
  defaultValues?: Partial<TransactionFormData>
  accounts: BankAccount[]
  onSubmit: (data: TransactionFormData) => void
  onCancel: () => void
  loading?: boolean
  isEdit?: boolean
}

export default function TransactionForm({
  defaultValues,
  accounts,
  onSubmit,
  onCancel,
  loading,
  isEdit,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      amount: '',
      category: 'Other',
      type: 'debit',
      description: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      bank_account_id: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah (Rp)
          </label>
          <input
            type="number"
            step="1"
            {...register('amount', {
              required: 'Wajib diisi',
              min: { value: 1, message: 'Minimal Rp 1' },
            })}
            className="input-field"
            placeholder="100000"
          />
          {errors.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipe
          </label>
          <select {...register('type')} className="input-field">
            <option value="debit">Pengeluaran (Debit)</option>
            <option value="credit">Pemasukan (Kredit)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keterangan
        </label>
        <input
          type="text"
          {...register('description', {
            required: 'Wajib diisi',
            minLength: { value: 2, message: 'Minimal 2 karakter' },
          })}
          className="input-field"
          placeholder="Deskripsi transaksi"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select {...register('category')} className="input-field">
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            {...register('date', { required: 'Wajib diisi' })}
            className="input-field"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>
      </div>

      {accounts.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Akun Bank
          </label>
          <select {...register('bank_account_id')} className="input-field">
            <option value="">-- Tidak ada --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catatan (opsional)
        </label>
        <input
          type="text"
          {...register('notes')}
          className="input-field"
          placeholder="Catatan tambahan"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Batal
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading && <Loader2 className="animate-spin" size={16} />}
          {isEdit ? 'Simpan' : 'Tambah'}
        </button>
      </div>
    </form>
  )
}
