'use client'

import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onFileLoaded: (data: ArrayBuffer, fileName: string) => void
}

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as ArrayBuffer
      onFileLoaded(data, file.name)
    }
    reader.onerror = () => {
      setError('Gagal membaca file')
      setFileName(null)
    }
    reader.readAsArrayBuffer(file)
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
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {fileName ? (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-blue-600" size={24} />
            <div>
              <p className="font-medium text-sm text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500">File siap diproses</p>
            </div>
          </div>
          <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
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
