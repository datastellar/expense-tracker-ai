import { TRANSFER_PATTERNS } from './default-rules'

export function isTransfer(description: string): boolean {
  const upper = description.toUpperCase()
  return TRANSFER_PATTERNS.some((pattern) => upper.includes(pattern))
}

/**
 * Extract destination info from transfer description.
 * e.g. "TRF KE BCA 1234567890 JOHN DOE" → { bank: "BCA", recipient: "JOHN DOE" }
 */
export function parseTransferDetails(description: string): {
  bank: string | null
  recipient: string | null
} {
  const upper = description.toUpperCase()

  // Known bank names to look for
  const banks = [
    'BCA', 'MANDIRI', 'BNI', 'BRI', 'CIMB', 'DANAMON',
    'PERMATA', 'BTPN', 'JENIUS', 'JAGO', 'OCBC', 'UOB',
    'MAYBANK', 'PANIN', 'MEGA', 'BUKOPIN', 'BSI',
    'GOPAY', 'OVO', 'DANA', 'SHOPEEPAY', 'LINKAJA',
  ]

  let bank: string | null = null
  for (const b of banks) {
    if (upper.includes(b)) {
      bank = b
      break
    }
  }

  // Try to extract recipient name (usually the last part after account number)
  const accountNumberPattern = /\d{6,}/
  const match = description.match(accountNumberPattern)
  let recipient: string | null = null

  if (match && match.index !== undefined) {
    const afterNumber = description.substring(match.index + match[0].length).trim()
    if (afterNumber.length > 1) {
      recipient = afterNumber
    }
  }

  return { bank, recipient }
}
