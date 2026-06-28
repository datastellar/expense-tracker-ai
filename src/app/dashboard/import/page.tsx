'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBankAccounts } from '@/hooks/useBankAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import { MandiriParser } from '@/lib/parsers/mandiri-parser'
import { categorizeTransactions } from '@/lib/categorizer/rule-engine'
import { categorizeWithGemini } from '@/lib/categorizer/gemini-categorizer'
import FileUpload from '@/components/import/FileUpload'
import ImportPreview from '@/components/import/ImportPreview'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import type { ParsedTransaction, ExpenseCategory, StatementMetadata } from '@/types'
import {
  FileSpreadsheet,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Building2,
} from 'lucide-react'
import Link from 'next/link'

type Step = 'upload' | 'preview' | 'done'

export default function ImportPage() {
  const { profile } = useAuth()
  const { accounts } = useBankAccounts()
  const { addTransactionsBatch } = useTransactions()

  const [step, setStep] = useState<Step>('upload')
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [fileName, setFileName] = useState('')
  const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [statementMetadata, setStatementMetadata] = useState<StatementMetadata | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ count: number } | null>(null)

  const mandiriAccounts = accounts.filter((a) => a.bank_name === 'mandiri')

  const handleFileLoaded = (data: ArrayBuffer, name: string) => {
    setParseError(null)
    setFileName(name)

    try {
      const parser = new MandiriParser()
      const result = parser.parse(data)

      if (result.transactions.length === 0) {
        setParseError('Tidak ada transaksi yang ditemukan di file ini.')
        return
      }

      setStatementMetadata(result.metadata)

      // Auto-categorize with rule engine
      const categorized = categorizeTransactions(result.transactions)
      setParsedTransactions(categorized)
      setStep('preview')
    } catch (err) {
      setParseError(
        err instanceof Error
          ? err.message
          : 'Gagal membaca file. Pastikan format file sesuai.'
      )
    }
  }

  const handleCategorizeWithAI = async (indices: number[]) => {
    if (!profile?.gemini_api_key) return

    const descriptions = indices.map((i) => parsedTransactions[i].description)
    const results = await categorizeWithGemini(descriptions, profile.gemini_api_key)

    const updated = [...parsedTransactions]
    results.forEach((result, i) => {
      const idx = indices[i]
      updated[idx] = {
        ...updated[idx],
        category: result.category as ExpenseCategory,
        confidence: result.confidence,
        categorized_by: 'ai',
      }
    })
    setParsedTransactions(updated)
  }

  const handleConfirmImport = async () => {
    setImporting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Create import batch
      const { data: batch } = await supabase
        .from('import_batches')
        .insert({
          user_id: user.id,
          bank_account_id: selectedAccountId || null,
          file_name: fileName,
          row_count: parsedTransactions.length,
        })
        .select()
        .single()

      // Convert parsed transactions to DB format
      const rows = parsedTransactions.map((tx) => ({
        bank_account_id: selectedAccountId || null,
        type: tx.type,
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        date: tx.date,
        is_transfer: tx.is_transfer,
        categorized_by: tx.categorized_by,
        import_batch_id: batch?.id || null,
        notes: null,
      }))

      const result = await addTransactionsBatch(rows)
      setImportResult({ count: result.data?.length || 0 })
      setStep('done')
    } catch (err) {
      setParseError('Gagal menyimpan transaksi. Coba lagi.')
    } finally {
      setImporting(false)
    }
  }

  const handleReset = () => {
    setStep('upload')
    setParsedTransactions([])
    setFileName('')
    setParseError(null)
    setImportResult(null)
    setStatementMetadata(null)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        {step === 'preview' && (
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet size={24} />
            Import E-Statement
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload e-statement bank untuk import transaksi otomatis
          </p>
        </div>
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          {/* Bank account selector */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={18} className="text-blue-600" />
              <h3 className="font-medium text-gray-900">Pilih Akun Bank</h3>
            </div>
            {mandiriAccounts.length > 0 ? (
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="input-field"
              >
                <option value="">-- Pilih akun Mandiri --</option>
                {mandiriAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_name}
                    {acc.account_number ? ` (****${acc.account_number})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-gray-500">
                Belum ada akun Mandiri.{' '}
                <Link href="/dashboard/settings" className="text-blue-600 hover:underline">
                  Tambah di Pengaturan
                </Link>
              </div>
            )}
          </div>

          {/* File upload */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-3">Upload File</h3>
            <FileUpload onFileLoaded={handleFileLoaded} />
            {parseError && (
              <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                {parseError}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Saat ini mendukung: Bank Mandiri (.xlsx dari Livin&apos;)
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          {statementMetadata && (
            <div className="card bg-blue-50 border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Info E-Statement</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {statementMetadata.account_holder && (
                  <div>
                    <span className="text-blue-600">Nama:</span>{' '}
                    <span className="font-medium text-blue-900">{statementMetadata.account_holder}</span>
                  </div>
                )}
                {statementMetadata.period && (
                  <div>
                    <span className="text-blue-600">Periode:</span>{' '}
                    <span className="font-medium text-blue-900">{statementMetadata.period}</span>
                  </div>
                )}
                {statementMetadata.account_number && (
                  <div>
                    <span className="text-blue-600">Rekening:</span>{' '}
                    <span className="font-medium text-blue-900">{statementMetadata.account_number}</span>
                  </div>
                )}
                {statementMetadata.initial_balance !== undefined && (
                  <div>
                    <span className="text-blue-600">Saldo Awal:</span>{' '}
                    <span className="font-medium text-blue-900">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(statementMetadata.initial_balance)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="card">
          <h3 className="font-medium text-gray-900 mb-4">
            Preview: {fileName}
          </h3>
          <ImportPreview
            transactions={parsedTransactions}
            onTransactionsChange={setParsedTransactions}
            onConfirm={handleConfirmImport}
            onCategorizeWithAI={handleCategorizeWithAI}
            loading={importing}
            hasGeminiKey={!!profile?.gemini_api_key}
          />
        </div>
        </div>
      )}

      {/* Step: Done */}
      {step === 'done' && importResult && (
        <div className="card text-center py-8">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Import Berhasil!
          </h3>
          <p className="text-gray-500 mb-6">
            {importResult.count} transaksi berhasil di-import dari {fileName}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleReset} className="btn-secondary">
              Import Lagi
            </button>
            <Link href="/dashboard/transactions" className="btn-primary">
              Lihat Transaksi
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
