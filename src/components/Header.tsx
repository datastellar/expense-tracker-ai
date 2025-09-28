'use client'

import React, { useState } from 'react'
import { Plus, Cloud, BarChart3 } from 'lucide-react'
import { Expense } from '@/types'
import CloudExportDashboard from './export/CloudExportDashboard'

interface HeaderProps {
  onAddExpense: () => void
  onToggleCharts: () => void
  expenses: Expense[]
  showCharts: boolean
}

export default function Header({ onAddExpense, onToggleCharts, expenses, showCharts }: HeaderProps) {
  const [showExportDashboard, setShowExportDashboard] = useState(false)

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Expense Tracker
            </h1>
            <div className="ml-3 sm:ml-6 text-xs sm:text-sm text-gray-500 hidden sm:block">
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''} tracked
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleCharts}
              className={`btn-secondary flex items-center gap-1 sm:gap-2 ${
                showCharts ? 'bg-primary-50 text-primary-700' : ''
              }`}
              title={showCharts ? 'Hide Charts' : 'Show Charts'}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Charts</span>
            </button>

            <button
              onClick={() => setShowExportDashboard(true)}
              className="btn-secondary flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-purple-100"
            >
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Cloud Export</span>
            </button>

            <button
              onClick={onAddExpense}
              className="btn-primary flex items-center gap-1 sm:gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Export Dashboard */}
      {showExportDashboard && (
        <CloudExportDashboard
          expenses={expenses}
          onClose={() => setShowExportDashboard(false)}
        />
      )}
    </div>
  )
}