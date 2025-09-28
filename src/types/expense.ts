export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Healthcare'
  | 'Other'

export interface Expense {
  id: string
  amount: number
  category: ExpenseCategory
  description: string
  date: string // ISO date string
  createdAt: string
  updatedAt: string
}

export interface ExpenseFormData {
  amount: string
  category: ExpenseCategory
  description: string
  date: string
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'all'
  startDate?: string
  endDate?: string
  searchQuery?: string
}

export interface ExpenseSummary {
  totalSpending: number
  monthlySpending: number
  categoryBreakdown: Record<ExpenseCategory, number>
  topCategories: Array<{
    category: ExpenseCategory
    amount: number
    percentage: number
  }>
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other',
]

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#10b981',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#f59e0b',
  Bills: '#ef4444',
  Healthcare: '#06b6d4',
  Other: '#6b7280',
}