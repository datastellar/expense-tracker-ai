import { Expense } from '@/types'
import { formatCurrency, formatDate } from './format'

export const exportToCSV = (expenses: Expense[], filename = 'expenses.csv'): void => {
  const headers = ['Date', 'Category', 'Description', 'Amount']

  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      formatDate(expense.date),
      expense.category,
      `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes in description
      expense.amount.toFixed(2)
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToJSON = (expenses: Expense[], filename = 'expenses.json'): void => {
  const jsonContent = JSON.stringify(expenses, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}