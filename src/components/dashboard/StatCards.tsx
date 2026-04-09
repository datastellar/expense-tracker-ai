'use client'

import { TrendingDown, Calendar, CreditCard, BarChart3 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/format'

interface StatCardsProps {
  totalSpending: number
  monthlySpending: number
  expenseCount: number
  topCategory: string | null
}

export default function StatCards({
  totalSpending,
  monthlySpending,
  expenseCount,
  topCategory,
}: StatCardsProps) {
  const stats = [
    {
      label: 'Total Pengeluaran',
      value: formatCurrency(totalSpending),
      icon: TrendingDown,
      color: 'text-red-600 bg-red-50',
    },
    {
      label: 'Bulan Ini',
      value: formatCurrency(monthlySpending),
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Jumlah Transaksi',
      value: expenseCount.toString(),
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Kategori Teratas',
      value: topCategory || '-',
      icon: BarChart3,
      color: 'text-green-600 bg-green-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-xl font-bold text-gray-900 mt-1 truncate">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
