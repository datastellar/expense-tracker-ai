'use client'

import { useTransactions } from '@/hooks/useTransactions'
import { calculateSummary, getMonthlyTrend } from '@/lib/utils/analytics'
import StatCards from '@/components/dashboard/StatCards'
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown'
import SpendingChart from '@/components/dashboard/SpendingChart'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'
import { Upload, Plus } from 'lucide-react'

export default function DashboardPage() {
  const { transactions, loading } = useTransactions()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  const summary = calculateSummary(transactions)
  const trend = getMonthlyTrend(transactions)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {transactions.length} transaksi tercatat
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/import" className="btn-secondary flex items-center gap-2">
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
          </Link>
          <Link href="/dashboard/transactions" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span className="hidden sm:inline">Transaksi</span>
          </Link>
        </div>
      </div>

      <StatCards
        totalSpending={summary.totalSpending}
        monthlySpending={summary.monthlySpending}
        expenseCount={summary.expenseCount}
        topCategory={summary.topCategories[0]?.category ?? null}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SpendingChart data={trend} />
        </div>
        <div>
          <CategoryBreakdown topCategories={summary.topCategories} />
        </div>
      </div>
    </div>
  )
}
