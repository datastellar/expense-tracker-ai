'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, Edit2, Trash2, Calendar, Tag } from 'lucide-react'
import { Expense, ExpenseFilters, EXPENSE_CATEGORIES, CATEGORY_COLORS } from '@/types'
import { formatCurrency, formatDate } from '@/utils'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export default function ExpenseList({ expenses, onEdit, onDelete, loading }: ExpenseListProps) {
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: 'all',
    searchQuery: '',
    startDate: '',
    endDate: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses]

    if (filters.searchQuery) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      )
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(expense => expense.category === filters.category)
    }

    if (filters.startDate) {
      filtered = filtered.filter(expense => expense.date >= filters.startDate!)
    }

    if (filters.endDate) {
      filtered = filtered.filter(expense => expense.date <= filters.endDate!)
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, filters])

  const handleFilterChange = (newFilters: Partial<ExpenseFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      searchQuery: '',
      startDate: '',
      endDate: ''
    })
  }

  const hasActiveFilters = filters.searchQuery || filters.category !== 'all' || filters.startDate || filters.endDate

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Expenses ({filteredExpenses.length})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-primary-50 text-primary-700' : ''}`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search descriptions..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleFilterChange({ category: e.target.value as any })}
                className="select-field"
              >
                <option value="all">All Categories</option>
                {EXPENSE_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange({ endDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {expenses.length === 0 ? (
              <>
                <Tag className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No expenses yet</p>
                <p className="text-gray-600">Start by adding your first expense above.</p>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No matching expenses</p>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                    />
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {expense.description}
                    </h3>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {expense.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(expense.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                    title="Edit expense"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}