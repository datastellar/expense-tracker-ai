import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMM yyyy', { locale: id })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'd MMM', { locale: id })
  } catch {
    return dateStr
  }
}
