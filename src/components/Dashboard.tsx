'use client'

import React, { useMemo } from 'react'
import { DollarSign, Calendar, TrendingUp, Tag } from 'lucide-react'
import { Expense, CATEGORY_COLORS } from '@/types'
import { formatCurrency, calculateExpenseSummary } from '@/utils'

interface DashboardProps {
  expenses: Expense[]
  loading?: boolean
}

export default function Dashboard({ expenses, loading }: DashboardProps) {
  const summary = useMemo(() => calculateExpenseSummary(expenses), [expenses])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const summaryCards = [
    {
      title: 'Total Spending',
      value: formatCurrency(summary.totalSpending),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlySpending),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Expenses',
      value: expenses.length.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Top Category',
      value: summary.topCategories[0]?.category || 'None',
      icon: Tag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {summary.topCategories.length > 0 && (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-4">
            {summary.topCategories.slice(0, 5).map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: CATEGORY_COLORS[category.category]
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: CATEGORY_COLORS[category.category]
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                    {formatCurrency(category.amount)}
                  </span>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}