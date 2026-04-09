import type { ExpenseCategory, ParsedTransaction } from '@/types'
import { DEFAULT_CATEGORY_RULES, TRANSFER_PATTERNS } from './default-rules'
import type { CategoryKeywordRule } from './default-rules'

interface UserRule {
  keyword: string
  category: string
  priority: number
}

export function categorizeTransaction(
  description: string,
  userRules: UserRule[] = []
): { category: ExpenseCategory; confidence: number; is_transfer: boolean } {
  const upper = description.toUpperCase()

  // 1. Check if it's a transfer first
  const isTransfer = TRANSFER_PATTERNS.some((pattern) =>
    upper.includes(pattern)
  )

  if (isTransfer) {
    return { category: 'Transfer', confidence: 0.9, is_transfer: true }
  }

  // 2. Check user-defined rules (higher priority)
  const sortedUserRules = [...userRules].sort((a, b) => b.priority - a.priority)
  for (const rule of sortedUserRules) {
    if (upper.includes(rule.keyword.toUpperCase())) {
      return {
        category: rule.category as ExpenseCategory,
        confidence: 1.0,
        is_transfer: false,
      }
    }
  }

  // 3. Check default rules
  for (const rule of DEFAULT_CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (upper.includes(keyword)) {
        return {
          category: rule.category,
          confidence: 0.8,
          is_transfer: false,
        }
      }
    }
  }

  // 4. No match — needs AI or manual categorization
  return { category: 'Other', confidence: 0, is_transfer: false }
}

export function categorizeTransactions(
  transactions: ParsedTransaction[],
  userRules: UserRule[] = []
): ParsedTransaction[] {
  return transactions.map((tx) => {
    const result = categorizeTransaction(tx.description, userRules)
    return {
      ...tx,
      category: result.category,
      is_transfer: result.is_transfer,
      confidence: result.confidence,
      categorized_by: result.confidence > 0 ? 'rule' as const : 'manual' as const,
    }
  })
}
