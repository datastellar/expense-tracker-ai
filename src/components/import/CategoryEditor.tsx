'use client'

import { ALL_CATEGORIES, CATEGORY_COLORS, type ExpenseCategory } from '@/types'

interface CategoryEditorProps {
  value: ExpenseCategory
  onChange: (category: ExpenseCategory) => void
}

export default function CategoryEditor({ value, onChange }: CategoryEditorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ExpenseCategory)}
      className="text-xs px-2 py-1 border rounded-md bg-white"
      style={{
        borderColor: CATEGORY_COLORS[value],
        color: CATEGORY_COLORS[value],
      }}
    >
      {ALL_CATEGORIES.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  )
}
