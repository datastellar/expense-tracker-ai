import * as XLSX from 'xlsx'
import type { ParsedTransaction, StatementMetadata, TransactionMethod } from '@/types'
import type { BankParser, ParseResult } from './types'

/**
 * Parser for Bank Mandiri e-statements downloaded from Livin' app (.xlsx).
 *
 * Actual format (from real sample):
 * - Password-protected xlsx (decrypted before reaching this parser)
 * - 25 columns with merged cells, data in specific column positions
 * - Row 1-15: Header (account info, summary)
 * - Row 16-17: Column headers (bilingual)
 * - Row 18+: Transactions (2 rows each: data + time)
 * - Footer: Empty rows + disclaimer
 *
 * Column positions (0-indexed):
 *   Col 0: No
 *   Col 4: Tanggal/Date
 *   Col 7: Keterangan/Remarks (multiline)
 *   Col 15: Dana Masuk (IDR)
 *   Col 18: Dana Keluar (IDR)
 *   Col 21: Saldo (IDR)
 */
export class MandiriParser implements BankParser {
  bankName = 'mandiri'

  // Column indices (0-indexed) — detected dynamically but these are defaults
  private COL_NO = 0
  private COL_DATE = 4
  private COL_DESC = 7
  private COL_CREDIT = 15  // Dana Masuk
  private COL_DEBIT = 18   // Dana Keluar
  private COL_BALANCE = 21 // Saldo

