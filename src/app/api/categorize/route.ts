import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { EXPENSE_CATEGORIES } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { descriptions, apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    if (!descriptions?.length) {
      return NextResponse.json(
        { error: 'Descriptions are required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const categoriesStr = EXPENSE_CATEGORIES.join(', ')
    const prompt = `Kamu adalah asisten keuangan. Kategorikan setiap transaksi bank berikut ke salah satu kategori: ${categoriesStr}.

Berikan jawaban dalam format JSON array, setiap elemen berisi "category" dan "confidence" (0-1).

Transaksi:
${descriptions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}

Jawab HANYA dengan JSON array, tanpa penjelasan lain. Contoh:
[{"category": "Food", "confidence": 0.9}]`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Invalid response from Gemini' },
        { status: 500 }
      )
    }

    const results = JSON.parse(jsonMatch[0])
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: 'Failed to categorize' },
      { status: 500 }
    )
  }
}
