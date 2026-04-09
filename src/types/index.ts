export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Healthcare'
  | 'Transfer'
  | 'Income'
  | 'Other'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other',
]

export const ALL_CATEGORIES: ExpenseCategory[] = [
  ...EXPENSE_CATEGORIES,
  'Transfer',
  'Income',
]

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#10b981',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#f59e0b',
  Bills: '#ef4444',
  Healthcare: '#06b6d4',
  Transfer: '#94a3b8',
  Income: '#22c55e',
  Other: '#6b7280',
}

export interface Transaction {
  id: string
  user_id: string
  bank_account_id: string | null
  type: 'debit' | 'credit'
  amount: number
  category: ExpenseCategory
  description: string
  notes: string | null
  date: string
  is_transfer: boolean
  categorized_by: 'rule' | 'ai' | 'manual'
  import_batch_id: string | null
  created_at: string
  updated_at: string
}

export interface BankAccount {
  id: string
  user_id: string
  bank_name: string
  account_name: string
  account_number: string
  created_at: string
}

export interface ImportBatch {
  id: string
  user_id: string
  bank_account_id: string
  file_name: string
  row_count: number
  imported_at: string
}

export interface CategoryRule {
  id: string
  user_id: string
  keyword: string
  category: ExpenseCategory
  priority: number
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  gemini_api_key: string | null
  created_at: string
}

export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  type: 'debit' | 'credit'
  balance?: number
  category: ExpenseCategory
  is_transfer: boolean
  categorized_by: 'rule' | 'ai' | 'manual'
  confidence: number // 0-1, how confident the categorization is
}

export interface TransactionFormData {
  amount: string
  category: ExpenseCategory
  type: 'debit' | 'credit'
  description: string
  date: string
  notes: string
  bank_account_id: string
}

export type BankName = 'mandiri' | 'bca' | 'jenius' | 'jago' | 'bri'

export const BANK_DISPLAY_NAMES: Record<BankName, string> = {
  mandiri: 'Bank Mandiri',
  bca: 'BCA',
  jenius: 'Jenius (BTPN)',
  jago: 'Bank Jago',
  bri: 'BRI',
}
