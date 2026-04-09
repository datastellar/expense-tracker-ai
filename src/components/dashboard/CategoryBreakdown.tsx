'use client'

import { CATEGORY_COLORS, type ExpenseCategory } from '@/types'
import { formatCurrency } from '@/lib/utils/format'

interface CategoryBreakdownProps {
  topCategories: Array<{
    category: ExpenseCategory
    amount: number
    percentage: number
  }>
}

export default function CategoryBreakdown({
  topCategories,
}: CategoryBreakdownProps) {
  if (topCategories.length === 0) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Kategori</h3>
        <p className="text-gray-500 text-sm">Belum ada data transaksi</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Kategori Pengeluaran</h3>
      <div className="space-y-3">
        {topCategories.slice(0, 6).map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: CATEGORY_COLORS[cat.category],
                  }}
                />
                <span className="text-gray-700">{cat.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {formatCurrency(cat.amount)}
                </span>
                <span className="text-gray-400 text-xs w-10 text-right">
                  {cat.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: CATEGORY_COLORS[cat.category],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