  parse(data: ArrayBuffer): ParseResult {
    const workbook = XLSX.read(data, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1')

    // Find header row and detect column positions
    const headerRow = this.findHeaderRow(sheet, range)
    if (headerRow === -1) {
      throw new Error(
        'Tidak bisa menemukan header kolom di file ini. Pastikan file ini adalah e-statement Bank Mandiri.'
      )
    }

    // Extract metadata from header area
    const metadata = this.extractMetadata(sheet, headerRow)

    // Parse transactions starting after header
    const transactions = this.parseTransactions(sheet, range, headerRow)

    return { transactions, metadata }
  }

  private findHeaderRow(sheet: XLSX.WorkSheet, range: XLSX.Range): number {
    for (let row = 0; row <= Math.min(range.e.r, 25); row++) {
      let hasTanggal = false
      let hasKeterangan = false
      let hasDanaMasuk = false

      for (let col = 0; col <= range.e.c; col++) {
        const val = this.getCellText(sheet, row, col).toLowerCase()
        if (val.includes('tanggal') || val.includes('date')) {
          hasTanggal = true
          this.COL_DATE = col
        }
        if (val.includes('keterangan') || val.includes('remarks')) {
          hasKeterangan = true
          this.COL_DESC = col
        }
        if (val.includes('dana masuk') || val.includes('incoming')) {
          hasDanaMasuk = true
          this.COL_CREDIT = col
        }
        if (val.includes('dana keluar') || val.includes('outgoing')) {
          this.COL_DEBIT = col
        }
        if (val.includes('saldo') || val.includes('balance')) {
          this.COL_BALANCE = col
        }
      }

      if (hasTanggal && hasKeterangan && hasDanaMasuk) {
        // Check if there's a second header row (bilingual) — skip it
        const nextRowVal = this.getCellText(sheet, row + 1, this.COL_DATE).toLowerCase()
        if (nextRowVal.includes('date') || nextRowVal.includes('tanggal')) {
          return row + 1 // return the second header row so we start parsing after it
        }
        return row
      }
    }
    return -1
  }

  private extractMetadata(sheet: XLSX.WorkSheet, headerRow: number): StatementMetadata {
    const metadata: StatementMetadata = {}

    // Scan rows above header for metadata
    for (let row = 0; row < headerRow; row++) {
      for (let col = 0; col <= 24; col++) {
        const text = this.getCellText(sheet, row, col)
        if (!text) continue

        // Account holder: row with "Nama/Name" label
        if (text.toLowerCase().includes('nama') || text.toLowerCase().includes('name')) {
          // Value is usually a few columns to the right after ":"
          const value = this.findValueAfterColon(sheet, row, col)
          if (value) metadata.account_holder = value
        }

        // Branch
        if (text.toLowerCase().includes('cabang') || text.toLowerCase().includes('branch')) {
          const value = this.findValueAfterColon(sheet, row, col)
          if (value) metadata.branch = value
        }

        // Period
        if (text.toLowerCase().includes('periode') || text.toLowerCase().includes('period')) {
          const value = this.findValueAfterColon(sheet, row, col)
          if (value) metadata.period = value
        }

        // Account number
        if (text.toLowerCase().includes('nomor rekening') || text.toLowerCase().includes('account number')) {
          const value = this.findValueAfterColon(sheet, row, col)
          if (value) metadata.account_number = value
        }

        // Currency
        if (text.toLowerCase().includes('mata uang') || text.toLowerCase().includes('currency')) {
          const value = this.findValueAfterColon(sheet, row, col)
          if (value) metadata.currency = value
        }

        // Balances and totals
        if (text.toLowerCase().includes('saldo awal') || text.toLowerCase().includes('initial balance')) {
          const amount = this.findAmountInRow(sheet, row)
          if (amount !== null) metadata.initial_balance = amount
        }
        if (text.toLowerCase().includes('saldo akhir') || text.toLowerCase().includes('closing balance')) {
          const amount = this.findAmountInRow(sheet, row)
          if (amount !== null) metadata.closing_balance = amount
        }
        if ((text.toLowerCase().includes('dana masuk') || text.toLowerCase().includes('incoming'))
          && row < headerRow - 2) {
          const amount = this.findAmountInRow(sheet, row)
          if (amount !== null) metadata.total_incoming = amount
        }
        if ((text.toLowerCase().includes('dana keluar') || text.toLowerCase().includes('outgoing'))
          && row < headerRow - 2) {
          const amount = this.findAmountInRow(sheet, row)
          if (amount !== null) metadata.total_outgoing = amount
        }
      }
    }

    return metadata
  }

  private parseTransactions(
    sheet: XLSX.WorkSheet,
    range: XLSX.Range,
    headerRow: number
  ): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = []

    let row = headerRow + 1
    while (row <= range.e.r) {
      const noText = this.getCellText(sheet, row, this.COL_NO).trim()

      // Transaction rows start with a number
      if (!/^\d+$/.test(noText)) {
        row++
        continue
      }

      const dateText = this.getCellText(sheet, row, this.COL_DATE).trim()
      const rawDesc = this.getCellText(sheet, row, this.COL_DESC)
      const creditText = this.getCellText(sheet, row, this.COL_CREDIT).trim()
      const debitText = this.getCellText(sheet, row, this.COL_DEBIT).trim()
      const balanceText = this.getCellText(sheet, row, this.COL_BALANCE).trim()

      // Next row may contain time
      let time: string | undefined
      if (row + 1 <= range.e.r) {
        const timeText = this.getCellText(sheet, row + 1, this.COL_DATE).trim()
        const timeMatch = timeText.match(/^(\d{2}:\d{2}:\d{2})\s*WIB$/i)
        if (timeMatch) {
          time = timeMatch[1]
          row++ // skip time row
        }
      }

      const date = this.parseDate(dateText)
      if (!date) {
        row++
        continue
      }

      const credit = this.parseAmount(creditText)
      const debit = this.parseAmount(debitText)
      const balance = this.parseAmount(balanceText)
      const amount = credit > 0 ? credit : debit
      const type = credit > 0 ? 'credit' : 'debit'

      if (amount === 0) {
        row++
        continue
      }

      // Decompose description
      const enriched = this.decomposeDescription(rawDesc)

      transactions.push({
        date,
        description: rawDesc.replace(/\n/g, ' ').trim(),
        amount,
        type: type as 'debit' | 'credit',
        balance: balance || undefined,
        category: 'Other',
        is_transfer: enriched.transaction_method === 'bi_fast' ||
          enriched.transaction_method === 'mandiri_transfer',
        categorized_by: 'manual',
        confidence: 0,
        time,
        ...enriched,
      })

      row++
    }

    return transactions
  }

  private decomposeDescription(raw: string): Partial<ParsedTransaction> {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) return {}

    const firstLine = lines[0]

    // Transfer BI Fast
    if (firstLine === 'Transfer BI Fast') {
      return this.parseTransferBiFast(lines)
    }

