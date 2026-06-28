'use client'

import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X, AlertCircle, Lock } from 'lucide-react'

interface FileUploadProps {
  onFileLoaded: (data: ArrayBuffer, fileName: string) => void
  showPasswordField?: boolean
}

export default function FileUpload({ onFileLoaded, showPasswordField = true }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [rawFile, setRawFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File, pwd: string) => {
    setProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (pwd) formData.append('password', pwd)

      const res = await fetch('/api/decrypt', { method: 'POST', body: formData })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal memproses file')
      }

      const decrypted = await res.arrayBuffer()
      onFileLoaded(decrypted, file.name)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses file'
      setError(msg)
    } finally {
      setProcessing(false)
    }
  }

  const handleFile = (file: File) => {
    setError(null)

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Hanya file .xlsx atau .xls yang didukung')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB')
      return
    }

    setFileName(file.name)
    setRawFile(file)

    if (!showPasswordField) {
      processFile(file, '')
    }
  }

  const handleSubmitPassword = () => {
    if (rawFile) {
      processFile(rawFile, password)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = () => {
    setFileName(null)
    setError(null)
    setRawFile(null)
    setPassword('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {fileName ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="text-blue-600" size={24} />
              <div>
                <p className="font-medium text-sm text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500">
                  {processing ? 'Memproses file...' : 'Masukkan password untuk melanjutkan'}
                </p>
              </div>
            </div>
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {showPasswordField && rawFile && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitPassword()
                  }}
                  placeholder="Password e-statement (biasanya tanggal lahir DDMMYYYY)"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSubmitPassword}
                disabled={!password || processing}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Memproses...' : 'Buka'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="mx-auto text-gray-400 mb-3" size={40} />
          <p className="text-gray-600 font-medium">
            Drag & drop e-statement atau klik untuk pilih file
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Format: .xlsx (Excel) - Maks 10MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  )
}
