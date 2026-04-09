'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { formatCurrency } from '@/lib/utils/format'

interface SpendingChartProps {
  data: Array<{ month: string; total: number; count: number }>
}

export default function SpendingChart({ data }: SpendingChartProps) {
  if (data.every((d) => d.total === 0)) {
    return (
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Trend Pengeluaran</h3>
        <p className="text-gray-500 text-sm">Belum ada data untuk ditampilkan</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Trend Pengeluaran</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Bulan: ${label}`}
            />
            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pengeluaran" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
