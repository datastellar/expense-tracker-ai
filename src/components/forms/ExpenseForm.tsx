'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { ExpenseFormData, EXPENSE_CATEGORIES, Expense } from '@/types'
import { generateId, parseAmount, formatDateForInput } from '@/utils'

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void
  onCancel?: () => void
  initialData?: Partial<Expense>
  isEditing?: boolean
}

export default function ExpenseForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: initialData?.amount?.toString() || '',
      category: initialData?.category || 'Other',
      description: initialData?.description || '',
      date: initialData?.date ? formatDateForInput(initialData.date) : formatDateForInput(new Date().toISOString())
    }
  })

  const watchedAmount = watch('amount')

  const onFormSubmit = (data: ExpenseFormData) => {
    const expense: Expense = {
      id: initialData?.id || generateId(),
      amount: parseAmount(data.amount),
      category: data.category,
      description: data.description,
      date: data.date,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onSubmit(expense)
    if (!isEditing) {
      reset()
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">$</span>
            </div>
            <input
              type="text"
              id="amount"
              {...register('amount', {
                required: 'Amount is required',
                validate: (value) => {
                  const amount = parseAmount(value)
                  if (amount <= 0) return 'Amount must be greater than 0'
                  if (amount > 999999) return 'Amount must be less than $1,000,000'
                  return true
                }
              })}
              className={`input-field pl-8 ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
          {watchedAmount && !errors.amount && (
            <p className="mt-1 text-sm text-gray-500">
              Amount: ${parseAmount(watchedAmount).toFixed(2)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className={`select-field ${errors.category ? 'border-red-500' : ''}`}
          >
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <input
            type="text"
            id="description"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 2, message: 'Description must be at least 2 characters' },
              maxLength: { value: 100, message: 'Description must be less than 100 characters' }
            })}
            className={`input-field ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Enter expense description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            {...register('date', {
              required: 'Date is required',
              validate: (value) => {
                const selectedDate = new Date(value)
                const today = new Date()
                if (selectedDate > today) return 'Date cannot be in the future'
                return true
              }
            })}
            className={`input-field ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary flex-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}