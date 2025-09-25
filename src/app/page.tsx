'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import ExpenseForm from '@/components/forms/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import ExpenseCharts from '@/components/charts/ExpenseCharts'
import Modal from '@/components/ui/Modal'
import { useExpenses } from '@/hooks/useExpenses'
import { Expense } from '@/types'

export default function Home() {
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [showCharts, setShowCharts] = useState(false)

  const handleAddExpense = async (expense: Expense) => {
    try {
      await addExpense(expense)
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to add expense:', error)
    }
  }

  const handleEditExpense = async (expense: Expense) => {
    try {
      await updateExpense(expense.id, expense)
      setEditingExpense(null)
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id)
      } catch (error) {
        console.error('Failed to delete expense:', error)
      }
    }
  }

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddExpense={() => setShowAddModal(true)}
        onToggleCharts={() => setShowCharts(!showCharts)}
        expenses={expenses}
        showCharts={showCharts}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Dashboard expenses={expenses} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <ExpenseList
              expenses={expenses}
              onEdit={handleEditClick}
              onDelete={handleDeleteExpense}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <ExpenseForm
                onSubmit={handleAddExpense}
                initialData={undefined}
                isEditing={false}
              />
            </div>
          </div>
        </div>

        {showCharts && (
          <div className="mt-8">
            <ExpenseCharts expenses={expenses} />
          </div>
        )}
      </main>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Expense"
        size="md"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
        size="md"
      >
        {editingExpense && (
          <ExpenseForm
            onSubmit={handleEditExpense}
            onCancel={() => setEditingExpense(null)}
            initialData={editingExpense}
            isEditing={true}
          />
        )}
      </Modal>
    </div>
  )
}