'use client'

import { useState } from 'react'
import type { ParsedTransaction, ExpenseCategory } from '@/types'
import { CATEGORY_COLORS } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import CategoryEditor from './CategoryEditor'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  Loader2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'

interface ImportPreviewProps {
  transactions: ParsedTransaction[]
  onTransactionsChange: (transactions: ParsedTransaction[]) => void
  onConfirm: () => void
  onCategorizeWithAI: (indices: number[]) => Promise<void>
  loading: boolean
  hasGeminiKey: boolean
}

export default function ImportPreview({
  transactions,
  onTransactionsChange,
  onConfirm,
  onCategorizeWithAI,
  loading,
  hasGeminiKey,
}: ImportPreviewProps) {
  const [aiLoading, setAiLoading] = useState(false)

  const uncategorizedIndices = transactions
    .map((t, i) => (t.confidence === 0 ? i : -1))
    .filter((i) => i >= 0)

  const debitCount = transactions.filter((t) => t.type === 'debit').length
  const creditCount = transactions.filter((t) => t.type === 'credit').length
  const transferCount = transactions.filter((t) => t.is_transfer).length
  const debitTotal = transactions
    .filter((t) => t.type === 'debit' && !t.is_transfer)
    .reduce((sum, t) => sum + t.amount, 0)

  const handleCategoryChange = (index: number, category: ExpenseCategory) => {
    const updated = [...transactions]
    updated[index] = {
      ...updated[index],
      category,
      categorized_by: 'manual',
      confidence: 1,
      is_transfer: category === 'Transfer',
    }
    onTransactionsChange(updated)
  }

  const handleAICategorize = async () => {
    if (uncategorizedIndices.length === 0) return
    setAiLoading(true)
    try {
      await onCategorizeWithAI(uncategorizedIndices)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          Total: <b>{transactions.length}</b> transaksi
        </span>
        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full">
          Debit: <b>{debitCount}</b> ({formatCurrency(debitTotal)})
        </span>
        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
          Kredit: <b>{creditCount}</b>
        </span>
        {transferCount > 0 && (
          <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full">
            Transfer: <b>{transferCount}</b>
          </span>
        )}
      </div>

      {/* AI Categorize button */}
      {uncategorizedIndices.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 flex-1">
            <b>{uncategorizedIndices.length}</b> transaksi belum dikategorikan
          </p>
          {hasGeminiKey && (
            <button
              onClick={handleAICategorize}
              disabled={aiLoading}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              {aiLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Sparkles size={14} />
              )}
              Kategorikan dengan AI
            </button>
          )}
        </div>
      )}

      {/* Transaction table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Tanggal</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Keterangan</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600">Jumlah</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Kategori</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((tx, i) => (
              <tr
                key={i}
                className={`hover:bg-gray-50 ${tx.is_transfer ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                  {formatDate(tx.date)}
                </td>
                <td className="px-3 py-2 max-w-xs truncate text-gray-900">
                  {tx.description}
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <span className={`flex items-center justify-end gap-1 ${
                    tx.type === 'debit' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {tx.type === 'debit' ? (
                      <ArrowDownCircle size={14} />
                    ) : (
                      <ArrowUpCircle size={14} />
                    )}
                    {formatCurrency(tx.amount)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <CategoryEditor
                    value={tx.category}
                    onChange={(cat) => handleCategoryChange(i, cat)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm button */}
      <div className="flex justify-end">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Check size={18} />
          )}
          Import {transactions.filter((t) => !t.is_transfer).length} Transaksi
        </button>
      </div>
    </div>
  )
}
