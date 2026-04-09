import * as XLSX from 'xlsx'
import type { ParsedTransaction } from '@/types'
import type { BankParser, RawBankRow } from './types'

/**
 * Parser for Bank Mandiri e-statements downloaded from Livin' app (.xlsx).
 *
 * Expected format (may vary — will be finalized with sample file):
 * Columns: Tanggal | Keterangan | Debit | Kredit | Saldo
 *
 * The parser tries multiple column name patterns to handle variations.
 */
export class MandiriParser implements BankParser {
  bankName = 'mandiri'

  // Column name patterns to try (case-insensitive)
  private datePatterns = ['tanggal', 'date', 'tgl', 'posting date']
  private descriptionPatterns = ['keterangan', 'description', 'uraian', 'remark', 'deskripsi']
  private debitPatterns = ['debit', 'debet', 'mutasi debit', 'keluar']
  private creditPatterns = ['kredit', 'credit', 'mutasi kredit', 'masuk']
  private balancePatterns = ['saldo', 'balance']

  parse(data: ArrayBuffer): ParsedTransaction[] {
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // Try to find the header row (may not be on row 1)
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1')
    let headerRow = -1
    let columnMap: Record<string, number> = {}

    for (let row = range.s.r; row <= Math.min(range.e.r, 20); row++) {
      const mapping = this.tryMapColumns(sheet, row, range.e.c)
      if (mapping) {
        headerRow = row
        columnMap = mapping
        break
      }
    }

    if (headerRow === -1) {
      throw new Error(
        'Tidak bisa menemukan header kolom di file ini. Pastikan file ini adalah e-statement Bank Mandiri.'
      )
    }

    const rows: RawBankRow[] = []

    for (let row = headerRow + 1; row <= range.e.r; row++) {
      const dateCell = sheet[XLSX.utils.encode_cell({ r: row, c: columnMap.date })]
      const descCell = sheet[XLSX.utils.encode_cell({ r: row, c: columnMap.description })]
      const debitCell = sheet[XLSX.utils.encode_cell({ r: row, c: columnMap.debit })]
      const creditCell = sheet[XLSX.utils.encode_cell({ r: row, c: columnMap.credit })]
      const balanceCell = columnMap.balance !== undefined
        ? sheet[XLSX.utils.encode_cell({ r: row, c: columnMap.balance })]
        : undefined

      // Skip empty rows
      if (!dateCell && !descCell) continue

      const dateValue = this.parseDate(dateCell)
      if (!dateValue) continue // Skip non-date rows (footers, summaries, etc.)

      const description = descCell ? String(descCell.v || '').trim() : ''
      if (!description) continue

      const debit = this.parseAmount(debitCell)
      const credit = this.parseAmount(creditCell)
      const balance = balanceCell ? this.parseAmount(balanceCell) : undefined

      // Skip rows with no monetary value
      if (debit === 0 && credit === 0) continue

      rows.push({
        date: dateValue,
        description,
        debit,
        credit,
        balance,
      })
    }

    return rows.map((row) => ({
      date: row.date,
      description: row.description,
      amount: row.debit > 0 ? row.debit : row.credit,
      type: row.debit > 0 ? 'debit' : 'credit',
      balance: row.balance,
      category: 'Other',
      is_transfer: false,
      categorized_by: 'manual',
      confidence: 0,
    }))
  }

  private tryMapColumns(
    sheet: XLSX.WorkSheet,
    row: number,
    maxCol: number
  ): Record<string, number> | null {
    const mapping: Record<string, number> = {}

    for (let col = 0; col <= maxCol; col++) {
      const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })]
      if (!cell) continue
      const value = String(cell.v || '').toLowerCase().trim()

      if (!mapping.date && this.datePatterns.some((p) => value.includes(p))) {
        mapping.date = col
      }
      if (!mapping.description && this.descriptionPatterns.some((p) => value.includes(p))) {
        mapping.description = col
      }
      if (!mapping.debit && this.debitPatterns.some((p) => value.includes(p))) {
        mapping.debit = col
      }
      if (!mapping.credit && this.creditPatterns.some((p) => value.includes(p))) {
        mapping.credit = col
      }
      if (mapping.balance === undefined && this.balancePatterns.some((p) => value.includes(p))) {
        mapping.balance = col
      }
    }

    // Must have at least date, description, and either debit or credit
    if (mapping.date !== undefined && mapping.description !== undefined &&
      (mapping.debit !== undefined || mapping.credit !== undefined)) {
      // Default debit/credit to same column if only one exists
      if (mapping.debit === undefined) mapping.debit = mapping.credit
      if (mapping.credit === undefined) mapping.credit = mapping.debit
      return mapping
    }

    return null
  }

  private parseDate(cell: XLSX.CellObject | undefined): string | null {
    if (!cell) return null

    // SheetJS may parse dates as Date objects
    if (cell.t === 'd' && cell.v instanceof Date) {
      return cell.v.toISOString().split('T')[0]
    }

    // Handle serial date numbers
    if (cell.t === 'n' && typeof cell.v === 'number') {
      try {
        const date = XLSX.SSF.parse_date_code(cell.v)
        if (date) {
          const year = date.y
          const month = String(date.m).padStart(2, '0')
          const day = String(date.d).padStart(2, '0')
          return `${year}-${month}-${day}`
        }
      } catch {
        return null
      }
    }

    // Handle string dates (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD)
    const str = String(cell.v || '').trim()
    const patterns = [
      /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/, // DD/MM/YYYY or DD-MM-YYYY
      /^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/, // YYYY-MM-DD or YYYY/MM/DD
    ]

    for (const pattern of patterns) {
      const match = str.match(pattern)
      if (match) {
        if (match[1].length === 4) {
          // YYYY-MM-DD
          return `${match[1]}-${match[2]}-${match[3]}`
        } else {
          // DD/MM/YYYY → YYYY-MM-DD
          return `${match[3]}-${match[2]}-${match[1]}`
        }
      }
    }

    return null
  }

  private parseAmount(cell: XLSX.CellObject | undefined): number {
    if (!cell) return 0

    if (cell.t === 'n') return Math.abs(Number(cell.v) || 0)

    // Handle string amounts with thousand separators
    const str = String(cell.v || '').trim()
    if (!str) return 0

    // Remove currency symbols, spaces, and thousand separators
    const cleaned = str
      .replace(/[Rp\s.]/g, '')
      .replace(/,/g, '.')
    const amount = parseFloat(cleaned)
    return isNaN(amount) ? 0 : Math.abs(amount)
  }
}

export function createMandiriParser(): BankParser {
  return new MandiriParser()
}