    // Transfer ke/dari BANK MANDIRI
    if (firstLine.startsWith('Transfer ke BANK MANDIRI')) {
      return this.parseMandiriTransfer(lines, 'ke')
    }
    if (firstLine.startsWith('Transfer dari BANK MANDIRI') || firstLine.startsWith('Transfer dari PT.')) {
      return this.parseMandiriTransfer(lines, 'dari')
    }

    // Transfer antar Mandiri
    if (firstLine === 'Transfer antar Mandiri') {
      return {
        transaction_method: 'mandiri_transfer',
        reference_code: lines[2] || lines[1] || undefined,
      }
    }

    // Pembayaran QR
    if (firstLine === 'Pembayaran QR') {
      return this.parseQrPayment(lines)
    }

    // Transaksi e-Commerce
    if (firstLine === 'Transaksi e-Commerce' || firstLine === 'Koreksi transaksi e-Commerce') {
      const merchant = lines[1]?.replace(/^VAP-/, '') || undefined
      return {
        transaction_method: 'ecommerce',
        merchant_name: merchant,
      }
    }

    // Biaya transaksi bank (fee linked to another transaction)
    if (firstLine === 'Biaya transaksi bank') {
      const linkedDesc = lines[1] || ''
      const merchant = linkedDesc.replace(/^Pembayaran\s+/, '')
      return {
        transaction_method: 'bank_fee',
        merchant_name: merchant || undefined,
        reference_code: lines[2] || undefined,
      }
    }

    // Biaya transfer BI Fast
    if (firstLine === 'Biaya transfer BI Fast') {
      return { transaction_method: 'bank_fee' }
    }

    // Biaya administrasi
    if (firstLine.startsWith('Biaya administrasi')) {
      return { transaction_method: 'bank_fee' }
    }

    // Pengkreditan gaji
    if (firstLine === 'Pengkreditan gaji') {
      return {
        transaction_method: 'salary',
        reference_code: lines[1] || undefined,
      }
    }

    // Penarikan tunai tanpa kartu
    if (firstLine.startsWith('Penarikan tunai')) {
      const location = lines[1]?.replace(/^Di ATM\s+/, '') || undefined
      return {
        transaction_method: 'atm',
        merchant_name: location,
        reference_code: lines[2] || undefined,
      }
    }

    // Pembayaran {Biller} (PLN, Tokopedia, Balifiber, KAI, OVO, etc.)
    if (firstLine.startsWith('Pembayaran ')) {
      const biller = firstLine.replace(/^Pembayaran\s+/, '')
      return {
        transaction_method: 'biller',
        merchant_name: biller,
        reference_code: lines[1] || undefined,
      }
    }

    // Auto-debit codes (9511, 9412, 6800, etc.)
    if (/^\d{4}$/.test(firstLine)) {
      return this.parseAutoDebit(lines)
    }

