'use client'

import React from 'react'
import { Plus, Download, BarChart3 } from 'lucide-react'
import { Expense } from '@/types'
import { exportToCSV, exportToJSON } from '@/utils'

interface HeaderProps {
  onAddExpense: () => void
  onToggleCharts: () => void
  expenses: Expense[]
  showCharts: boolean
}

export default function Header({ onAddExpense, onToggleCharts, expenses, showCharts }: HeaderProps) {
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('No expenses to export')
      return
    }
    const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`
    exportToCSV(expenses, filename)
  }

  const handleExportJSON = () => {
    if (expenses.length === 0) {
      alert('No expenses to export')
      return
    }
    const filename = `expenses_${new Date().toISOString().split('T')[0]}.json`
    exportToJSON(expenses, filename)
  }

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

            <div className="relative group">
              <button className="btn-secondary flex items-center gap-1 sm:gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleExportCSV}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={expenses.length === 0}
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={expenses.length === 0}
                  >
                    Export as JSON
                  </button>
                </div>
              </div>
            </div>

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
    </div>
  )
}