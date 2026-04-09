'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useBankAccounts } from '@/hooks/useBankAccounts'
import {
  Key,
  Plus,
  Trash2,
  Building2,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { BANK_DISPLAY_NAMES, type BankName } from '@/types'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function SettingsPage() {
  const { profile, updateProfile, loading: authLoading } = useAuth()
  const { accounts, addAccount, deleteAccount, loading: accountsLoading } = useBankAccounts()

  const [geminiKey, setGeminiKey] = useState(profile?.gemini_api_key || '')
  const [showKey, setShowKey] = useState(false)
  const [savingKey, setSavingKey] = useState(false)
  const [keyMessage, setKeyMessage] = useState('')

  const [newBank, setNewBank] = useState<BankName>('mandiri')
  const [newAccountName, setNewAccountName] = useState('')
  const [newAccountNumber, setNewAccountNumber] = useState('')
  const [addingAccount, setAddingAccount] = useState(false)

  if (authLoading || accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  const handleSaveKey = async () => {
    setSavingKey(true)
    setKeyMessage('')
    const result = await updateProfile({ gemini_api_key: geminiKey || null })
    if (result?.error) {
      setKeyMessage('Gagal menyimpan API key')
    } else {
      setKeyMessage('API key berhasil disimpan')
    }
    setSavingKey(false)
    setTimeout(() => setKeyMessage(''), 3000)
  }

  const handleAddAccount = async () => {
    if (!newAccountName.trim()) return
    setAddingAccount(true)
    await addAccount({
      bank_name: newBank,
      account_name: newAccountName.trim(),
      account_number: newAccountNumber.trim(),
    })
    setNewAccountName('')
    setNewAccountNumber('')
    setAddingAccount(false)
  }

  const handleDeleteAccount = async (id: string) => {
    if (confirm('Hapus akun bank ini? Transaksi yang terkait tidak akan terhapus.')) {
      await deleteAccount(id)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>

      {/* Gemini API Key */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Key size={20} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900">Gemini API Key</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Diperlukan untuk auto-kategorisasi transaksi menggunakan AI. Dapatkan
          key gratis di{' '}
          <span className="text-blue-600">aistudio.google.com</span>
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="input-field pr-10"
              placeholder="AIzaSy..."
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            onClick={handleSaveKey}
            disabled={savingKey}
            className="btn-primary flex items-center gap-2"
          >
            {savingKey ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Simpan
          </button>
        </div>
        {keyMessage && (
          <p className={`text-sm mt-2 ${keyMessage.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>
            {keyMessage}
          </p>
        )}
      </div>

      {/* Bank Accounts */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={20} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900">Akun Bank</h2>
        </div>

        {accounts.length > 0 && (
          <div className="space-y-2 mb-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
              >
                <div>
                  <p className="font-medium text-sm">
                    {BANK_DISPLAY_NAMES[acc.bank_name as BankName] || acc.bank_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {acc.account_name}
                    {acc.account_number ? ` - ****${acc.account_number}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAccount(acc.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Tambah Akun Bank</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={newBank}
              onChange={(e) => setNewBank(e.target.value as BankName)}
              className="input-field"
            >
              {Object.entries(BANK_DISPLAY_NAMES).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              className="input-field"
              placeholder="Nama akun (e.g. Tabungan)"
            />
            <input
              type="text"
              value={newAccountNumber}
              onChange={(e) => setNewAccountNumber(e.target.value)}
              className="input-field"
              placeholder="4 digit terakhir"
              maxLength={4}
            />
          </div>
          <button
            onClick={handleAddAccount}
            disabled={addingAccount || !newAccountName.trim()}
            className="btn-secondary flex items-center gap-2 mt-2"
          >
            {addingAccount ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Plus size={16} />
            )}
            Tambah
          </button>
        </div>
      </div>
    </div>
  )
}