    return { transaction_method: 'other' }
  }

  private parseTransferBiFast(lines: string[]): Partial<ParsedTransaction> {
    const result: Partial<ParsedTransaction> = {
      transaction_method: 'bi_fast',
    }

    if (lines.length >= 2) {
      const dirLine = lines[1]
      const keMatch = dirLine.match(/^Ke\s+(.+)$/i)
      const dariMatch = dirLine.match(/^Dari\s+(.+)$/i)

      if (keMatch) {
        result.counterparty_bank = keMatch[1].trim()
      } else if (dariMatch) {
        result.counterparty_bank = dariMatch[1].trim()
      }
    }

    if (lines.length >= 3) {
      const { name, account } = this.parseNameAccount(lines[2])
      result.counterparty_name = name
      result.counterparty_account = account
    }

    if (lines.length >= 4) {
      result.purpose = lines[3]
    }

    return result
  }

  private parseMandiriTransfer(lines: string[], direction: 'ke' | 'dari'): Partial<ParsedTransaction> {
    const result: Partial<ParsedTransaction> = {
      transaction_method: 'mandiri_transfer',
      counterparty_bank: 'BANK MANDIRI',
    }

    // For "Transfer dari PT. BANK DANAMON..." etc.
    const bankMatch = lines[0].match(/Transfer (?:ke|dari)\s+(.+)$/i)
    if (bankMatch) {
      result.counterparty_bank = bankMatch[1].trim()
    }

    if (lines.length >= 2) {
      const { name, account } = this.parseNameAccount(lines[1])
      result.counterparty_name = name
      result.counterparty_account = account
    }

    if (lines.length >= 3) {
      result.purpose = lines[2]
    }

    return result
  }

  private parseQrPayment(lines: string[]): Partial<ParsedTransaction> {
    let merchant: string | undefined
    if (lines.length >= 2) {
      merchant = lines[1].replace(/^ke\s+/i, '').replace(/,\s*$/, '').trim()
    }

    return {
      transaction_method: 'qr_payment',
      merchant_name: merchant,
      reference_code: lines[2] || undefined,
    }
  }

  private parseAutoDebit(lines: string[]): Partial<ParsedTransaction> {
    const result: Partial<ParsedTransaction> = {
      transaction_method: 'auto_debit',
    }

    // Pattern: line 1 = code, line 2 = {number}{name}, line 3 = purpose
    if (lines.length >= 3) {
      // Try to extract name from line 2 (starts with digits then name)
      const nameMatch = lines[1].match(/^\d+(.+)$/)
      if (nameMatch) {
        result.counterparty_name = nameMatch[1].trim()
      }
      result.purpose = lines[2]
    } else if (lines.length >= 2) {
      result.purpose = lines[1]
    }

    return result
  }

  /** Parse "NAME ACCOUNTNUMBER" pattern */
  private parseNameAccount(text: string): { name?: string; account?: string } {
    // Common pattern: "BERYL CHOLIF ARRAHMA 1440018019510"
    // Account numbers are typically 10+ digits at the end
    const match = text.match(/^(.+?)\s+(\d{7,})$/)
    if (match) {
      return { name: match[1].trim(), account: match[2] }
    }
    return { name: text.trim() }
  }

  // --- Utility methods ---

  private getCellText(sheet: XLSX.WorkSheet, row: number, col: number): string {
    const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })]
    if (!cell) return ''
    if (cell.w) return cell.w // formatted text
    return String(cell.v ?? '')
  }

  private parseDate(text: string): string | null {
    // Format: "01 Jan 2026"
    const months: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04',
      may: '05', jun: '06', jul: '07', aug: '08',
      sep: '09', oct: '10', nov: '11', dec: '12',
    }

    const match = text.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/)
    if (match) {
      const day = match[1].padStart(2, '0')
      const month = months[match[2].toLowerCase()]
      const year = match[3]
      if (month) return `${year}-${month}-${day}`
    }

    // Fallback: DD/MM/YYYY
    const slashMatch = text.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/)
    if (slashMatch) {
      return `${slashMatch[3]}-${slashMatch[2]}-${slashMatch[1]}`
    }

    return null
  }

  private parseAmount(text: string): number {
    if (!text) return 0
    // Indonesian format: 2.943.200,00 → 2943200.00
    const cleaned = text
      .replace(/[Rp\s]/g, '')
      .replace(/\./g, '')        // remove thousand separators
      .replace(/,/, '.')          // decimal comma → dot
    const amount = parseFloat(cleaned)
    return isNaN(amount) ? 0 : Math.abs(amount)
  }

  private findValueAfterColon(sheet: XLSX.WorkSheet, row: number, startCol: number): string | null {
    // Look for ":" in nearby columns, then get the value after it
    for (let col = startCol; col <= Math.min(startCol + 15, 24); col++) {
      const text = this.getCellText(sheet, row, col)
      if (text === ':' || text.includes(':')) {
        // Value is in the next non-empty column
        for (let nextCol = col + 1; nextCol <= 24; nextCol++) {
          const val = this.getCellText(sheet, row, nextCol).trim()
          if (val && val !== ':') return val
        }
      }
    }
    return null
  }

  private findAmountInRow(sheet: XLSX.WorkSheet, row: number): number | null {
    // Scan from right to left looking for a formatted number
    for (let col = 24; col >= 15; col--) {
      const text = this.getCellText(sheet, row, col).trim()
      if (text && /[\d.,]+/.test(text)) {
        const amount = this.parseAmount(text)
        if (amount > 0) return amount
      }
    }
    return null
  }
}

export function createMandiriParser(): BankParser {
  return new MandiriParser()
}
