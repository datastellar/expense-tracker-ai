'use client'

import type { Transaction } from '@/types'
import { CATEGORY_COLORS, type ExpenseCategory } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Edit2,
  Trash2,
  ArrowLeftRight,
} from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Belum ada transaksi</p>
        <p className="text-sm mt-1">Import e-statement atau tambah transaksi manual</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th className="text-left px-3 py-3 font-medium text-gray-500">Tanggal</th>
            <th className="text-left px-3 py-3 font-medium text-gray-500">Keterangan</th>
            <th className="text-left px-3 py-3 font-medium text-gray-500">Kategori</th>
            <th className="text-right px-3 py-3 font-medium text-gray-500">Jumlah</th>
            <th className="text-right px-3 py-3 font-medium text-gray-500 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 group">
              <td className="px-3 py-3 whitespace-nowrap text-gray-600">
                {formatDate(tx.date)}
              </td>
              <td className="px-3 py-3 max-w-xs">
                <div className="truncate text-gray-900">{tx.description}</div>
                {tx.notes && (
                  <div className="text-xs text-gray-400 truncate">{tx.notes}</div>
                )}
              </td>
              <td className="px-3 py-3">
                <span
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[tx.category as ExpenseCategory]}15`,
                    color: CATEGORY_COLORS[tx.category as ExpenseCategory],
                  }}
                >
                  {tx.is_transfer && <ArrowLeftRight size={10} />}
                  {tx.category}
                </span>
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                <span
                  className={`flex items-center justify-end gap-1 font-medium ${
                    tx.type === 'debit' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {tx.type === 'debit' ? (
                    <ArrowDownCircle size={14} />
                  ) : (
                    <ArrowUpCircle size={14} />
                  )}
                  {formatCurrency(Number(tx.amount))}
                </span>
              </td>
              <td className="px-3 py-3 text-right">
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 justify-end transition-opacity">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-500"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="p-1.5 rounded hover:bg-red-100 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
