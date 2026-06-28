import type { ParsedTransaction, StatementMetadata } from '@/types'

export interface ParseResult {
  transactions: ParsedTransaction[]
  metadata: StatementMetadata
}

export interface BankParser {
  bankName: string
  parse(data: ArrayBuffer): ParseResult
}

export interface RawBankRow {
  date: string
  time?: string
  description: string
  debit: number
  credit: number
  balance?: number
}
