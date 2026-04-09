import type { ParsedTransaction } from '@/types'

export interface BankParser {
  bankName: string
  parse(data: ArrayBuffer): ParsedTransaction[]
}

export interface RawBankRow {
  date: string
  description: string
  debit: number
  credit: number
  balance?: number
}
