'use client'

import { ALL_CATEGORIES, type ExpenseCategory } from '@/types'
import type { BankAccount } from '@/types'
import { Search, Filter } from 'lucide-react'

interface TransactionFiltersProps {
  search: string
  onSearchChange: (search: string) => void
  category: string
  onCategoryChange: (category: string) => void
  bankAccountId: string
  onBankAccountChange: (id: string) => void
  startDate: string
  onStartDateChange: (date: string) => void
  endDate: string
  onEndDateChange: (date: string) => void
  accounts: BankAccount[]
}

export default function TransactionFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  bankAccountId,
  onBankAccountChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  accounts,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-10"
          placeholder="Cari transaksi..."
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="all">Semua Kategori</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {accounts.length > 0 && (
          <select
            value={bankAccountId}
            onChange={(e) => onBankAccountChange(e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="">Semua Bank</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_name}
              </option>
            ))}
          </select>
        )}

        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="input-field w-auto text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="input-field w-auto text-sm"
        />
      </div>
    </div>
  )
}
