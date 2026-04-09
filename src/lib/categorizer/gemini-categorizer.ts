import type { ExpenseCategory } from '@/types'
import { EXPENSE_CATEGORIES } from '@/types'

interface GeminiCategorizeResult {
  category: ExpenseCategory
  confidence: number
}

/**
 * Categorize transactions using Gemini API.
 * Sends batch of descriptions and gets category suggestions.
 */
export async function categorizeWithGemini(
  descriptions: string[],
  apiKey: string
): Promise<GeminiCategorizeResult[]> {
  const categoriesStr = EXPENSE_CATEGORIES.join(', ')

  const prompt = `Kamu adalah asisten keuangan. Kategorikan setiap transaksi bank berikut ke salah satu kategori: ${categoriesStr}.

Berikan jawaban dalam format JSON array, setiap elemen berisi "category" dan "confidence" (0-1).

Transaksi:
${descriptions.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Jawab HANYA dengan JSON array, tanpa penjelasan lain. Contoh format:
[{"category": "Food", "confidence": 0.9}, {"category": "Shopping", "confidence": 0.7}]`

  const response = await fetch('/api/categorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descriptions, apiKey }),
  })

  if (!response.ok) {
    throw new Error('Gagal menghubungi Gemini API')
  }

  const data = await response.json()
  return data.results as GeminiCategorizeResult[]
}
